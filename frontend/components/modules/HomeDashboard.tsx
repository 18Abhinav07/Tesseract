'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import { useAccount, useBalance } from 'wagmi';
import config from '../../lib/addresses';

export function HomeDashboard() {
    const { address, isConnected } = useAccount();
    const { data: pasBalance } = useBalance({ address });
    const isFresh = !isConnected || (pasBalance && pasBalance.value === 0n);

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-bold text-foreground tracking-tight">
                    Tesseract <span className="text-brand-subtle">Phase 1 + 2</span>
                </h1>
                <p className="text-muted text-sm max-w-md mx-auto">
                    Focused build for core market + lending validation on Polkadot Hub. Legacy swap, vault, and compute UI flows have been removed from this frontend.
                </p>
                {config.explorer && (
                    <a
                        href={config.explorer}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-block text-xs text-brand-subtle hover:underline"
                    >
                        Paseo Subscan Explorer ↗
                    </a>
                )}
            </div>

            {isFresh && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-brand-subtle/30 bg-brand-subtle/5 backdrop-blur-lg p-5 space-y-3"
                >
                    <h3 className="text-sm font-semibold text-foreground">Getting Started</h3>
                    <ol className="text-xs text-muted space-y-1.5 list-decimal list-inside">
                        <li>Get PAS from the <a href={config.faucet || '#'} target="_blank" rel="noopener noreferrer" className="text-brand-subtle hover:underline">Polkadot Faucet ↗</a></li>
                        <li>Connect your wallet on Polkadot Hub testnet</li>
                        <li>Use the tUSDC faucet in the wallet panel</li>
                        <li>Run Phase 1/2 market and lending scenarios</li>
                    </ol>
                </motion.div>
            )}

            <div className="rounded-2xl border border-glass-border bg-surface/50 backdrop-blur-lg p-5 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Current Scope</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1.5">
                        <p className="text-muted font-medium">Included</p>
                        <p className="text-foreground/70">Market and lending phase validation flows</p>
                        <p className="text-foreground/70">Wallet connect, PAS balance, and tUSDC minting</p>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-muted font-medium">Removed</p>
                        <p className="text-foreground/70">Swap UI and XCM bridge interaction screens</p>
                        <p className="text-foreground/70">Vault and compute dashboard workflows</p>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-glass-border bg-surface/50 backdrop-blur-lg p-5 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Environment</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1.5">
                        <p className="text-muted font-medium">Network</p>
                        <p className="text-foreground/70">Polkadot Hub (Paseo)</p>
                        <p className="text-foreground/70">Chain ID: {config.chainId}</p>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-muted font-medium">Wallet Utilities</p>
                        <p className="text-foreground/70">PAS faucet link</p>
                        <p className="text-foreground/70">tUSDC mint and token watch helpers</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs text-muted">
                {config.explorer && (
                    <a href={config.explorer} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                        Subscan ↗
                    </a>
                )}
                {config.faucet && (
                    <a href={config.faucet} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                        Faucet ↗
                    </a>
                )}
                <a href="https://docs.polkadot.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    Polkadot Docs ↗
                </a>
            </div>
        </div>
    );
}
