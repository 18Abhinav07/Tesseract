import * as React from 'react'
import { GlassCard } from '../factory/GlassCard'
import { ActionButton } from '../factory/ActionButton'
import { TokenInput } from '../factory/TokenInput'
import { useState, useEffect } from 'react'
import { useStakingLogic } from '../../hooks/useStakingLogic'
import { toast } from 'sonner'
import { formatDisplayBalance } from '../../lib/utils'
import { parseUnits } from 'viem'

export function StakeWidget() {
    const [amount, setAmount] = useState('');
    const [tab, setTab] = useState<'stake'>('stake');
    const [liveRewards, setLiveRewards] = useState(0.0042);

    const {
        executeStake,
        exchangeRate,
        stakedBalance,
        isPending,
        isSuccess,
        hash
    } = useStakingLogic(amount);

    useEffect(() => {
        if (isSuccess && hash) {
            toast.success('Successfully Staked DOT!', {
                description: `Transaction hash: ${hash.slice(0, 6)}...${hash.slice(-4)}`
            });
            setAmount('');
        }
    }, [isSuccess, hash]);

    // Fake live rewards ticking mapping
    useEffect(() => {
        const interval = setInterval(() => {
            setLiveRewards(prev => prev + 0.000001);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleStake = () => {
        if (!amount || parseFloat(amount) <= 0) return;
        executeStake();
    };

    const displayExchangeRate = exchangeRate ? (Number(exchangeRate) / 1e18).toFixed(4) : "1.0000";
    const expectedOut = amount ? (parseFloat(amount) / parseFloat(displayExchangeRate)).toFixed(4) : "0.0000";


    return (
        <div className="w-full max-w-[840px] grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Left Panel: Action */}
            <GlassCard className="p-6 flex flex-col gap-4 h-[420px]">
                <div className="flex gap-4 mb-4 border-b border-white/5 pb-2">
                    <button className="text-lg font-bold text-foreground border-b-2 border-primary pb-2">Stake</button>
                    <button className="text-lg font-bold text-muted hover:text-foreground pb-2 transition-colors">Unstake</button>
                </div>

                <TokenInput
                    label="Deposit Amount"
                    tokenSymbol="DOT"
                    balance="-"
                    value={amount}
                    onChange={setAmount}
                />

                <div className="flexjustify-between items-center my-2 text-sm text-muted px-2">
                    <div className="flex justify-between items-center w-full mt-2">
                        <span>Exchange Rate</span>
                        {exchangeRate ? (
                            <span className="font-mono text-primary animate-in fade-in">1 lstDOT = {displayExchangeRate} DOT</span>
                        ) : (
                            <div className="h-4 w-32 bg-white/10 animate-pulse rounded"></div>
                        )}
                    </div>
                </div>

                <div className="mt-auto">
                    <ActionButton className="w-full" onClick={handleStake} isLoading={isPending}>
                        Stake DOT
                    </ActionButton>
                </div>
            </GlassCard>

            {/* Right Panel: Yield Performance Stats */}
            <GlassCard variant="elevated" className="p-6 flex flex-col h-[420px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />

                <h3 className="text-lg font-bold text-foreground mb-6">Yield Performance</h3>

                <div className="flex flex-col gap-8">
                    <div>
                        <span className="text-sm border border-green-500/20 bg-green-500/10 text-green-400 px-3 py-1 rounded-full font-semibold">
                            Live APR: 14.2%
                        </span>
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-muted text-sm">Your Staked Balance</span>
                        <div className="text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 min-h-[48px]">
                            {stakedBalance !== undefined ? (
                                <>
                                    {formatDisplayBalance(stakedBalance, 18, 4)} <span className="text-xl text-muted font-medium">lstDOT</span>
                                </>
                            ) : (
                                <div className="h-10 w-48 bg-white/10 animate-pulse rounded-lg mt-1"></div>
                            )}
                        </div>
                        {stakedBalance !== undefined && exchangeRate ? (
                            <span className="text-sm text-muted mt-1 font-mono">
                                ≈ {((Number(stakedBalance) / 1e18) * (Number(exchangeRate) / 1e18)).toFixed(4)} DOT
                            </span>
                        ) : (
                            <div className="h-4 w-24 bg-white/5 animate-pulse rounded mt-2"></div>
                        )}
                    </div>

                    <div className="flex flex-col gap-1 mt-4 border-t border-white/5 pt-6">
                        <span className="text-muted text-sm">Unclaimed Rewards</span>
                        <div className="text-2xl font-mono text-primary flex items-center gap-2">
                            +{liveRewards.toFixed(6)} DOT
                            <span className="flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    )
}
