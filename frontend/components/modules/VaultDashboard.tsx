import * as React from 'react'
import { GlassCard } from '../factory/GlassCard'
import { ActionButton } from '../factory/ActionButton'
import { useVaultLogic } from '../../hooks/useVaultLogic'
import { formatDisplayBalance } from '../../lib/utils'
import { useEffect } from 'react'
import { toast } from 'sonner'

const STRATEGIES = [
    {
        id: 'bifrost',
        protocol: 'Bifrost Protocol',
        network: 'Bifrost Parachain',
        apy: '14.2%',
        allocation: '420.00'
    },
    {
        id: 'acala',
        protocol: 'Acala Network',
        network: 'Acala Parachain',
        apy: '11.8%',
        allocation: '0.00'
    }
];

export function VaultDashboard() {
    return (
        <div className="w-full max-w-[840px] flex flex-col gap-6 relative">
            <div className="flex flex-col items-center justify-center py-8">
                <h2 className="text-xl font-medium text-muted mb-2">Total Value Locked</h2>
                <div className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                    $12,405,920
                </div>
                <div className="mt-4 flex gap-4">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium">
                        Your Balance: 420.00 lstDOT
                    </span>
                    <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold">
                        Avg Yield: 13.5%
                    </span>
                </div>
            </div>

            <GlassCard className="p-2 overflow-hidden">
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-sm text-muted">
                                <th className="font-medium p-4 pl-6">Protocol Strategy</th>
                                <th className="font-medium p-4">Network Route</th>
                                <th className="font-medium p-4">Live APY</th>
                                <th className="font-medium p-4 pr-6 text-right">Your Allocation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {STRATEGIES.map((strategy) => (
                                <tr key={strategy.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                                                {strategy.protocol[0]}
                                            </div>
                                            <span className="font-semibold">{strategy.protocol}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-muted">{strategy.network}</td>
                                    <td className="p-4">
                                        <span className="text-green-400 font-semibold px-2 py-1 bg-green-500/10 rounded-md">
                                            {strategy.apy}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-6 text-right font-mono">{strategy.allocation}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-black/20 p-4 flex justify-between items-center border-t border-white/5 mt-2">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">Rebalance Optimization Available</span>
                        <span className="text-xs text-muted mt-0.5">Route funds to Bifrost for higher yield</span>
                    </div>
                    <ActionButton className="w-auto px-8 h-12 shadow-[0_0_20px_rgba(34,211,238,0.3)] ring-2 ring-cyan-400/50 bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 hover:from-cyan-400 hover:to-blue-400">
                        Optimize Allocation (+2.4% APY)
                    </ActionButton>
                </div>
            </GlassCard>
        </div>
    )
}
