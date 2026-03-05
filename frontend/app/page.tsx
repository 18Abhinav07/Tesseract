"use client";

import Link from 'next/link';
import { PageShell, Panel, RouteShortcut } from '../components/modules/ProtocolUI';
import config from '../lib/addresses';
import { useAccess } from '../hooks/useAccess';

export default function Home() {
    const { isAdmin } = useAccess();

    return (
        <PageShell title="Kredio Credit Protocol" subtitle="Live frontend for lending, PAS-backed borrowing, liquidation and admin control on Polkadot Hub.">
            <Panel title="Start" subtitle="Open one of the primary workflows.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <RouteShortcut href="/dashboard" label="Dashboard" description="Protocol state, account snapshot and quick routes" />
                    <RouteShortcut href="/markets" label="Markets" description="USDC and PAS market liquidity/borrow metrics" />
                    <RouteShortcut href="/borrow/usdc" label="Borrow" description="Borrower flows for KredioLending and PAS market" />
                    <RouteShortcut href="/lend/usdc" label="Lend" description="Lender deposit, withdraw and harvest actions" />
                    {isAdmin ? <RouteShortcut href="/liquidate" label="Liquidate" description="At-risk position checks and liquidation actions" /> : null}
                    {isAdmin ? <RouteShortcut href="/admin" label="Admin" description="Owner-only risk controls and emergency operations" /> : null}
                </div>
            </Panel>

            <Panel title="Network" subtitle="Canonical deployed addresses from protocol config.">
                <div className="text-xs text-slate-300 space-y-2">
                    <p>Chain ID: {config.chainId}</p>
                    <p>Explorer: <a href={config.explorer} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">Open Subscan ↗</a></p>
                    <p>Faucet: <a href={config.faucet} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">Request PAS ↗</a></p>
                    <p className="break-all">KredioLending: {config.lending}</p>
                    <p className="break-all">KredioPASMarket: {config.pasMarket}</p>
                    <p className="break-all">mUSDC: {config.mUSDC}</p>
                </div>
                <Link href="/dashboard" className="inline-flex mt-2 px-3 py-2 rounded-xl border border-white/20 text-sm text-white hover:bg-white/10">
                    Open Dashboard
                </Link>
            </Panel>
        </PageShell>
    );
}
