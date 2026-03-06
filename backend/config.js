'use strict';
require('dotenv').config();

// ─── Chain config ──────────────────────────────────────────────────────────
// Add more chains here as the bridge expands to Base, Arbitrum, OP, Polygon.
const CHAINS = {
    11155111: {
        name: 'Ethereum Sepolia',
        rpcUrl: process.env.SEPOLIA_RPC || 'https://rpc.sepolia.org',
        inboxAddress: (process.env.INBOX_ADDR_11155111 || '').toLowerCase(),
        explorerUrl: 'https://sepolia.etherscan.io',
        // Chainlink ETH/USD feed on Sepolia (used for price sanity check)
        chainlinkEthUsd: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
    },
};

// ─── Hub config ───────────────────────────────────────────────────────────
const HUB = {
    rpcUrl: process.env.RPC || 'https://eth-rpc-testnet.polkadot.io/',
    chainId: 420420417,
    minter: (process.env.MINTER_ADDR || '').toLowerCase(),
    mUSDC: '0x5998ce005b4f3923c988ae31940faa1deac0c646',
    oracle: (process.env.ORACLE || '').toLowerCase(),
    market: (process.env.MARKET_ADDR || '').toLowerCase(),
};

// ─── Bridge fee (basis points) ────────────────────────────────────────────
// 0.2% = 20 bps
const BRIDGE_FEE_BPS = Number(process.env.BRIDGE_FEE_BPS || 20);

// ─── Price sanity: max divergence between CoinGecko and Chainlink ─────────
const MAX_PRICE_DIVERGENCE_PCT = 2;

// ─── Oracle feeder mode ───────────────────────────────────────────────────
const MODE = (process.env.MODE || 'DEMO').toUpperCase();
const DEFAULT_TICK_MS = MODE === 'REAL' ? 15 * 60 * 1000 : 60 * 1000;
const TICK_MS = Number(process.env.TICK_MS || DEFAULT_TICK_MS);
const KEY = process.env.KEY;
const PORT = Number(process.env.PORT || 3002);
const CRASH_PRICE = process.env.CRASH_PRICE_8DEC
    ? BigInt(process.env.CRASH_PRICE_8DEC)
    : 250000000n;

module.exports = { CHAINS, HUB, BRIDGE_FEE_BPS, MAX_PRICE_DIVERGENCE_PCT, MODE, TICK_MS, KEY, PORT, CRASH_PRICE };
