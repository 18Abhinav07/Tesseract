import { create } from 'zustand';

interface ProtocolState {
    activeTab: 'swap' | 'stake' | 'vault';
    setActiveTab: (tab: 'swap' | 'stake' | 'vault') => void;
    txPending: boolean;
    setTxPending: (status: boolean) => void;
    txHash: string | null;
    setTxHash: (hash: string | null) => void;
}

export const useProtocolStore = create<ProtocolState>((set) => ({
    activeTab: 'swap',
    setActiveTab: (tab) => set({ activeTab: tab }),
    txPending: false,
    setTxPending: (status) => set({ txPending: status }),
    txHash: null,
    setTxHash: (hash) => set({ txHash: hash }),
}));
