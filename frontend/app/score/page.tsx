"use client";

import { Grid, PageShell, Panel, StatRow } from '../../components/modules/ProtocolUI';
import { bpsToPercent, tierLabel, useUserPortfolio, useUserScore } from '../../hooks/useProtocolData';

export default function ScorePage() {
    const { score, loading, error, refresh } = useUserScore();
    const portfolio = useUserPortfolio();

    return (
        <PageShell title="Credit Score" subtitle="Tiered borrower risk profile from on-chain score and repayment behavior.">
            <Grid>
                <Panel title="Current Score">
                    <StatRow label="Score" value={score.score.toString()} />
                    <StatRow label="Tier" value={tierLabel(score.tier)} />
                    <StatRow label="Collateral Ratio" value={bpsToPercent(score.collateralRatioBps)} />
                    <StatRow label="Interest Rate" value={bpsToPercent(score.interestRateBps)} />
                    <StatRow label="Scored At Block" value={score.blockNumber.toString()} />
                    <button onClick={refresh} className="text-xs text-cyan-300 hover:underline">Refresh Score</button>
                    {loading ? <p className="text-xs text-slate-500">Refreshing…</p> : null}
                    {error ? <p className="text-xs text-rose-300">{error}</p> : null}
                </Panel>

                <Panel title="Repayment History" subtitle="Inputs into score shaping.">
                    <StatRow label="Lending Repayments" value={portfolio.lendingRepaymentCount.toString()} />
                    <StatRow label="Lending Defaults" value={portfolio.lendingDefaultCount.toString()} />
                    <StatRow label="PAS Repayments" value={portfolio.pasRepaymentCount.toString()} />
                    <StatRow label="PAS Defaults" value={portfolio.pasDefaultCount.toString()} />
                    <StatRow label="Governance Votes" value={portfolio.governance[0].toString()} />
                    <StatRow label="Conviction" value={portfolio.governance[1].toString()} />
                </Panel>
            </Grid>
        </PageShell>
    );
}
