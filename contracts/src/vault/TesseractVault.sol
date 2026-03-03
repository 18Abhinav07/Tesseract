// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC4626} from "openzeppelin-contracts/contracts/token/ERC20/extensions/ERC4626.sol";
import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {IXcm, XCM_PRECOMPILE} from "../interfaces/IXCM.sol";
import {YieldAggregator} from "../libraries/YieldAggregator.sol";

contract TesseractVault is ERC4626 {
    struct Strategy {
        bytes32 parachainId;
        address protocolAddress;
        uint256 allocatedAmount;
        uint256 targetAllocation;
        uint256 lastAPY;
        bool active;
    }

    IERC20 public immutable lstDOT;
    IXcm public immutable xcmPrecompile;

    mapping(bytes32 => Strategy) public strategies;
    bytes32[] public activeStrategies;

    constructor(address _lstDOT) ERC4626(IERC20(_lstDOT)) ERC20("Tesseract Vault", "tvLSTDOT") {
        lstDOT = IERC20(_lstDOT);
        xcmPrecompile = IXcm(XCM_PRECOMPILE);
    }

    function totalAssets() public view override returns (uint256) {
        uint256 total = lstDOT.balanceOf(address(this)); // Idle balance

        // Add allocated amounts across all active strategies
        for (uint256 i = 0; i < activeStrategies.length; i++) {
            total += strategies[activeStrategies[i]].allocatedAmount;
        }

        return total;
    }

    function _calculateOptimalAllocation() internal view returns (uint256[] memory) {
        YieldAggregator.YieldData[] memory yields = new YieldAggregator.YieldData[](activeStrategies.length);
        
        for (uint i = 0; i < activeStrategies.length; i++) {
            bytes32 id = activeStrategies[i];
            yields[i] = YieldAggregator.YieldData({
                strategyId: id,
                apy: strategies[id].lastAPY, 
                tvl: strategies[id].allocatedAmount,
                capacity: 1_000_000 ether // hardcoded mock capacity limit
            });
        }
        
        return YieldAggregator.calculateOptimalAllocation(yields, totalAssets());
    }

    function rebalance() external {
        // 1. Calculate optimal allocation based on APYs
        uint256[] memory optimalAllocations = _calculateOptimalAllocation();

        // 2. Execute rebalancing via XCM
        for (uint256 i = 0; i < activeStrategies.length; i++) {
            bytes32 strategyId = activeStrategies[i];
            Strategy storage strategy = strategies[strategyId];
            
            uint256 currentAlloc = strategy.allocatedAmount;
            uint256 targetAlloc = optimalAllocations[i];

            if (targetAlloc > currentAlloc) {
                // Increase allocation - send more funds
                _depositToStrategy(strategyId, targetAlloc - currentAlloc);
            } else if (targetAlloc < currentAlloc) {
                // Decrease allocation - withdraw funds
                _withdrawFromStrategy(strategyId, currentAlloc - targetAlloc);
            }
        }
    }

    function _depositToStrategy(bytes32 strategyId, uint256 amount) internal {
        Strategy storage strategy = strategies[strategyId];
        
        // Encode XCM message for cross-chain deposit
        bytes memory xcmMessage = _encodeDepositXCM(
            strategy.parachainId,
            strategy.protocolAddress,
            amount
        );

        // Send via XCM precompile
        xcmPrecompile.send(
            abi.encode(strategy.parachainId),
            xcmMessage
        );

        strategy.allocatedAmount += amount;
    }

    function _withdrawFromStrategy(bytes32 strategyId, uint256 amount) internal {
        Strategy storage strategy = strategies[strategyId];
        
        // Encode XCM message for cross-chain withdraw
        bytes memory xcmMessage = _encodeWithdrawXCM(
            strategy.parachainId,
            strategy.protocolAddress,
            amount
        );

        // Send via XCM precompile
        xcmPrecompile.send(
            abi.encode(strategy.parachainId),
            xcmMessage
        );

        strategy.allocatedAmount -= amount;
    }

    // Mock encoders
    function _encodeDepositXCM(bytes32 parachainId, address protocol, uint256 amount) internal pure returns (bytes memory) {
        return abi.encodePacked(parachainId, protocol, amount);
    }
    function _encodeWithdrawXCM(bytes32 parachainId, address protocol, uint256 amount) internal pure returns (bytes memory) {
        return abi.encodePacked(parachainId, protocol, amount);
    }
}
