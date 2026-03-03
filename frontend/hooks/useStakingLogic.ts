import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { ADDRESSES, ABIS } from '../lib/constants'

export function useStakingLogic(amount: string) {
    const { address } = useAccount();
    const parsedAmount = amount ? parseUnits(amount, 18) : 0n;

    // 1. Fetch live Exchange Rate (Ticks automatically via React Query cachetime/refetch)
    const { data: exchangeRateRaw, refetch: refetchExchangeRate } = useReadContract({
        address: ADDRESSES.STAKE,
        abi: ABIS.STAKE,
        functionName: 'exchangeRate',
        query: {
            refetchInterval: 12000, // Refetch every 12 seconds (Polkadot block time)
        }
    });

    // 2. Fetch Staked Balance (LstDOT)
    const { data: userStakeRaw, refetch: refetchStake } = useReadContract({
        address: ADDRESSES.STAKE, // LstDOT is the Stake contract itself in this context
        abi: ABIS.ERC20,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        }
    });

    // 3. Execution (Assuming native PAS token for simplicity, no approval needed for native)
    const { data: hash, writeContract: executeRaw, isPending } = useWriteContract();

    const executeStake = () => {
        executeRaw({
            address: ADDRESSES.STAKE,
            abi: ABIS.STAKE,
            functionName: 'stake',
            args: [parsedAmount],
            value: parsedAmount // Assuming native token staking for Demo
        });
    }

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    return {
        executeStake,
        exchangeRate: exchangeRateRaw as bigint | undefined,
        stakedBalance: userStakeRaw as bigint | undefined,
        isPending: isPending || isConfirming,
        isSuccess,
        hash,
        refetchAll: () => { refetchExchangeRate(); refetchStake(); }
    }
}
