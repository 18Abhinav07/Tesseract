import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { useProtocolStore } from '../../lib/store'

const TABS = [
    { id: 'swap', label: 'Swap', icon: '⇄' },
    { id: 'stake', label: 'Stake', icon: '💧' },
    { id: 'vault', label: 'Vault', icon: '🏦' }
] as const;

export function Dock() {
    const { activeTab, setActiveTab } = useProtocolStore();

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 rounded-full bg-glass-bg border border-glass-border p-2 shadow-2xl backdrop-blur-3xl">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <motion.button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                                "relative flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-colors",
                                isActive ? "text-primary" : "text-muted hover:text-foreground"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="dock-indicator"
                                    className="absolute inset-0 rounded-full bg-white/5 border border-white/10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            {isActive && (
                                <div className="absolute -bottom-2 w-8 h-1 rounded-full bg-primary/50 blur-sm" />
                            )}
                            <span className="relative z-10">{tab.icon}</span>
                            <span className="relative z-10">{tab.label}</span>
                        </motion.button>
                    )
                })}
            </div>
        </div>
    )
}
