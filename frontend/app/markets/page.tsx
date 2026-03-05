"use client";

import Link from 'next/link';
import { Grid, PageShell, Panel, StatRow } from '../../components/modules/ProtocolUI';
import { bpsToPercent, fmtToken, useGlobalProtocolData } from '../../hooks/useProtocolData';

export default function MarketsIndexPage() {
    const { lending, pasMarket, oracle, refresh } = useGlobalProtocolData();

    return (
        <PageShell title="Markets" subtitle="Two live protocol markets backed by deployed Kredio contracts.">
            <Grid>
                <Panel title="USDC Lending Market" subtitle="Standard mUSDC lending/borrowing pool.">
                    <StatRow label="Total Deposited" value={`${fmtToken(lending.totalDeposited, 6, 2)} mUSDC`} />
                    <StatRow label="Total Borrowed" value={`${fmtToken(lending.totalBorrowed, 6, 2)} mUSDC`} />
                    <StatRow label="Utilization" value={bpsToPercent(lending.utilizationBps)} />
                    <StatRow label="Protocol Fees" value={`${fmtToken(lending.protocolFees, 6, 2)} mUSDC`} />
                    <Link href="/markets/usdc" className="inline-flex px-3 py-2 rounded-xl border border-white/15 text-sm text-white hover:bg-white/10">Open /markets/usdc</Link>
                </Panel>

                <Panel title="PAS Collateral Market" subtitle="Borrow mUSDC against native PAS collateral.">
                    <StatRow label="Total Deposited" value={`${fmtToken(pasMarket.totalDeposited, 6, 2)} mUSDC`} />
                    <StatRow label="Total Borrowed" value={`${fmtToken(pasMarket.totalBorrowed, 6, 2)} mUSDC`} />
                    <StatRow label="Utilization" value={bpsToPercent(pasMarket.utilizationBps)} />
                    <StatRow label="Protocol Fees" value={`${fmtToken(pasMarket.protocolFees, 6, 2)} mUSDC`} />
                    <StatRow label="Oracle Crash" value={oracle.isCrashed ? 'Yes' : 'No'} tone={oracle.isCrashed ? 'red' : 'green'} />
                    <Link href="/markets/pas" className="inline-flex px-3 py-2 rounded-xl border border-white/15 text-sm text-white hover:bg-white/10">Open /markets/pas</Link>
                </Panel>
            </Grid>

            <button onClick={refresh} className="text-sm text-cyan-300 hover:underline">Refresh Market Data</button>
        </PageShell>
    );
}
