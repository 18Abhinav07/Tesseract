import * as React from 'react'
import { GlassCard } from '../factory/GlassCard'
import { ActionButton } from '../factory/ActionButton'
import { TokenInput } from '../factory/TokenInput'
import { useState } from 'react'

export function SwapWidget() {
    const [tokenIn, setTokenIn] = useState('PAS');
    const [tokenOut, setTokenOut] = useState('DOT');
    const [amountIn, setAmountIn] = useState('');
    const [isCrossChain, setIsCrossChain] = useState(false);

    return (
        <GlassCard className="w-full max-w-[480px] p-6 flex flex-col gap-4 relative">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-foreground">Swap</h2>
                <div className="flex items-center gap-2 text-sm text-muted">
                    <span>Bridge Layout</span>
                    <button
                        type="button"
                        className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${isCrossChain ? 'bg-primary' : 'bg-surface/50 border border-glass-border'}`}
                        onClick={() => setIsCrossChain(!isCrossChain)}
                    >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isCrossChain ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>

            <TokenInput
                label="You pay"
                tokenSymbol={tokenIn}
                balance="4,999.99"
                value={amountIn}
                onChange={setAmountIn}
                onMax={() => setAmountIn('4999.99')}
            />

            <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 z-10">
                <button
                    className="w-10 h-10 rounded-xl bg-glass-bg border border-glass-border shadow-xl flex items-center justify-center text-muted hover:text-primary transition-colors hover:rotate-180 duration-500"
                    onClick={() => {
                        setTokenIn(tokenOut);
                        setTokenOut(tokenIn);
                    }}
                >
                    ↓
                </button>
            </div>

            <TokenInput
                label="You receive"
                tokenSymbol={tokenOut}
                balance="0.00"
                value={amountIn ? (parseFloat(amountIn) * 0.95).toFixed(4) : ''}
                readOnly
            />

            {isCrossChain && (
                <div className="mt-2 p-4 rounded-2xl bg-black/10 border border-white/5 flex flex-col gap-3 animate-in slide-in-from-top-4 fade-in">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted">Destination</span>
                        <select className="bg-surface/50 border border-glass-border rounded-lg px-3 py-1 text-foreground focus:outline-none focus:border-primary cursor-pointer appearance-none">
                            <option>Bifrost Parachain</option>
                            <option>Acala Parachain</option>
                            <option>Asset Hub (Paseo)</option>
                        </select>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted">Estimated XCM Fee</span>
                        <span className="text-foreground font-mono">0.0031 PAS</span>
                    </div>
                </div>
            )}

            <ActionButton className="mt-4 shadow-primary/20 shadow-xl">
                {isCrossChain ? 'Swap & Bridge' : 'Swap Tokens'}
            </ActionButton>
        </GlassCard>
    )
}
