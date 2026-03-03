"use client"

import { WagmiProvider, useAccount, useConnect, useDisconnect } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig } from '../lib/wagmi'
import { ReactNode } from 'react'
import { shortenAddress } from '../lib/utils'
import { ThemeProvider } from '../components/providers/ThemeProvider'
import { Toaster } from 'sonner'
import { NebulaBackground } from '../components/modules/NebulaBackground'
import { Dock } from '../components/modules/Dock'
import '../styles/theme.css'

const queryClient = new QueryClient()

function Navbar() {
    const { address, isConnected } = useAccount()
    const { connect, connectors } = useConnect()
    const { disconnect } = useDisconnect()
    return (
        <nav className="flex justify-between items-center p-4 lg:p-6 sticky top-0 z-50">
            <div className="flex items-center gap-3 cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
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
                        <span className="font-mono text-sm bg-glass-bg/50 backdrop-blur-md px-4 py-2 rounded-xl border border-glass-border shadow-inner">
                            {shortenAddress(address)}
                        </span>
                        <button
                            onClick={() => disconnect()}
                            className="bg-red-500/10 text-red-500 hover:bg-red-500/20 px-4 py-2 rounded-lg transition-colors font-medium text-sm border border-red-500/20"
                        >
                            Disconnect
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => connect({ connector: connectors[0] })}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg shadow-lg shadow-primary/20 font-medium transition-all"
                    >
                        Connect Wallet
                    </button>
                )}
            </div>
        </nav>
    )
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className="bg-slate-950 min-h-screen text-slate-100 font-sans antialiased overflow-x-hidden">
                <WagmiProvider config={wagmiConfig}>
                    <QueryClientProvider client={queryClient}>
                        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                            <NebulaBackground />
                            <Navbar />
                            <main className="container mx-auto p-4 lg:p-8 pb-32 relative z-10 flex flex-col items-center">
                                {children}
                            </main>
                            <Dock />
                        </ThemeProvider>
                        <Toaster position="bottom-right" richColors />
                    </QueryClientProvider>
                </WagmiProvider>
            </body>
        </html>
    )
}
