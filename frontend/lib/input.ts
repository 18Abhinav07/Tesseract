import { isAddress, parseUnits } from 'viem';

export function parseUsdcInput(raw: string): bigint | null {
    const cleaned = raw.trim();
    if (!cleaned) return null;
    const value = Number(cleaned);
    if (!Number.isFinite(value) || value <= 0) return null;
    try {
        return parseUnits(cleaned, 6);
    } catch {
        return null;
    }
}

export function parsePasInput(raw: string): bigint | null {
    const cleaned = raw.trim();
    if (!cleaned) return null;
    const value = Number(cleaned);
    if (!Number.isFinite(value) || value <= 0) return null;
    try {
        return parseUnits(cleaned, 18);
    } catch {
        return null;
    }
}

export function validAddress(raw: string): `0x${string}` | null {
    const addr = raw.trim();
    return isAddress(addr) ? (addr as `0x${string}`) : null;
}
