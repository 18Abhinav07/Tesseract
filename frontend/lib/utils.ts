import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatUnits } from "viem";

/**
 * Merges Tailwind classes dynamically
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Formats a BigInt blockchain value into a clean readable string
 * @param value The raw BigInt from Wagmi
 * @param decimals Decimals (usually 18)
 * @param displayDecimals How many decimals to show in the UI
 */
export function formatDisplayBalance(value: bigint | undefined | null, decimals = 18, displayDecimals = 4): string {
    if (!value) return "0.00";

    // Convert to readable string
    const formatted = formatUnits(value, decimals);

    // Parse to float to easily fix decimals without precision loss on display
    const floatVal = parseFloat(formatted);

    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: displayDecimals,
    }).format(floatVal);
}

/**
 * Shortens a blockchain address for display (e.g. 0x1234...5678)
 */
export function shortenAddress(address: string | undefined): string {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
