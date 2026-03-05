"use client";

import { useAccount } from 'wagmi';
import { Grid, PageShell, Panel, RouteShortcut, StatRow } from '../../components/modules/ProtocolUI';
import { bpsToPercent, fmtToken, useGlobalProtocolData, useUserPortfolio, useUserScore, tierLabel } from '../../hooks/useProtocolData';

export default function DashboardPage() {
    const { address, isConnected } = useAccount();
    const { lending, pasMarket, oracle, loading, error, refresh } = useGlobalProtocolData();
    const score = useUserScore();
    const portfolio = useUserPortfolio();

    return (
        <PageShell title="Dashboard" subtitle="Protocol state, wallet snapshot, and fast route navigation.">
            <Grid>
                <Panel title="Protocol Snapshot" subtitle="Live total deposits, borrows, fees and utilization.">
                    <StatRow label="Lending Deposits" value={`${fmtToken(lending.totalDeposited, 6, 2)} mUSDC`} />
                    <StatRow label="Lending Borrowed" value={`${fmtToken(lending.totalBorrowed, 6, 2)} mUSDC`} />
                    <StatRow label="Lending Utilization" value={bpsToPercent(lending.utilizationBps)} />
                    <StatRow label="PAS Deposits" value={`${fmtToken(pasMarket.totalDeposited, 6, 2)} mUSDC`} />
                    <StatRow label="PAS Borrowed" value={`${fmtToken(pasMarket.totalBorrowed, 6, 2)} mUSDC`} />
                    <StatRow label="PAS Utilization" value={bpsToPercent(pasMarket.utilizationBps)} />
                    <div className="pt-2">
                        <button onClick={refresh} className="text-xs text-cyan-300 hover:underline">Refresh Snapshot</button>
                    </div>
                    {loading ? <p className="text-xs text-slate-500">Refreshing…</p> : null}
                    {error ? <p className="text-xs text-rose-300">{error}</p> : null}
                </Panel>

                <Panel title="Wallet & Score" subtitle="Connected account score/tier and activity profile.">
                    <StatRow label="Wallet" value={isConnected ? `${address?.slice(0, 6)}…${address?.slice(-4)}` : 'Not connected'} />
                    <StatRow label="Score" value={score.score.score.toString()} />
                    <StatRow label="Tier" value={tierLabel(score.score.tier)} />
                    <StatRow label="Collateral Ratio" value={bpsToPercent(score.score.collateralRatioBps)} />
                    <StatRow label="Interest Rate" value={bpsToPercent(score.score.interestRateBps)} />
                    <StatRow label="Lending Repayments" value={portfolio.lendingRepaymentCount.toString()} />
                    <StatRow label="Lending Defaults" value={portfolio.lendingDefaultCount.toString()} />
                    <StatRow label="PAS Repayments" value={portfolio.pasRepaymentCount.toString()} />
                    <StatRow label="PAS Defaults" value={portfolio.pasDefaultCount.toString()} />
                </Panel>
            </Grid>

            <Grid>
                <Panel title="Oracle Status" subtitle="PAS valuation source and crash status.">
                    <StatRow label="PAS Price (8d)" value={oracle.price8.toString()} />
                    <StatRow label="Round ID" value={oracle.roundId.toString()} />
                    <StatRow label="Updated At" value={oracle.updatedAt.toString()} />
                    <StatRow label="Crash Mode" value={oracle.isCrashed ? 'Active' : 'Normal'} tone={oracle.isCrashed ? 'red' : 'green'} />
                </Panel>
                <Panel title="Quick Routes" subtitle="Navigate directly to core action pages.">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <RouteShortcut href="/markets/usdc" label="USDC Market" description="Read pool metrics and fees" />
                        <RouteShortcut href="/markets/pas" label="PAS Market" description="Read oracle-linked market state" />
                        <RouteShortcut href="/borrow/usdc" label="Borrow USDC" description="Lending collateral/borrow/repay" />
                        <RouteShortcut href="/borrow/pas" label="Borrow vs PAS" description="PAS collateralized borrow flow" />
                        <RouteShortcut href="/lend/usdc" label="Lend USDC" description="Deposit/withdraw/harvest in lending" />
                        <RouteShortcut href="/lend/pas" label="Lend PAS Market" description="Deposit/withdraw/harvest in PAS pool" />
                    </div>
                </Panel>
            </Grid>
        </PageShell>
    );
}
