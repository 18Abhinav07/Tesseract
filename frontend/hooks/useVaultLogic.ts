import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { ADDRESSES, ABIS } from '../lib/constants'

export function useVaultLogic() {
    // 1. Total Value Locked
    const { data: tvlRaw, isLoading: isTvlLoading } = useReadContract({
        address: ADDRESSES.VAULT,
        abi: ABIS.VAULT,
        functionName: 'totalAssets',
        query: {
            refetchInterval: 60000, // 1 min
        }
    });

    // 2. Execution logic for rebalance
    const { data: hash, writeContract: executeRaw, isPending } = useWriteContract();

    const executeRebalance = () => {
        executeRaw({
            address: ADDRESSES.VAULT,
            abi: ABIS.VAULT,
            functionName: 'rebalance',
        });
    }

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    return {
        tvl: tvlRaw as bigint | undefined,
        isTvlLoading,
        executeRebalance,
        isPending: isPending || isConfirming,
        isSuccess,
        hash
    }
}
