// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IPASOracle} from "./interfaces/IPASOracle.sol";

/// @notice PAS-collateral market for borrowing mUSDC.
/// @dev KreditAgent calls use low-level SCALE encoding copied from KredioLending.
contract KredioPASMarket is Ownable, ReentrancyGuard, Pausable {
    IERC20 public usdc;
    address public kreditAgent;
    IPASOracle public oracle;

    // Agent selectors (SCALE shim)
    bytes4 internal constant SEL_COMPUTE_SCORE = 0x3a518c00;
    bytes4 internal constant SEL_COLLATERAL_RATIO = 0xa70eec89;
    bytes4 internal constant SEL_INTEREST_RATE = 0xb8dc60f2;
    bytes4 internal constant SEL_TIER = 0x2b2bb477;

    uint256 internal constant ACC_PRECISION = 1e12;
    uint256 internal constant BPS_DIVISOR = 10_000;

    // Risk params (bounded)
    uint256 public ltvBps = 6500; // Max borrow vs collateral value (65%)
    uint256 public liqBonusBps = 800; // Liquidator bonus (8%)
    uint256 public stalenessLimit = 3600; // Seconds
    uint256 public protocolFeeBps = 1000; // 10%, max 20%

    // Pool accounting
    uint256 public totalDeposited;
    uint256 public totalBorrowed;
    uint256 public protocolFees;
    uint256 public accYieldPerShare;

    // Lender state
    mapping(address => uint256) public depositBalance;
    mapping(address => uint256) public yieldDebt;

    // Borrower state
    mapping(address => uint256) public collateralBalance; // PAS held for borrower (wei)
    mapping(address => Position) public positions;
    mapping(address => uint64) public repaymentCount;
    mapping(address => uint64) public liquidationCount;
    mapping(address => uint256) public demoRateMultiplier; // 0 or 1-1,000,000

    /// @notice Global interest tick multiplier applied to ALL positions (0 = disabled = 1x).
    /// @dev 525600 ≈ one year per second; 60 ≈ one minute of interest per second.
    uint256 public globalTick;

    // Credit score inputs
    mapping(address => uint256) public totalDepositedEver; // cumulative lifetime USDC deposits (never decrements)
    mapping(address => uint256) public firstSeenBlock; // block of first deposit()

    struct Position {
        uint256 collateralPAS;
        uint256 debtUSDC;
        uint32 interestBps;
        uint256 openedAt;
        uint8 tier;
        bool active;
    }

    event Deposited(address indexed lender, uint256 amount);
    event Withdrawn(address indexed lender, uint256 amount);
    event YieldHarvested(address indexed lender, uint256 amount);
    event CollateralDeposited(address indexed borrower, uint256 pasAmount);
    event CollateralWithdrawn(address indexed borrower, uint256 pasAmount);
    event Borrowed(address indexed borrower, uint256 usdcAmount);
    event Repaid(address indexed borrower, uint256 totalOwed);
    event Liquidated(address indexed borrower, address indexed liquidator, uint256 pasSeized, uint256 usdcRepaid);
    event FeeSwept(address indexed to, uint256 amount);
    event OracleUpdated(address indexed newOracle);
    event RiskParamsUpdated(uint256 ltvBps, uint256 liqBonusBps, uint256 stalenessLimit, uint256 protocolFeeBps);
    event DemoMultiplierSet(address indexed user, uint256 multiplier);
    event GlobalTickSet(uint256 tick);
    event UserScoreReset(address indexed user);
    event PoolTicked(uint256 totalInterestDistributed);
    event HardReset(address indexed to, uint256 usdcSwept);
    event ContractCleaned(address indexed to, uint256 usdcSwept, uint256 usersProcessed, uint256 depositorsProcessed);

    constructor(
        address _usdc,
        address _agent,
        address _oracle
    ) Ownable(msg.sender) {
        require(_usdc != address(0) && _agent != address(0) && _oracle != address(0), "zero addr");
        usdc = IERC20(_usdc);
        kreditAgent = _agent;
        oracle = IPASOracle(_oracle);
    }

    // -------- Lender --------

    function deposit(
        uint256 amount
    ) external nonReentrant whenNotPaused {
        require(amount > 0, "zero amount");
        if (firstSeenBlock[msg.sender] == 0) {
            firstSeenBlock[msg.sender] = block.number;
        }
        totalDepositedEver[msg.sender] += amount;
        _harvest(msg.sender);
        depositBalance[msg.sender] += amount;
        totalDeposited += amount;
        yieldDebt[msg.sender] = (depositBalance[msg.sender] * accYieldPerShare) / ACC_PRECISION;
        require(usdc.transferFrom(msg.sender, address(this), amount), "transfer fail");
        emit Deposited(msg.sender, amount);
    }

    function pendingYield(
        address user
    ) public view returns (uint256) {
        uint256 userBalance = depositBalance[user];
        if (userBalance == 0) return 0;
        uint256 accrued = (userBalance * accYieldPerShare) / ACC_PRECISION;
        if (accrued < yieldDebt[user]) return 0;
        return accrued - yieldDebt[user];
    }

    function withdraw(
        uint256 amount
    ) external nonReentrant {
        require(amount > 0, "zero amount");
        require(depositBalance[msg.sender] >= amount, "insufficient LP balance");
        uint256 available = totalDeposited > totalBorrowed ? totalDeposited - totalBorrowed : 0;
        require(available >= amount, "insufficient liquidity");
        _harvest(msg.sender);
        depositBalance[msg.sender] -= amount;
        totalDeposited -= amount;
        yieldDebt[msg.sender] = (depositBalance[msg.sender] * accYieldPerShare) / ACC_PRECISION;
        require(usdc.transfer(msg.sender, amount), "transfer fail");
        emit Withdrawn(msg.sender, amount);
    }

    function pendingYieldAndHarvest(
        address user
    ) external nonReentrant {
        _harvest(user);
    }

    // -------- Collateral & Borrow --------

    function depositCollateral() external payable nonReentrant whenNotPaused {
        require(msg.value > 0, "zero amount");
        collateralBalance[msg.sender] += msg.value;
        emit CollateralDeposited(msg.sender, msg.value);
    }

    function withdrawCollateral() external nonReentrant {
        Position storage p = positions[msg.sender];
        require(!p.active, "position active");
        uint256 amount = collateralBalance[msg.sender];
        if (p.collateralPAS > 0) {
            amount += p.collateralPAS;
            p.collateralPAS = 0;
        }
        require(amount > 0, "no collateral");
        collateralBalance[msg.sender] = 0;
        (bool ok,) = payable(msg.sender).call{value: amount}("");
        require(ok, "pas transfer fail");
        emit CollateralWithdrawn(msg.sender, amount);
    }

    function borrow(
        uint256 borrowAmount
    ) external nonReentrant whenNotPaused {
        require(borrowAmount > 0, "zero borrow");
        Position storage p = positions[msg.sender];
        require(!p.active, "position active");

        uint256 userCollateral = collateralBalance[msg.sender];
        require(userCollateral > 0, "no collateral");

        uint256 price = _getOraclePrice();
        uint256 collateralValue = _toUSDCValue(userCollateral, price);

        (uint32 ratioBps, uint32 rateBps, uint8 tier) = _scoreParams(msg.sender);
        ratioBps; // unused in PAS market; kept for parity

        uint256 maxBorrow = (collateralValue * ltvBps) / BPS_DIVISOR;
        require(borrowAmount <= maxBorrow, "exceeds LTV");

        uint256 available = totalDeposited > totalBorrowed ? totalDeposited - totalBorrowed : 0;
        require(available >= borrowAmount, "insufficient liquidity");

        p.collateralPAS = userCollateral;
        p.debtUSDC = borrowAmount;
        p.interestBps = rateBps;
        p.openedAt = block.timestamp;
        p.tier = tier;
        p.active = true;

        collateralBalance[msg.sender] = 0;
        totalBorrowed += borrowAmount;

        require(usdc.transfer(msg.sender, borrowAmount), "transfer fail");
        emit Borrowed(msg.sender, borrowAmount);
    }

    function repay() external nonReentrant {
        Position storage p = positions[msg.sender];
        require(p.active, "no position");

        uint256 interest = _accruedInterest(msg.sender, p);
        uint256 totalOwed = p.debtUSDC + interest;
        uint256 principal = p.debtUSDC;

        require(usdc.transferFrom(msg.sender, address(this), totalOwed), "transfer fail");

        _distributeInterest(interest);
        totalBorrowed -= principal;
        repaymentCount[msg.sender] += 1;

        p.debtUSDC = 0;
        p.interestBps = 0;
        p.openedAt = 0;
        p.tier = 0;
        p.active = false;

        emit Repaid(msg.sender, totalOwed);
    }

    // -------- Liquidation --------

    function liquidate(
        address borrower
    ) external nonReentrant {
        _liquidate(borrower, false);
    }

    function adminLiquidate(
        address borrower
    ) external onlyOwner nonReentrant {
        _liquidate(borrower, true);
    }

    /// @notice Force-close a position and any pending collateral without debt repayment.
    /// @dev For testnet / demo resets only. Absorbs outstanding debt as a protocol loss.
    function adminForceClose(
        address user
    ) external onlyOwner nonReentrant {
        Position storage p = positions[user];
        uint256 pasToReturn = collateralBalance[user];

        if (p.active) {
            if (p.debtUSDC <= totalBorrowed) totalBorrowed -= p.debtUSDC;
            else totalBorrowed = 0;
            pasToReturn += p.collateralPAS;
            delete positions[user];
        }
        if (collateralBalance[user] > 0) collateralBalance[user] = 0;

        if (pasToReturn > 0) {
            (bool ok,) = payable(user).call{value: pasToReturn}("");
            require(ok, "force-close pas return fail");
        }
        emit CollateralWithdrawn(user, pasToReturn);
    }

    function _liquidate(
        address borrower,
        bool ignoreHealth
    ) internal {
        Position storage p = positions[borrower];
        require(p.active, "no position");

        uint256 price = _getOraclePrice();
        uint256 collateralValue = _toUSDCValue(p.collateralPAS, price);
        uint256 interest = _accruedInterest(borrower, p);
        uint256 totalOwed = p.debtUSDC + interest;

        if (!ignoreHealth) {
            uint256 health = (collateralValue * BPS_DIVISOR) / totalOwed;
            require(health < ltvBps, "position is healthy");
        }

        uint256 principal = p.debtUSDC;
        uint256 pasToSeize = _usdcToPAS((totalOwed * (BPS_DIVISOR + liqBonusBps)) / BPS_DIVISOR, price);
        if (pasToSeize > p.collateralPAS) {
            pasToSeize = p.collateralPAS;
        }
        uint256 refund = p.collateralPAS > pasToSeize ? p.collateralPAS - pasToSeize : 0;

        delete positions[borrower];
        totalBorrowed -= principal;
        liquidationCount[borrower] += 1;

        require(usdc.transferFrom(msg.sender, address(this), totalOwed), "repay fail");
        _distributeInterest(interest);

        if (refund > 0) {
            (bool refundOk,) = payable(borrower).call{value: refund}("");
            require(refundOk, "refund fail");
        }

        (bool payoutOk,) = payable(msg.sender).call{value: pasToSeize}("");
        require(payoutOk, "payout fail");

        emit Liquidated(borrower, msg.sender, pasToSeize, totalOwed);
    }

    // -------- Admin --------

    function sweepProtocolFees(
        address to
    ) external onlyOwner nonReentrant {
        require(to != address(0), "zero to");
        uint256 amount = protocolFees;
        require(amount > 0, "no fees");
        protocolFees = 0;
        require(usdc.transfer(to, amount), "transfer fail");
        emit FeeSwept(to, amount);
    }

    function setOracle(
        address newOracle
    ) external onlyOwner {
        require(newOracle != address(0), "zero addr");
        oracle = IPASOracle(newOracle);
        emit OracleUpdated(newOracle);
    }

    function setRiskParams(
        uint256 _ltvBps,
        uint256 _liqBonusBps,
        uint256 _stalenessLimit,
        uint256 _protocolFeeBps
    ) external onlyOwner {
        require(_ltvBps <= 8000, "ltv too high");
        require(_liqBonusBps <= 2000, "bonus too high");
        require(_stalenessLimit >= 300, "stale too long");
        require(_protocolFeeBps <= 2000, "fee exceeds 20%");
        ltvBps = _ltvBps;
        liqBonusBps = _liqBonusBps;
        stalenessLimit = _stalenessLimit;
        protocolFeeBps = _protocolFeeBps;
        emit RiskParamsUpdated(_ltvBps, _liqBonusBps, _stalenessLimit, _protocolFeeBps);
    }

    function setDemoMultiplier(
        address user,
        uint256 multiplier
    ) external onlyOwner {
        require(multiplier <= 1_000_000, "max 1M");
        demoRateMultiplier[user] = multiplier;
        emit DemoMultiplierSet(user, multiplier);
    }

    /// @notice Set global interest tick multiplier for ALL positions simultaneously.
    /// @param tick 0 = disabled (1x normal), N = Nx accelerated. 60 = 1 sec equals 1 min of interest.
    function adminSetGlobalTick(
        uint256 tick
    ) external onlyOwner {
        require(tick <= 1_000_000, "max 1M");
        globalTick = tick;
        emit GlobalTickSet(tick);
    }

    /// @notice Reset a single user's credit score history.
    function adminResetUserScore(
        address user
    ) external onlyOwner {
        repaymentCount[user] = 0;
        liquidationCount[user] = 0;
        firstSeenBlock[user] = 0;
        totalDepositedEver[user] = 0;
        demoRateMultiplier[user] = 0;
        emit UserScoreReset(user);
    }

    /// @notice Batch-reset credit score history for multiple users.
    function adminResetUserScores(
        address[] calldata users
    ) external onlyOwner {
        for (uint256 i = 0; i < users.length; i++) {
            repaymentCount[users[i]] = 0;
            liquidationCount[users[i]] = 0;
            firstSeenBlock[users[i]] = 0;
            totalDepositedEver[users[i]] = 0;
            demoRateMultiplier[users[i]] = 0;
            emit UserScoreReset(users[i]);
        }
    }

    /// @notice Batch force-close PAS positions and return PAS collateral. Absorbs unpaid USDC debt.
    function adminForceCloseAll(
        address[] calldata users
    ) external onlyOwner nonReentrant {
        for (uint256 i = 0; i < users.length; i++) {
            address user = users[i];
            Position storage p = positions[user];
            uint256 pasToReturn = collateralBalance[user];

            if (p.active) {
                if (p.debtUSDC <= totalBorrowed) totalBorrowed -= p.debtUSDC;
                else totalBorrowed = 0;
                pasToReturn += p.collateralPAS;
                delete positions[user];
            }

            if (collateralBalance[user] > 0) collateralBalance[user] = 0;

            if (pasToReturn > 0) {
                (bool ok,) = payable(user).call{value: pasToReturn}("");
                require(ok, "bulk force-close pas fail");
            }
            emit CollateralWithdrawn(user, pasToReturn);
        }
    }

    /// @notice Force-withdraw USDC deposits for a batch of lenders without the normal liquidity check.
    function adminBulkWithdrawDeposits(
        address[] calldata depositors
    ) external onlyOwner nonReentrant {
        for (uint256 i = 0; i < depositors.length; i++) {
            address depositor = depositors[i];
            uint256 amount = depositBalance[depositor];
            if (amount == 0) continue;
            depositBalance[depositor] = 0;
            yieldDebt[depositor] = 0;
            if (totalDeposited >= amount) totalDeposited -= amount;
            else totalDeposited = 0;
            require(usdc.transfer(depositor, amount), "bulk withdraw fail");
            emit Withdrawn(depositor, amount);
        }
    }

    /// @notice Force-accrue interest for PAS borrowers and distribute USDC to lenders as yield.
    /// @dev Capitalises accrued interest into the borrower's principal and resets their clock.
    function adminTickPool(
        address[] calldata borrowers
    ) external onlyOwner nonReentrant {
        uint256 totalInterest = 0;
        for (uint256 i = 0; i < borrowers.length; i++) {
            Position storage p = positions[borrowers[i]];
            if (!p.active) continue;
            uint256 interest = _accruedInterest(borrowers[i], p);
            if (interest == 0) continue;
            p.debtUSDC += interest;
            p.openedAt = block.timestamp;
            totalBorrowed += interest;
            _distributeInterest(interest);
            totalInterest += interest;
        }
        emit PoolTicked(totalInterest);
    }

    /// @notice Nuclear reset: zero all pool accounting and sweep all USDC to admin.
    /// @dev PAS collateral is NOT swept (it belongs to borrowers). Call adminForceCloseAll first.
    function adminHardReset(
        address to
    ) external onlyOwner nonReentrant {
        require(to != address(0), "zero addr");
        totalBorrowed = 0;
        totalDeposited = 0;
        accYieldPerShare = 0;
        protocolFees = 0;
        globalTick = 0;
        uint256 bal = usdc.balanceOf(address(this));
        if (bal > 0) require(usdc.transfer(to, bal), "sweep fail");
        emit HardReset(to, bal);
    }

    /// @notice Comprehensive cleanup to return mutable contract state to a fresh-start baseline.
    /// @dev Clears listed borrower/lender user state, zeros accounting, restores default risk params,
    ///      unpauses if paused, then sweeps remaining USDC to `to`.
    function adminCleanContract(
        address to,
        address[] calldata users,
        address[] calldata depositors
    ) external onlyOwner nonReentrant {
        require(to != address(0), "zero addr");

        globalTick = 0;

        for (uint256 i = 0; i < users.length; i++) {
            address user = users[i];
            Position storage p = positions[user];
            uint256 pasToReturn = collateralBalance[user];

            if (p.active) {
                if (p.debtUSDC <= totalBorrowed) totalBorrowed -= p.debtUSDC;
                else totalBorrowed = 0;
                pasToReturn += p.collateralPAS;
                delete positions[user];
            }

            if (collateralBalance[user] > 0) collateralBalance[user] = 0;

            if (pasToReturn > 0) {
                (bool ok,) = payable(user).call{value: pasToReturn}("");
                require(ok, "clean pas return fail");
                emit CollateralWithdrawn(user, pasToReturn);
            }

            repaymentCount[user] = 0;
            liquidationCount[user] = 0;
            firstSeenBlock[user] = 0;
            totalDepositedEver[user] = 0;
            demoRateMultiplier[user] = 0;
            emit UserScoreReset(user);
        }

        for (uint256 i = 0; i < depositors.length; i++) {
            address depositor = depositors[i];
            uint256 amount = depositBalance[depositor];

            if (amount > 0) {
                depositBalance[depositor] = 0;
                yieldDebt[depositor] = 0;
                if (totalDeposited >= amount) totalDeposited -= amount;
                else totalDeposited = 0;
                require(usdc.transfer(depositor, amount), "clean withdraw fail");
                emit Withdrawn(depositor, amount);
            }

            repaymentCount[depositor] = 0;
            liquidationCount[depositor] = 0;
            firstSeenBlock[depositor] = 0;
            totalDepositedEver[depositor] = 0;
            demoRateMultiplier[depositor] = 0;
            emit UserScoreReset(depositor);
        }

        ltvBps = 6500;
        liqBonusBps = 800;
        stalenessLimit = 3600;
        protocolFeeBps = 1000;

        accYieldPerShare = 0;
        protocolFees = 0;
        totalBorrowed = 0;
        totalDeposited = 0;

        if (paused()) {
            _unpause();
        }

        uint256 bal = usdc.balanceOf(address(this));
        if (bal > 0) require(usdc.transfer(to, bal), "clean sweep fail");

        emit ContractCleaned(to, bal, users.length, depositors.length);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // -------- Views --------

    function utilizationRate() public view returns (uint256) {
        if (totalDeposited == 0) return 0;
        return (totalBorrowed * BPS_DIVISOR) / totalDeposited;
    }

    function accruedInterest(
        address borrower
    ) external view returns (uint256) {
        Position memory p = positions[borrower];
        if (!p.active) return 0;
        return _accruedInterestValue(borrower, p);
    }

    function healthRatio(
        address borrower
    ) external view returns (uint256) {
        Position memory p = positions[borrower];
        if (!p.active || p.debtUSDC == 0) return type(uint256).max;
        uint256 price = _getOraclePrice();
        uint256 collateralValue = _toUSDCValue(p.collateralPAS, price);
        uint256 totalOwed = p.debtUSDC + _accruedInterestValue(borrower, p);
        return (collateralValue * BPS_DIVISOR) / totalOwed;
    }

    function getPositionFull(
        address borrower
    )
        external
        view
        returns (
            uint256 collateralPAS,
            uint256 collateralValueUSDC,
            uint256 debtUSDC,
            uint256 accrued,
            uint256 totalOwed,
            uint32 interestBps,
            uint8 tier,
            bool active
        )
    {
        Position memory p = positions[borrower];
        uint256 price = _getOraclePrice();
        collateralPAS = p.collateralPAS;
        collateralValueUSDC = _toUSDCValue(p.collateralPAS, price);
        debtUSDC = p.debtUSDC;
        accrued = p.active ? _accruedInterestValue(borrower, p) : 0;
        totalOwed = p.debtUSDC + accrued;
        interestBps = p.interestBps;
        tier = p.tier;
        active = p.active;
    }

    function maxBorrowable(
        address borrower
    ) external view returns (uint256) {
        uint256 pasBal = collateralBalance[borrower];
        if (pasBal == 0) return 0;
        uint256 price = _getOraclePrice();
        uint256 collateralValue = _toUSDCValue(pasBal, price);
        return (collateralValue * ltvBps) / BPS_DIVISOR;
    }

    // -------- Internal helpers --------

    function _harvest(
        address user
    ) internal {
        uint256 pending = pendingYield(user);
        yieldDebt[user] = (depositBalance[user] * accYieldPerShare) / ACC_PRECISION;
        if (pending > 0) {
            require(usdc.transfer(user, pending), "yield transfer fail");
            emit YieldHarvested(user, pending);
        }
    }

    function _distributeInterest(
        uint256 interest
    ) internal {
        if (interest == 0) return;
        uint256 protocolCut = (interest * protocolFeeBps) / BPS_DIVISOR;
        protocolFees += protocolCut;
        uint256 toLenders = interest - protocolCut;
        if (toLenders > 0 && totalDeposited > 0) {
            accYieldPerShare += (toLenders * ACC_PRECISION) / totalDeposited;
        } else {
            protocolFees += toLenders;
        }
    }

    function _scoreParams(
        address user
    ) internal view returns (uint32 ratioBps, uint32 rateBps, uint8 tier) {
        uint64 depositTier = _depositTier(user);
        uint64 repayments = repaymentCount[user];
        uint64 liquidations = liquidationCount[user];
        uint64 blocksSinceFirst = firstSeenBlock[user] > 0 ? uint64(block.number - firstSeenBlock[user]) : 0;
        uint64 score = _callAgent4(SEL_COMPUTE_SCORE, repayments, liquidations, depositTier, blocksSinceFirst);
        ratioBps = uint32(_callAgent1(SEL_COLLATERAL_RATIO, score));
        rateBps = uint32(_callAgent1(SEL_INTEREST_RATE, score));
        tier = _callAgent1U8(SEL_TIER, score);
    }

    function _depositTier(
        address user
    ) internal view returns (uint64) {
        uint256 d = totalDepositedEver[user];
        if (d >= 100_000_000_000) return 7;
        if (d >= 75_000_000_000) return 6;
        if (d >= 55_000_000_000) return 5;
        if (d >= 35_000_000_000) return 4;
        if (d >= 20_000_000_000) return 3;
        if (d >= 10_000_000_000) return 2;
        if (d >= 5_000_000_000) return 1;
        return 0;
    }

    function _effectiveMultiplier(
        address borrower
    ) internal view returns (uint256) {
        uint256 userM = demoRateMultiplier[borrower];
        uint256 effM = globalTick > userM ? globalTick : userM;
        return effM == 0 ? 1 : effM;
    }

    function _accruedInterest(
        address borrower,
        Position storage p
    ) internal view returns (uint256) {
        if (!p.active) return 0;
        uint256 elapsed = block.timestamp - p.openedAt;
        uint256 rate = uint256(p.interestBps) * _effectiveMultiplier(borrower);
        return (p.debtUSDC * rate * elapsed) / (BPS_DIVISOR * 365 days);
    }

    function _accruedInterestValue(
        address borrower,
        Position memory p
    ) internal view returns (uint256) {
        if (!p.active) return 0;
        uint256 elapsed = block.timestamp - p.openedAt;
        uint256 rate = uint256(p.interestBps) * _effectiveMultiplier(borrower);
        return (p.debtUSDC * rate * elapsed) / (BPS_DIVISOR * 365 days);
    }

    function _getOraclePrice() internal view returns (uint256) {
        (uint80 roundId, int256 answer,, uint256 updatedAt, uint80 answeredInRound) = oracle.latestRoundData();
        require(answer > 0, "oracle: price zero");
        require(answeredInRound >= roundId, "oracle: incomplete round");
        require(block.timestamp - updatedAt <= stalenessLimit, "oracle: stale");
        return uint256(answer);
    }

    function _toUSDCValue(
        uint256 pasAmount,
        uint256 price
    ) internal pure returns (uint256) {
        // pasAmount (18 decimals) * price (8 decimals) / 1e20 => USDC 6 decimals
        return (pasAmount * price) / 1e20;
    }

    function _usdcToPAS(
        uint256 usdcAmount,
        uint256 price
    ) internal pure returns (uint256) {
        // usdcAmount (6 decimals) * 1e20 / price => PAS 18 decimals
        return (usdcAmount * 1e20) / price;
    }

    // -------- Agent low-level helpers (copied from KredioLending) --------

    function _callAgent1(
        bytes4 selector,
        uint64 a
    ) internal view returns (uint64) {
        bytes memory input = abi.encodePacked(selector, _le64(a));
        (bool ok, bytes memory data) = kreditAgent.staticcall(input);
        require(ok && data.length >= 9 && data[0] == 0x00, "agent1 fail");
        return _fromLE64(data, 1);
    }

    function _callAgent1U8(
        bytes4 selector,
        uint64 a
    ) internal view returns (uint8) {
        bytes memory input = abi.encodePacked(selector, _le64(a));
        (bool ok, bytes memory data) = kreditAgent.staticcall(input);
        require(ok && data.length >= 2 && data[0] == 0x00, "agent1 fail");
        return uint8(data[1]);
    }

    function _callAgent4(
        bytes4 selector,
        uint64 a,
        uint64 b,
        uint64 c,
        uint64 d
    ) internal view returns (uint64) {
        bytes memory input = abi.encodePacked(selector, _le64(a), _le64(b), _le64(c), _le64(d));
        (bool ok, bytes memory data) = kreditAgent.staticcall(input);
        require(ok && data.length >= 9 && data[0] == 0x00, "agent4 fail");
        return _fromLE64(data, 1);
    }

    function _le64(
        uint64 v
    ) internal pure returns (bytes8) {
        return bytes8(
            ((v & 0xFF) << 56) | (((v >> 8) & 0xFF) << 48) | (((v >> 16) & 0xFF) << 40) | (((v >> 24) & 0xFF) << 32)
                | (((v >> 32) & 0xFF) << 24) | (((v >> 40) & 0xFF) << 16) | (((v >> 48) & 0xFF) << 8)
                | ((v >> 56) & 0xFF)
        );
    }

    function _fromLE64(
        bytes memory b,
        uint256 o
    ) internal pure returns (uint64 v) {
        for (uint256 i = 0; i < 8; i++) {
            v |= uint64(uint8(b[o + i])) << uint64(i * 8);
        }
    }

    // -------- Fallbacks --------

    receive() external payable {}
}
