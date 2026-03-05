// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Documentation-only interface for the KreditAgent ink! contract.
/// @dev PAS market uses low-level SCALE-encoded calls (see KredioPASMarket), not this ABI.
interface IKreditAgent {
    function compute_score(
        uint64 balanceTier,
        uint64 votes,
        uint64 conviction,
        uint64 repayments,
        uint64 defaults
    ) external view returns (uint64);

    function collateral_ratio(
        uint64 score
    ) external view returns (uint64);

    function interest_rate(
        uint64 score
    ) external view returns (uint64);

    function tier(
        uint64 score
    ) external view returns (uint8);
}
