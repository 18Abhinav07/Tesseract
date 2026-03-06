"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { PageShell, StateNotice } from '../../components/modules/ProtocolUI';
import config from '../../lib/addresses';
import { ABIS } from '../../lib/constants';
import { cn } from '../../lib/utils';
import { parseUsdcInput } from '../../lib/input';
import {
    bpsToPercent, fmtToken, fmtOraclePrice8, fmtCount, fmtTimestamp,
    useGlobalProtocolData, useUserPortfolio, useUserScore, tierLabel,
    formatHealthFactor, healthState, useLendingHistory,
    type LendHistoryEntry,
} from '../../hooks/useProtocolData';

// ── Primitives ────────────────────────────────────────────────────────────

function Spinner({ small }: { small?: boolean }) {
    const s = small ? 'w-3 h-3 border' : 'w-4 h-4 border-2';
    return <span className={`inline-block rounded-full border-current border-t-transparent animate-spin shrink-0 ${s}`} />;
}
function Check() {
    return (
        <svg className="w-4 h-4 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    );
}
function InfoRow({ label, value, tone }: { label: string; value: React.ReactNode; tone?: 'green' | 'yellow' | 'red' | 'blue' | 'purple' }) {
    return (
        <div className="flex items-center justify-between text-[13px] py-2.5 border-b border-white/5 last:border-0 group/row hover:bg-white/[0.02] px-3 -mx-3 rounded-lg transition-colors">
            <span className="text-slate-400">{label}</span>
            <span className={cn('font-semibold font-mono tracking-tight',
                tone === 'green' ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]' : 
                tone === 'yellow' ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]' : 
                tone === 'red' ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]' : 
                tone === 'blue' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]' : 
                tone === 'purple' ? 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]' : 
                'text-slate-100'
            )}>{value}</span>
        </div>
    );
}
function MetricCard({ label, value, tone }: { label: string; value: string; tone?: 'green' | 'red' | 'blue' | 'purple' }) {
    return (
        <div className="relative group overflow-hidden rounded-2xl border border-white/5 bg-[#080B12]/80 backdrop-blur-xl p-5 hover:border-white/10 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">{label}</p>
            <p className={cn('text-2xl font-black tracking-tight', 
                tone === 'green' ? 'text-emerald-400' : 
                tone === 'red' ? 'text-rose-400' : 
                tone === 'blue' ? 'text-cyan-400' :
                tone === 'purple' ? 'text-purple-400' :
                'text-white')}>{value}</p>
            {tone && (
                <div className={cn("absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-[3rem] opacity-30 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none",
                    tone === 'green' ? 'bg-emerald-500' : tone === 'red' ? 'bg-rose-500' : tone === 'blue' ? 'bg-cyan-500' : 'bg-purple-500'
                )} />
            )}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
}

function healthTone(ratioRaw: bigint): 'green' | 'yellow' | 'red' {
    const n = Number(ratioRaw) / 1e18;
    if (n >= 1.5 || ratioRaw > BigInt('10000000000000000000000')) return 'green';
    if (n >= 1.2) return 'yellow';
    return 'red';
}
function healthLabel(ratioRaw: bigint) {
    const t = healthTone(ratioRaw);
    return t === 'green' ? 'Safe' : t === 'yellow' ? 'Caution' : 'At Risk';
}
function healthNum(ratioRaw: bigint) {
    if (ratioRaw > BigInt('10000000000000000000000')) return Infinity;
    return Number(ratioRaw) / 1e18;
}
function fmt6(atoms: bigint, dp = 2) { return (Number(atoms) / 1e6).toFixed(dp); }
function fmt18(wei: bigint, dp = 4) { return (Number(wei) / 1e18).toFixed(dp); }

function HealthBar({ ratio }: { ratio: bigint }) {
    const num = healthNum(ratio);
    const pct = Math.min(isFinite(num) ? (num / 2.0) * 100 : 100, 100);
    const tone = healthTone(ratio);
    const lbl = healthLabel(ratio);
    return (
        <div className="space-y-2 mt-4">
            <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Position Health</span>
                <span className={cn('px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider border shadow-sm', 
                    tone === 'green' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-emerald-500/10' : 
                    tone === 'yellow' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-amber-500/10' : 
                    'bg-rose-500/10 border-rose-500/20 text-rose-400 animate-pulse shadow-rose-500/10')}>
                    {isFinite(num) ? num.toFixed(2) : '—'} • {lbl}
                </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden ring-1 ring-inset ring-white/5">
                <div className={cn('h-full rounded-full transition-all duration-500 relative', 
                    tone === 'green' ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 
                    tone === 'yellow' ? 'bg-gradient-to-r from-amber-600 to-amber-400' : 
                    'bg-gradient-to-r from-rose-600 to-rose-400'
                )} style={{ width: `${pct}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                </div>
            </div>
        </div>
    );
}

// ── Borrow position card (repay + withdraw) ───────────────────────────────
type RepayPhase = 'idle' | 'confirming' | 'approving' | 'repaying' | 'success';
type WithdrawPhase = 'idle' | 'confirming' | 'withdrawing' | 'success';

function PASBorrowCard({ collateralWei, debtAtoms, accruedAtoms, totalOwedAtoms, healthRatio, oraclePrice8, ltvBps, onRefresh }: {
    collateralWei: bigint; debtAtoms: bigint; accruedAtoms: bigint; totalOwedAtoms: bigint;
    healthRatio: bigint; oraclePrice8: bigint; ltvBps: bigint; onRefresh: () => void;
}) {
    const [repayPhase, setRepayPhase] = useState<RepayPhase>('idle');
    const [withdrawPhase, setWithdrawPhase] = useState<WithdrawPhase>('idle');
    const { writeContract: writeApprove, data: approveHash, isPending: approveSigning, reset: resetApprove } = useWriteContract();
    const { isSuccess: approveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });
    const { writeContract: writeRepay, data: repayHash, isPending: repaySigning, reset: resetRepay } = useWriteContract();
    const { isSuccess: repaySuccess, isLoading: repayConfirming } = useWaitForTransactionReceipt({ hash: repayHash });
    const { writeContract: writeWithdraw, data: withdrawHash, isPending: withdrawSigning } = useWriteContract();
    const { isSuccess: withdrawSuccess } = useWaitForTransactionReceipt({ hash: withdrawHash });

    useEffect(() => { if (!approveSuccess || repayPhase !== 'approving') return; setRepayPhase('repaying'); setTimeout(() => writeRepay({ address: config.pasMarket, abi: ABIS.KREDIO_PAS_MARKET, functionName: 'repay' }), 300); }, [approveSuccess]);
    useEffect(() => { if (!repaySuccess) return; setRepayPhase('success'); const t = setTimeout(() => { onRefresh(); setRepayPhase('idle'); }, 1500); return () => clearTimeout(t); }, [repaySuccess]);
    useEffect(() => { if (!withdrawSuccess) return; setWithdrawPhase('success'); const t = setTimeout(() => { onRefresh(); setWithdrawPhase('idle'); }, 1500); return () => clearTimeout(t); }, [withdrawSuccess]);

    const handleConfirmRepay = () => { resetApprove(); resetRepay(); setRepayPhase('approving'); writeApprove({ address: config.mUSDC, abi: ABIS.ERC20, functionName: 'approve', args: [config.pasMarket, totalOwedAtoms] }); };
    const handleConfirmWithdraw = () => { setWithdrawPhase('withdrawing'); writeWithdraw({ address: config.pasMarket, abi: ABIS.KREDIO_PAS_MARKET, functionName: 'withdrawCollateral' }); };

    const oracleUsd = Number(oraclePrice8) / 1e8;
    const pasAmount = Number(collateralWei) / 1e18;
    const collateralUsd = pasAmount * oracleUsd;
    const canWithdraw = debtAtoms === 0n && collateralWei > 0n;
    const actionOpen = repayPhase !== 'idle' || withdrawPhase !== 'idle';
    const tone = healthTone(healthRatio);
    const lbl = healthLabel(healthRatio);
    const liqPrice = debtAtoms > 0n && collateralWei > 0n && ltvBps > 0n ? (Number(totalOwedAtoms) / 1e6) / (pasAmount * (Number(ltvBps) / 10000)) : null;

    if (collateralWei === 0n && debtAtoms === 0n && repayPhase === 'idle' && withdrawPhase === 'idle') return null;

    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#080B12]/80 backdrop-blur-xl p-6 shadow-2xl transition-all duration-300 hover:border-white/10 group flex flex-col gap-4">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center justify-between relative z-10">
                <div>
                    <h3 className="text-[15px] font-bold text-white tracking-tight">PAS Market</h3>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">PAS collateral — mUSDC borrow</p>
                </div>
                <span className={cn('px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-sm', tone === 'green' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-emerald-500/10' : tone === 'yellow' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-amber-500/10' : 'border-rose-500/30 bg-rose-500/10 text-rose-400 animate-pulse shadow-rose-500/10')}>{lbl}</span>
            </div>
            <div className={cn('transition-opacity relative z-10', actionOpen ? 'opacity-60' : 'opacity-100')}>
                <div className="rounded-xl border border-white/[0.03] bg-black/40 px-4 py-2 shadow-inner">
                    <InfoRow label="PAS Collateral" value={`${fmt18(collateralWei, 4)} PAS${oracleUsd > 0 ? ` (~$${collateralUsd.toFixed(2)})` : ''}`} />
                    <InfoRow label="Borrowed" value={`${fmt6(debtAtoms)} mUSDC`} />
                    <InfoRow label="Interest owed" value={`${fmt6(accruedAtoms, 6)} mUSDC`} />
                    <InfoRow label="Total to repay" value={`${fmt6(totalOwedAtoms)} mUSDC`} tone={totalOwedAtoms > 0n ? 'yellow' : undefined} />
                </div>
            </div>
            {(debtAtoms > 0n || collateralWei > 0n) && <div className={cn('transition-opacity', actionOpen ? 'opacity-60' : 'opacity-100')}><HealthBar ratio={healthRatio} /></div>}
            {!actionOpen && liqPrice !== null && oracleUsd > 0 && (
                <div className={cn('rounded-xl border px-4 py-3', oracleUsd < liqPrice * 1.1 ? 'border-rose-500/20 bg-rose-500/5' : 'border-white/5 bg-black/20')}>
                    <InfoRow label="Liquidation price" value={`$${liqPrice.toFixed(4)} / PAS`} />
                    <InfoRow label="Current PAS price" value={`$${oracleUsd.toFixed(4)} / PAS`} />
                    {oracleUsd > liqPrice ? <InfoRow label="Distance" value={`${(((oracleUsd - liqPrice) / liqPrice) * 100).toFixed(2)}% above liquidation`} tone="green" /> : <InfoRow label="Distance" value={`${(((liqPrice - oracleUsd) / liqPrice) * 100).toFixed(2)}% below — at risk`} tone="red" />}
                </div>
            )}
            <AnimatePresence>
                {repayPhase === 'confirming' && (
                    <motion.div key="rc" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
                        <p className="text-sm text-slate-200">Repaying {fmt6(totalOwedAtoms)} mUSDC (principal + interest)</p>
                        <p className="text-xs text-slate-500">2 wallet confirmations: approve then repay</p>
                        <div className="flex gap-2">
                            <button onClick={handleConfirmRepay} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">Confirm Repay</button>
                            <button onClick={() => setRepayPhase('idle')} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
                        </div>
                    </motion.div>
                )}
                {(repayPhase === 'approving' || repayPhase === 'repaying') && (
                    <motion.div key="rp" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className={cn('flex items-center gap-2 text-xs flex-1', repayPhase === 'repaying' ? 'text-emerald-400' : 'text-indigo-300')}>{repayPhase === 'repaying' ? <Check /> : <Spinner small />} Step 1/2 — Approve mUSDC</div>
                            <div className={cn('flex items-center gap-2 text-xs flex-1', repayPhase === 'repaying' ? 'text-indigo-300' : 'text-slate-600')}>{repayPhase === 'repaying' ? <Spinner small /> : <span className="w-4 h-4" />} Step 2/2 — Repay</div>
                        </div>
                        <div className="w-full h-1 rounded-full bg-white/10"><motion.div className="h-full bg-indigo-500 rounded-full" animate={{ width: repayPhase === 'repaying' ? '75%' : '25%' }} transition={{ duration: 0.4 }} /></div>
                        <p className="text-xs text-slate-500">{approveSigning || repaySigning ? 'Waiting for wallet…' : repayConfirming ? 'Confirming…' : ''}</p>
                    </motion.div>
                )}
                {repayPhase === 'success' && (<motion.div key="rs" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 flex items-center gap-2 text-emerald-300 text-sm"><Check /> Repaid successfully</motion.div>)}
            </AnimatePresence>
            <AnimatePresence>
                {withdrawPhase === 'confirming' && (
                    <motion.div key="wc" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
                        <p className="text-sm text-slate-200">Withdraw {fmt18(collateralWei, 4)} PAS to your wallet</p>
                        <div className="flex gap-2">
                            <button onClick={handleConfirmWithdraw} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">Confirm Withdrawal</button>
                            <button onClick={() => setWithdrawPhase('idle')} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
                        </div>
                    </motion.div>
                )}
                {withdrawPhase === 'withdrawing' && (<motion.div key="wp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 flex items-center gap-2 text-slate-300 text-sm"><Spinner />{withdrawSigning ? 'Waiting for wallet…' : 'Withdrawing…'}</motion.div>)}
                {withdrawPhase === 'success' && (<motion.div key="ws" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 flex items-center gap-2 text-emerald-300 text-sm"><Check /> {fmt18(collateralWei, 4)} PAS withdrawn</motion.div>)}
            </AnimatePresence>
            {repayPhase === 'idle' && withdrawPhase === 'idle' && (
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    {debtAtoms > 0n && (<button onClick={() => setRepayPhase('confirming')} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 hover:text-rose-200 transition-colors">Repay {fmt6(totalOwedAtoms)} mUSDC</button>)}
                    <button onClick={() => setWithdrawPhase('confirming')} disabled={!canWithdraw} className={cn('flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors', canWithdraw ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200 hover:text-white' : 'bg-white/5 border-white/5 text-slate-600 cursor-not-allowed')}>
                        {canWithdraw ? `Withdraw ${fmt18(collateralWei, 4)} PAS` : 'Repay debt to withdraw collateral'}
                    </button>
                </div>
            )}
        </div>
    );
}

function USDCBorrowCard({ collateralAtoms, debtAtoms, accruedAtoms, totalOwedAtoms, healthRatio, onRefresh }: {
    collateralAtoms: bigint; debtAtoms: bigint; accruedAtoms: bigint; totalOwedAtoms: bigint; healthRatio: bigint; onRefresh: () => void;
}) {
    const [repayPhase, setRepayPhase] = useState<RepayPhase>('idle');
    const [withdrawPhase, setWithdrawPhase] = useState<WithdrawPhase>('idle');
    const { writeContract: writeApprove, data: approveHash, isPending: approveSigning, reset: resetApprove } = useWriteContract();
    const { isSuccess: approveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });
    const { writeContract: writeRepay, data: repayHash, isPending: repaySigning, reset: resetRepay } = useWriteContract();
    const { isSuccess: repaySuccess, isLoading: repayConfirming } = useWaitForTransactionReceipt({ hash: repayHash });
    const { writeContract: writeWithdraw, data: withdrawHash, isPending: withdrawSigning } = useWriteContract();
    const { isSuccess: withdrawSuccess } = useWaitForTransactionReceipt({ hash: withdrawHash });

    useEffect(() => { if (!approveSuccess || repayPhase !== 'approving') return; setRepayPhase('repaying'); setTimeout(() => writeRepay({ address: config.lending, abi: ABIS.KREDIO_LENDING, functionName: 'repay' }), 300); }, [approveSuccess]);
    useEffect(() => { if (!repaySuccess) return; setRepayPhase('success'); const t = setTimeout(() => { onRefresh(); setRepayPhase('idle'); }, 1500); return () => clearTimeout(t); }, [repaySuccess]);
    useEffect(() => { if (!withdrawSuccess) return; setWithdrawPhase('success'); const t = setTimeout(() => { onRefresh(); setWithdrawPhase('idle'); }, 1500); return () => clearTimeout(t); }, [withdrawSuccess]);

    const handleConfirmRepay = () => { resetApprove(); resetRepay(); setRepayPhase('approving'); writeApprove({ address: config.mUSDC, abi: ABIS.ERC20, functionName: 'approve', args: [config.lending, totalOwedAtoms] }); };
    const handleConfirmWithdraw = () => { setWithdrawPhase('withdrawing'); writeWithdraw({ address: config.lending, abi: ABIS.KREDIO_LENDING, functionName: 'withdrawCollateral' }); };

    const canWithdraw = debtAtoms === 0n && collateralAtoms > 0n;
    const actionOpen = repayPhase !== 'idle' || withdrawPhase !== 'idle';
    const tone = healthTone(healthRatio);
    const lbl = healthLabel(healthRatio);

    if (collateralAtoms === 0n && debtAtoms === 0n && repayPhase === 'idle' && withdrawPhase === 'idle') return null;

    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#080B12]/80 backdrop-blur-xl p-6 shadow-2xl transition-all duration-300 hover:border-white/10 group flex flex-col gap-4">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center justify-between relative z-10">
                <div>
                    <h3 className="text-[15px] font-bold text-white tracking-tight">USDC Market</h3>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">mUSDC collateral — mUSDC borrow</p>
                </div>
                <span className={cn('px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-sm', tone === 'green' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-emerald-500/10' : tone === 'yellow' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-amber-500/10' : 'border-rose-500/30 bg-rose-500/10 text-rose-400 animate-pulse shadow-rose-500/10')}>{lbl}</span>
            </div>
            <div className={cn('transition-opacity relative z-10', actionOpen ? 'opacity-60' : 'opacity-100')}>
                <div className="rounded-xl border border-white/[0.03] bg-black/40 px-4 py-2 shadow-inner">
                    <InfoRow label="mUSDC Collateral" value={`${fmt6(collateralAtoms)} mUSDC`} />
                    <InfoRow label="Borrowed" value={`${fmt6(debtAtoms)} mUSDC`} />
                    <InfoRow label="Interest owed" value={`${fmt6(accruedAtoms, 6)} mUSDC`} />
                    <InfoRow label="Total to repay" value={`${fmt6(totalOwedAtoms)} mUSDC`} tone={totalOwedAtoms > 0n ? 'yellow' : undefined} />
                </div>
            </div>
            {(debtAtoms > 0n || collateralAtoms > 0n) && <div className={cn('transition-opacity', actionOpen ? 'opacity-60' : 'opacity-100')}><HealthBar ratio={healthRatio} /></div>}
            <AnimatePresence>
                {repayPhase === 'confirming' && (
                    <motion.div key="rc" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
                        <p className="text-sm text-slate-200">Repaying {fmt6(totalOwedAtoms)} mUSDC (principal + interest)</p>
                        <p className="text-xs text-slate-500">2 wallet confirmations: approve then repay</p>
                        <div className="flex gap-2">
                            <button onClick={handleConfirmRepay} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">Confirm Repay</button>
                            <button onClick={() => setRepayPhase('idle')} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
                        </div>
                    </motion.div>
                )}
                {(repayPhase === 'approving' || repayPhase === 'repaying') && (
                    <motion.div key="rp" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className={cn('flex items-center gap-2 text-xs flex-1', repayPhase === 'repaying' ? 'text-emerald-400' : 'text-indigo-300')}>{repayPhase === 'repaying' ? <Check /> : <Spinner small />} Step 1/2 — Approve mUSDC</div>
                            <div className={cn('flex items-center gap-2 text-xs flex-1', repayPhase === 'repaying' ? 'text-indigo-300' : 'text-slate-600')}>{repayPhase === 'repaying' ? <Spinner small /> : <span className="w-4 h-4" />} Step 2/2 — Repay</div>
                        </div>
                        <div className="w-full h-1 rounded-full bg-white/10"><motion.div className="h-full bg-indigo-500 rounded-full" animate={{ width: repayPhase === 'repaying' ? '75%' : '25%' }} transition={{ duration: 0.4 }} /></div>
                        <p className="text-xs text-slate-500">{approveSigning || repaySigning ? 'Waiting for wallet…' : repayConfirming ? 'Confirming…' : ''}</p>
                    </motion.div>
                )}
                {repayPhase === 'success' && (<motion.div key="rs" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 flex items-center gap-2 text-emerald-300 text-sm"><Check /> Repaid successfully</motion.div>)}
            </AnimatePresence>
            <AnimatePresence>
                {withdrawPhase === 'confirming' && (
                    <motion.div key="wc" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
                        <p className="text-sm text-slate-200">Withdraw {fmt6(collateralAtoms)} mUSDC to your wallet</p>
                        <div className="flex gap-2">
                            <button onClick={handleConfirmWithdraw} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">Confirm Withdrawal</button>
                            <button onClick={() => setWithdrawPhase('idle')} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
                        </div>
                    </motion.div>
                )}
                {withdrawPhase === 'withdrawing' && (<motion.div key="wp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 flex items-center gap-2 text-slate-300 text-sm"><Spinner />{withdrawSigning ? 'Waiting for wallet…' : 'Withdrawing…'}</motion.div>)}
                {withdrawPhase === 'success' && (<motion.div key="ws" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 flex items-center gap-2 text-emerald-300 text-sm"><Check /> {fmt6(collateralAtoms)} mUSDC withdrawn</motion.div>)}
            </AnimatePresence>
            {repayPhase === 'idle' && withdrawPhase === 'idle' && (
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    {debtAtoms > 0n && (<button onClick={() => setRepayPhase('confirming')} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 hover:text-rose-200 transition-colors">Repay {fmt6(totalOwedAtoms)} mUSDC</button>)}
                    <button onClick={() => setWithdrawPhase('confirming')} disabled={!canWithdraw} className={cn('flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors', canWithdraw ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200 hover:text-white' : 'bg-white/5 border-white/5 text-slate-600 cursor-not-allowed')}>
                        {canWithdraw ? `Withdraw ${fmt6(collateralAtoms)} mUSDC` : 'Repay debt to withdraw collateral'}
                    </button>
                </div>
            )}
        </div>
    );
}

// ── Lend position cards ───────────────────────────────────────────────────

function LendCard({ label, subtitle, depositAtoms, yieldAtoms, utilizationBps, contractAddr, abi, onRefresh }: {
    label: string; subtitle: string; depositAtoms: bigint; yieldAtoms: bigint; utilizationBps: bigint;
    contractAddr: `0x${string}`; abi: typeof ABIS.KREDIO_LENDING | typeof ABIS.KREDIO_PAS_MARKET; onRefresh: () => void;
}) {
    const { address } = useAccount();
    const [harvestPhase, setHarvestPhase] = useState<'idle' | 'confirming' | 'harvesting' | 'success'>('idle');
    const [withdrawPhase, setWithdrawPhase] = useState<'idle' | 'confirming' | 'withdrawing' | 'success'>('idle');
    const [withdrawInput, setWithdrawInput] = useState('');

    const { writeContract: writeHarvest, data: harvestHash, isPending: harvestSigning } = useWriteContract();
    const { isSuccess: harvestSuccess } = useWaitForTransactionReceipt({ hash: harvestHash });
    const { writeContract: writeWithdraw, data: withdrawHash, isPending: withdrawSigning } = useWriteContract();
    const { isSuccess: withdrawSuccess } = useWaitForTransactionReceipt({ hash: withdrawHash });

    useEffect(() => { if (!harvestSuccess) return; setHarvestPhase('success'); const t = setTimeout(() => { onRefresh(); setHarvestPhase('idle'); }, 1500); return () => clearTimeout(t); }, [harvestSuccess]);
    useEffect(() => { if (!withdrawSuccess) return; setWithdrawPhase('success'); const t = setTimeout(() => { onRefresh(); setWithdrawPhase('idle'); setWithdrawInput(''); }, 1500); return () => clearTimeout(t); }, [withdrawSuccess]);

    const apr = `${((Number(utilizationBps) / 10000) * 8).toFixed(2)}%`;
    const depositDisplay = fmt6(depositAtoms);
    const yieldDisplay = fmt6(yieldAtoms, 6);
    const withdrawAtoms = parseUsdcInput(withdrawInput);
    const overWithdraw = withdrawAtoms !== null && withdrawAtoms > depositAtoms;

    const handleConfirmHarvest = () => { setHarvestPhase('harvesting'); writeHarvest({ address: contractAddr, abi, functionName: 'pendingYieldAndHarvest', args: [address ?? '0x0000000000000000000000000000000000000000'] }); };
    const handleConfirmWithdraw = () => { if (!withdrawAtoms) return; setWithdrawPhase('withdrawing'); writeWithdraw({ address: contractAddr, abi, functionName: 'withdraw', args: [withdrawAtoms] }); };

    if (depositAtoms === 0n && harvestPhase === 'idle' && withdrawPhase === 'idle') return null;

    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#080B12]/80 backdrop-blur-xl p-6 shadow-2xl transition-all duration-300 hover:border-white/10 group flex flex-col gap-4">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
                <h3 className="text-[15px] font-bold text-white tracking-tight">{label}</h3>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">{subtitle}</p>
            </div>
            <div className="rounded-xl border border-white/[0.03] bg-black/40 px-4 py-2 shadow-inner relative z-10">
                <InfoRow label="Deposited" value={`${depositDisplay} mUSDC`} tone={depositAtoms > 0n ? 'green' : undefined} />
                <InfoRow label="Pending yield" value={`${yieldDisplay} mUSDC`} tone={yieldAtoms > 0n ? 'yellow' : undefined} />
                <InfoRow label="Pool APY (est.)" value={apr} />
            </div>
            <AnimatePresence>
                {harvestPhase === 'confirming' && (
                    <motion.div key="hc" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
                        <p className="text-sm text-slate-200">Harvest {yieldDisplay} mUSDC yield</p>
                        <div className="flex gap-2">
                            <button onClick={handleConfirmHarvest} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-amber-600/30 hover:bg-amber-600/40 border border-amber-500/30 text-amber-200 transition-colors">Confirm Harvest</button>
                            <button onClick={() => setHarvestPhase('idle')} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
                        </div>
                    </motion.div>
                )}
                {harvestPhase === 'harvesting' && (<motion.div key="hp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 flex items-center gap-2 text-slate-300 text-sm"><Spinner />{harvestSigning ? 'Waiting for wallet…' : 'Harvesting…'}</motion.div>)}
                {harvestPhase === 'success' && (<motion.div key="hs" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 flex items-center gap-2 text-amber-300 text-sm"><Check /> +{yieldDisplay} mUSDC harvested</motion.div>)}
            </AnimatePresence>
            <AnimatePresence>
                {withdrawPhase === 'confirming' && (
                    <motion.div key="wc" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
                        <p className="text-sm text-slate-200">Withdraw from pool</p>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2.5">
                                <input type="number" min="0" step="any" placeholder={`Max: ${depositDisplay}`} value={withdrawInput} onChange={e => setWithdrawInput(e.target.value)} className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                <button onClick={() => setWithdrawInput(depositDisplay)} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium shrink-0">Max</button>
                                <span className="text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2 py-0.5 shrink-0">mUSDC</span>
                            </div>
                            {overWithdraw && <p className="text-xs text-rose-400">Amount exceeds deposited balance</p>}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleConfirmWithdraw} disabled={!withdrawAtoms || overWithdraw} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors">Withdraw {withdrawInput || '0'} mUSDC</button>
                            <button onClick={() => setWithdrawPhase('idle')} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
                        </div>
                    </motion.div>
                )}
                {withdrawPhase === 'withdrawing' && (<motion.div key="wp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 flex items-center gap-2 text-slate-300 text-sm"><Spinner />{withdrawSigning ? 'Waiting for wallet…' : 'Withdrawing…'}</motion.div>)}
                {withdrawPhase === 'success' && (<motion.div key="ws" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 flex items-center gap-2 text-emerald-300 text-sm"><Check /> Withdrawal processed</motion.div>)}
            </AnimatePresence>
            {harvestPhase === 'idle' && withdrawPhase === 'idle' && (
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <button onClick={() => setWithdrawPhase('confirming')} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition-colors">Withdraw</button>
                    {yieldAtoms > 0n && (<button onClick={() => setHarvestPhase('confirming')} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-300 hover:text-amber-200 transition-colors">Harvest {yieldDisplay} mUSDC</button>)}
                </div>
            )}
        </div>
    );
}

// ── Credit profile ────────────────────────────────────────────────────────

const TIER_LABELS = ['ANON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'];

function repaymentPts(r: number) {
    if (r >= 12) return 55;
    if (r >= 8) return 46;
    if (r >= 5) return 36;
    if (r >= 3) return 26;
    if (r === 2) return 16;
    if (r === 1) return 8;
    return 0;
}
function liquidationPenalty(l: number) {
    if (l === 0) return 0;
    if (l === 1) return 20;
    if (l === 2) return 35;
    return 55;
}
function depositPts(totalDeposited: bigint) {
    const d = Number(totalDeposited);
    if (d >= 100_000_000_000) return 35;
    if (d >= 75_000_000_000) return 30;
    if (d >= 55_000_000_000) return 25;
    if (d >= 35_000_000_000) return 20;
    if (d >= 20_000_000_000) return 15;
    if (d >= 10_000_000_000) return 10;
    if (d >= 5_000_000_000) return 5;
    return 0;
}
function agePts(blocksSince: number) {
    if (blocksSince >= 10000) return 10;
    if (blocksSince >= 2000) return 5;
    if (blocksSince >= 500) return 2;
    return 0;
}
function nextRepaymentMilestone(r: number) {
    if (r >= 12) return null;
    if (r >= 8) return { needed: 12 - r, pts: 9 };
    if (r >= 5) return { needed: 8 - r, pts: 10 };
    if (r >= 3) return { needed: 5 - r, pts: 10 };
    if (r >= 2) return { needed: 3 - r, pts: 10 };
    if (r >= 1) return { needed: 2 - r, pts: 8 };
    return { needed: 1 - r, pts: 8 };
}

function CreditProfile({ scoreValue, tier, collateralRatioBps, interestRateBps, repaymentCount, liquidationCount, totalDepositedEver, firstSeenBlock, currentBlock }: {
    scoreValue: bigint; tier: number; collateralRatioBps: number; interestRateBps: number;
    repaymentCount: bigint; liquidationCount: bigint;
    totalDepositedEver: bigint; firstSeenBlock: bigint; currentBlock: bigint;
}) {
    const [expanded, setExpanded] = useState(false);
    const score = Number(scoreValue);
    const scoreTierLabel = TIER_LABELS[Math.min(tier, 5)] ?? 'ANON';
    const tierBadge =
        tier >= 5 ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300' :
            tier === 4 ? 'border-purple-500/40 bg-purple-500/10 text-purple-300' :
                tier === 3 ? 'border-amber-500/40 bg-amber-500/10 text-amber-300' :
                    tier === 2 ? 'border-slate-400/40 bg-slate-400/10 text-slate-300' :
                        tier === 1 ? 'border-amber-700/40 bg-amber-700/10 text-amber-500' :
                            'border-slate-500/40 bg-slate-500/10 text-slate-400';
    const scorePct = Math.min(score / 100, 1) * 100;
    const scoreTone = score >= 65 ? 'text-cyan-300' : score >= 50 ? 'text-emerald-300' : score >= 30 ? 'text-amber-300' : score > 0 ? 'text-rose-300' : 'text-slate-400';
    const scoreBarColor = score >= 65 ? 'bg-cyan-500' : score >= 50 ? 'bg-emerald-500' : score >= 30 ? 'bg-amber-500' : score > 0 ? 'bg-rose-500' : 'bg-slate-600';
    const maxLTV = collateralRatioBps > 0 ? `${((10000 / collateralRatioBps) * 100).toFixed(0)}%` : '—';
    const borrowRate = interestRateBps > 0 ? `${(interestRateBps / 100).toFixed(2)}% APY` : '—';

    const repayments = Number(repaymentCount);
    const liquidations = Number(liquidationCount);
    const blocksSince = firstSeenBlock > 0n ? Number(currentBlock - firstSeenBlock) : 0;

    const rPts = Math.max(0, repaymentPts(repayments) - liquidationPenalty(liquidations));
    const dPts = depositPts(totalDepositedEver);
    const aPts = agePts(blocksSince);

    const nextMs = nextRepaymentMilestone(repayments);
    const depUSD = (Number(totalDepositedEver) / 1e6).toFixed(0);

    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#080B12]/80 backdrop-blur-xl p-6 shadow-2xl transition-all duration-300 hover:border-white/10 group flex flex-col gap-4">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-stretch">
                {/* Left: Circular Score Gauge */}
                <div className="flex-shrink-0 relative w-40 h-40 flex items-center justify-center">
                    <svg width="100%" height="100%" viewBox="0 0 100 100" className="rotate-[-90deg] overflow-visible">
                        <circle cx="50" cy="50" r="45" fill="none" className="stroke-white/5" strokeWidth="6" />
                        {score > 0 && (
                            <circle 
                                cx="50" cy="50" r="45" fill="none" 
                                className={cn('transition-all duration-1000 ease-out', scoreTone.replace('text-', 'stroke-'))} 
                                style={{ filter: `drop-shadow(0 0 8px currentColor)` }}
                                strokeWidth="6" 
                                strokeDasharray="283" 
                                strokeDashoffset={283 - (283 * scorePct) / 100} 
                                strokeLinecap="round" 
                            />
                        )}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
                        <span className={cn('font-black text-4xl tracking-tighter drop-shadow-sm', scoreTone)}>{score > 0 ? score : '—'}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">out of 100</span>
                    </div>
                </div>

                {/* Right: Tiers and Max LTV */}
                <div className="flex-1 w-full space-y-4 flex flex-col justify-center">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[15px] font-bold text-white tracking-tight">Credit Profile</h3>
                        <span className={cn('px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-sm', tierBadge)}>{scoreTierLabel}</span>
                    </div>
                    <div className="rounded-xl border border-white/[0.03] bg-black/40 px-4 py-2 shadow-inner space-y-1">
                        <InfoRow label="Protocol Max LTV" value={maxLTV} />
                        <InfoRow label="Base Borrow Rate" value={borrowRate} />
                    </div>
                </div>
            </div>
            <div className="rounded-xl border border-white/[0.05] bg-white/[0.01] overflow-hidden relative z-10">
                <button onClick={() => setExpanded(v => !v)} className="w-full flex items-center justify-between px-4 py-3 text-xs text-slate-400 hover:text-white transition-colors">
                    <span>Score breakdown</span>
                    <span className={cn('transition-transform inline-block', expanded ? 'rotate-180' : '')}>▾</span>
                </button>
                <AnimatePresence>
                    {expanded && (
                        <motion.div key="reasoning" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                            <div className="px-4 pb-4 border-t border-white/5 space-y-3">
                                {/* 3-component breakdown */}
                                <div className="pt-3 space-y-2">
                                    {/* Repayment history */}
                                    <div className="rounded-xl border border-white/5 bg-black/20 px-4 py-3 space-y-1.5">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-300 font-medium">Repayment History</span>
                                            <span className={cn('font-bold', rPts >= 40 ? 'text-emerald-300' : rPts >= 20 ? 'text-amber-300' : 'text-rose-300')}>{rPts} / 55 pts</span>
                                        </div>
                                        <div className="w-full h-1 rounded-full bg-white/10">
                                            <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${(rPts / 55) * 100}%` }} />
                                        </div>
                                        <p className="text-[11px] text-slate-500">{repayments} successful repayment{repayments !== 1 ? 's' : ''}{liquidations > 0 ? ` — ${liquidations} liquidation${liquidations !== 1 ? 's' : ''} (−${liquidationPenalty(liquidations)} pts)` : ''}</p>
                                        {nextMs && repayments < 12 && (
                                            <p className="text-[11px] text-indigo-400">+{nextMs.pts} pts after {nextMs.needed} more repayment{nextMs.needed !== 1 ? 's' : ''}</p>
                                        )}
                                    </div>

                                    {/* Lending volume */}
                                    <div className="rounded-xl border border-white/5 bg-black/20 px-4 py-3 space-y-1.5">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-300 font-medium">Lending Volume</span>
                                            <span className={cn('font-bold', dPts >= 25 ? 'text-emerald-300' : dPts >= 10 ? 'text-amber-300' : 'text-rose-300')}>{dPts} / 35 pts</span>
                                        </div>
                                        <div className="w-full h-1 rounded-full bg-white/10">
                                            <div className="h-full rounded-full bg-purple-500 transition-all" style={{ width: `${(dPts / 35) * 100}%` }} />
                                        </div>
                                        <p className="text-[11px] text-slate-500">${depUSD} deposited lifetime</p>
                                        {dPts < 35 && (
                                            <p className="text-[11px] text-purple-400">Deposit more mUSDC to earn up to 35 pts</p>
                                        )}
                                    </div>

                                    {/* Account age */}
                                    <div className="rounded-xl border border-white/5 bg-black/20 px-4 py-3 space-y-1.5">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-300 font-medium">Account Age</span>
                                            <span className={cn('font-bold', aPts >= 10 ? 'text-emerald-300' : aPts >= 5 ? 'text-amber-300' : 'text-rose-300')}>{aPts} / 10 pts</span>
                                        </div>
                                        <div className="w-full h-1 rounded-full bg-white/10">
                                            <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${(aPts / 10) * 100}%` }} />
                                        </div>
                                        <p className="text-[11px] text-slate-500">{firstSeenBlock > 0n ? `${blocksSince.toLocaleString()} blocks since first deposit` : 'Make a first deposit to start earning age points'}</p>
                                        {aPts < 10 && firstSeenBlock > 0n && (
                                            <p className="text-[11px] text-teal-400">{blocksSince < 500 ? `${500 - blocksSince} blocks until +2 pts` : blocksSince < 2000 ? `${2000 - blocksSince} blocks until +3 pts` : `${10000 - blocksSince} blocks until max age pts`}</p>
                                        )}
                                    </div>
                                </div>

                                {liquidations > 0 && (
                                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-xs text-rose-300">
                                        ⚠ {liquidations} liquidation{liquidations !== 1 ? 's' : ''} on record — penalty applied to repayment score
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// ── Lending history table ─────────────────────────────────────────────────

const TYPE_META: Record<LendHistoryEntry['type'], { label: string; color: string }> = {
    deposit: { label: 'Deposit', color: 'text-indigo-300' },
    withdraw: { label: 'Withdraw', color: 'text-slate-300' },
    yield: { label: 'Yield', color: 'text-amber-300' },
};

function LendingHistoryTable({ entries, loading }: { entries: LendHistoryEntry[]; loading: boolean }) {
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    const totalPages = Math.max(1, Math.ceil(entries.length / ITEMS_PER_PAGE));
    const paginatedEntries = entries.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const totalYieldUSDC = entries.filter(e => e.type === 'yield').reduce((s, e) => s + e.amount, 0n);
    const totalDeposited = entries.filter(e => e.type === 'deposit').reduce((s, e) => s + e.amount, 0n);
    const totalWithdrawn = entries.filter(e => e.type === 'withdraw').reduce((s, e) => s + e.amount, 0n);

    if (loading) {
        return <div className="rounded-2xl border border-white/5 bg-black/20 p-5 h-32 animate-pulse" />;
    }

    if (entries.length === 0) {
        return (
            <div className="rounded-2xl border border-white/10 bg-black/30 px-6 py-8 text-center">
                <p className="text-slate-500 text-sm">No lending activity yet on-chain.</p>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#080B12]/80 backdrop-blur-xl p-6 shadow-2xl transition-all duration-300 hover:border-white/10 group flex flex-col gap-4">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* summary strip */}
            <div className="grid grid-cols-3 gap-3 relative z-10">
                <div className="rounded-xl border border-white/[0.03] bg-black/40 px-4 py-3 shadow-inner">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Deposited</p>
                    <p className="text-[15px] font-black tracking-tight text-white mt-1">{fmt6(totalDeposited)} mUSDC</p>
                </div>
                <div className="rounded-xl border border-white/[0.03] bg-black/40 px-4 py-3 shadow-inner">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Withdrawn</p>
                    <p className="text-[15px] font-black tracking-tight text-white mt-1">{fmt6(totalWithdrawn)} mUSDC</p>
                </div>
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Yield Earned</p>
                    <p className="text-[15px] font-black tracking-tight text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)] mt-1">{fmt6(totalYieldUSDC, 6)} mUSDC</p>
                </div>
            </div>

            {/* event log */}
            <div className="overflow-x-auto rounded-xl border border-white/5 relative z-10">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Type</th>
                            <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Market</th>
                            <th className="text-right px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Amount (mUSDC)</th>
                            <th className="text-right px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Block</th>
                            <th className="text-right px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Tx</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedEntries.map((e, i) => {
                            const meta = TYPE_META[e.type];
                            return (
                                <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors font-mono tracking-tight">
                                    <td className={`px-4 py-3 font-semibold ${meta.color}`}>{meta.label}</td>
                                    <td className="px-4 py-3 text-slate-400">{e.market}</td>
                                    <td className="px-4 py-3 text-right font-medium text-slate-200">{fmt6(e.amount, 6)}</td>
                                    <td className="px-4 py-3 text-right text-slate-500/70">{e.blockNumber.toString()}</td>
                                    <td className="px-4 py-3 text-right">
                                        {e.txHash ? (
                                            <a
                                                href={`https://blockscout-testnet.polkadot.io/tx/${e.txHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-cyan-400 hover:text-cyan-300 transition-colors"
                                            >
                                                {e.txHash.slice(0, 8)}…
                                            </a>
                                        ) : '—'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1 relative z-10">
                    <span className="text-xs text-slate-500">Page {page} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-xs font-semibold text-white disabled:opacity-30 disabled:hover:bg-white/5 transition-colors"
                        >
                            Prev
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-xs font-semibold text-white disabled:opacity-30 disabled:hover:bg-white/5 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Section heading ───────────────────────────────────────────────────────
function SectionHeading({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-4 mb-2 w-full">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/90 drop-shadow-sm shrink-0">{label}</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
    const { address, isConnected } = useAccount();
    const [activeTab, setActiveTab] = useState<'overview' | 'borrow' | 'lend' | 'history'>('overview');
    const { lending, pasMarket, oracle, loading: globalLoading, error: globalError, refresh: refreshGlobal } = useGlobalProtocolData();
    const { score, refresh: refreshScore } = useUserScore();
    const portfolio = useUserPortfolio();
    const { history: lendHistory, loading: historyLoading, refresh: refreshHistory } = useLendingHistory();

    const { data: ltvBpsRaw } = useReadContract({ address: config.pasMarket, abi: ABIS.KREDIO_PAS_MARKET, functionName: 'ltvBps' });
    const ltvBps = (ltvBpsRaw as bigint | undefined) ?? 6500n;

    const lastRefreshRef = useRef(Date.now());
    const [secondsAgo, setSecondsAgo] = useState(0);
    useEffect(() => { const id = setInterval(() => setSecondsAgo(Math.floor((Date.now() - lastRefreshRef.current) / 1000)), 1000); return () => clearInterval(id); }, []);

    const handleRefresh = useCallback(() => {
        portfolio.refresh(); refreshGlobal(); refreshScore(); refreshHistory();
        lastRefreshRef.current = Date.now(); setSecondsAgo(0);
    }, [refreshHistory]);

    useEffect(() => { const id = setInterval(handleRefresh, 30_000); return () => clearInterval(id); }, [handleRefresh]);

    const hasPasBorrow = portfolio.pasPosition[0] > 0n || portfolio.pasPosition[2] > 0n;
    const hasUsdcBorrow = portfolio.lendingPosition[0] > 0n || portfolio.lendingPosition[1] > 0n;
    const hasPasLend = portfolio.pasDeposit > 0n;
    const hasUsdcLend = portfolio.lendingDeposit > 0n;
    const hasAnyBorrow = hasPasBorrow || hasUsdcBorrow;
    const hasAnyLend = hasPasLend || hasUsdcLend;
    const hasAnything = hasAnyBorrow || hasAnyLend;
    const totalRepayments = portfolio.pasRepaymentCount + portfolio.lendingRepaymentCount;
    const totalLiquidations = portfolio.pasLiquidationCount + portfolio.lendingLiquidationCount;
    const combinedDeposited = portfolio.lendingTotalDepositedEver + portfolio.pasTotalDepositedEver;
    const earliestBlock =
        portfolio.lendingFirstSeenBlock > 0n && portfolio.pasFirstSeenBlock > 0n
            ? portfolio.lendingFirstSeenBlock < portfolio.pasFirstSeenBlock ? portfolio.lendingFirstSeenBlock : portfolio.pasFirstSeenBlock
            : portfolio.lendingFirstSeenBlock > 0n ? portfolio.lendingFirstSeenBlock
                : portfolio.pasFirstSeenBlock;

    return (
        <PageShell title="Dashboard" subtitle="Protocol overview, active positions, and credit profile.">

            {/* ── Protocol metrics ── */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard label="Total Liquidity" value={`${fmtToken(lending.totalDeposited + pasMarket.totalDeposited, 6, 2)} mUSDC`} tone="blue" />
                <MetricCard label="Total Borrowed" value={`${fmtToken(lending.totalBorrowed + pasMarket.totalBorrowed, 6, 2)} mUSDC`} tone="purple" />
                <MetricCard label="Oracle" value={oracle.isCrashed ? 'Crash Mode' : 'Healthy'} tone={oracle.isCrashed ? 'red' : 'green'} />
                <MetricCard label="Credit Tier" value={isConnected ? tierLabel(score.tier) : '—'} tone={isConnected ? 'green' : undefined} />
            </section>

            {/* ── Removed redundant market detail section ── */}

            {/* ── Wallet positions ── */}
            {!isConnected && (
                <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl px-6 py-10 flex flex-col items-center gap-3 text-center">
                    <p className="text-slate-300 text-sm font-medium">Connect your wallet to view positions and credit profile</p>
                    <p className="text-slate-500 text-xs">Use the Connect Wallet button in the header</p>
                </div>
            )}

            {isConnected && (
                <div className="mt-8 flex flex-col gap-6">

                    {/* ── Tab Navigation ── */}
                    <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'overview', label: 'Credit Overview' },
                            { id: 'borrow', label: 'Borrow Positions' },
                            { id: 'lend', label: 'Lending Market' },
                            { id: 'history', label: 'Tx History' }
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id as any)}
                                className={cn('px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 whitespace-nowrap',
                                    activeTab === t.id
                                        ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] ring-1 ring-white/20'
                                        : 'bg-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                )}
                            >
                                {t.label}
                            </button>
                        ))}
                        <div className="flex-1" />
                        <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs text-slate-500 font-medium">{secondsAgo}s ago</span>
                            <button onClick={handleRefresh} disabled={portfolio.loading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all duration-300 disabled:opacity-50">
                                <span className={cn(portfolio.loading ? 'animate-spin' : '')}>↻</span> Refresh
                            </button>
                        </div>
                    </div>

                    {/* loading */}
                    {portfolio.loading && !hasAnything && (
                        <div className="space-y-3 mt-4">
                            {[1].map(i => <div key={i} className="rounded-2xl border border-white/5 bg-[#080B12]/80 backdrop-blur-xl p-5 h-64 animate-pulse" />)}
                        </div>
                    )}

                    {!portfolio.loading && (
                        <div className="mt-2 min-h-[500px]">

                            {/* ── Tab: Overview ── */}
                            {activeTab === 'overview' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="max-w-2xl">
                                        <SectionHeading label="Credit Identity" />
                                        <CreditProfile
                                            scoreValue={score.score}
                                            tier={score.tier}
                                            collateralRatioBps={score.collateralRatioBps}
                                            interestRateBps={score.interestRateBps}
                                            repaymentCount={totalRepayments}
                                            liquidationCount={totalLiquidations}
                                            totalDepositedEver={combinedDeposited}
                                            firstSeenBlock={earliestBlock}
                                            currentBlock={score.blockNumber}
                                        />
                                    </div>
                                    {!hasAnything && (
                                        <div className="rounded-2xl border border-white/5 bg-[#080B12]/80 px-6 py-12 flex flex-col items-center gap-3 text-center">
                                            <p className="text-white text-base font-bold">No active positions</p>
                                            <p className="text-slate-400 text-[13px] max-w-sm">Use the tabs above to explore Lending or Borrowing and begin building your reputation score.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── Tab: Borrow ── */}
                            {activeTab === 'borrow' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <SectionHeading label="Your Loans" />
                                    {!hasAnyBorrow ? (
                                         <div className="rounded-2xl border border-white/5 bg-[#080B12]/50 px-6 py-12 text-center">
                                            <p className="text-slate-400 text-sm mb-4">You have no open borrowing positions.</p>
                                            <Link href="/borrow/usdc" className="px-6 py-2.5 rounded-xl text-sm font-bold border border-white/10 bg-white/5 hover:bg-indigo-600 text-slate-200 hover:text-white transition-colors">Open a Borrow Position</Link>
                                         </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
                                            {hasPasBorrow && (
                                                <PASBorrowCard
                                                    collateralWei={portfolio.pasPosition[0]}
                                                    debtAtoms={portfolio.pasPosition[2]}
                                                    accruedAtoms={portfolio.pasPosition[3]}
                                                    totalOwedAtoms={portfolio.pasPosition[4]}
                                                    healthRatio={portfolio.pasHealthRatio}
                                                    oraclePrice8={oracle.price8}
                                                    ltvBps={ltvBps}
                                                    onRefresh={handleRefresh}
                                                />
                                            )}
                                            {hasUsdcBorrow && (
                                                <USDCBorrowCard
                                                    collateralAtoms={portfolio.lendingPosition[0]}
                                                    debtAtoms={portfolio.lendingPosition[1]}
                                                    accruedAtoms={portfolio.lendingPosition[2]}
                                                    totalOwedAtoms={portfolio.lendingPosition[3]}
                                                    healthRatio={portfolio.lendingHealthRatio}
                                                    onRefresh={handleRefresh}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── Tab: Lend ── */}
                            {activeTab === 'lend' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <SectionHeading label="Deposited Capital" />
                                    {!hasAnyLend ? (
                                         <div className="rounded-2xl border border-white/5 bg-[#080B12]/50 px-6 py-12 text-center">
                                            <p className="text-slate-400 text-sm mb-4">You have no active lending deposits.</p>
                                            <Link href="/lend/usdc" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">Start Yield Farming</Link>
                                         </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
                                            {hasPasLend && (
                                                <LendCard
                                                    label="PAS Market — Lending"
                                                    subtitle="mUSDC deposited to PAS-collateral pool"
                                                    depositAtoms={portfolio.pasDeposit}
                                                    yieldAtoms={portfolio.pasPendingYield}
                                                    utilizationBps={pasMarket.utilizationBps}
                                                    contractAddr={config.pasMarket}
                                                    abi={ABIS.KREDIO_PAS_MARKET}
                                                    onRefresh={handleRefresh}
                                                />
                                            )}
                                            {hasUsdcLend && (
                                                <LendCard
                                                    label="USDC Market — Lending"
                                                    subtitle="mUSDC deposited to KredioLending pool"
                                                    depositAtoms={portfolio.lendingDeposit}
                                                    yieldAtoms={portfolio.lendingPendingYield}
                                                    utilizationBps={lending.utilizationBps}
                                                    contractAddr={config.lending}
                                                    abi={ABIS.KREDIO_LENDING}
                                                    onRefresh={handleRefresh}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── Tab: History ── */}
                            {activeTab === 'history' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <SectionHeading label="Lending Logs" />
                                    <LendingHistoryTable entries={lendHistory} loading={historyLoading} />
                                </div>
                            )}

                        </div>
                    )}
                </div>
            )}

            {globalError && <StateNotice tone="error" message={globalError} />}
        </PageShell>
    );
}
