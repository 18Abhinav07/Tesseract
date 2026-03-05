import { defineChain } from 'viem'
import { http, createConfig } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { CONTRACTS } from '../config/contracts'

export const passetHub = defineChain({
    id: CONTRACTS.CHAIN_ID,
    name: 'Polkadot Hub Paseo Testnet',
    nativeCurrency: { name: 'PAS', symbol: 'PAS', decimals: 18 },
    rpcUrls: {
        default: { http: [CONTRACTS.RPC] },
    },
    blockExplorers: {
        default: { name: 'Subscan', url: CONTRACTS.EXPLORER },
    },
    testnet: true,
});

export const wagmiConfig = createConfig({
    chains: [passetHub],
    connectors: [
        injected(),
    ],
    transports: {
        [passetHub.id]: http(CONTRACTS.RPC),
    },
});

// Backward compat alias
export const paseoTestnet = passetHub;
