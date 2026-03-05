// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Minimal interface for the governance cache used by credit scoring.
interface IGovernanceCache {
    function getGovernanceData(
        address user
    ) external view returns (uint64 votes, uint8 conviction, uint256 cachedAt);
}
