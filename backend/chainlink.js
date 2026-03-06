'use strict';
// Reads Chainlink ETH/USD aggregator on Sepolia for price verification.
// Used by bridge-service to ensure CoinGecko quote is within ±2% of on-chain.

const { ethers } = require('ethers');

const AGGREGATOR_ABI = [
    'function latestRoundData() view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
    'function decimals() view returns (uint8)',
];

/**
 * @param {ethers.Provider} provider  Connected to Sepolia
 * @param {string} feedAddress        Chainlink feed address on Sepolia
 * @returns {{ priceUSD: number, updatedAt: number }}
 */
async function getChainlinkEthUsd(provider, feedAddress) {
    const feed = new ethers.Contract(feedAddress, AGGREGATOR_ABI, provider);
    const [, answer, , updatedAt] = await feed.latestRoundData();
    const decimals = Number(await feed.decimals());
    const priceUSD = Number(answer) / 10 ** decimals;
    return { priceUSD, updatedAt: Number(updatedAt) };
}

module.exports = { getChainlinkEthUsd };
