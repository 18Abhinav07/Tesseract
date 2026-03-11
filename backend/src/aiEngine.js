'use strict';
// backend/src/aiEngine.js
// Phase 5 AI Engine — event-driven ink! contract caller
// Run: node backend/src/aiEngine.js
// Uses: ethers v6 (already in package.json), same .env as server.js

const { ethers } = require('ethers');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const RPC_URL = process.env.RPC || 'https://eth-rpc-testnet.polkadot.io/';
const KEY     = process.env.KEY;

if (!KEY) { console.error('[aiEngine] KEY not set in .env'); process.exit(1); }

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet   = new ethers.Wallet(KEY, provider);

// ─── ABI fragments ────────────────────────────────────────────────────────────

const NEURAL_ABI = [
    'function infer(bytes20 account, uint32 repaymentCount, uint32 liquidationCount, uint8 depositTier, uint32 ageBlocks, uint8 deterministicScore) external',
    'event ScoreInferred(bytes20 indexed account, uint8 neuralScore, uint8 deterministicScore, uint8 confidencePct, uint8 dominantSignal, int8 deltaFromRule, uint32 modelVersion)',
];

const RISK_ABI = [
    'function assess_position(bytes20 borrower, uint64 collateralUsdX6, uint64 debtUsdX6, uint8 creditScore, int32 price7dChangeBps, uint32 liqRatioBps) external',
    'function assess_batch(bytes20[16] borrowers, uint64[16] collaterals, uint64[16] debts, uint8[16] scores, int32 priceChange, uint32 liqRatio, uint8 activeCount) external',
    'event RiskAssessed(bytes20 indexed borrower, uint8 riskTier, uint8 liqProb, uint32 bufferBps, uint32 blocksToLiq)',
];

const YIELD_ABI = [
    'function compute_allocation(uint64 totalDeposited, uint64 totalBorrowed, uint64 strategyBalance, uint8 avgCreditScore, uint32 volatilityBps, uint32 blocksSinceRebalance) external',
    'event AllocationComputed(uint32 utilizationBps, uint32 conservativeBps, uint32 balancedBps, uint32 aggressiveBps, uint32 idleBps, uint32 projectedApyBps, uint8 reasoningCode)',
];

const LENDING_ABI = [
    'function repaymentCount(address) view returns (uint64)',
    'function liquidationCount(address) view returns (uint64)',
    'function depositBalance(address) view returns (uint256)',
    'function firstSeenBlock(address) view returns (uint256)',
    'function collateralBalance(address) view returns (uint256)',
    'function positions(address) view returns (uint256 collateral, uint256 debt, uint256 openedAt, uint32 interestBps, uint32 collateralRatioBps, uint8 tier, bool active)',
    'function totalDeposited() view returns (uint256)',
    'function totalBorrowed() view returns (uint256)',
    'event CollateralDeposited(address indexed user, uint256 amount)',
    'event Borrowed(address indexed user, uint256 amount, uint8 tier, uint32 ratioBps)',
    'event Repaid(address indexed user, uint256 principal, uint256 interest)',
    'event Liquidated(address indexed borrower, address indexed liquidator)',
    'event Deposited(address indexed user, uint256 amount)',
    'event YieldHarvested(address indexed lender, uint256 amount)',
];

const YIELD_POOL_ABI = [
    'function totalPrincipal() view returns (uint256)',
];

const KREDIT_AGENT_ABI = [
    'function compute_score(uint64 repayments, uint64 liquidations, uint64 deposit_tier, uint64 blocks_since_first) view returns (uint64)',
];

const ORACLE_ABI = [
    'function latestPrice() view returns (int256)',
    'event PriceUpdated(int256 price, uint80 roundId, uint256 updatedAt)',
];

// ─── Contract instances ───────────────────────────────────────────────────────

const LENDING_ADDR      = process.env.LENDING_ADDR      || '0x1eDaD1271FB9d1296939C6f4Fb762752b041C64E';
const YIELD_POOL_ADDR   = process.env.YIELD_POOL_ADDR   || '0x1dB4Faad3081aAfe26eC0ef6886F04f28D944AAB';
const KREDITAGENT_ADDR  = '0x8c13E6fFDf27bB51304Efff108C9B646d148E5F3';
const ORACLE_ADDR       = process.env.ORACLE             || '0x1494432a8Af6fa8c03C0d7DD7720E298D85C55c7';
const NEURAL_ADDR       = process.env.NEURAL_SCORER_ADDRESS;
const RISK_ADDR         = process.env.RISK_ASSESSOR_ADDRESS;
const YIELD_MIND_ADDR   = process.env.YIELD_MIND_ADDRESS;

if (!NEURAL_ADDR || !RISK_ADDR || !YIELD_MIND_ADDR) {
    console.error('[aiEngine] NEURAL_SCORER_ADDRESS / RISK_ASSESSOR_ADDRESS / YIELD_MIND_ADDRESS not set. Deploy contracts first.');
    process.exit(1);
}

const lending     = new ethers.Contract(LENDING_ADDR,     LENDING_ABI,      wallet);
const yieldPool   = new ethers.Contract(YIELD_POOL_ADDR,  YIELD_POOL_ABI,   provider);
const kreditAgent = new ethers.Contract(KREDITAGENT_ADDR, KREDIT_AGENT_ABI, provider);
const oracle      = new ethers.Contract(ORACLE_ADDR,      ORACLE_ABI,       provider);
const neural      = new ethers.Contract(NEURAL_ADDR,      NEURAL_ABI,       wallet);
const risk        = new ethers.Contract(RISK_ADDR,        RISK_ABI,         wallet);
const yieldMind   = new ethers.Contract(YIELD_MIND_ADDR,  YIELD_ABI,        wallet);

// ─── In-memory state ──────────────────────────────────────────────────────────

const state = {
    activeBorrowers:    new Set(),      // Set<address>
    priceHistory:       [],             // rolling 100 bigint entries
    lastRebalanceBlock: 0n,
    borrowerScores:     new Map(),      // address → number
    avgCreditScore:     0,
    lastSweepBlock:     0n,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function waitBlocks(n) {
    if (n <= 0) return;
    const start = await provider.getBlockNumber();
    await new Promise((resolve) => {
        const check = async () => {
            try {
                const current = await provider.getBlockNumber();
                if (current >= start + n) { resolve(); return; }
            } catch (_) {}
            setTimeout(check, 6_000);
        };
        check();
    });
}

// Deposit balance → tier 0-7
function computeDepositTier(balance) {
    const b = BigInt(balance);
    if (b >= 500_000_000_000n) return 7;
    if (b >= 100_000_000_000n) return 6;
    if (b >= 50_000_000_000n)  return 5;
    if (b >= 10_000_000_000n)  return 4;
    if (b >= 2_000_000_000n)   return 3;
    if (b >= 500_000_000n)     return 2;
    if (b > 0n)                return 1;
    return 0;
}

function computeMean(values) {
    if (!values.length) return 0;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

function computeVolatilityBps() {
    if (state.priceHistory.length < 10) return 0;
    const nums = state.priceHistory.map(Number);
    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    const variance = nums.reduce((s, x) => s + (x - mean) ** 2, 0) / nums.length;
    const stddev = Math.sqrt(variance);
    return Math.round((stddev / mean) * 10_000);
}

function compute7dChangeBps() {
    if (state.priceHistory.length < 2) return 0;
    const oldest  = Number(state.priceHistory[0]);
    const current = Number(state.priceHistory[state.priceHistory.length - 1]);
    if (oldest === 0) return 0;
    return Math.round(((current - oldest) / oldest) * 10_000);
}

// ─── Data fetchers ────────────────────────────────────────────────────────────

async function fetchBorrowerInputs(borrower) {
    try {
        const [repayments, liquidations, depositBal, firstSeen, currentBlock] =
            await Promise.all([
                lending.repaymentCount(borrower),
                lending.liquidationCount(borrower),
                lending.depositBalance(borrower),
                lending.firstSeenBlock(borrower),
                provider.getBlockNumber(),
            ]);

        const depositTier        = computeDepositTier(depositBal);
        const ageBlocks          = Math.max(0, Number(currentBlock) - Number(firstSeen));

        // Call KreditAgent with the four numeric inputs
        let deterministicScore = 0;
        try {
            const rawScore = await kreditAgent.compute_score(
                Number(repayments),
                Number(liquidations),
                depositTier,
                ageBlocks,
            );
            deterministicScore = Number(rawScore);
        } catch (e) {
            console.warn(`[aiEngine] compute_score failed for ${borrower}:`, e.message);
        }

        state.borrowerScores.set(borrower, deterministicScore);
        state.avgCreditScore = computeMean([...state.borrowerScores.values()]);

        return {
            repayments:          Number(repayments),
            liquidations:        Number(liquidations),
            depositTier,
            ageBlocks,
            deterministicScore,
        };
    } catch (err) {
        console.error(`[aiEngine] fetchBorrowerInputs skipping ${borrower}:`, err.message);
        return null;
    }
}

async function fetchPositionData(borrower) {
    try {
        const [pos, rawPrice] = await Promise.all([
            lending.positions(borrower),
            oracle.latestPrice(),
        ]);
        // Convert: collateral is mUSDC (6 decimals) — already USD × 1e6
        // debt is mUSDC — already USD × 1e6
        return {
            collateralUSD_x6: BigInt(pos.collateral),
            debtUSD_x6:       BigInt(pos.debt),
        };
    } catch (err) {
        console.error(`[aiEngine] fetchPositionData skipping ${borrower}:`, err.message);
        return null;
    }
}

// ─── AI contract callers ──────────────────────────────────────────────────────

async function callNeuralScorer(borrower) {
    const inputs = await fetchBorrowerInputs(borrower);
    if (!inputs) return;
    try {
        // Pad borrower address to bytes20 (drop 0x, take 40 hex chars)
        const tx = await neural.infer(
            borrower,
            inputs.repayments,
            inputs.liquidations,
            inputs.depositTier,
            inputs.ageBlocks,
            inputs.deterministicScore,
        );
        await tx.wait();
        console.log(`[NeuralScorer] infer() ${borrower} ✓  tx:${tx.hash}`);
    } catch (err) {
        console.error(`[NeuralScorer] infer() failed ${borrower}:`, err.message);
    }
}

async function callRiskAssessor(borrower) {
    const [posData, scoreResult] = await Promise.all([
        fetchPositionData(borrower),
        kreditAgent.compute_score(0, 0, 0, 0).catch(() => 0n),   // fallback
    ]);
    if (!posData) return;

    // Use borrower-specific score if available
    const creditScore = state.borrowerScores.get(borrower) ?? 0;

    try {
        const tx = await risk.assess_position(
            borrower,
            posData.collateralUSD_x6,
            posData.debtUSD_x6,
            creditScore,
            compute7dChangeBps(),
            11_000,   // 110% liquidation threshold
        );
        await tx.wait();
        console.log(`[RiskAssessor] assess_position() ${borrower} ✓  tx:${tx.hash}`);
    } catch (err) {
        console.error(`[RiskAssessor] assess_position() failed ${borrower}:`, err.message);
    }
}

async function callRiskAssessorBatch() {
    const borrowers = [...state.activeBorrowers].slice(0, 16);
    if (!borrowers.length) return;

    const addrArr  = new Array(16).fill(ethers.ZeroAddress);
    const collArr  = new Array(16).fill(0n);
    const debtArr  = new Array(16).fill(0n);
    const scoreArr = new Array(16).fill(0);

    let realCount = 0;
    for (let i = 0; i < borrowers.length; i++) {
        const pos = await fetchPositionData(borrowers[i]);
        if (!pos) continue;
        addrArr[i]  = borrowers[i];
        collArr[i]  = pos.collateralUSD_x6;
        debtArr[i]  = pos.debtUSD_x6;
        scoreArr[i] = state.borrowerScores.get(borrowers[i]) ?? 0;
        realCount++;
    }
    if (!realCount) return;

    try {
        const tx = await risk.assess_batch(
            addrArr, collArr, debtArr, scoreArr,
            compute7dChangeBps(), 11_000, realCount,
        );
        await tx.wait();
        console.log(`[RiskAssessor] assess_batch() ${realCount} positions ✓  tx:${tx.hash}`);
    } catch (err) {
        console.error('[RiskAssessor] assess_batch() failed:', err.message);
    }
}

async function callYieldMind() {
    if (state.priceHistory.length < 5) {
        console.log('[YieldMind] skipping — insufficient price history');
        return;
    }
    try {
        const [deposited, borrowed, stratBal, currentBlock] = await Promise.all([
            lending.totalDeposited(),
            lending.totalBorrowed(),
            yieldPool.totalPrincipal(),
            provider.getBlockNumber(),
        ]);
        const blocksSinceRebalance = Number(BigInt(currentBlock) - state.lastRebalanceBlock);
        const tx = await yieldMind.compute_allocation(
            BigInt(deposited),
            BigInt(borrowed),
            BigInt(stratBal),
            state.avgCreditScore,
            computeVolatilityBps(),
            blocksSinceRebalance,
        );
        await tx.wait();
        state.lastRebalanceBlock = BigInt(currentBlock);
        console.log(`[YieldMind] compute_allocation() ✓  tx:${tx.hash}`);
    } catch (err) {
        console.error('[YieldMind] compute_allocation() failed:', err.message);
    }
}

// ─── Event-driven triggers ────────────────────────────────────────────────────

lending.on('Borrowed', async (borrower) => {
    state.activeBorrowers.add(borrower);
    console.log(`[aiEngine] Borrowed event — borrower:${borrower}`);
    await waitBlocks(2);
    await callNeuralScorer(borrower);
});

lending.on('Repaid', async (borrower) => {
    console.log(`[aiEngine] Repaid event — borrower:${borrower}`);
    await waitBlocks(1);
    await callNeuralScorer(borrower);
});

lending.on('CollateralDeposited', async (borrower) => {
    state.activeBorrowers.add(borrower);
    console.log(`[aiEngine] CollateralDeposited — borrower:${borrower}`);
    await waitBlocks(1);
    await callRiskAssessor(borrower);
});

lending.on('Liquidated', async (borrower) => {
    console.log(`[aiEngine] Liquidated event — borrower:${borrower}`);
    await callRiskAssessor(borrower);
});

lending.on('Deposited', async () => {
    console.log('[aiEngine] Deposited event');
    await waitBlocks(2);
    await callYieldMind();
});

lending.on('YieldHarvested', async () => {
    console.log('[aiEngine] YieldHarvested event');
    await waitBlocks(1);
    await callYieldMind();
});

oracle.on('PriceUpdated', async () => {
    console.log('[aiEngine] PriceUpdated event');
    await waitBlocks(2);
    await callRiskAssessorBatch();
});

// ─── Price history — update on every block ───────────────────────────────────

provider.on('block', async () => {
    try {
        const price = await oracle.latestPrice();
        state.priceHistory.push(BigInt(price));
        if (state.priceHistory.length > 100) state.priceHistory.shift();
    } catch (_) {}
});

// ─── Periodic sweep — every 200 blocks ───────────────────────────────────────

provider.on('block', async (blockNumber) => {
    const current = BigInt(blockNumber);
    if (current < state.lastSweepBlock + 200n) return;
    state.lastSweepBlock = current;

    const borrowers = [...state.activeBorrowers];
    if (!borrowers.length) return;
    console.log(`[aiEngine] periodic sweep at block ${blockNumber} — ${borrowers.length} borrower(s)`);

    for (let i = 0; i < borrowers.length; i++) {
        await waitBlocks(i * 2);   // stagger: 2 blocks apart per borrower
        await callNeuralScorer(borrowers[i]);
    }
});

// ─── Startup ──────────────────────────────────────────────────────────────────

(async () => {
    const block = await provider.getBlockNumber();
    console.log(`[aiEngine] started at block ${block}`);
    console.log(`[aiEngine]   NeuralScorer  ${NEURAL_ADDR}`);
    console.log(`[aiEngine]   RiskAssessor  ${RISK_ADDR}`);
    console.log(`[aiEngine]   YieldMind     ${YIELD_MIND_ADDR}`);
    console.log(`[aiEngine] listening for protocol events...`);
})();
