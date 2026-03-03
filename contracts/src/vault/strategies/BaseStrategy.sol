// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IStrategy {
    function getAPY() external view returns (uint256);
    function invest(uint256 amount) external;
    function withdraw(uint256 amount) external;
}

abstract contract BaseStrategy is IStrategy {
    bytes32 public immutable parachainId;
    address public immutable protocolAddress;
    address public immutable vault;

    modifier onlyVault() {
        require(msg.sender == vault, "BaseStrategy: UNAUTHORIZED");
        _;
    }

    constructor(address _vault, bytes32 _parachainId, address _protocolAddress) {
        vault = _vault;
        parachainId = _parachainId;
        protocolAddress = _protocolAddress;
    }
}
