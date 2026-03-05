// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IPASOracle} from "./interfaces/IPASOracle.sol";

/// @notice Testnet PAS/USD oracle compatible with Chainlink AggregatorV3.
contract MockPASOracle is Ownable, IPASOracle {
    int256 public latestPrice;
    int256 public normalPrice;
    uint256 public updatedAt;
    uint80 public roundId;
    bool public crashed;

    uint8 internal constant DECIMALS = 8;

    event PriceUpdated(int256 price, uint80 roundId, uint256 updatedAt);
    event CrashInjected(int256 crashPrice);
    event PriceRecovered(int256 restoredPrice);

    constructor(
        int256 initialPrice
    ) Ownable(msg.sender) {
        require(initialPrice > 0, "invalid price");
        latestPrice = initialPrice;
        normalPrice = initialPrice;
        updatedAt = block.timestamp;
        roundId = 1;
    }

    function setPrice(
        int256 price
    ) external onlyOwner {
        require(!crashed, "crash active");
        require(price > 0, "invalid price");
        normalPrice = price;
        latestPrice = price;
        updatedAt = block.timestamp;
        roundId += 1;
        emit PriceUpdated(price, roundId, updatedAt);
    }

    function crash(
        int256 crashPrice
    ) external onlyOwner {
        require(!crashed, "already crashed");
        require(crashPrice > 0 && crashPrice < latestPrice, "invalid crash price");
        crashed = true;
        latestPrice = crashPrice;
        updatedAt = block.timestamp;
        roundId += 1;
        emit CrashInjected(crashPrice);
    }

    function recover() external onlyOwner {
        require(crashed, "not crashed");
        crashed = false;
        latestPrice = normalPrice;
        updatedAt = block.timestamp;
        roundId += 1;
        emit PriceRecovered(normalPrice);
    }

    function latestRoundData() external view override returns (uint80, int256, uint256, uint256, uint80) {
        return (roundId, latestPrice, updatedAt, updatedAt, roundId);
    }

    function decimals() external pure override returns (uint8) {
        return DECIMALS;
    }

    function isCrashed() external view returns (bool) {
        return crashed;
    }
}
