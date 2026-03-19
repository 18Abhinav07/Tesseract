'use strict';
// backend/src/aiEngine.js
// Phase 5 AI Engine - event-driven ink! contract caller
// Usable as: require('./src/aiEngine').start()  OR  node src/aiEngine.js

const { ethers } = require('ethers');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const RPC_URL = process.env.RPC || 'https://eth-rpc-testnet.polkadot.io/';
const KEY = process.env.KEY_AI_ENGINE || process.env.KEY;

if (!KEY) { console.error('[aiEngine] KEY_AI_ENGINE/KEY not set in .env - skipping AI engine'); }

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = KEY ? new ethers.Wallet(KEY, provider) : null;

// ─── ABI fragments ────────────────────────────────────────────────────────────

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

const ORACLE_ABI = [
    'function latestPrice() view returns (int256)',
    'event PriceUpdated(int256 price, uint80 roundId, uint256 updatedAt)',
];

// ─── Contract instances ───────────────────────────────────────────────────────

function normalizeAddress(addr, label) {
    if (!addr) throw new Error(`[aiEngine] Missing ${label}`);
    try {
        return ethers.getAddress(addr);
    } catch (_) {
        return ethers.getAddress(String(addr).toLowerCase());
    }
}

const LENDING_ADDR = normalizeAddress(process.env.LENDING_ADDR || '0x61c6b46f5094f2867Dce66497391d0fd41796CEa', 'LENDING_ADDR');
const YIELD_POOL_ADDR = normalizeAddress(process.env.YIELD_POOL_ADDR || '0x12CEF08cb9D58357A170ee2fA70b3cE2c0419bd6', 'YIELD_POOL_ADDR');
const KREDITAGENT_ADDR = normalizeAddress(process.env.KREDIT_AGENT_ADDRESS || '0x8c13e6ffdf27bb51304efff108c9b646d148e5f3', 'KREDIT_AGENT_ADDRESS');
const ORACLE_ADDR = normalizeAddress(process.env.ORACLE || '0x1494432a8Af6fa8c03C0d7DD7720E298D85C55c7', 'ORACLE');
const NEURAL_ADDR = process.env.NEURAL_SCORER_ADDRESS ? normalizeAddress(process.env.NEURAL_SCORER_ADDRESS, 'NEURAL_SCORER_ADDRESS') : null;
const RISK_ADDR = process.env.RISK_ASSESSOR_ADDRESS ? normalizeAddress(process.env.RISK_ASSESSOR_ADDRESS, 'RISK_ASSESSOR_ADDRESS') : null;
const YIELD_MIND_ADDR = process.env.YIELD_MIND_ADDRESS ? normalizeAddress(process.env.YIELD_MIND_ADDRESS, 'YIELD_MIND_ADDRESS') : null;

if (!NEURAL_ADDR || !RISK_ADDR || !YIELD_MIND_ADDR) {
    console.error('[aiEngine] NEURAL_SCORER_ADDRESS / RISK_ASSESSOR_ADDRESS / YIELD_MIND_ADDRESS not set. Deploy contracts first.');
}

const lending = new ethers.Contract(LENDING_ADDR, LENDING_ABI, wallet || provider);
const yieldPool = new ethers.Contract(YIELD_POOL_ADDR, YIELD_POOL_ABI, provider);
const oracle = new ethers.Contract(ORACLE_ADDR, ORACLE_ABI, provider);

// PVM ink! message selectors from compiled metadata.
const SEL_AGENT_COMPUTE_SCORE = '0x3a518c00';
const SEL_NEURAL_INFER = '0xb323a37b';
const SEL_RISK_ASSESS_POSITION = '0x392c875f';
const SEL_YIELDMIND_COMPUTE_ALLOCATION = '0x3f705728';

// ─── In-memory state ──────────────────────────────────────────────────────────

const state = {
    activeBorrowers: new Set(),      // Set<address>
    priceHistory: [],             // rolling 100 bigint entries
    lastRebalanceBlock: 0n,
    borrowerScores: new Map(),      // address → number
    avgCreditScore: 0,
    lastSweepBlock: 0n,
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
            } catch (_) { }
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
    if (b >= 50_000_000_000n) return 5;
    if (b >= 10_000_000_000n) return 4;
    if (b >= 2_000_000_000n) return 3;
    if (b >= 500_000_000n) return 2;
    if (b > 0n) return 1;
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
    const oldest = Number(state.priceHistory[0]);
    const current = Number(state.priceHistory[state.priceHistory.length - 1]);
    if (oldest === 0) return 0;
    return Math.round(((current - oldest) / oldest) * 10_000);
}

function bytes20FromAddress(addr) {
    return ethers.getBytes(normalizeAddress(addr, 'bytes20 address')).slice(0, 20);
}

function leU32(v) {
    const b = Buffer.alloc(4);
    b.writeUInt32LE(Number(v));
    return Uint8Array.from(b);
}

function leI32(v) {
    const b = Buffer.alloc(4);
    b.writeInt32LE(Number(v));
    return Uint8Array.from(b);
}

function leU64(v) {
    const b = Buffer.alloc(8);
    b.writeBigUInt64LE(BigInt(v));
    return Uint8Array.from(b);
}

function u8(v) {
    return Uint8Array.from([Number(v) & 0xff]);
}

function buildPvmCalldata(selectorHex, parts) {
    return ethers.hexlify(ethers.concat([ethers.getBytes(selectorHex), ...parts]));
}

function fromLE64(bytes, offset) {
    let v = 0n;
    for (let i = 0; i < 8; i++) {
        v |= BigInt(bytes[offset + i]) << BigInt(i * 8);
    }
    return v;
}

async function callAgentComputeScore(repayments, liquidations, depositTier, ageBlocks) {
    const data = buildPvmCalldata(SEL_AGENT_COMPUTE_SCORE, [
        leU64(repayments),
        leU64(liquidations),
        leU64(depositTier),
        leU64(ageBlocks),
    ]);

    const ret = await provider.call({ to: KREDITAGENT_ADDR, data });
    const out = ethers.getBytes(ret);
    if (out.length < 9 || out[0] !== 0x00) {
        throw new Error('kreditAgent malformed response');
    }
    return Number(fromLE64(out, 1));
}

async function sendPvmMessage(contractAddress, selectorHex, parts, label) {
    if (!wallet) throw new Error('no signer wallet');
    const data = buildPvmCalldata(selectorHex, parts);
    const tx = await wallet.sendTransaction({ to: contractAddress, data });
    const rcpt = await tx.wait();
    console.log(`[${label}] ✓  tx:${tx.hash} gas:${rcpt.gasUsed}`);
    return tx.hash;
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

        const depositTier = computeDepositTier(depositBal);
        const ageBlocks = Math.max(0, Number(currentBlock) - Number(firstSeen));

        // Call KreditAgent with the four numeric inputs
        let deterministicScore = 0;
        try {
            deterministicScore = await callAgentComputeScore(
                Number(repayments),
                Number(liquidations),
                depositTier,
                ageBlocks,
            );
        } catch (e) {
            console.warn(`[aiEngine] compute_score failed for ${borrower}:`, e.message);
        }

        state.borrowerScores.set(borrower, deterministicScore);
        state.avgCreditScore = computeMean([...state.borrowerScores.values()]);

        return {
            repayments: Number(repayments),
            liquidations: Number(liquidations),
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
        // Convert: collateral is mUSDC (6 decimals) - already USD × 1e6
        // debt is mUSDC - already USD × 1e6
        return {
            collateralUSD_x6: BigInt(pos.collateral),
            debtUSD_x6: BigInt(pos.debt),
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
        await sendPvmMessage(
            NEURAL_ADDR,
            SEL_NEURAL_INFER,
            [
                bytes20FromAddress(borrower),
                leU32(inputs.repayments),
                leU32(inputs.liquidations),
                u8(inputs.depositTier),
                leU32(inputs.ageBlocks),
                u8(inputs.deterministicScore),
            ],
            `NeuralScorer infer() ${borrower}`,
        );
    } catch (err) {
        console.error(`[NeuralScorer] infer() failed ${borrower}:`, err.message);
    }
}

async function callRiskAssessor(borrower) {
    const [posData] = await Promise.all([
        fetchPositionData(borrower),
    ]);
    if (!posData) return;

    // Use borrower-specific score if available
    const creditScore = state.borrowerScores.get(borrower) ?? 0;

    try {
        await sendPvmMessage(
            RISK_ADDR,
            SEL_RISK_ASSESS_POSITION,
            [
                bytes20FromAddress(borrower),
                leU64(posData.collateralUSD_x6),
                leU64(posData.debtUSD_x6),
                u8(creditScore),
                leI32(compute7dChangeBps()),
                leU32(11_000),
            ],
            `RiskAssessor assess_position() ${borrower}`,
        );
    } catch (err) {
        console.error(`[RiskAssessor] assess_position() failed ${borrower}:`, err.message);
    }
}

async function callRiskAssessorBatch() {
    const borrowers = [...state.activeBorrowers].slice(0, 16);
    if (!borrowers.length) return;
    for (const borrower of borrowers) {
        await callRiskAssessor(borrower);
    }
}

async function callYieldMind() {
    if (state.priceHistory.length < 5) {
        console.log('[YieldMind] skipping - insufficient price history');
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
        await sendPvmMessage(
            YIELD_MIND_ADDR,
            SEL_YIELDMIND_COMPUTE_ALLOCATION,
            [
                leU64(deposited),
                leU64(borrowed),
                leU64(stratBal),
                u8(state.avgCreditScore),
                leU32(computeVolatilityBps()),
                leU32(blocksSinceRebalance),
            ],
            'YieldMind compute_allocation()',
        );
        state.lastRebalanceBlock = BigInt(currentBlock);
    } catch (err) {
        console.error('[YieldMind] compute_allocation() failed:', err.message);
    }
}

// ─── Event-driven triggers (polling via eth_getLogs - eth_newFilter unsupported) ──

function setupPolling(startBlock) {
    let fromBlock = startBlock;

    const LENDING_EVENTS = [
        lending.filters.Borrowed(),
        lending.filters.Repaid(),
        lending.filters.CollateralDeposited(),
        lending.filters.Liquidated(),
        lending.filters.Deposited(),
        lending.filters.YieldHarvested(),
    ];

    const poll = async () => {
        try {
            const toBlock = await provider.getBlockNumber();
            if (toBlock <= fromBlock) return;

            // Update price history
            try {
                const price = await oracle.latestPrice();
                state.priceHistory.push(BigInt(price));
                if (state.priceHistory.length > 100) state.priceHistory.shift();
            } catch (_) { }

            // Poll lending events
            for (const filter of LENDING_EVENTS) {
                const logs = await lending.queryFilter(filter, fromBlock + 1, toBlock).catch(() => []);
                for (const log of logs) {
                    const { name, args } = log;
                    const borrower = args[0]?.toLowerCase?.() ?? args[0];

                    if (name === 'Borrowed') {
                        state.activeBorrowers.add(borrower);
                        console.log(`[aiEngine] Borrowed - borrower:${borrower}`);
                        await callNeuralScorer(borrower);
                    } else if (name === 'Repaid') {
                        console.log(`[aiEngine] Repaid - borrower:${borrower}`);
                        await callNeuralScorer(borrower);
                    } else if (name === 'CollateralDeposited') {
                        state.activeBorrowers.add(borrower);
                        console.log(`[aiEngine] CollateralDeposited - borrower:${borrower}`);
                        await callRiskAssessor(borrower);
                    } else if (name === 'Liquidated') {
                        console.log(`[aiEngine] Liquidated - borrower:${borrower}`);
                        await callRiskAssessor(borrower);
                    } else if (name === 'Deposited' || name === 'YieldHarvested') {
                        console.log(`[aiEngine] ${name} event`);
                        await callYieldMind();
                    }
                }
            }

            // Periodic sweep every 50 blocks (~5 min)
            // Always runs - uses wallet as sentinel demo borrower when no real borrowers exist
            // so that PVM contracts emit events even on quiet testnet periods.
            const current = BigInt(toBlock);
            if (current >= state.lastSweepBlock + 50n) {
                state.lastSweepBlock = current;
                const realBorrowers = [...state.activeBorrowers];
                const sweepList = realBorrowers.length > 0 ? realBorrowers : [wallet.address];
                const isDemo = realBorrowers.length === 0;
                console.log(`[aiEngine] periodic sweep at block ${toBlock} - ${sweepList.length} borrower(s)${isDemo ? ' (demo sentinel)' : ''}`);
                for (const borrower of sweepList) {
                    await callNeuralScorer(borrower);
                    await callRiskAssessor(borrower);
                }
                // Always run yield-mind with current pool state
                await callYieldMind();
            }

            fromBlock = toBlock;
        } catch (err) {
            console.error('[aiEngine] poll error:', err.message);
        }
    };

    poll();
    setInterval(poll, 12_000);  // poll every ~2 blocks
}

// ─── Startup ──────────────────────────────────────────────────────────────────

async function start() {
    if (!KEY || !wallet) return;
    if (!NEURAL_ADDR || !RISK_ADDR || !YIELD_MIND_ADDR) {
        console.warn('[aiEngine] Contract addresses not set - event polling disabled');
        return;
    }
    const block = await provider.getBlockNumber();
    state.lastSweepBlock = BigInt(block);
    console.log(`[aiEngine] started at block ${block}`);
    console.log(`[aiEngine]   NeuralScorer  ${NEURAL_ADDR}`);
    console.log(`[aiEngine]   RiskAssessor  ${RISK_ADDR}`);
    console.log(`[aiEngine]   YieldMind     ${YIELD_MIND_ADDR}`);
    console.log(`[aiEngine] listening for protocol events...`);
    setupPolling(block);
}

module.exports = { start };

// allow standalone: node src/aiEngine.js
if (require.main === module) start().catch(err => console.error('[aiEngine]', err.message));
