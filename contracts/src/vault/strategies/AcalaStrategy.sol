// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseStrategy} from "./BaseStrategy.sol";

contract AcalaStrategy is BaseStrategy {
    constructor(address _vault, bytes32 _parachainId, address _protocolAddress) 
        BaseStrategy(_vault, _parachainId, _protocolAddress) {}

    function getAPY() external pure override returns (uint256) {
        return 1200; // 12% mock APY (in basis points)
    }

    function invest(uint256 amount) external override onlyVault {
        // Vault handles the actual cross-chain dispatch
        amount;
    }

    function withdraw(uint256 amount) external override onlyVault {
        // Vault handles the actual cross-chain dispatch
        amount;
    }

    function encodeAcalaWithdraw(uint256 shares) public pure returns (bytes memory) {
        // XCM message to redeem from Acala lending
        return abi.encodePacked(
            hex"030c", // WithdrawAsset
            _encodeMultiAsset(shares),
            hex"0401", // BuyExecution
            hex"0d01", // Transact
            _encodeAcalaRedeemCall(shares)
        );
    }

    // Helper functions for SCALE encoding formats
    function _encodeMultiAsset(uint256 amount) internal pure returns (bytes memory) {
        return abi.encodePacked(hex"000101", amount);
    }

    function _encodeAcalaRedeemCall(uint256 shares) internal pure returns (bytes memory) {
        // Mock method signature for Acala redeem
        return abi.encodePacked(hex"aabbccdd", shares);
    }
}
