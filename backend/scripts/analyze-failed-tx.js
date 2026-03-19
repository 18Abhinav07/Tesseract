'use strict';

/**
 * Analyze failed transactions from backend/test-report.json.
 *
 * What this script does:
 * 1) Finds FAIL steps in the latest product simulation report.
 * 2) Inspects on-chain tx/receipt/fee/nonce data for failed tx hashes.
 * 3) Re-runs similar use cases using estimateGas + staticCall (no state changes).
 * 4) Executes similar real tx flows repeatedly to test failure recurrence patterns.
 * 5) Produces detailed JSON + Markdown diagnostics with likely root causes.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { ethers } = require('ethers');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../contracts/.env'), override: false });

const RPC = process.env.PASSET_RPC || process.env.RPC || 'https://eth-rpc-testnet.polkadot.io/';
const CHAIN_ID = 420420417;

const ADDR = {
    MUSDC: process.env.MUSDC_ADDR || process.env.MUSDC || '0x5998cE005b4f3923c988Ae31940fAa1DEAC0c646',
    LENDING: process.env.LENDING_ADDR || process.env.LENDING || '0x61c6b46f5094f2867Dce66497391d0fd41796CEa',
    PAS_MARKET: process.env.MARKET_ADDR || process.env.PAS_MARKET_ADDR || '0x5617dBa1b13155fD6fD62f82ef6D9e8F0F3B0E86',
    ORACLE: process.env.ORACLE || '0x1494432a8Af6fa8c03C0d7DD7720E298D85C55c7',
};

const provider = new ethers.JsonRpcProvider(RPC, { chainId: CHAIN_ID, name: 'polkadot-hub-testnet' });

function walletFromEnv(name) {
    const v = process.env[name];
    if (!v) throw new Error(`Missing env key: ${name}`);
    const key = v.startsWith('0x') ? v : `0x${v}`;
    return new ethers.Wallet(key, provider);
}

const admin = walletFromEnv('ADMIN');

const MUSDC_ABI = [
    'function balanceOf(address) view returns (uint256)',
    'function allowance(address,address) view returns (uint256)',
];

const LENDING_ABI = [
    'function deposit(uint256)',
    'function withdraw(uint256)',
    'function adminInvest(uint256)',
    'function adminPullBack(uint256)',
    'function totalDeposited() view returns (uint256)',
    'function totalBorrowed() view returns (uint256)',
    'function investedAmount() view returns (uint256)',
    'function pendingStrategyYield() view returns (uint256)',
    'function strategyStatus() view returns (address pool, uint256 invested, uint256 totalEarned, uint256 pendingYield_, uint256 investRatio_, uint256 minBuffer_)',
];

const ORACLE_ABI = [
    'function setPrice(int256)',
    'function latestRoundData() view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
    'function crashed() view returns (bool)',
];

const musdc = new ethers.Contract(ADDR.MUSDC, MUSDC_ABI, provider);
const lending = new ethers.Contract(ADDR.LENDING, LENDING_ABI, provider);
const oracle = new ethers.Contract(ADDR.ORACLE, ORACLE_ABI, provider);

const fmt6 = (v) => Number(ethers.formatUnits(v ?? 0n, 6)).toLocaleString('en-US', { maximumFractionDigits: 6 });
const fmt18 = (v) => Number(ethers.formatUnits(v ?? 0n, 18)).toLocaleString('en-US', { maximumFractionDigits: 8 });
const toGwei = (v) => (v == null ? null : Number(ethers.formatUnits(v, 'gwei')));

function parseError(err) {
    if (!err) return 'Unknown error';
    const msg = String(
        err.shortMessage ||
        err.reason ||
        err.message ||
        err.error?.message ||
        err.info?.error?.message ||
        err.data?.message ||
        'Unknown error'
    );
    return msg.slice(0, 500);
}

function parseFirstNumber(str) {
    if (!str) return null;
    const m = str.match(/-?[\d,]+(?:\.\d+)?/);
    if (!m) return null;
    return m[0].replace(/,/g, '');
}

function parseSetPriceTarget(action) {
    const m = String(action || '').match(/to\s+(-?\d+)/i);
    return m ? BigInt(m[1]) : null;
}

async function tryStaticCall(fn, label) {
    try {
        await fn();
        return { ok: true, label, error: null };
    } catch (err) {
        return { ok: false, label, error: parseError(err) };
    }
}

async function tryEstimateGas(fn, label) {
    try {
        const gas = await fn();
        return { ok: true, label, gas: gas?.toString?.() || String(gas), error: null };
    } catch (err) {
        return { ok: false, label, gas: null, error: parseError(err) };
    }
}

async function waitForReceiptWithTimeout(txHash, timeoutMs = 180000) {
    const started = Date.now();
    while (Date.now() - started < timeoutMs) {
        const r = await provider.getTransactionReceipt(txHash);
        if (r) return r;
        await new Promise((resolve) => setTimeout(resolve, 2500));
    }
    throw new Error(`tx ${txHash} not mined within ${Math.floor(timeoutMs / 1000)}s`);
}

async function sendWithTimeout(sendFn, timeoutMs) {
    const tx = await sendFn();
    const receipt = await waitForReceiptWithTimeout(tx.hash, timeoutMs);
    return { txHash: tx.hash, receipt };
}

async function analyzeTxHash(txHash) {
    if (!txHash) return { txHash: null, reason: 'No tx hash on failed step' };

    const [tx, receipt, latestBlock, feeData] = await Promise.all([
        provider.getTransaction(txHash),
        provider.getTransactionReceipt(txHash),
        provider.getBlock('latest'),
        provider.getFeeData(),
    ]);

    const result = {
        txHash,
        foundInNode: !!tx,
        receiptFound: !!receipt,
        tx: null,
        receipt: null,
        feeContext: {
            latestBaseFeeGwei: toGwei(latestBlock?.baseFeePerGas ?? null),
            networkSuggestedMaxFeeGwei: toGwei(feeData?.maxFeePerGas ?? null),
            networkSuggestedPriorityFeeGwei: toGwei(feeData?.maxPriorityFeePerGas ?? null),
        },
        nonceContext: null,
        likelyNetworkReason: null,
    };

    if (tx) {
        result.tx = {
            from: tx.from,
            to: tx.to,
            nonce: tx.nonce,
            type: tx.type,
            valueWei: tx.value?.toString?.() || '0',
            gasLimit: tx.gasLimit?.toString?.() || null,
            maxFeePerGasGwei: toGwei(tx.maxFeePerGas ?? null),
            maxPriorityFeePerGasGwei: toGwei(tx.maxPriorityFeePerGas ?? null),
            gasPriceGwei: toGwei(tx.gasPrice ?? null),
            blockNumber: tx.blockNumber,
        };

        const [latestNonce, pendingNonce] = await Promise.all([
            provider.getTransactionCount(tx.from, 'latest'),
            provider.getTransactionCount(tx.from, 'pending'),
        ]);

        result.nonceContext = {
            txNonce: tx.nonce,
            senderLatestNonce: latestNonce,
            senderPendingNonce: pendingNonce,
        };
    }

    if (receipt) {
        result.receipt = {
            blockNumber: receipt.blockNumber,
            status: receipt.status,
            gasUsed: receipt.gasUsed?.toString?.() || null,
            effectiveGasPriceGwei: toGwei(receipt.gasPrice ?? null),
            confirmationsApprox: latestBlock?.number != null ? Math.max(0, latestBlock.number - receipt.blockNumber) : null,
        };

        if (receipt.status === 1) {
            result.likelyNetworkReason = 'Timeout false-negative: tx eventually mined successfully after script wait limit.';
        } else {
            result.likelyNetworkReason = 'Tx was mined but reverted on-chain.';
        }
        return result;
    }

    if (!tx) {
        result.likelyNetworkReason = 'Tx hash not found now: likely dropped from mempool, replaced, or node no longer retains pending tx.';
        return result;
    }

    if (tx.blockNumber == null) {
        if (result.nonceContext && result.nonceContext.senderLatestNonce > tx.nonce) {
            result.likelyNetworkReason = 'Nonce advanced past failed tx nonce: likely replaced or dropped before inclusion.';
        } else {
            result.likelyNetworkReason = 'Still pending or temporarily unavailable to this RPC; inclusion delay/network congestion likely.';
        }
    }

    return result;
}

async function discoverInvestableBound(high, requested) {
    const candidates = new Set();
    const push = (v) => {
        if (v > 0n) candidates.add(v.toString());
    };

    if (requested && requested > 0n) push(requested);
    push(high);
    push((high * 3n) / 4n);
    push(high / 2n);
    push(high / 3n);
    push(high / 4n);
    push(high / 8n);
    push(high / 16n);
    push(ethers.parseUnits('1000', 6));
    push(ethers.parseUnits('100', 6));
    push(ethers.parseUnits('1', 6));

    const tested = [];
    let bestOk = 0n;
    for (const raw of candidates) {
        const amount = BigInt(raw);
        const check = await tryStaticCall(() => lending.connect(admin).adminInvest.staticCall(amount), `probe adminInvest(${fmt6(amount)})`);
        tested.push({ amount: amount.toString(), amountFmt: fmt6(amount), ok: check.ok, error: check.error });
        if (check.ok && amount > bestOk) bestOk = amount;
    }

    return { bestOk, tested };
}

async function runSimilarUseCaseChecks(step) {
    const action = String(step.action || '');

    if (action.includes('Seed Lending') && action.includes('mUSDC')) {
        const n = parseFirstNumber(action);
        const amount = n ? ethers.parseUnits(n, 6) : null;
        const adminBal = await musdc.balanceOf(admin.address);
        const allowance = await musdc.allowance(admin.address, ADDR.LENDING);
        const state = {
            reportObservedBefore: step.observedBefore || null,
            reportObservedAfter: step.observedAfter || null,
            adminMusdc: adminBal.toString(),
            adminMusdcFmt: fmt6(adminBal),
            allowanceToLending: allowance.toString(),
            allowanceToLendingFmt: fmt6(allowance),
            requestedAmount: amount ? amount.toString() : null,
            requestedAmountFmt: amount ? fmt6(amount) : null,
        };

        const checks = [];
        if (amount != null) {
            checks.push(await tryEstimateGas(() => lending.connect(admin).deposit.estimateGas(amount), 'estimateGas deposit(requested)'));
            checks.push(await tryStaticCall(() => lending.connect(admin).deposit.staticCall(amount), 'staticCall deposit(requested)'));
        }
        checks.push(await tryEstimateGas(() => lending.connect(admin).deposit.estimateGas(ethers.parseUnits('1', 6)), 'estimateGas deposit(1 mUSDC)'));
        checks.push(await tryStaticCall(() => lending.connect(admin).deposit.staticCall(ethers.parseUnits('1', 6)), 'staticCall deposit(1 mUSDC)'));

        return {
            category: 'similar-usecase/timeout-or-sendability',
            state,
            checks,
            inference: 'If staticCall/estimateGas pass but original tx timed out, cause is likely mempool/inclusion delay instead of business-logic revert.',
        };
    }

    if (action.includes('Invest idle') && action.includes('strategy')) {
        const n = parseFirstNumber(action);
        const amount = n ? ethers.parseUnits(n, 6) : null;
        const [totalDeposited, totalBorrowed, investedAmount, pendingStrategyYield, lendingUsdc, strategy] = await Promise.all([
            lending.totalDeposited(),
            lending.totalBorrowed(),
            lending.investedAmount(),
            lending.pendingStrategyYield(),
            musdc.balanceOf(ADDR.LENDING),
            lending.strategyStatus(),
        ]);

        const upper = lendingUsdc > 0n ? lendingUsdc : ethers.parseUnits('1000000', 6);
        const bound = await discoverInvestableBound(upper, amount);
        const maxInvestable = bound.bestOk;

        const checks = [];
        if (amount != null) {
            checks.push(await tryEstimateGas(() => lending.connect(admin).adminInvest.estimateGas(amount), 'estimateGas adminInvest(requested)'));
            checks.push(await tryStaticCall(() => lending.connect(admin).adminInvest.staticCall(amount), 'staticCall adminInvest(requested)'));
        }
        checks.push(await tryStaticCall(() => lending.connect(admin).adminInvest.staticCall(maxInvestable), 'staticCall adminInvest(maxInvestable)'));
        checks.push(await tryStaticCall(() => lending.connect(admin).adminInvest.staticCall(maxInvestable + 1n), 'staticCall adminInvest(maxInvestable + 1)'));

        return {
            category: 'similar-usecase/liquidity-constraint',
            state: {
                reportObservedBefore: step.observedBefore || null,
                reportObservedAfter: step.observedAfter || null,
                totalDeposited: totalDeposited.toString(),
                totalDepositedFmt: fmt6(totalDeposited),
                totalBorrowed: totalBorrowed.toString(),
                totalBorrowedFmt: fmt6(totalBorrowed),
                investedAmount: investedAmount.toString(),
                investedAmountFmt: fmt6(investedAmount),
                pendingStrategyYield: pendingStrategyYield.toString(),
                pendingStrategyYieldFmt: fmt6(pendingStrategyYield),
                lendingMusdcBalance: lendingUsdc.toString(),
                lendingMusdcBalanceFmt: fmt6(lendingUsdc),
                strategyInvestRatio: (strategy.investRatio_ || strategy[4] || 0n).toString(),
                strategyMinBuffer: (strategy.minBuffer_ || strategy[5] || 0n).toString(),
                requestedAmount: amount ? amount.toString() : null,
                requestedAmountFmt: amount ? fmt6(amount) : null,
                discoveredMaxInvestable: maxInvestable.toString(),
                discoveredMaxInvestableFmt: fmt6(maxInvestable),
                probeResults: bound.tested,
            },
            checks,
            inference: 'Requested invest amount exceeded live investable liquidity constraints at execution time.',
        };
    }

    if (action.includes('Crash oracle price') && action.includes('liquidation')) {
        const targetPrice = parseSetPriceTarget(action);
        const [rd, crashed] = await Promise.all([
            oracle.latestRoundData(),
            oracle.crashed().catch(() => null),
        ]);

        const current = BigInt(rd[1].toString());
        const checks = [];
        if (targetPrice != null) {
            checks.push(await tryEstimateGas(() => oracle.connect(admin).setPrice.estimateGas(targetPrice), 'estimateGas setPrice(targetCrash)'));
            checks.push(await tryStaticCall(() => oracle.connect(admin).setPrice.staticCall(targetPrice), 'staticCall setPrice(targetCrash)'));
        }
        checks.push(await tryStaticCall(() => oracle.connect(admin).setPrice.staticCall(current), 'staticCall setPrice(currentPrice)'));

        return {
            category: 'similar-usecase/oracle-update-timeout',
            state: {
                reportObservedBefore: step.observedBefore || null,
                reportObservedAfter: step.observedAfter || null,
                currentOraclePrice: current.toString(),
                targetCrashPrice: targetPrice != null ? targetPrice.toString() : null,
                crashedFlag: crashed,
            },
            checks,
            inference: 'If staticCall/estimateGas pass while tx timed out, likely network/mempool delay; if they fail, analyze signer permissions or oracle guards.',
        };
    }

    return {
        category: 'similar-usecase/generic',
        state: {},
        checks: [],
        inference: 'No specialized similar-usecase template matched this failed step.',
    };
}

async function runExecutionTrials(step, opts, useCase) {
    if (!opts.executeSimilar) {
        return {
            enabled: false,
            attempts: 0,
            successCount: 0,
            failCount: 0,
            successRate: null,
            results: [],
            note: 'Execution trials disabled by flag.',
        };
    }

    const action = String(step.action || '');
    const results = [];
    const attempts = Math.max(1, opts.attempts);

    for (let i = 1; i <= attempts; i++) {
        const started = Date.now();
        try {
            if (action.includes('Seed Lending') && action.includes('mUSDC')) {
                const smallAmount = ethers.parseUnits('1', 6);
                const sent = await sendWithTimeout(() => lending.connect(admin).deposit(smallAmount), opts.txTimeoutMs);
                results.push({ attempt: i, ok: true, txHash: sent.txHash, error: null, durationMs: Date.now() - started });
            } else if (action.includes('Invest idle') && action.includes('strategy')) {
                const tinyInvest = ethers.parseUnits('1', 6);
                const sent = await sendWithTimeout(() => lending.connect(admin).adminInvest(tinyInvest), opts.txTimeoutMs);

                // Best-effort cleanup to avoid drift when invest succeeds.
                try {
                    await sendWithTimeout(() => lending.connect(admin).adminPullBack(tinyInvest), opts.txTimeoutMs);
                } catch (_) {
                    // Cleanup failures are not fatal to the recurrence trial.
                }

                results.push({ attempt: i, ok: true, txHash: sent.txHash, error: null, durationMs: Date.now() - started });
            } else if (action.includes('Crash oracle price') && action.includes('liquidation')) {
                const currentOracle = await oracle.latestRoundData();
                const currentPrice = BigInt(currentOracle[1].toString());
                const targetPrice = parseSetPriceTarget(action);
                if (targetPrice == null) throw new Error('Unable to parse target crash price from action');

                const sent = await sendWithTimeout(() => oracle.connect(admin).setPrice(targetPrice), opts.txTimeoutMs);

                // Always restore to the latest pre-test baseline.
                try {
                    await sendWithTimeout(() => oracle.connect(admin).setPrice(currentPrice), opts.txTimeoutMs);
                } catch (_) {
                    // Non-fatal for recurrence diagnostics.
                }

                results.push({ attempt: i, ok: true, txHash: sent.txHash, error: null, durationMs: Date.now() - started });
            } else {
                results.push({
                    attempt: i,
                    ok: false,
                    txHash: null,
                    error: `No execution template for step action: ${step.action}`,
                    durationMs: Date.now() - started,
                });
            }
        } catch (err) {
            results.push({
                attempt: i,
                ok: false,
                txHash: null,
                error: parseError(err),
                durationMs: Date.now() - started,
            });
        }
    }

    const successCount = results.filter((r) => r.ok).length;
    const failCount = results.length - successCount;
    const successRate = results.length ? Number(((successCount / results.length) * 100).toFixed(2)) : null;

    let recurrence = 'unknown';
    if (failCount === 0) recurrence = 'not_regularly_failing';
    else if (successCount === 0) recurrence = 'consistently_failing';
    else recurrence = 'intermittent';

    return {
        enabled: true,
        attempts,
        successCount,
        failCount,
        successRate,
        recurrence,
        results,
        note: useCase?.category ? `Execution template based on ${useCase.category}` : null,
    };
}

function inferRootCause(step, txAnalysis, usecase) {
    const err = String(step.error || '').toLowerCase();

    if (err.includes('not mined within')) {
        if (txAnalysis?.receiptFound && txAnalysis?.receipt?.status === 1) {
            return 'Script timeout issue: tx was mined successfully after wait limit.';
        }
        if (!txAnalysis?.foundInNode) {
            return 'Likely dropped/replaced pending tx (not available in node now).';
        }
        return 'Inclusion delay or mempool propagation issue (tx send succeeded, receipt not observed in timeout window).';
    }

    if (err.includes('not enough liquid capital')) {
        const max = usecase?.state?.discoveredMaxInvestableFmt;
        return max
            ? `Liquidity constraint revert: requested invest exceeded max investable (~${max} mUSDC) at check time.`
            : 'Liquidity constraint revert in adminInvest path.';
    }

    if (err.includes('execution reverted')) {
        return `On-chain revert: ${step.error}`;
    }

    return txAnalysis?.likelyNetworkReason || 'Unknown - inspect tx analysis and static call checks.';
}

function toBigintSafe(obj) {
    return JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === 'bigint' ? v.toString() : v)));
}

function buildMarkdown(reportPath, output) {
    let md = '';
    md += '# Failed Transaction Diagnostics\n\n';
    md += `- Generated At: ${output.generatedAt}\n`;
    md += `- Source Report: ${reportPath}\n`;
    md += `- RPC: ${output.chain.rpc}\n`;
    md += `- Chain ID: ${output.chain.chainId}\n`;
    md += `- Failed Steps Analyzed: ${output.summary.failedSteps}\n`;
    md += `- Expected Failures Ignored: ${output.summary.expectedFailuresIgnored}\n\n`;
    md += '> Note: Similar use-case checks run against current chain state. reportObservedBefore/reportObservedAfter fields capture original run-time snapshots from the source report.\n\n';
    md += `- Similar Execution Trials: ${output.execution.enabled ? `enabled (${output.execution.attempts} attempts per failed step)` : 'disabled'}\n\n`;

    md += '## Summary\n\n';
    for (const item of output.results) {
        const ex = item.execution;
        const exPart = ex?.enabled
            ? ` | recurrence=${ex.recurrence}, successRate=${ex.successRate}% (${ex.successCount}/${ex.attempts})`
            : '';
        md += `- Step ${item.step.step} (${item.step.phase}) ${item.step.action}: ${item.rootCause}${exPart}\n`;
    }
    md += '\n';

    md += '## Detailed Analysis\n\n';
    for (const item of output.results) {
        const s = item.step;
        md += `### Step ${s.step}: ${s.action}\n\n`;
        md += `- Contract: ${s.contract}\n`;
        md += `- Actor: ${s.actor}\n`;
        md += `- Status In Report: ${s.status}\n`;
        md += `- Reported Error: ${s.error || '-'}\n`;
        md += `- Tx Hash: ${s.txHash || '-'}\n`;
        md += `- Root Cause: ${item.rootCause}\n\n`;

        if (item.execution?.enabled) {
            md += '| Execution Trial Metric | Value |\n';
            md += '|---|---|\n';
            md += `| Recurrence | ${item.execution.recurrence} |\n`;
            md += `| Attempts | ${item.execution.attempts} |\n`;
            md += `| Success Count | ${item.execution.successCount} |\n`;
            md += `| Failure Count | ${item.execution.failCount} |\n`;
            md += `| Success Rate | ${item.execution.successRate}% |\n\n`;

            md += '#### Live Similar Execution Attempts\n\n';
            md += '| Attempt | OK | Tx Hash | Error | Duration ms |\n';
            md += '|---:|---:|---|---|---:|\n';
            for (const r of item.execution.results) {
                md += `| ${r.attempt} | ${r.ok ? 'yes' : 'no'} | ${r.txHash || '-'} | ${r.error || '-'} | ${r.durationMs} |\n`;
            }
            md += '\n';
        }

        md += '| Check | Value |\n';
        md += '|---|---|\n';
        md += `| Tx found in node | ${String(item.txAnalysis.foundInNode)} |\n`;
        md += `| Receipt found | ${String(item.txAnalysis.receiptFound)} |\n`;
        md += `| Network reason hint | ${item.txAnalysis.likelyNetworkReason || '-'} |\n`;
        md += `| Use-case category | ${item.useCase.category} |\n\n`;

        md += '#### Similar Use-Case Checks\n\n';
        if (!item.useCase.checks.length) {
            md += '- No structured similar checks for this step type.\n\n';
        } else {
            md += '| Check | OK | Gas | Error |\n';
            md += '|---|---:|---:|---|\n';
            for (const c of item.useCase.checks) {
                md += `| ${c.label} | ${c.ok ? 'yes' : 'no'} | ${c.gas || '-'} | ${c.error || '-'} |\n`;
            }
            md += '\n';
        }

        md += '#### Snapshot Data\n\n';
        md += '```json\n';
        md += `${JSON.stringify(item.useCase.state, null, 2)}\n`;
        md += '```\n\n';
    }

    return md;
}

async function main() {
    const args = process.argv.slice(2);
    const positional = args.filter((a) => !a.startsWith('--'));
    const reportPath = positional[0] || path.resolve(__dirname, '../test-report.json');
    const outJson = positional[1] || path.resolve(__dirname, '../failed-tx-analysis.json');
    const outMd = positional[2] || path.resolve(__dirname, '../failed-tx-analysis.md');

    const attemptsArg = args.find((a) => a.startsWith('--attempts='));
    const timeoutArg = args.find((a) => a.startsWith('--tx-timeout-ms='));
    const noExec = args.includes('--no-exec');
    const execOptions = {
        executeSimilar: !noExec,
        attempts: attemptsArg ? Math.max(1, Number(attemptsArg.split('=')[1] || '3')) : 3,
        txTimeoutMs: timeoutArg ? Math.max(15000, Number(timeoutArg.split('=')[1] || '180000')) : 180000,
    };

    if (!fs.existsSync(reportPath)) {
        throw new Error(`Report not found: ${reportPath}`);
    }

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    const failedSteps = (report.steps || []).filter((s) => s.status === 'FAIL');
    const expectedFails = (report.steps || []).filter((s) => s.status === 'EXPECTED_FAIL');

    const results = [];
    for (const step of failedSteps) {
        console.log(`Analyzing step ${step.step}: ${step.action}`);
        const txAnalysis = await analyzeTxHash(step.txHash);
        const useCase = await runSimilarUseCaseChecks(step);
        const execution = await runExecutionTrials(step, execOptions, useCase);
        const rootCause = inferRootCause(step, txAnalysis, useCase);

        results.push({
            step,
            txAnalysis,
            useCase,
            execution,
            rootCause,
        });
    }

    const output = {
        generatedAt: new Date().toISOString(),
        chain: {
            rpc: RPC,
            chainId: CHAIN_ID,
        },
        sourceReportMeta: {
            runAt: report.runAt,
            elapsed_s: report.elapsed_s,
            reportPath,
        },
        summary: {
            failedSteps: failedSteps.length,
            expectedFailuresIgnored: expectedFails.length,
        },
        execution: {
            enabled: execOptions.executeSimilar,
            attempts: execOptions.attempts,
            txTimeoutMs: execOptions.txTimeoutMs,
        },
        results,
    };

    fs.writeFileSync(outJson, JSON.stringify(toBigintSafe(output), null, 2));
    fs.writeFileSync(outMd, buildMarkdown(reportPath, toBigintSafe(output)));

    console.log('\nDiagnostics complete.');
    console.log(`JSON: ${outJson}`);
    console.log(`MD:   ${outMd}`);
}

main().catch((err) => {
    console.error('analyze-failed-tx failed:', parseError(err));
    process.exit(1);
});
