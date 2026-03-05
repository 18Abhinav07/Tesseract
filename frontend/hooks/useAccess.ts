'use client';

import { useAccount, useChainId } from 'wagmi';
import config from '../lib/addresses';

export function useAccess() {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();

    const isAdmin = !!address && address.toLowerCase() === config.owner.toLowerCase();
    const isWrongNetwork = isConnected && chainId !== config.chainId;

    return {
        address,
        isConnected,
        isAdmin,
        isWrongNetwork,
    };
}
