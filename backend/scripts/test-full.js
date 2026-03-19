'use strict';
/**
 * Product simulation runner for Kredio protocol.
 *
 * Scenario summary:
 *  - Load all keys/addresses from backend/.env (with contracts/.env fallback)
 *  - Reset protocol to a known state
 *  - Ensure all users are funded to required simulation balances
 *  - USER1 + USER2 become depositors
 *  - USER3 + USER4 perform borrow and repay flows
 *  - Oracle crash simulation forces liquidation of an unsafe USER4 position
 *  - Intelligent yield strategy is exercised under low-liquidity conditions
 *  - USER1 + USER2 harvest and withdraw assets
 *  - Rich JSON + Markdown reports include expected-vs-actual failure classification
 */

const { ethers } = require('ethers');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Prefer backend/.env first as requested, then fill missing values from contracts/.env.
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../contracts/.env'), override: false });

// -----------------------------------------------------------------------------
// Network + addresses
// -----------------------------------------------------------------------------
const RPC = process.env.PASSET_RPC || process.env.RPC || 'https://eth-rpc-testnet.polkadot.io/';
const CHAIN_ID = 420420417;

const ADDR = {
    MUSDC: process.env.MUSDC_ADDR || process.env.MUSDC || '0x5998cE005b4f3923c988Ae31940fAa1DEAC0c646',
    LENDING: process.env.LENDING_ADDR || process.env.LENDING || '0x61c6b46f5094f2867Dce66497391d0fd41796CEa',
    PAS_MARKET: process.env.MARKET_ADDR || process.env.PAS_MARKET_ADDR || '0x5617dBa1b13155fD6fD62f82ef6D9e8F0F3B0E86',
    YIELD_POOL: process.env.YIELD_POOL_ADDR || process.env.YIELD_POOL || '0x1dB4Faad3081aAfe26eC0ef6886F04f28D944AAB',
    ORACLE: process.env.ORACLE || '0x1494432a8Af6fa8c03C0d7DD7720E298D85C55c7',
};

// -----------------------------------------------------------------------------
// ABIs
// -----------------------------------------------------------------------------
const MUSDC_ABI = [
    'function balanceOf(address) view returns (uint256)',
    'function approve(address,uint256) returns (bool)',
    'function transfer(address,uint256) returns (bool)',
    'function mint(address,uint256)',
    'function allowance(address,address) view returns (uint256)',
];

const LENDING_ABI = [
    'function deposit(uint256)',
    'function withdraw(uint256)',
    'function depositCollateral(uint256)',
    'function borrow(uint256)',
    'function repay()',
    'function pendingYield(address) view returns (uint256)',
    'function pendingYieldAndHarvest(address)',
    'function totalDeposited() view returns (uint256)',
    'function totalBorrowed() view returns (uint256)',
    'function investedAmount() view returns (uint256)',
    'function globalTick() view returns (uint256)',
    'function protocolFees() view returns (uint256)',
    'function depositBalance(address) view returns (uint256)',
    'function collateralBalance(address) view returns (uint256)',
    'function accruedInterest(address) view returns (uint256)',
    'function utilizationRate() view returns (uint256)',
    'function getScore(address) view returns (uint64 score, uint8 tier, uint32 collateralRatioBps, uint32 interestRateBps)',
    'function getPositionFull(address) view returns (uint256 collateral, uint256 debt, uint256 accrued, uint256 totalOwed, uint32 interestBps, uint8 tier, bool active)',
    'function strategyStatus() view returns (address pool, uint256 invested, uint256 totalEarned, uint256 pendingYield_, uint256 investRatio_, uint256 minBuffer_)',
    'function pendingStrategyYield() view returns (uint256)',
    'function adminSetGlobalTick(uint256)',
    'function adminInvest(uint256)',
    'function adminPullBack(uint256)',
    'function adminClaimAndInjectYield()',
    'function adminTickPool(address[])',
    'function adminSetYieldPool(address)',
    'function adminCleanContract(address to, address[] users, address[] depositors)',
];

const PAS_MARKET_ABI = [
    'function setRiskParams(uint256,uint256,uint256,uint256)',
    'function deposit(uint256)',
    'function withdraw(uint256)',
    'function depositCollateral() payable',
    'function withdrawCollateral()',
    'function borrow(uint256)',
    'function repay()',
    'function pendingYield(address) view returns (uint256)',
    'function pendingYieldAndHarvest(address)',
    'function totalDeposited() view returns (uint256)',
    'function totalBorrowed() view returns (uint256)',
    'function globalTick() view returns (uint256)',
    'function protocolFees() view returns (uint256)',
    'function ltvBps() view returns (uint256)',
    'function depositBalance(address) view returns (uint256)',
    'function collateralBalance(address) view returns (uint256)',
    'function accruedInterest(address) view returns (uint256)',
    'function utilizationRate() view returns (uint256)',
    'function maxBorrowable(address) view returns (uint256)',
    'function getPositionFull(address) view returns (uint256 collateralPAS, uint256 collateralValueUSDC, uint256 debtUSDC, uint256 accrued, uint256 totalOwed, uint32 interestBps, uint8 tier, bool active)',
    'function adminSetGlobalTick(uint256)',
    'function adminTickPool(address[])',
    'function adminLiquidate(address)',
    'function adminCleanContract(address to, address[] users, address[] depositors)',
];

const YIELD_POOL_ABI = [
    'function totalPrincipal() view returns (uint256)',
    'function pendingYield(address) view returns (uint256)',
    'function setYieldRate(uint256)',
    'function yieldRateBps() view returns (uint256)',
];

const ORACLE_ABI = [
    'function latestRoundData() view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
    'function normalPrice() view returns (int256)',
    'function crashed() view returns (bool)',
    'function setPrice(int256)',
    'function recover()',
];

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------
const provider = new ethers.JsonRpcProvider(RPC, { chainId: CHAIN_ID, name: 'polkadot-hub-testnet' });

function mkWallet(pk) {
    if (!pk) throw new Error('Missing private key from env');
    const key = pk.startsWith('0x') ? pk : `0x${pk}`;
    return new ethers.Wallet(key, provider);
}

const admin = mkWallet(process.env.ADMIN);
const users = {
    USER1: mkWallet(process.env.USER1),
    USER2: mkWallet(process.env.USER2),
    USER3: mkWallet(process.env.USER3),
    USER4: mkWallet(process.env.USER4),
    USER5: mkWallet(process.env.USER5),
    USER6: mkWallet(process.env.USER6),
};

const musdc = new ethers.Contract(ADDR.MUSDC, MUSDC_ABI, provider);
const lending = new ethers.Contract(ADDR.LENDING, LENDING_ABI, provider);
const pasMarket = new ethers.Contract(ADDR.PAS_MARKET, PAS_MARKET_ABI, provider);
let yieldPool = new ethers.Contract(ADDR.YIELD_POOL, YIELD_POOL_ABI, provider);
const oracle = new ethers.Contract(ADDR.ORACLE, ORACLE_ABI, provider);

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
const fmt6 = (n) => Number(ethers.formatUnits(n ?? 0n, 6)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
const fmt18 = (n) => Number(ethers.formatEther(n ?? 0n)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
const u6 = (n) => ethers.parseUnits(String(n), 6);
const u18 = (n) => ethers.parseEther(String(n));
const minBI = (...vals) => vals.reduce((a, b) => (a < b ? a : b));
const maxBI = (a, b) => (a > b ? a : b);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function bigintSafe(obj) {
    if (obj == null) return null;
    return JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === 'bigint' ? v.toString() : v)));
}

function isLikelyPrivateKey(v) {
    return typeof v === 'string' && /^(0x)?[0-9a-fA-F]{64}$/.test(v.trim());
}

function collectEnvWalletAddresses() {
    const addrs = new Set();
    for (const [key, value] of Object.entries(process.env)) {
        if (!value) continue;
        if (!/^(ADMIN|DEPLOYER|USER\d+|KEY\d+|PRIVATE_KEY(?:_\d+)?)$/.test(key)) continue;
        if (!isLikelyPrivateKey(value)) continue;
        try {
            addrs.add(mkWallet(value).address);
        } catch (_) {
            // ignore malformed values
        }
    }
    return [...addrs];
}

async function withTimeout(promise, ms, label) {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)),
    ]);
}

function isRetryableTxError(err) {
    const msg = String(err?.shortMessage || err?.message || '').toLowerCase();
    return (
        msg.includes('could not coalesce error') ||
        msg.includes('timeout') ||
        msg.includes('nonce too low') ||
        msg.includes('already known') ||
        msg.includes('replacement transaction underpriced') ||
        msg.includes('priority is too low') ||
        msg.includes('temporarily unavailable')
    );
}

async function waitForReceiptWithTimeout(txHash, timeoutMs = 180000) {
    const started = Date.now();
    while (Date.now() - started < timeoutMs) {
        const r = await provider.getTransactionReceipt(txHash);
        if (r) return r;
        await sleep(2500);
    }
    throw new Error(`tx ${txHash} not mined within ${Math.floor(timeoutMs / 1000)}s`);
}

async function hasCode(address) {
    const code = await provider.getCode(address);
    return !!code && code !== '0x';
}

async function resolveYieldPoolAddress() {
    if (await hasCode(ADDR.YIELD_POOL)) return ADDR.YIELD_POOL;
    const status = await lending.strategyStatus();
    const fromStrategy = status.pool || status[0];
    if (fromStrategy && await hasCode(fromStrategy)) return fromStrategy;
    throw new Error(`No deployed yield pool found. configured=${ADDR.YIELD_POOL}, strategyStatus=${fromStrategy}`);
}

async function poolSnap() {
    const l = {
        totalDeposited: await lending.totalDeposited(),
        totalBorrowed: await lending.totalBorrowed(),
        investedAmount: await lending.investedAmount(),
        protocolFees: await lending.protocolFees(),
        utilizationRate: await lending.utilizationRate(),
        globalTick: await lending.globalTick(),
        usdcBalance: await musdc.balanceOf(ADDR.LENDING),
    };
    const p = {
        totalDeposited: await pasMarket.totalDeposited(),
        totalBorrowed: await pasMarket.totalBorrowed(),
        protocolFees: await pasMarket.protocolFees(),
        utilizationRate: await pasMarket.utilizationRate(),
        globalTick: await pasMarket.globalTick(),
        usdcBalance: await musdc.balanceOf(ADDR.PAS_MARKET),
    };
    const y = {
        principal: await yieldPool.totalPrincipal(),
        pendingForLending: await yieldPool.pendingYield(ADDR.LENDING),
        yieldRateBps: await yieldPool.yieldRateBps(),
    };
    return { lending: bigintSafe(l), pasMarket: bigintSafe(p), yieldPool: bigintSafe(y) };
}

function normalizeStepStatus(step) {
    // Expected failure cases are counted as successful outcomes.
    return step.status === 'PASS' || step.status === 'EXPECTED_FAIL';
}

const REPORT = [];
let stepNum = 0;

/**
 * Execute transaction step with expected failure support + optional state verification.
 */
async function step(phase, actor, action, contractName, txFn, opts = {}) {
    stepNum += 1;
    const rec = {
        step: stepNum,
        phase,
        actor,
        action,
        contract: contractName,
        params: opts.params || '',
        expected: opts.expected || '',
        expectedFailure: !!opts.expectFailure,
        status: 'PENDING',
        txHash: null,
        gasUsed: null,
        error: null,
        verification: null,
        observedBefore: null,
        observedAfter: null,
        durationMs: 0,
    };

    const started = Date.now();
    console.log(`\n  [Step ${rec.step}] (${phase}) ${actor}: ${action}`);
    try {
        await sleep(opts.preDelayMs ?? 3000);

        if (opts.beforeFn) rec.observedBefore = bigintSafe(await opts.beforeFn());

        let tx = null;
        let receipt = null;
        let lastErr = null;
        const retries = opts.retries ?? 3;

        for (let i = 1; i <= retries; i++) {
            try {
                tx = await withTimeout(txFn(), opts.sendTimeoutMs ?? 45000, 'tx send');
                rec.txHash = tx.hash;
                console.log(`     ↳ submitted: ${tx.hash}`);
                receipt = await waitForReceiptWithTimeout(tx.hash, opts.waitTimeoutMs ?? 180000);
                break;
            } catch (err) {
                lastErr = err;
                if (!isRetryableTxError(err) || i === retries) throw err;
                console.log(`     [retry] transient tx error (${i}/${retries}): ${(err.shortMessage || err.message || String(err)).slice(0, 140)}`);
                await sleep(1500 * i);
            }
        }

        if (!receipt && lastErr) throw lastErr;
        rec.txHash = receipt.hash;
        rec.gasUsed = receipt.gasUsed?.toString?.() || '0';

        if (opts.afterFn) rec.observedAfter = bigintSafe(await opts.afterFn());

        if (opts.expectFailure) {
            rec.status = 'UNEXPECTED_SUCCESS';
            rec.error = 'Transaction succeeded but failure was expected';
            console.log('     ✗ Unexpected success (expected failure)');
        } else if (opts.verifyFn) {
            const verify = await opts.verifyFn();
            rec.verification = verify?.message || '';
            if (verify?.ok) {
                rec.status = 'PASS';
                console.log(`     ✓ tx: ${receipt.hash}   gas: ${receipt.gasUsed}`);
                if (verify?.message) console.log(`     ✓ verify: ${verify.message}`);
            } else {
                rec.status = 'VERIFY_FAIL';
                rec.error = verify?.message || 'Post-state verification failed';
                console.log(`     ✗ verify failed: ${rec.error}`);
            }
        } else {
            rec.status = 'PASS';
            console.log(`     ✓ tx: ${receipt.hash}   gas: ${receipt.gasUsed}`);
        }
    } catch (err) {
        rec.error = (err.shortMessage || err.message || String(err)).slice(0, 350);
        if (opts.expectFailure) {
            rec.status = 'EXPECTED_FAIL';
            console.log(`     ✓ expected fail: ${rec.error}`);
        } else {
            rec.status = 'FAIL';
            console.log(`     ✗ failed: ${rec.error}`);
        }
    } finally {
        rec.durationMs = Date.now() - started;
        REPORT.push(rec);
    }

    return rec;
}

async function check(phase, actor, action, checkFn, expected = '') {
    stepNum += 1;
    const rec = {
        step: stepNum,
        phase,
        actor,
        action,
        contract: 'READ_ONLY_CHECK',
        params: '',
        expected,
        expectedFailure: false,
        status: 'PENDING',
        txHash: null,
        gasUsed: null,
        error: null,
        verification: null,
        observedBefore: null,
        observedAfter: null,
        durationMs: 0,
    };

    const started = Date.now();
    console.log(`\n  [Step ${rec.step}] (${phase}) ${actor}: ${action}`);
    try {
        const out = await checkFn();
        rec.verification = out?.message || '';
        rec.observedAfter = bigintSafe(out?.details || null);
        rec.status = out?.ok ? 'PASS' : 'VERIFY_FAIL';
        if (out?.ok) {
            console.log(`     ✓ check: ${out?.message || 'ok'}`);
        } else {
            rec.error = out?.message || 'check failed';
            console.log(`     ✗ check failed: ${rec.error}`);
        }
    } catch (err) {
        rec.status = 'FAIL';
        rec.error = (err.shortMessage || err.message || String(err)).slice(0, 350);
        console.log(`     ✗ failed: ${rec.error}`);
    } finally {
        rec.durationMs = Date.now() - started;
        REPORT.push(rec);
    }

    return rec;
}

function statusIcon(s) {
    if (s === 'PASS' || s === 'EXPECTED_FAIL') return 'OK';
    if (s === 'UNEXPECTED_SUCCESS') return 'BAD';
    if (s === 'VERIFY_FAIL') return 'BAD';
    return 'BAD';
}

function shortAddr(a) {
    return `${a.slice(0, 8)}...${a.slice(-6)}`;
}

async function main() {
    const startedAt = Date.now();
    const bar = '='.repeat(110);
    const usersInOrder = [
        users.USER1,
        users.USER2,
        users.USER3,
        users.USER4,
        users.USER5,
        users.USER6,
    ];

    console.log(`\n${bar}`);
    console.log('  KREDIO PRODUCT WORKING SIMULATION');
    console.log(`  Run started: ${new Date().toISOString()}`);
    console.log(`${bar}\n`);

    ADDR.YIELD_POOL = await resolveYieldPoolAddress();
    yieldPool = new ethers.Contract(ADDR.YIELD_POOL, YIELD_POOL_ABI, provider);

    const envKnownAddrs = collectEnvWalletAddresses();
    const allKnownAddrs = [...new Set([admin.address, ...envKnownAddrs, ...usersInOrder.map(w => w.address)])];

    console.log('Using backend env values:');
    console.log(`  RPC       : ${RPC}`);
    console.log(`  ADMIN     : ${admin.address}`);
    console.log(`  USER1..6  : ${usersInOrder.map(w => shortAddr(w.address)).join(', ')}`);
    console.log('Contracts:');
    Object.entries(ADDR).forEach(([k, v]) => console.log(`  ${k.padEnd(10)}: ${v}`));

    // -------------------------------------------------------------------------
    // PHASE 0 - Baseline snapshot
    // -------------------------------------------------------------------------
    const p0 = await poolSnap();
    let normalOraclePrice = 0n;
    try {
        const rd = await oracle.latestRoundData();
        normalOraclePrice = BigInt(rd[1].toString());
    } catch (_) {
        normalOraclePrice = 502069300n;
    }

    // -------------------------------------------------------------------------
    // PHASE 1 - Clean reset + funding targets
    // -------------------------------------------------------------------------
    await step('PHASE 1', 'ADMIN', 'Reset globalTick=0 on Lending', 'KredioLending', () => lending.connect(admin).adminSetGlobalTick(0), {
        expected: 'Lending tick reset',
    });
    await step('PHASE 1', 'ADMIN', 'Reset globalTick=0 on PASMarket', 'KredioPASMarket', () => pasMarket.connect(admin).adminSetGlobalTick(0), {
        expected: 'PASMarket tick reset',
    });
    await step('PHASE 1', 'ADMIN', `adminCleanContract on Lending (${allKnownAddrs.length} users)`, 'KredioLending',
        () => lending.connect(admin).adminCleanContract(admin.address, allKnownAddrs, allKnownAddrs), {
        expected: 'Lending clean state',
    });
    await step('PHASE 1', 'ADMIN', `adminCleanContract on PASMarket (${allKnownAddrs.length} users)`, 'KredioPASMarket',
        () => pasMarket.connect(admin).adminCleanContract(admin.address, allKnownAddrs, allKnownAddrs), {
        expected: 'PAS clean state',
    });

    await check('PHASE 1', 'ADMIN', 'Verify clean deposits are zero', async () => {
        const ld = await lending.totalDeposited();
        const pd = await pasMarket.totalDeposited();
        const ok = ld === 0n && pd === 0n;
        return {
            ok,
            message: ok ? 'Both markets clean' : `Not clean: lending=${fmt6(ld)}, pas=${fmt6(pd)}`,
            details: { lendingTotalDeposited: ld.toString(), pasTotalDeposited: pd.toString() },
        };
    }, 'Both market totalDeposited should be zero after clean');

    const TARGET_MUSDC = u6('200000');
    const TARGET_PAS = u18('500');

    for (const [name, usr] of Object.entries(users)) {
        const mu = await musdc.balanceOf(usr.address);
        const pa = await provider.getBalance(usr.address);

        if (mu < TARGET_MUSDC) {
            const need = TARGET_MUSDC - mu;
            await step('PHASE 1', 'ADMIN', `Top-up ${name} with ${fmt6(need)} mUSDC`, 'MockUSDC',
                () => musdc.connect(admin).mint(usr.address, need),
                { expected: `${name} mUSDC >= ${fmt6(TARGET_MUSDC)}` });
        }

        if (pa < TARGET_PAS) {
            const needPas = TARGET_PAS - pa;
            await step('PHASE 1', 'ADMIN', `Top-up ${name} with ${fmt18(needPas)} PAS`, 'Native',
                () => admin.sendTransaction({ to: usr.address, value: needPas }),
                { expected: `${name} PAS >= ${fmt18(TARGET_PAS)}` });
        }
    }

    // -------------------------------------------------------------------------
    // PHASE 2 - Market configuration + liquidity seeding
    // -------------------------------------------------------------------------
    await step('PHASE 2', 'ADMIN', 'Set lending tick multiplier = 86400', 'KredioLending',
        () => lending.connect(admin).adminSetGlobalTick(86400),
        { expected: '1 second -> 1 day interest simulation' });

    await step('PHASE 2', 'ADMIN', 'Set PAS market tick multiplier = 86400', 'KredioPASMarket',
        () => pasMarket.connect(admin).adminSetGlobalTick(86400),
        { expected: '1 second -> 1 day interest simulation' });

    await step('PHASE 2', 'ADMIN', 'Wire yield pool to lending', 'KredioLending',
        () => lending.connect(admin).adminSetYieldPool(ADDR.YIELD_POOL),
        { expected: 'Lending strategyStatus.pool points to deployed yield pool' });

    await step('PHASE 2', 'ADMIN', 'Set PAS risk params (ltv=6500, bonus=800, stale=86400, fee=1000)', 'KredioPASMarket',
        () => pasMarket.connect(admin).setRiskParams(6500, 800, 86400, 1000),
        { expected: 'Stable testing risk profile' });

    await step('PHASE 2', 'ADMIN', 'Set yield pool rate to 100000 bps', 'MockYieldPool',
        () => yieldPool.connect(admin).setYieldRate(100000),
        { expected: 'Fast visible external yield accrual' });

    const crashed = await oracle.crashed().catch(() => false);
    if (crashed) {
        await step('PHASE 2', 'ADMIN', 'Recover oracle from crashed state', 'MockPASOracle',
            () => oracle.connect(admin).recover(),
            { expected: 'oracle.crashed=false and updatedAt refreshed' });
    }
    await step('PHASE 2', 'ADMIN', `Refresh oracle with normal price ${normalOraclePrice}`, 'MockPASOracle',
        () => oracle.connect(admin).setPrice(normalOraclePrice),
        { expected: 'Fresh normal oracle baseline before borrow simulation' });

    await step('PHASE 2', 'ADMIN', 'Approve max mUSDC -> Lending', 'MockUSDC',
        () => musdc.connect(admin).approve(ADDR.LENDING, ethers.MaxUint256),
        { expected: 'Admin can seed liquidity and support strategy ops' });
    await step('PHASE 2', 'ADMIN', 'Approve max mUSDC -> PASMarket', 'MockUSDC',
        () => musdc.connect(admin).approve(ADDR.PAS_MARKET, ethers.MaxUint256),
        { expected: 'Admin can seed PAS market + liquidations' });

    await step('PHASE 2', 'ADMIN', 'Seed Lending with 700000 mUSDC', 'KredioLending',
        () => lending.connect(admin).deposit(u6('700000')),
        { expected: 'Initial deep liquidity for simulation' });

    await step('PHASE 2', 'ADMIN', 'Seed PASMarket with 350000 mUSDC', 'KredioPASMarket',
        () => pasMarket.connect(admin).deposit(u6('350000')),
        { expected: 'Initial PAS market liquidity' });

    // -------------------------------------------------------------------------
    // PHASE 3 - Product simulation
    // -------------------------------------------------------------------------
    // USER1 + USER2 deposit (required sequence)
    const U1_DEP = u6('120000');
    const U2_DEP = u6('90000');

    await step('PHASE 3', 'USER1', `Approve ${fmt6(U1_DEP)} mUSDC to Lending`, 'MockUSDC',
        () => musdc.connect(users.USER1).approve(ADDR.LENDING, U1_DEP),
        { expected: 'USER1 allowance set' });

    await step('PHASE 3', 'USER1', `Deposit ${fmt6(U1_DEP)} mUSDC to Lending`, 'KredioLending',
        () => lending.connect(users.USER1).deposit(U1_DEP),
        {
            expected: 'USER1 becomes depositor',
            beforeFn: async () => ({ userDeposit: (await lending.depositBalance(users.USER1.address)).toString() }),
            afterFn: async () => ({ userDeposit: (await lending.depositBalance(users.USER1.address)).toString() }),
        });

    await step('PHASE 3', 'USER2', `Approve ${fmt6(U2_DEP)} mUSDC to Lending`, 'MockUSDC',
        () => musdc.connect(users.USER2).approve(ADDR.LENDING, U2_DEP),
        { expected: 'USER2 allowance set' });

    await step('PHASE 3', 'USER2', `Deposit ${fmt6(U2_DEP)} mUSDC to Lending`, 'KredioLending',
        () => lending.connect(users.USER2).deposit(U2_DEP),
        {
            expected: 'USER2 becomes depositor',
            beforeFn: async () => ({ userDeposit: (await lending.depositBalance(users.USER2.address)).toString() }),
            afterFn: async () => ({ userDeposit: (await lending.depositBalance(users.USER2.address)).toString() }),
        });

    // Intelligent yield: invest idle capital, accrue yield, then stress liquidity.
    const investTarget = u6('350000');
    await step('PHASE 3', 'ADMIN', `Invest idle ${fmt6(investTarget)} mUSDC into strategy`, 'KredioLending',
        () => lending.connect(admin).adminInvest(investTarget),
        {
            expected: 'investedAmount increases and strategy accrues yield',
            beforeFn: async () => ({ investedAmount: (await lending.investedAmount()).toString(), strategyPending: (await lending.pendingStrategyYield()).toString() }),
            afterFn: async () => ({ investedAmount: (await lending.investedAmount()).toString(), strategyPending: (await lending.pendingStrategyYield()).toString() }),
        });

    console.log('\n  Waiting 8 seconds for strategy yield accrual...');
    await sleep(8000);

    await check('PHASE 3', 'ADMIN', 'Check strategy pending yield > 0 after invest', async () => {
        const p = await lending.pendingStrategyYield();
        return {
            ok: p > 0n,
            message: `pendingStrategyYield=${fmt6(p)} mUSDC`,
            details: { pendingStrategyYield: p.toString() },
        };
    }, 'Strategy pending yield should increase after invest + time');

    // USER3 borrow + repay on Lending.
    const u3Balance = await musdc.balanceOf(users.USER3.address);
    const u3Coll = minBI(u6('70000'), (u3Balance * 55n) / 100n);

    await step('PHASE 3', 'USER3', `Approve ${fmt6(u3Coll)} mUSDC collateral to Lending`, 'MockUSDC',
        () => musdc.connect(users.USER3).approve(ADDR.LENDING, u3Coll),
        { expected: 'USER3 collateral allowance ready' });

    await step('PHASE 3', 'USER3', `Deposit ${fmt6(u3Coll)} mUSDC collateral to Lending`, 'KredioLending',
        () => lending.connect(users.USER3).depositCollateral(u3Coll),
        { expected: 'USER3 collateral set for borrowing' });

    const u3Score = await lending.getScore(users.USER3.address);
    const u3Ratio = BigInt(u3Score.collateralRatioBps || 20000);
    const u3MaxBorrow = (u3Coll * 10000n) / u3Ratio;
    const lAvailBeforeBorrow = maxBI((await lending.totalDeposited()) - (await lending.totalBorrowed()), 0n);
    const u3BorrowAmt = minBI((u3MaxBorrow * 8000n) / 10000n, (lAvailBeforeBorrow * 45n) / 100n);

    await step('PHASE 3', 'USER3', `Borrow ${fmt6(u3BorrowAmt)} mUSDC from Lending`, 'KredioLending',
        () => lending.connect(users.USER3).borrow(u3BorrowAmt),
        {
            expected: 'USER3 debt opens and pool utilization increases',
            beforeFn: async () => ({ totalBorrowed: (await lending.totalBorrowed()).toString(), investedAmount: (await lending.investedAmount()).toString() }),
            afterFn: async () => ({ totalBorrowed: (await lending.totalBorrowed()).toString(), investedAmount: (await lending.investedAmount()).toString() }),
        });

    // Stress response: if liquid balance gets tight while invested remains high, pull back.
    const lendingUsdcBal = await musdc.balanceOf(ADDR.LENDING);
    const lendingInvested = await lending.investedAmount();
    const desiredBuffer = u6('120000');
    if (lendingUsdcBal < desiredBuffer && lendingInvested > 0n) {
        const need = minBI(desiredBuffer - lendingUsdcBal, lendingInvested);
        await step('PHASE 3', 'ADMIN', `Pull back ${fmt6(need)} mUSDC from strategy due low liquid buffer`, 'KredioLending',
            () => lending.connect(admin).adminPullBack(need),
            {
                expected: 'Liquidity restored when pool is stressed/undercollateralized',
                beforeFn: async () => ({ contractUsdc: (await musdc.balanceOf(ADDR.LENDING)).toString(), investedAmount: (await lending.investedAmount()).toString() }),
                afterFn: async () => ({ contractUsdc: (await musdc.balanceOf(ADDR.LENDING)).toString(), investedAmount: (await lending.investedAmount()).toString() }),
            });
    }

    console.log('\n  Waiting 7 seconds for borrower interest accrual...');
    await sleep(7000);

    await step('PHASE 3', 'ADMIN', 'Tick Lending pool for USER3 debt capitalization', 'KredioLending',
        () => lending.connect(admin).adminTickPool([users.USER3.address]),
        { expected: 'Borrow interest converted into lender yield' });

    const u3Pos = await lending.getPositionFull(users.USER3.address);
    const u3RepayApprove = u3Pos.totalOwed + u6('1000');

    await step('PHASE 3', 'USER3', `Approve ${fmt6(u3RepayApprove)} mUSDC for Lending repay`, 'MockUSDC',
        () => musdc.connect(users.USER3).approve(ADDR.LENDING, u3RepayApprove),
        { expected: 'Repay allowance set' });

    await step('PHASE 3', 'USER3', `Repay Lending debt (owed ${fmt6(u3Pos.totalOwed)} mUSDC)`, 'KredioLending',
        () => lending.connect(users.USER3).repay(),
        {
            expected: 'USER3 lending debt closed and collateral returned',
            verifyFn: async () => {
                const p = await lending.getPositionFull(users.USER3.address);
                return { ok: !p.active, message: `USER3 active=${p.active}` };
            },
        });

    // USER4 borrow + repay on PAS market.
    const pasLtv = await pasMarket.ltvBps();
    const u4PasColl1 = u18('40');
    const coll1Value = (u4PasColl1 * normalOraclePrice) / (10n ** 20n);
    const maxBorrow1 = (coll1Value * pasLtv) / 10000n;
    const pasAvail1 = maxBI((await pasMarket.totalDeposited()) - (await pasMarket.totalBorrowed()), 0n);
    const u4Borrow1 = minBI((maxBorrow1 * 7000n) / 10000n, (pasAvail1 * 25n) / 100n);

    await step('PHASE 3', 'USER4', 'Deposit 40 PAS collateral into PASMarket', 'KredioPASMarket',
        () => pasMarket.connect(users.USER4).depositCollateral({ value: u4PasColl1 }),
        { expected: 'USER4 PAS collateral active' });

    await step('PHASE 3', 'USER4', `Borrow ${fmt6(u4Borrow1)} mUSDC from PASMarket`, 'KredioPASMarket',
        () => pasMarket.connect(users.USER4).borrow(u4Borrow1),
        { expected: 'USER4 PAS debt opens' });

    console.log('\n  Waiting 5 seconds for PAS borrow interest accrual...');
    await sleep(5000);

    await step('PHASE 3', 'ADMIN', 'Tick PASMarket for USER4 debt capitalization', 'KredioPASMarket',
        () => pasMarket.connect(admin).adminTickPool([users.USER4.address]),
        { expected: 'PAS debt interest capitalized' });

    const u4PosRepay = await pasMarket.getPositionFull(users.USER4.address);
    const u4RepayApprove = u4PosRepay.totalOwed + u6('200');

    await step('PHASE 3', 'USER4', `Approve ${fmt6(u4RepayApprove)} mUSDC for PAS repay`, 'MockUSDC',
        () => musdc.connect(users.USER4).approve(ADDR.PAS_MARKET, u4RepayApprove),
        { expected: 'Repay allowance set' });

    await step('PHASE 3', 'USER4', `Repay PAS debt (owed ${fmt6(u4PosRepay.totalOwed)} mUSDC)`, 'KredioPASMarket',
        () => pasMarket.connect(users.USER4).repay(),
        {
            expected: 'USER4 PAS position closed after repayment',
            verifyFn: async () => {
                const p = await pasMarket.getPositionFull(users.USER4.address);
                return { ok: !p.active, message: `USER4 active=${p.active}` };
            },
        });

    await step('PHASE 3', 'USER4', 'Withdraw PAS collateral after full repay', 'KredioPASMarket',
        () => pasMarket.connect(users.USER4).withdrawCollateral(),
        { expected: 'Collateral withdrawal succeeds after debt close' });

    // Open a new riskier USER4 position for forced liquidation simulation.
    const u4PasColl2 = u18('30');
    const coll2Value = (u4PasColl2 * normalOraclePrice) / (10n ** 20n);
    const maxBorrow2 = (coll2Value * pasLtv) / 10000n;
    const pasAvail2 = maxBI((await pasMarket.totalDeposited()) - (await pasMarket.totalBorrowed()), 0n);
    const u4Borrow2 = minBI((maxBorrow2 * 9300n) / 10000n, (pasAvail2 * 18n) / 100n);

    await step('PHASE 3', 'USER4', 'Deposit 30 PAS collateral for high-risk position', 'KredioPASMarket',
        () => pasMarket.connect(users.USER4).depositCollateral({ value: u4PasColl2 }),
        { expected: 'Risky collateral position opened' });

    await step('PHASE 3', 'USER4', `Borrow ${fmt6(u4Borrow2)} mUSDC at high LTV`, 'KredioPASMarket',
        () => pasMarket.connect(users.USER4).borrow(u4Borrow2),
        { expected: 'Position vulnerable to oracle downside move' });

    // Oracle crash and liquidation.
    const crashPrice = maxBI(1n, normalOraclePrice / 12n);
    await step('PHASE 3', 'ADMIN', `Crash oracle price to ${crashPrice} for liquidation test`, 'MockPASOracle',
        () => oracle.connect(admin).setPrice(crashPrice),
        { expected: 'Collateral value drops sharply, risky position becomes liquidatable' });

    await step('PHASE 3', 'ADMIN', 'Liquidate USER4 risky PAS position', 'KredioPASMarket',
        () => pasMarket.connect(admin).adminLiquidate(users.USER4.address),
        {
            expected: 'Liquidation succeeds and closes USER4 risky PAS debt',
            verifyFn: async () => {
                const p = await pasMarket.getPositionFull(users.USER4.address);
                return { ok: !p.active, message: `USER4 active=${p.active}` };
            },
        });

    await step('PHASE 3', 'USER4', 'Expected failure: withdrawCollateral after liquidation', 'KredioPASMarket',
        () => pasMarket.connect(users.USER4).withdrawCollateral(),
        {
            expected: 'No collateral left to withdraw after liquidation',
            expectFailure: true,
        });

    await step('PHASE 3', 'ADMIN', `Recover oracle to normal price ${normalOraclePrice}`, 'MockPASOracle',
        () => oracle.connect(admin).setPrice(normalOraclePrice),
        { expected: 'Restore normal pricing after crash simulation' });

    // Strategy claim + inject should improve depositor pending yield.
    const u1PendingBeforeInject = await lending.pendingYield(users.USER1.address);
    const u2PendingBeforeInject = await lending.pendingYield(users.USER2.address);

    await step('PHASE 3', 'ADMIN', 'Claim strategy yield and inject to lending pool', 'KredioLending',
        () => lending.connect(admin).adminClaimAndInjectYield(),
        {
            expected: 'External strategy yield distributed to lenders',
            verifyFn: async () => {
                const a = await lending.pendingYield(users.USER1.address);
                const b = await lending.pendingYield(users.USER2.address);
                const ok = a >= u1PendingBeforeInject && b >= u2PendingBeforeInject;
                return {
                    ok,
                    message: `U1 pending: ${fmt6(u1PendingBeforeInject)} -> ${fmt6(a)}, U2 pending: ${fmt6(u2PendingBeforeInject)} -> ${fmt6(b)}`,
                };
            },
        });

    // USER1 + USER2 harvest + withdraw (required sequence)
    const u1PendingHarvest = await lending.pendingYield(users.USER1.address);
    await step('PHASE 3', 'USER1', `Harvest Lending yield (${fmt6(u1PendingHarvest)} mUSDC pending)`, 'KredioLending',
        () => lending.connect(users.USER1).pendingYieldAndHarvest(users.USER1.address),
        {
            expected: 'USER1 pending yield becomes near zero',
            verifyFn: async () => {
                const p = await lending.pendingYield(users.USER1.address);
                return { ok: p <= u6('1'), message: `remaining pending=${fmt6(p)} mUSDC` };
            },
        });

    const u2PendingHarvest = await lending.pendingYield(users.USER2.address);
    await step('PHASE 3', 'USER2', `Harvest Lending yield (${fmt6(u2PendingHarvest)} mUSDC pending)`, 'KredioLending',
        () => lending.connect(users.USER2).pendingYieldAndHarvest(users.USER2.address),
        {
            expected: 'USER2 pending yield becomes near zero',
            verifyFn: async () => {
                const p = await lending.pendingYield(users.USER2.address);
                return { ok: p <= u6('1'), message: `remaining pending=${fmt6(p)} mUSDC` };
            },
        });

    const u1Dep = await lending.depositBalance(users.USER1.address);
    const u2Dep = await lending.depositBalance(users.USER2.address);

    await step('PHASE 3', 'USER1', `Withdraw full lending deposit (${fmt6(u1Dep)} mUSDC)`, 'KredioLending',
        () => lending.connect(users.USER1).withdraw(u1Dep),
        {
            expected: 'USER1 principal withdrawn',
            verifyFn: async () => {
                const d = await lending.depositBalance(users.USER1.address);
                return { ok: d === 0n, message: `remaining deposit=${fmt6(d)} mUSDC` };
            },
        });

    await step('PHASE 3', 'USER2', `Withdraw full lending deposit (${fmt6(u2Dep)} mUSDC)`, 'KredioLending',
        () => lending.connect(users.USER2).withdraw(u2Dep),
        {
            expected: 'USER2 principal withdrawn',
            verifyFn: async () => {
                const d = await lending.depositBalance(users.USER2.address);
                return { ok: d === 0n, message: `remaining deposit=${fmt6(d)} mUSDC` };
            },
        });

    // -------------------------------------------------------------------------
    // PHASE 4 - Post simulation clean reset
    // -------------------------------------------------------------------------
    await step('PHASE 4', 'ADMIN', 'Set lending tick back to 0', 'KredioLending',
        () => lending.connect(admin).adminSetGlobalTick(0),
        { expected: 'Disable accelerated interest after simulation' });
    await step('PHASE 4', 'ADMIN', 'Set PAS market tick back to 0', 'KredioPASMarket',
        () => pasMarket.connect(admin).adminSetGlobalTick(0),
        { expected: 'Disable accelerated interest after simulation' });
    await step('PHASE 4', 'ADMIN', `Post-clean Lending (${allKnownAddrs.length} users)`, 'KredioLending',
        () => lending.connect(admin).adminCleanContract(admin.address, allKnownAddrs, allKnownAddrs),
        { expected: 'Fresh lending state for next run' });
    await step('PHASE 4', 'ADMIN', `Post-clean PASMarket (${allKnownAddrs.length} users)`, 'KredioPASMarket',
        () => pasMarket.connect(admin).adminCleanContract(admin.address, allKnownAddrs, allKnownAddrs),
        { expected: 'Fresh PAS market state for next run' });

    // -------------------------------------------------------------------------
    // Final snapshots + report output
    // -------------------------------------------------------------------------
    const finalState = await poolSnap();
    const finalBalances = {};
    for (const [name, w] of Object.entries({ ADMIN: admin, ...users })) {
        finalBalances[name] = {
            address: w.address,
            mUSDC: (await musdc.balanceOf(w.address)).toString(),
            PAS: (await provider.getBalance(w.address)).toString(),
        };
    }

    const passed = REPORT.filter(normalizeStepStatus).length;
    const failed = REPORT.length - passed;
    const elapsedSec = ((Date.now() - startedAt) / 1000).toFixed(1);

    console.log(`\n${'='.repeat(120)}`);
    console.log('  SIMULATION REPORT SUMMARY');
    console.log(`${'='.repeat(120)}`);
    console.log(`  Steps: ${REPORT.length}  |  Passed: ${passed}  |  Failed: ${failed}  |  Elapsed: ${elapsedSec}s`);

    for (const r of REPORT) {
        const marker = statusIcon(r.status).padEnd(3);
        const txRef = r.txHash ? `${r.txHash.slice(0, 14)}...` : '-';
        const info = r.error || r.verification || '';
        console.log(`  [${marker}] #${String(r.step).padStart(2, '0')} ${r.phase.padEnd(7)} ${r.actor.padEnd(6)} ${r.status.padEnd(17)} ${r.action.slice(0, 48).padEnd(48)} ${txRef} ${info.slice(0, 60)}`);
    }

    const json = {
        runAt: new Date().toISOString(),
        elapsed_s: Number(elapsedSec),
        chain: { rpc: RPC, chainId: CHAIN_ID },
        contracts: ADDR,
        accounts: Object.fromEntries(Object.entries({ ADMIN: admin, ...users }).map(([k, w]) => [k, w.address])),
        simulationProfile: {
            fundingTargets: { mUSDC: '200000', pas: '500' },
            requiredFlow: 'USER1+USER2 deposit -> USER3+USER4 borrow/repay -> oracle crash liquidation -> USER1+USER2 harvest+withdraw',
        },
        phase0_state: p0,
        final_state: finalState,
        final_balances: finalBalances,
        steps: REPORT.map(r => ({
            step: r.step,
            phase: r.phase,
            actor: r.actor,
            action: r.action,
            contract: r.contract,
            params: r.params,
            expected: r.expected,
            expectedFailure: r.expectedFailure,
            status: r.status,
            txHash: r.txHash,
            gasUsed: r.gasUsed,
            error: r.error,
            verification: r.verification,
            observedBefore: r.observedBefore,
            observedAfter: r.observedAfter,
            durationMs: r.durationMs,
        })),
        summary: {
            total: REPORT.length,
            passed,
            failed,
            passRatePct: REPORT.length ? Number(((passed * 100) / REPORT.length).toFixed(2)) : 0,
        },
    };

    const jsonPath = path.resolve(__dirname, '../test-report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2));

    let md = '';
    md += '# Kredio Product Simulation Report\n\n';
    md += `- Run Date: ${json.runAt}\n`;
    md += `- Duration: ${elapsedSec}s\n`;
    md += `- Chain: ${CHAIN_ID}\n`;
    md += `- RPC: ${RPC}\n`;
    md += `- Steps: ${REPORT.length} | Passed: ${passed} | Failed: ${failed}\n`;
    md += '\n';

    md += '## Scenario Objective\n\n';
    md += '- Convert testing flow into product-style multi-user simulation\n';
    md += '- Required user flow enforced: USER1/USER2 deposit, USER3/USER4 borrow+repay, USER1/USER2 harvest+withdraw\n';
    md += '- Intelligent yield exercised under stressed liquidity and validated via depositor pending-yield progression\n';
    md += '- Oracle crash simulation executed and liquidation verified\n';
    md += '- Expected failures classified separately from true failures\n\n';

    md += '## Initial Targets\n\n';
    md += '| Metric | Target |\n';
    md += '|---|---:|\n';
    md += '| User mUSDC funding floor | 200,000 |\n';
    md += '| User PAS funding floor | 500 |\n\n';

    md += '## Contract Addresses\n\n';
    md += '| Contract | Address |\n';
    md += '|---|---|\n';
    for (const [k, v] of Object.entries(ADDR)) {
        md += `| ${k} | ${v} |\n`;
    }
    md += '\n';

    md += '## Step-by-Step Execution\n\n';
    md += '| # | Phase | Actor | Contract | Action | Expected | Status | Tx Hash | Gas | Notes |\n';
    md += '|---:|---|---|---|---|---|---|---|---:|---|\n';
    for (const r of REPORT) {
        const tx = r.txHash ? `\`${r.txHash}\`` : '-';
        const notes = (r.error || r.verification || '').replace(/\|/g, '/');
        md += `| ${r.step} | ${r.phase} | ${r.actor} | ${r.contract} | ${r.action} | ${r.expected || '-'} | ${r.status} | ${tx} | ${r.gasUsed || '-'} | ${notes || '-'} |\n`;
    }
    md += '\n';

    md += '## Post Simulation Snapshots\n\n';
    md += '### Lending\n\n';
    md += `- totalDeposited: ${fmt6(BigInt(finalState.lending.totalDeposited))} mUSDC\n`;
    md += `- totalBorrowed: ${fmt6(BigInt(finalState.lending.totalBorrowed))} mUSDC\n`;
    md += `- investedAmount: ${fmt6(BigInt(finalState.lending.investedAmount))} mUSDC\n`;
    md += `- protocolFees: ${fmt6(BigInt(finalState.lending.protocolFees))} mUSDC\n`;
    md += `- utilizationRate: ${(Number(finalState.lending.utilizationRate) / 100).toFixed(2)}%\n\n`;

    md += '### PAS Market\n\n';
    md += `- totalDeposited: ${fmt6(BigInt(finalState.pasMarket.totalDeposited))} mUSDC\n`;
    md += `- totalBorrowed: ${fmt6(BigInt(finalState.pasMarket.totalBorrowed))} mUSDC\n`;
    md += `- protocolFees: ${fmt6(BigInt(finalState.pasMarket.protocolFees))} mUSDC\n`;
    md += `- utilizationRate: ${(Number(finalState.pasMarket.utilizationRate) / 100).toFixed(2)}%\n\n`;

    md += '### Yield Pool\n\n';
    md += `- totalPrincipal: ${fmt6(BigInt(finalState.yieldPool.principal))} mUSDC\n`;
    md += `- pendingForLending: ${fmt6(BigInt(finalState.yieldPool.pendingForLending))} mUSDC\n`;
    md += `- yieldRateBps: ${finalState.yieldPool.yieldRateBps}\n\n`;

    md += '## Final User Balances\n\n';
    md += '| Account | Address | mUSDC | PAS |\n';
    md += '|---|---|---:|---:|\n';
    for (const [name, bal] of Object.entries(finalBalances)) {
        md += `| ${name} | ${bal.address} | ${fmt6(BigInt(bal.mUSDC))} | ${fmt18(BigInt(bal.PAS))} |\n`;
    }
    md += '\n';

    md += '## Failure Classification\n\n';
    md += '- PASS: Action executed and validation passed\n';
    md += '- EXPECTED_FAIL: Revert/failure that was intentionally expected\n';
    md += '- VERIFY_FAIL: Transaction mined but expected post-state was not reached\n';
    md += '- FAIL: Unexpected execution failure\n';
    md += '- UNEXPECTED_SUCCESS: Action was expected to fail but succeeded\n';

    const mdPath = path.resolve(__dirname, '../test-report.md');
    fs.writeFileSync(mdPath, md);

    console.log(`\n  JSON report: ${jsonPath}`);
    console.log(`  Markdown report: ${mdPath}`);
    console.log('  Simulation complete.\n');
}

main().catch((e) => {
    console.error('\nFATAL ERROR:', e);
    process.exit(1);
});
