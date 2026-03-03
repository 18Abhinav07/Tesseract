import { useAccount, useReadContract, useWriteContract, useSimulateContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { ADDRESSES, ABIS } from '../lib/constants'

export function useSwapLogic(tokenIn: string, amountIn: string, isCrossChain: boolean) {
    const { address } = useAccount();

    // 1. Get Token Balances
    const { data: balance, isLoading: isBalanceLoading } = useReadContract({
        address: tokenIn === 'PAS' ? ADDRESSES.PAS : undefined, // Replace w/ actual XC20 address map if multiple
        abi: ABIS.ERC20,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && tokenIn !== 'PAS',
        }
    });

    // 2. Check Allowance
    const { data: allowance } = useReadContract({
        address: tokenIn === 'PAS' ? ADDRESSES.PAS : undefined,
        abi: ABIS.ERC20,
        functionName: 'allowance',
        args: address ? [address, ADDRESSES.SWAP] : undefined,
        query: {
            enabled: !!address && tokenIn !== 'PAS',
        }
    });

    const parsedAmount = amountIn ? parseUnits(amountIn, 18) : 0n;
    const needsApproval = tokenIn !== 'PAS' && (allowance as bigint || 0n) < parsedAmount;

    // 3. Simulate Swap (Slippage Catch)
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 min

    const { data: simulateSwap, error: simulateError } = useSimulateContract({
        address: ADDRESSES.SWAP,
        abi: ABIS.SWAP,
        functionName: isCrossChain ? 'swapAndBridgeXCM' : 'swapExactTokensForTokens',
        args: isCrossChain
            ? [parsedAmount, 0n, [ADDRESSES.PAS, ADDRESSES.PAS], address, deadline, 2001, 1000000000n] // Mock args
            : [parsedAmount, 0n, [ADDRESSES.PAS, ADDRESSES.PAS], address, deadline],
        query: {
            enabled: !!address && parsedAmount > 0n && !needsApproval,
        }
    });

    // 4. Execution
    const { data: hash, writeContract: executeRaw, isPending } = useWriteContract();

    const executeApproval = () => {
        executeRaw({
            address: ADDRESSES.PAS,
            abi: ABIS.ERC20,
            functionName: 'approve',
            args: [ADDRESSES.SWAP, parsedAmount]
        });
    }

    const executeSwap = () => {
        if (simulateSwap?.request) {
            executeRaw(simulateSwap.request);
        }
    }

    // 5. Receipt wait
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    return {
        executeSwap,
        executeApproval,
        needsApproval,
        isPending: isPending || isConfirming,
        isSuccess,
        balance: balance as bigint | undefined,
        isBalanceLoading,
        simulationError: simulateError?.message,
        hash
    }
}
