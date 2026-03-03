"use client"

import { WagmiProvider, useAccount, useConnect, useDisconnect } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig } from '../lib/wagmi'
import { ReactNode } from 'react'
import { shortenAddress } from '../lib/utils'

const queryClient = new QueryClient()

function Navbar() {
    const { address, isConnected } = useAccount()
    const { connect, connectors } = useConnect()
    const { disconnect } = useDisconnect()
    return (
        <nav className="flex justify-between items-center p-4 lg:p-6 bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-xl">
            <div className="flex items-center gap-3 cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                </div>
                <div className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 hidden sm:block">
                    Tesseract
                </div>
            </div>
            <div>
                {isConnected ? (
                    <div className="flex gap-4 items-center">
                        <span className="font-mono text-sm bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 shadow-inner">
                            {shortenAddress(address)}
                        </span>
                        <button
                            onClick={() => disconnect()}
                            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                        >
                            Disconnect
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => connect({ connector: connectors[0] })}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg shadow-lg font-medium transition-all"
                    >
                        Connect Wallet
                    </button>
                )}
            </div>
        </nav >
    )
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className="dark">
            <body className="bg-slate-950 min-h-screen text-slate-100 font-sans antialiased">
                <WagmiProvider config={wagmiConfig}>
                    <QueryClientProvider client={queryClient}>
                        <Navbar />
                        <main className="container mx-auto p-4 lg:p-8">
                            {children}
                        </main>
                    </QueryClientProvider>
                </WagmiProvider>
            </body>
        </html>
    )
}
