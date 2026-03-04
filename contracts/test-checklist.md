Here is the complete checklist in full:

***

```
================================================================================
TESSERACT PROTOCOL — PHASE 1 + PHASE 2
COMPLETE USER-SIMULATION TEST CHECKLIST
================================================================================
Network:   Polkadot EVM Testnet
RPC:       https://eth-rpc-testnet.polkadot.io/
Date:      2026-03-04
================================================================================

LEGEND
  [READ]  = cast call   (no gas, no state change)
  [WRITE] = cast send   (state-changing tx)
  EXPECT  = what the contract must return
  CHANGE  = what state changes after the call
  EDGE    = boundary / negative path test
================================================================================

ENVIRONMENT SETUP
─────────────────
export LENDING="0x696FAF0240De212353f6f60B24fC97F39c075840"
export AGENT="0x8c13e6FfDF27BB51304EfFF108c9b646d148e5f3"
export USDC="0x5998cE005b4f3923c988Ae31940fAa1DEAC0c646"
export GOV="0xe4DE7eadE2c0A65BdA6863Ad7bA22416c77F3e55"
export ADMIN="0xe37a8983570B39F305fe93D565A29F89366f3fFe"
export USER2="<second wallet address>"
export USER3="<third wallet address>"
export KEY="0x0e1c069181f0e5c444154e5934ec9126f9aa0941c7d4029e1a797a6207b1b623"
export RPC="https://eth-rpc-testnet.polkadot.io/"
```

***

## MODULE A — CONTRACT REGISTRY & WIRING

```
A-01  KredioLending → KreditAgent pointer
──────────────────────────────────────────
[READ]  cast call $LENDING "getAgent()(address)" --rpc-url $RPC
EXPECT  0x8c13e6FfDF27BB51304EfFF108c9b646d148e5f3
CHANGE  none

A-02  KredioLending → MockUSDC pointer
───────────────────────────────────────
[READ]  cast call $LENDING "getUsdc()(address)" --rpc-url $RPC
EXPECT  0x5998cE005b4f3923c988Ae31940fAa1DEAC0c646
CHANGE  none

A-03  KredioLending → GovCache pointer
───────────────────────────────────────
[READ]  cast call $LENDING "getGovCache()(address)" --rpc-url $RPC
EXPECT  0xe4DE7eadE2c0A65BdA6863Ad7bA22416c77F3e55
CHANGE  none

A-04  No temp helpers present on final deploy
─────────────────────────────────────────────
[READ]  cast call $LENDING "testCompute()(uint64)" --rpc-url $RPC
EXPECT  REVERT (no function selector match)
CHANGE  none

A-05  No temp helpers present — testRate
─────────────────────────────────────────
[READ]  cast call $LENDING "testRate(uint64)(uint64)" 60 --rpc-url $RPC
EXPECT  REVERT
CHANGE  none
```

***

## MODULE B — GOVCACHE CONTRACT

```
B-01  Read governance data — seeded admin
──────────────────────────────────────────
[READ]  cast call $GOV "getGovernanceData(address)(uint64,uint8,uint256)" \
          $ADMIN --rpc-url $RPC
EXPECT  votes=7, conviction=3, cachedAt=1772635464
CHANGE  none

B-02  Read governance data — unseeded address
──────────────────────────────────────────────
[READ]  cast call $GOV "getGovernanceData(address)(uint64,uint8,uint256)" \
          $USER2 --rpc-url $RPC
EXPECT  votes=0, conviction=0, cachedAt=0
CHANGE  none

B-03  Seed governance for USER2
────────────────────────────────
[WRITE] cast send $GOV "setGovernanceData(address,uint64,uint8)" \
          $USER2 3 1 \
          --rpc-url $RPC --private-key $KEY --legacy
EXPECT  tx success
CHANGE  USER2 entry: votes=3, conviction=1

B-04  Verify USER2 seed persisted
──────────────────────────────────
[READ]  cast call $GOV "getGovernanceData(address)(uint64,uint8,uint256)" \
          $USER2 --rpc-url $RPC
EXPECT  votes=3, conviction=1, cachedAt>0
CHANGE  none

B-05  EDGE — Update existing entry
────────────────────────────────────
[WRITE] cast send $GOV "setGovernanceData(address,uint64,uint8)" \
          $USER2 10 4 \
          --rpc-url $RPC --private-key $KEY --legacy
EXPECT  tx success (overwrite)
CHANGE  USER2: votes=10, conviction=4

B-06  EDGE — Zero-vote seed
────────────────────────────
[WRITE] cast send $GOV "setGovernanceData(address,uint64,uint8)" \
          $USER3 0 0 \
          --rpc-url $RPC --private-key $KEY --legacy
EXPECT  tx success
CHANGE  USER3: votes=0, conviction=0

B-07  EDGE — Max conviction value (6 in OpenGov)
──────────────────────────────────────────────────
[WRITE] cast send $GOV "setGovernanceData(address,uint64,uint8)" \
          $USER3 1 6 \
          --rpc-url $RPC --private-key $KEY --legacy
EXPECT  tx success
CHANGE  USER3: votes=1, conviction=6

NOTE    Reset USER2 back to (3,1) and USER3 to (0,0) after B-07 for clean downstream tests.
```

***

## MODULE C — MOCKUSDC TOKEN

```
C-01  USDC decimals
────────────────────
[READ]  cast call $USDC "decimals()(uint8)" --rpc-url $RPC
EXPECT  6

C-02  USDC name / symbol
─────────────────────────
[READ]  cast call $USDC "name()(string)" --rpc-url $RPC
EXPECT  "USD Coin" (or mock equivalent)
[READ]  cast call $USDC "symbol()(string)" --rpc-url $RPC
EXPECT  "USDC"

C-03  Mint to admin
────────────────────
[WRITE] cast send $USDC "mint(address,uint256)" \
          $ADMIN 100000000000 \
          --rpc-url $RPC --private-key $KEY --legacy
EXPECT  tx success
CHANGE  balanceOf(ADMIN) increases by 100_000_000_000

C-04  Verify admin USDC balance
────────────────────────────────
[READ]  cast call $USDC "balanceOf(address)(uint256)" $ADMIN --rpc-url $RPC
EXPECT  ≥ 100000000000

C-05  Approve KredioLending to spend
──────────────────────────────────────
[WRITE] cast send $USDC "approve(address,uint256)" \
          $LENDING 115792089237316195423570985008687907853269984665640564039457584007913129639935 \
          --rpc-url $RPC --private-key $KEY --legacy
EXPECT  tx success
CHANGE  allowance(ADMIN, LENDING) = max_uint256

C-06  Verify allowance
───────────────────────
[READ]  cast call $USDC "allowance(address,address)(uint256)" \
          $ADMIN $LENDING --rpc-url $RPC
EXPECT  max_uint256

C-07  EDGE — Transfer without approval (USER2 → USER3, not approved)
─────────────────────────────────────────────────────────────────────
[READ]  cast call $USDC "allowance(address,address)(uint256)" \
          $USER2 $USER3 --rpc-url $RPC
EXPECT  0 (no allowance set)

C-08  EDGE — Mint to USER2 for downstream borrow tests
────────────────────────────────────────────────────────
[WRITE] cast send $USDC "mint(address,uint256)" \
          $USER2 50000000000 \
          --rpc-url $RPC --private-key $KEY --legacy
EXPECT  tx success
CHANGE  balanceOf(USER2) ≥ 50_000_000_000
```

***

## MODULE D — CREDIT SCORE PIPELINE

```
SCORING FORMULA (Rust agent — reference)
  balance_tier_pts  = f(PAS balance) → 0/10/20/30 pts
  vote_pts          = min(votes, 40) pts
  conviction_bonus  = conviction ≥ 3 → +5 pts (else 0)
  repayment_pts     = repaymentCount * 10 (capped at 30)
  default_penalty   = if defaults > 0 → repayment_pts = 0
  total             = balance_tier_pts + vote_pts + conviction_bonus + repayment_pts
  tier              = ANON(0)<25 | BRONZE(1)<50 | SILVER(2)<70 | GOLD(3)<85 | PLATINUM(4)≥85
  rate_bps          = ANON:2500 | BRONZE:1800 | SILVER:1100 | GOLD:700 | PLATINUM:400
  ratio_bps         = ANON:10000 | BRONZE:11000 | SILVER:12700 | GOLD:14000 | PLATINUM:15000

D-01  Admin baseline score (votes=7, conv=3, repay=0, defaults=0)
───────────────────────────────────────────────────────────────────
[READ]  cast call $LENDING "getScore(address)(uint64,uint8,uint32,uint32)" \
          $ADMIN --rpc-url $RPC
EXPECT  score=60, tier=2(SILVER), ratio=12700, rate=1100
CHANGE  none

D-02  USER2 score (votes=3, conv=1, fresh wallet)
───────────────────────────────────────────────────
[WRITE] cast send $GOV "setGovernanceData(address,uint64,uint8)" \
          $USER2 3 1 --rpc-url $RPC --private-key $KEY --legacy
[READ]  cast call $LENDING "getScore(address)(uint64,uint8,uint32,uint32)" \
          $USER2 --rpc-url $RPC
EXPECT  score<60, tier≤2, ratio matches tier, rate matches tier
CHANGE  none

D-03  USER3 score — zero governance
─────────────────────────────────────
[READ]  cast call $LENDING "getScore(address)(uint64,uint8,uint32,uint32)" \
          $USER3 --rpc-url $RPC
EXPECT  score<25, tier=0(ANON), ratio=10000, rate=2500
CHANGE  none

D-04  EDGE — getScore unknown address (never seeded)
──────────────────────────────────────────────────────
[READ]  cast call $LENDING "getScore(address)(uint64,uint8,uint32,uint32)" \
          0x000000000000000000000000000000000000dEaD --rpc-url $RPC
EXPECT  score=0 or minimal, tier=0(ANON), ratio=10000, rate=2500
CHANGE  none

D-05  EDGE — getScore after conviction bump to 6
──────────────────────────────────────────────────
[WRITE] cast send $GOV "setGovernanceData(address,uint64,uint8)" \
          $USER2 3 6 --rpc-url $RPC --private-key $KEY --legacy
[READ]  cast call $LENDING "getScore(address)(uint64,uint8,uint32,uint32)" \
          $USER2 --rpc-url $RPC
EXPECT  score higher than D-02 result (conviction bonus applies)
CHANGE  none

D-06  EDGE — getScore does not modify state
─────────────────────────────────────────────
Run D-01 five times consecutively.
EXPECT  Identical (60,2,12700,1100) each time — pure view, no state mutation
```

***

## MODULE E — LP DEPOSIT (USDC LIQUIDITY)

```
E-01  Initial pool state
─────────────────────────
[READ]  cast call $LENDING "totalDeposits()(uint256)" --rpc-url $RPC
EXPECT  0 (fresh deploy)
[READ]  cast call $LENDING "utilizationRate()(uint256)" --rpc-url $RPC
EXPECT  0

E-02  Admin deposits 20,000 USDC
─────────────────────────────────
[WRITE] cast send $LENDING "deposit(uint256)" 20000000000 \
          --rpc-url $RPC --private-key $KEY --legacy
EXPECT  tx success, event: Deposited(ADMIN, 20000000000)
CHANGE  totalDeposits += 20000000000
        lpBalance(ADMIN) += 20000000000
        USDC.balanceOf(LENDING) += 20000000000

E-03  Verify totalDeposits
───────────────────────────
[READ]  cast call $LENDING "totalDeposits()(uint256)" --rpc-url $RPC
EXPECT  20000000000

E-04  LP balance of admin
──────────────────────────
[READ]  cast call $LENDING "lpBalance(address)(uint256)" $ADMIN --rpc-url $RPC
EXPECT  20000000000

E-05  PendingYield accrues
───────────────────────────
[READ]  cast call $LENDING "pendingYield(address)(uint256)" $ADMIN --rpc-url $RPC
NOTE    Call twice 30 seconds apart. Second value must be ≥ first value.
EXPECT  T1: some value V1 ≥ 0; T2: V2 ≥ V1
CHANGE  none (view only)

E-06  EDGE — Deposit zero
──────────────────────────
[WRITE] cast send $LENDING "deposit(uint256)" 0 \
          --rpc-url $RPC --private-key $KEY --legacy
EXPECT  REVERT with "amount must be > 0" or equivalent
CHANGE  none

E-07  EDGE — Deposit without USDC approval
────────────────────────────────────────────
Revoke approval first:
[WRITE] cast send $USDC "approve(address,uint256)" $LENDING 0 \
          --rpc-url $RPC --private-key $KEY --legacy
[WRITE] cast send $LENDING "deposit(uint256)" 1000000 \
          --rpc-url $RPC --private-key $KEY --legacy
EXPECT  REVERT (ERC20 insufficient allowance)
CHANGE  none
NOTE    Re-approve max after this test.

E-08  EDGE — Deposit more than USDC balance
────────────────────────────────────────────
[WRITE] cast send $LENDING "deposit(uint256)" 999999999999999 \
          --rpc-url $RPC --private-key $KEY --legacy
EXPECT  REVERT (ERC20 transfer exceeds balance)
CHANGE  none

E-09  Second depositor (USER2)
───────────────────────────────
Approve first:
[WRITE] cast send $USDC "approve(address,uint256)" \
          $LENDING 999999999999 \
          --from $USER2 --rpc-url $RPC --private-key $KEY2 --legacy
[WRITE] cast send $LENDING "deposit(uint256)" 5000000000 \
          --from $USER2 --rpc-url $RPC --private-key $KEY2 --legacy
EXPECT  tx success
CHANGE  totalDeposits = 25000000000
        lpBalance(USER2) = 5000000000

E-10  Utilization still zero (no borrows yet)
──────────────────────────────────────────────
[READ]  cast call $LENDING "utilizationRate()(uint256)" --rpc-url $RPC
EXPECT  0
```

***

## MODULE F — COLLATERAL & BORROWING

```
F-01  No active position before deposit
────────────────────────────────────────
[READ]  cast call $LENDING \
          "getPosition(address)(uint256,uint256,uint256,uint256,uint8,bool)" \
          $ADMIN --rpc-url $RPC
EXPECT  (0, 0, 0, 0, 0, false)

F-02  Deposit collateral (native token — 15,000 units)
───────────────────────────────────────────────────────
[WRITE] cast send $LENDING "depositCollateral()" \
          --value 15000000000 \
          --rpc-url $RPC --private-key $KEY --legacy
EXPECT  tx success, event: CollateralDeposited(ADMIN, 15000000000)
CHANGE  position.collateral = 15000000000
        position.active = false (not yet borrowed)

F-03  Verify collateral stored
───────────────────────────────
[READ]  cast call $LENDING \
          "getPosition(address)(uint256,uint256,uint256,uint256,uint8,bool)" \
          $ADMIN --rpc-url $RPC
EXPECT  collateral=15000000000, debt=0, active=false

F-04  Compute max borrow
─────────────────────────
From D-01: ratio=12700 bps
maxBorrow = 15000000000 * 12700 / 10000 = 19050000000
Any borrow ≤ 19050000000 must succeed.

F-05  Borrow 8,000 USDC (within limit)
────────────────────────────────────────
[WRITE] cast send $LENDING "borrow(uint256)" 8000000000 \
          --rpc-url $RPC --private-key $KEY --legacy
EXPECT  tx success, event: Borrowed(ADMIN, 8000000000)
CHANGE  position.debt = 8000000000
        position.active = true
        position.tier = 2
        position.interestBps = 1100
        USDC.balanceOf(ADMIN) increases by 8000000000
        totalBorrows += 8000000000

F-06  Verify position tuple after borrow
─────────────────────────────────────────
[READ]  cast call $LENDING \
          "getPosition(address)(uint256,uint256,uint256,uint256,uint8,bool)" \
          $ADMIN --rpc-url $RPC
EXPECT  debt=8000000000, collateral=15000000000,
        active=true, tier=2, interestBps=1100

F-07  Utilization rate non-zero
────────────────────────────────
[READ]  cast call $LENDING "utilizationRate()(uint256)" --rpc-url $RPC
EXPECT  4000 (40%)
MATH    8000000000 * 10000 / 20000000000 = 4000

F-08  EDGE — Borrow zero
─────────────────────────
[WRITE] cast send $LENDING "borrow(uint256)" 0 \
          --rpc-url $RPC --private-key $KEY --legacy
EXPECT  REVERT "amount must be > 0"
CHANGE  none

F-09  EDGE — Borrow while already having active position
─────────────────────────────────────────────────────────
[WRITE] cast send $LENDING "borrow(uint256)" 1000000 \
          --rpc-url $RPC --private-key $KEY --legacy
EXPECT  REVERT "position already active"
CHANGE  none

F-10  EDGE — Borrow exceeds collateral ratio
──────────────────────────────────────────────
maxBorrow = collateral * ratio / 10000 for USER2.
Attempt: borrow = maxBorrow + 1
[WRITE] cast send $LENDING "borrow(uint256)" <maxBorrow+1> \
          --from $USER2 --rpc-url $RPC --private-key $KEY2 --legacy
EXPECT  REVERT "borrow exceeds collateral limit"
CHANGE  none

F-11  EDGE — Borrow without collateral
────────────────────────────────────────
[WRITE] cast send $LENDING "borrow(uint256)" 1000000 \
          --from $USER3 --rpc-url $RPC --private-key $KEY3 --legacy
EXPECT  REVERT (no collateral, ratio check fails)
CHANGE  none

F-12  EDGE — Borrow more than pool liquidity
──────────────────────────────────────────────
Attempt borrow > totalDeposits - totalBorrows
[WRITE] cast send $LENDING "borrow(uint256)" 18000000000 \
          --rpc-url $RPC --private-key $KEY --legacy
EXPECT  REVERT "insufficient pool liquidity"
CHANGE  none
```

***

## MODULE G — INTEREST ACCRUAL

```
G-01  Interest accrues over time
──────────────────────────────────
[READ]  cast call $LENDING \
          "getPosition(address)(uint256,uint256,uint256,uint256,uint8,bool)" \
          $ADMIN --rpc-url $RPC
NOTE    Record pendingYield at T1, wait 60 seconds, query at T2.
EXPECT  pendingYield(T2) > pendingYield(T1)
CHANGE  none (view only)

G-02  Interest formula
───────────────────────
MATH    interestPerSec = debt * interestBps / 10000 / 31536000
        = 8000000000 * 1100 / 10000 / 31536000
        ≈ 278 units/second
        Over 60s ≈ 16,666 units accrued

G-03  EDGE — Interest not accrued on inactive position
────────────────────────────────────────────────────────
[READ]  getPosition(USER3)  (USER3 has no active borrow)
EXPECT  pendingYield = 0 always
CHANGE  none
```

***

## MODULE H — REPAYMENT

```
H-01  Full repayment (debt + accrued interest)
───────────────────────────────────────────────
[WRITE] cast send $USDC "approve(address,uint256)" $LENDING 999999999999 \
          --rpc-url $RPC --private-key $KEY --legacy
[WRITE] cast send $LENDING "repay()" \
          --rpc-url $RPC --private-key $KEY --legacy
EXPECT  tx success, event: Repaid(ADMIN, totalOwed)
CHANGE  position.debt = 0
        position.active = false
        position.interestBps = 0
        repaymentCount(ADMIN) += 1
        totalBorrows -= 8000000000
        USDC.balanceOf(ADMIN) decreases by totalOwed
        USDC.balanceOf(LENDING) increases by totalOwed

H-02  Score improves after repayment
─────────────────────────────────────
[READ]  cast call $LENDING "getScore(address)(uint64,uint8,uint32,uint32)" \
          $ADMIN --rpc-url $RPC
EXPECT  score=70, tier=3(GOLD), ratio=14000, rate=700

H-03  Position cleared after repay
────────────────────────────────────
[READ]  getPosition(ADMIN)
EXPECT  (0, collateral_still_there, 0, 0, 0, false)
NOTE    Collateral is NOT auto-returned on repay. Must call withdrawCollateral.

H-04  Protocol fees recorded
──────────────────────────────
[READ]  cast call $LENDING "protocolFees()(uint256)" --rpc-url $RPC
EXPECT  > 0

H-05  EDGE — Repay with no active position
────────────────────────────────────────────
[WRITE] cast send $LENDING "repay()" \
          --rpc-url $RPC --private-key $KEY --legacy
EXPECT  REVERT "no active position"
CHANGE  none

H-06  EDGE — Repay with insufficient USDC balance
───────────────────────────────────────────────────
Setup: borrow again, then send away USDC so balance < debt
EXPECT  REVERT (ERC20 transfer fails)
CHANGE  none

H-07  Collateral withdrawal after repay
────────────────────────────────────────
[WRITE] cast send $LENDING "withdrawCollateral()" \
          --rpc-url $RPC --private-key $KEY --legacy
EXPECT  tx success, event: CollateralWithdrawn(ADMIN, 15000000000)
CHANGE  position.collateral = 0
        native balance of ADMIN increases

H-08  EDGE — Withdraw collateral with active borrow
─────────────────────────────────────────────────────
Setup: depositCollateral, borrow, then try withdrawCollateral
EXPECT  REVERT "active position — cannot withdraw"
CHANGE  none

H-09  EDGE — Withdraw collateral twice
────────────────────────────────────────
[WRITE] cast send $LENDING "withdrawCollateral()" (second call)
EXPECT  REVERT "no collateral"
CHANGE  none
```

***

## MODULE I — LIQUIDATION

```
SETUP:
  Admin deposits collateral 15000000000, borrows 8000000000.
  Liquidator is USER2 with enough USDC to cover debt.

I-01  Confirm position is active
─────────────────────────────────
[READ]  getPosition(ADMIN)
EXPECT  active=true, debt=8000000000, collateral=15000000000

I-02  Liquidator calls liquidate
──────────────────────────────────
[WRITE] cast send $LENDING "liquidate(address)" $ADMIN \
          --from $USER2 --rpc-url $RPC --private-key $KEY2 --legacy
EXPECT  tx success
        event: Liquidated(ADMIN, USER2, seizedCollateral, debt)
CHANGE  position(ADMIN) = (0, 0, 0, 0, 0, false)
        defaultCount(ADMIN) += 1
        USDC transferred from USER2 to cover debt
        Collateral + premium transferred to USER2

I-03  Verify position zeroed
──────────────────────────────
[READ]  getPosition(ADMIN)
EXPECT  (0, 0, 0, 0, 0, false)

I-04  defaultCount incremented
────────────────────────────────
[READ]  cast call $LENDING "defaultCount(address)(uint256)" $ADMIN --rpc-url $RPC
EXPECT  1

I-05  Score penalized by default
──────────────────────────────────
[READ]  cast call $LENDING "getScore(address)(uint64,uint8,uint32,uint32)" \
          $ADMIN --rpc-url $RPC
EXPECT  score=60 (repayment bonus wiped; back to governance baseline)
        tier=2(SILVER), ratio=12700, rate=1100

I-06  EDGE — Liquidate inactive position
──────────────────────────────────────────
[WRITE] cast send $LENDING "liquidate(address)" $ADMIN \
          --from $USER2 --rpc-url $RPC --private-key $KEY2 --legacy
EXPECT  REVERT "position not active"
CHANGE  none

I-07  EDGE — Self-liquidation
──────────────────────────────
If contract allows: verify it works.
If contract forbids: EXPECT REVERT "cannot liquidate yourself"

I-08  EDGE — Liquidate address with no position
────────────────────────────────────────────────
[WRITE] cast send $LENDING "liquidate(address)" $USER3 \
          --from $USER2 --rpc-url $RPC --private-key $KEY2 --legacy
EXPECT  REVERT "position not active"
CHANGE  none

I-09  Liquidator receives collateral + premium
───────────────────────────────────────────────
MATH    seizedCollateral = debt * (10000 + liquidationBonus) / 10000
        With debt=8000000000, bonus=500 (5%):
        seized = 8000000000 * 10500 / 10000 = 8400000000
EXPECT  USER2 native balance delta ≈ 8400000000 (minus gas)

I-10  Multiple defaults accumulate
────────────────────────────────────
Repeat depositCollateral → borrow → liquidate cycle twice more.
[READ]  cast call $LENDING "defaultCount(address)(uint256)" $ADMIN --rpc-url $RPC
EXPECT  3 after three total liquidations
```

***

## MODULE J — PROTOCOL FEES

```
J-01  Fees accumulate during borrow lifecycle
──────────────────────────────────────────────
After any repayment:
[READ]  cast call $LENDING "protocolFees()(uint256)" --rpc-url $RPC
EXPECT  > 0

J-02  Sweep protocol fees to admin
────────────────────────────────────
[READ]  preBalance = balanceOf(ADMIN) before sweep
[WRITE] cast send $LENDING "sweepProtocolFees(address)" $ADMIN \
          --rpc-url $RPC --private-key $KEY --legacy
EXPECT  tx success
CHANGE  protocolFees → 0
        USDC.balanceOf(ADMIN) += previous protocolFees value

J-03  Verify fees zeroed
─────────────────────────
[READ]  cast call $LENDING "protocolFees()(uint256)" --rpc-url $RPC
EXPECT  0

J-04  EDGE — Sweep when fees = 0
──────────────────────────────────
[WRITE] cast send $LENDING "sweepProtocolFees(address)" $ADMIN \
          --rpc-url $RPC --private-key $KEY --legacy
EXPECT  REVERT "no fees to sweep" OR tx success with 0 transfer

J-05  EDGE — Non-owner calls sweepProtocolFees
───────────────────────────────────────────────
[WRITE] cast send $LENDING "sweepProtocolFees(address)" $USER2 \
          --from $USER2 --rpc-url $RPC --private-key $KEY2 --legacy
EXPECT  REVERT "Ownable: caller is not the owner"
CHANGE  none
```

***

## MODULE K — LP WITHDRAWAL

```
K-01  Withdraw LP (partial)
────────────────────────────
[WRITE] cast send $LENDING "withdraw(uint256)" 5000000000 \
          --rpc-url $RPC --private-key $KEY --legacy
EXPECT  tx success, event: Withdrawn(ADMIN, 5000000000 + yield)
CHANGE  lpBalance(ADMIN) -= 5000000000
        totalDeposits -= 5000000000
        USDC.balanceOf(ADMIN) increases

K-02  Yield claimed on withdrawal
───────────────────────────────────
[READ]  cast call $LENDING "pendingYield(address)(uint256)" $ADMIN --rpc-url $RPC
EXPECT  0 (yield paid out on withdraw)

K-03  Full LP withdrawal
─────────────────────────
[WRITE] cast send $LENDING "withdraw(uint256)" <remaining lpBalance> \
          --rpc-url $RPC --private-key $KEY --legacy
EXPECT  tx success
CHANGE  lpBalance(ADMIN) = 0

K-04  EDGE — Withdraw more than lpBalance
──────────────────────────────────────────
[WRITE] cast send $LENDING "withdraw(uint256)" 999999999999 \
          --rpc-url $RPC --private-key $KEY --legacy
EXPECT  REVERT "insufficient LP balance"
CHANGE  none

K-05  EDGE — Withdraw 0
────────────────────────
[WRITE] cast send $LENDING "withdraw(uint256)" 0 \
          --rpc-url $RPC --private-key $KEY --legacy
EXPECT  REVERT "amount must be > 0"
CHANGE  none

K-06  EDGE — Withdraw more than available liquidity
─────────────────────────────────────────────────────
Setup: ensure totalBorrows > 0, try withdraw > (totalDeposits - totalBorrows)
EXPECT  REVERT "insufficient pool liquidity"
CHANGE  none
```

***

## MODULE L — UTILIZATION RATE

```
L-01  Utilization = 0 when no borrows
──────────────────────────────────────
[READ]  cast call $LENDING "utilizationRate()(uint256)" --rpc-url $RPC
EXPECT  0

L-02  Utilization correct with active borrow
─────────────────────────────────────────────
After borrow 8000000000 into pool of 20000000000:
[READ]  cast call $LENDING "utilizationRate()(uint256)" --rpc-url $RPC
EXPECT  4000 (40% in bps)
MATH    8000000000 * 10000 / 20000000000 = 4000

L-03  Utilization = 0 after full repayment
───────────────────────────────────────────
[READ]  cast call $LENDING "utilizationRate()(uint256)" --rpc-url $RPC
EXPECT  0
```

***

## MODULE M — MULTI-USER SIMULATION

```
SETUP
  Admin:  votes=7, conv=3 → score 60 (SILVER)
  USER2:  votes=3, conv=1 → score ~35 (BRONZE)
  USER3:  votes=0, conv=0 → score 0  (ANON)

M-01  All three deposit USDC into pool
───────────────────────────────────────
Admin  → deposit 20000000000
USER2  → deposit 5000000000
USER3  → deposit 2000000000
EXPECT  totalDeposits = 27000000000

M-02  All three deposit collateral
────────────────────────────────────
Admin  → depositCollateral 15000000000
USER2  → depositCollateral 5000000000
USER3  → depositCollateral 2000000000

M-03  All three borrow at their respective tier limits
───────────────────────────────────────────────────────
Admin  → borrow 10000000000  (SILVER ratio 12700 bps → max 19050000000)
USER2  → borrow 3000000000   (BRONZE ratio 11000 bps → max 5500000000)
USER3  → borrow 1000000000   (ANON   ratio 10000 bps → max 2000000000)
EXPECT  All three tx succeed, each active=true

M-04  Verify positions do not bleed
─────────────────────────────────────
[READ]  getPosition(ADMIN)  → debt=10000000000, collateral=15000000000
[READ]  getPosition(USER2)  → debt=3000000000,  collateral=5000000000
[READ]  getPosition(USER3)  → debt=1000000000,  collateral=2000000000

M-05  All positions accrue interest independently
──────────────────────────────────────────────────
Wait 60 seconds.
[READ]  pendingYield ADMIN, USER2, USER3 all > 0
        Each proportional to their debt and rate (not each other's)

M-06  USER2 repays — score improves, others unchanged
───────────────────────────────────────────────────────
[WRITE] USER2 repay()
[READ]  getScore(USER2) → score increased (+10 repay)
[READ]  getScore(ADMIN) → unchanged (still 60)
[READ]  getScore(USER3) → unchanged

M-07  Liquidate USER3 — only USER3 penalized
──────────────────────────────────────────────
[WRITE] Admin liquidates USER3
[READ]  defaultCount(USER3) = 1
[READ]  getScore(USER3)     → default cancels repayment bonus
[READ]  getScore(ADMIN)     → unchanged
[READ]  getScore(USER2)     → unchanged

M-08  Pool accounting reconciles
──────────────────────────────────
[READ]  USDC.balanceOf(LENDING) must equal
        totalDeposits - totalBorrows + protocolFees (approximately)
```

***

## MODULE N — ACCESS CONTROL

```
N-01  Only owner can sweep fees          → covered in J-05
N-02  Anyone can call getScore (public view)
      cast call $LENDING "getScore(address)" $ADMIN --from $USER2
      EXPECT  succeeds

N-03  Anyone can deposit to pool         → covered in E-09
N-04  Anyone can depositCollateral/borrow → covered in F-02/F-05

N-05  EDGE — Non-owner seeds GovCache
───────────────────────────────────────
[WRITE] cast send $GOV "setGovernanceData(address,uint64,uint8)" \
          $USER2 99 5 \
          --from $USER2 --rpc-url $RPC --private-key $KEY2 --legacy
EXPECT  REVERT "not authorized" or "Ownable"
CHANGE  none

N-06  No external repaymentCount/defaultCount setter exposed
─────────────────────────────────────────────────────────────
grep the ABI for any public setter on repaymentCount or defaultCount.
EXPECT  No such function exists — only incremented internally on repay/liquidate
```

***

## MODULE O — MATH PRECISION & BOUNDARIES

```
O-01  Exact boundary borrow succeeds
──────────────────────────────────────
borrow = collateral * ratio / 10000 exactly
EXPECT  tx success (at boundary = allowed)

O-02  One unit over boundary reverts
──────────────────────────────────────
borrow = (collateral * ratio / 10000) + 1
EXPECT  REVERT "borrow exceeds collateral limit"

O-03  1 wei borrow
────────────────────
depositCollateral 10000000000, then borrow 1
EXPECT  tx success (1 wei > 0, within ratio)

O-04  1 wei interest accrual
──────────────────────────────
Check pendingYield on 1 wei borrow after 1 block.
EXPECT  0 or 1 (rounding down OK — must not overflow)

O-05  Score at tier boundaries (exactly 25, 50, 70, 85)
──────────────────────────────────────────────────────────
Seed governance to produce each exact score.
EXPECT
  score=25 → tier=1 BRONZE  (not ANON)
  score=50 → tier=2 SILVER  (not BRONZE)
  score=70 → tier=3 GOLD    (not SILVER)
  score=85 → tier=4 PLATINUM (not GOLD)

O-06  No overflow at max utilization
──────────────────────────────────────
Fill pool to ~95% utilization.
[READ]  utilizationRate()
EXPECT  Returns correct bps value, no overflow or panic
```

***

## MODULE P — EVENT LOG AUDIT

```
For every state-changing call, verify the correct event emitted:

P-01  deposit()            → Deposited(user, amount)
P-02  withdraw()           → Withdrawn(user, amount)
P-03  depositCollateral()  → CollateralDeposited(user, amount)
P-04  withdrawCollateral() → CollateralWithdrawn(user, amount)
P-05  borrow()             → Borrowed(user, amount)
P-06  repay()              → Repaid(user, amount)
P-07  liquidate()          → Liquidated(borrower, liquidator, seized, debt)
P-08  sweepProtocolFees()  → ProtocolFeesSwept(to, amount)
P-09  USDC flows           → ERC20 Transfer events on every operation

Verify using:
cast logs --rpc-url $RPC --address $LENDING \
  --from-block <block> --to-block latest
```

***

## RESULT REPORTING MATRIX

```
TEST ID   DESCRIPTION                        EXPECTED            RECEIVED    STATUS
──────────────────────────────────────────────────────────────────────────────────────
A-01      getAgent()                         0x8c13e6...         ___         ✅/❌
A-02      getUsdc()                          0x5998cE...         ___         ✅/❌
A-03      getGovCache()                      0xe4DE7e...         ___         ✅/❌
A-04      testCompute() reverts              REVERT              ___         ✅/❌
A-05      testRate() reverts                 REVERT              ___         ✅/❌
B-01      GovData admin                      v=7,c=3             ___         ✅/❌
B-02      GovData USER2 unseeded             v=0,c=0             ___         ✅/❌
B-03      Seed USER2                         tx ok               ___         ✅/❌
B-04      GovData USER2 persists             v=3,c=1             ___         ✅/❌
B-05      Update USER2 entry                 v=10,c=4            ___         ✅/❌
B-06      Zero seed USER3                    tx ok               ___         ✅/❌
B-07      Max conviction USER3               tx ok               ___         ✅/❌
C-01      USDC decimals                      6                   ___         ✅/❌
C-02      USDC name/symbol                   USD Coin/USDC       ___         ✅/❌
C-03      Mint to admin                      tx ok               ___         ✅/❌
C-04      Admin USDC balance                 ≥100000000000       ___         ✅/❌
C-05      Approve max                        tx ok               ___         ✅/❌
C-06      Allowance = max_uint256            max_uint256         ___         ✅/❌
D-01      Admin score baseline               60,2,12700,1100     ___         ✅/❌
D-02      USER2 score (votes=3,conv=1)       <60,tier≤2          ___         ✅/❌
D-03      USER3 score (ANON, zero gov)       <25,tier=0          ___         ✅/❌
D-04      Dead address score                 ANON                ___         ✅/❌
D-05      Conviction bump raises score       >D-02 value         ___         ✅/❌
D-06      getScore idempotent (5x)           same each call      ___         ✅/❌
E-01      Pool starts empty                  0                   ___         ✅/❌
E-02      Admin deposits 20k USDC            tx ok               ___         ✅/❌
E-03      totalDeposits                      20000000000         ___         ✅/❌
E-04      lpBalance admin                    20000000000         ___         ✅/❌
E-05      pendingYield accrues T2≥T1         T2≥T1               ___         ✅/❌
E-06      Deposit 0 reverts                  REVERT              ___         ✅/❌
E-07      Deposit no approval reverts        REVERT              ___         ✅/❌
E-08      Deposit over balance reverts       REVERT              ___         ✅/❌
E-09      USER2 deposits 5k                  tx ok               ___         ✅/❌
E-10      Utilization = 0 before borrow      0                   ___         ✅/❌
F-01      No position before collateral      (0,0,0,0,0,false)   ___         ✅/❌
F-02      depositCollateral 15k              tx ok               ___         ✅/❌
F-03      Position collateral stored         15000000000         ___         ✅/❌
F-05      Borrow 8k within limit             tx ok               ___         ✅/❌
F-06      Position tuple after borrow        debt=8k,active=true ___         ✅/❌
F-07      Utilization = 4000 (40%)           4000                ___         ✅/❌
F-08      Borrow 0 reverts                   REVERT              ___         ✅/❌
F-09      Double borrow reverts              REVERT              ___         ✅/❌
F-10      Over-ratio borrow reverts          REVERT              ___         ✅/❌
F-11      Borrow no collateral reverts       REVERT              ___         ✅/❌
F-12      Borrow over pool liquidity reverts REVERT              ___         ✅/❌
G-01      Interest accrues over time         T2>T1               ___         ✅/❌
G-03      Inactive position no interest      pendingYield=0      ___         ✅/❌
H-01      Full repayment                     tx ok               ___         ✅/❌
H-02      Score improves post-repay          70,3,14000,700      ___         ✅/❌
H-03      Position cleared after repay       active=false        ___         ✅/❌
H-04      Protocol fees > 0                  >0                  ___         ✅/❌
H-05      Repay no position reverts          REVERT              ___         ✅/❌
H-07      withdrawCollateral succeeds        tx ok               ___         ✅/❌
H-08      Withdraw with active borrow        REVERT              ___         ✅/❌
H-09      Double withdraw reverts            REVERT              ___         ✅/❌
I-01      Position active before liquidation active=true         ___         ✅/❌
I-02      Liquidate admin                    tx ok               ___         ✅/❌
I-03      Position zeroed after liquidation  (0,0,0,0,0,false)   ___         ✅/❌
I-04      defaultCount = 1                   1                   ___         ✅/❌
I-05      Score penalized by default →60     60,2,12700,1100     ___         ✅/❌
I-06      Liquidate inactive reverts         REVERT              ___         ✅/❌
I-08      Liquidate no position reverts      REVERT              ___         ✅/❌
I-09      Liquidator receives premium        ≈8400000000         ___         ✅/❌
I-10      Multiple defaults accumulate       3 after 3 liq       ___         ✅/❌
J-01      Fees accumulate after repay        >0                  ___         ✅/❌
J-02      Sweep fees tx                      tx ok               ___         ✅/❌
J-03      Fees zeroed after sweep            0                   ___         ✅/❌
J-05      Non-owner sweep reverts            REVERT              ___         ✅/❌
K-01      Partial LP withdraw                tx ok               ___         ✅/❌
K-02      Yield claimed on withdraw          pendingYield=0      ___         ✅/❌
K-04      Withdraw over balance reverts      REVERT              ___         ✅/❌
K-05      Withdraw 0 reverts                 REVERT              ___         ✅/❌
K-06      Withdraw over liquidity reverts    REVERT              ___         ✅/❌
L-01      Utilization = 0, no borrows        0                   ___         ✅/❌
L-02      Utilization correct with borrow    4000                ___         ✅/❌
L-03      Utilization = 0 after repay        0                   ___         ✅/❌
M-01      3 users deposit to pool            total=27000000000   ___         ✅/❌
M-02      3 users deposit collateral         each stored         ___         ✅/❌
M-03      3 users borrow at tier limits      all active=true     ___         ✅/❌
M-04      Positions do not bleed             isolated per user   ___         ✅/❌
M-05      Interest accrues independently     each > 0            ___         ✅/❌
M-06      USER2 repay only affects USER2     others unchanged    ___         ✅/❌
M-07      USER3 liquidation only affects USER3 others unchanged  ___         ✅/❌
M-08      Pool USDC accounting reconciles    balance matches     ___         ✅/❌
N-02      getScore callable by anyone        succeeds            ___         ✅/❌
N-05      Non-owner GovCache seed reverts    REVERT              ___         ✅/❌
N-06      No external defaultCount setter    not in ABI          ___         ✅/❌
O-01      Exact boundary borrow succeeds     tx ok               ___         ✅/❌
O-02      One unit over boundary reverts     REVERT              ___         ✅/❌
O-03      1 wei borrow succeeds              tx ok               ___         ✅/❌
O-05      Tier boundary scores exact         correct tier each   ___         ✅/❌
P-01-09   All events emitted correctly       events present      ___         ✅/❌

TOTAL: 88 TESTS
TARGET: 88 / 88 ✅
──────────────────────────────────────────────────────────────────────────────────────
```

***

Run modules A through N first (read-only and single-user), then M (multi-user), then O and P last as they depend on all prior paths being stable. Any `❌` in the matrix maps directly back to the module entry with the exact `cast` command to reproduce it.