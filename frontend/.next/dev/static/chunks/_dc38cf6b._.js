(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/input.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "parsePasInput",
    ()=>parsePasInput,
    "parseUsdcInput",
    ()=>parseUsdcInput,
    "validAddress",
    ()=>validAddress
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$address$2f$isAddress$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/address/isAddress.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$parseUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/unit/parseUnits.js [app-client] (ecmascript)");
;
function parseUsdcInput(raw) {
    const cleaned = raw.trim();
    if (!cleaned) return null;
    const value = Number(cleaned);
    if (!Number.isFinite(value) || value <= 0) return null;
    try {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$parseUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseUnits"])(cleaned, 6);
    } catch  {
        return null;
    }
}
function parsePasInput(raw) {
    const cleaned = raw.trim();
    if (!cleaned) return null;
    const value = Number(cleaned);
    if (!Number.isFinite(value) || value <= 0) return null;
    try {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$parseUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseUnits"])(cleaned, 18);
    } catch  {
        return null;
    }
}
function validAddress(raw) {
    const addr = raw.trim();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$address$2f$isAddress$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAddress"])(addr) ? addr : null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useProtocolActions.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProtocolActions",
    ()=>useProtocolActions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$parseUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/unit/parseUnits.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useConnection__as__useAccount$3e$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useConnection.js [app-client] (ecmascript) <export useConnection as useAccount>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useChainId$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useChainId.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$usePublicClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/usePublicClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useWalletClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useWalletClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/addresses.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$providers$2f$ActionLogProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/providers/ActionLogProvider.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function toErrorMessage(error) {
    if (error instanceof Error) return error.message;
    return 'Unknown wallet error';
}
function useProtocolActions() {
    _s();
    const { address } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useConnection__as__useAccount$3e$__["useAccount"])();
    const chainId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useChainId$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChainId"])();
    const publicClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$usePublicClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePublicClient"])();
    const { data: walletClient } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useWalletClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWalletClient"])();
    const { logAction } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$providers$2f$ActionLogProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActionLog"])();
    const ensureWallet = (action, market)=>{
        if (!address || !walletClient || !publicClient) {
            logAction({
                level: 'warning',
                action,
                detail: 'Connect wallet to continue',
                market
            });
            return 'Wallet not connected';
        }
        if (chainId !== __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].chainId) {
            logAction({
                level: 'warning',
                action,
                detail: `Switch network to chain ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].chainId}`,
                market
            });
            return 'Wrong network';
        }
        return null;
    };
    const approveMUSDC = async (spender, amount)=>{
        const missing = ensureWallet('Approve mUSDC', 'system');
        if (missing) return {
            ok: false,
            error: missing
        };
        if (amount <= 0n) {
            logAction({
                level: 'warning',
                action: 'Approve mUSDC',
                detail: 'Approval amount must be greater than 0',
                market: 'system'
            });
            return {
                ok: false,
                error: 'Invalid amount'
            };
        }
        try {
            const hash = await walletClient.writeContract({
                address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].mUSDC,
                abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].ERC20,
                functionName: 'approve',
                args: [
                    spender,
                    amount
                ]
            });
            await publicClient.waitForTransactionReceipt({
                hash
            });
            logAction({
                level: 'success',
                action: 'Approve mUSDC',
                detail: 'Allowance update confirmed',
                txHash: hash,
                market: 'system'
            });
            return {
                ok: true,
                hash
            };
        } catch (error) {
            const message = toErrorMessage(error);
            logAction({
                level: 'error',
                action: 'Approve mUSDC',
                detail: message,
                market: 'system'
            });
            return {
                ok: false,
                error: message
            };
        }
    };
    const tx = async (title, market, run)=>{
        const missing = ensureWallet(title, market);
        if (missing) return {
            ok: false,
            error: missing
        };
        try {
            logAction({
                action: title,
                detail: 'Waiting for wallet confirmation…',
                market
            });
            const hash = await run();
            await publicClient.waitForTransactionReceipt({
                hash
            });
            logAction({
                level: 'success',
                action: title,
                detail: 'Transaction confirmed',
                txHash: hash,
                market
            });
            return {
                ok: true,
                hash
            };
        } catch (error) {
            const message = toErrorMessage(error);
            logAction({
                level: 'error',
                action: title,
                detail: message,
                market
            });
            return {
                ok: false,
                error: message
            };
        }
    };
    return {
        approveMUSDC,
        depositLending: (amount)=>tx('Deposit to KredioLending', 'lending', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
                    functionName: 'deposit',
                    args: [
                        amount
                    ]
                })),
        withdrawLending: (amount)=>tx('Withdraw from KredioLending', 'lending', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
                    functionName: 'withdraw',
                    args: [
                        amount
                    ]
                })),
        harvestLending: ()=>tx('Harvest lending yield', 'lending', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
                    functionName: 'pendingYieldAndHarvest',
                    args: [
                        address
                    ]
                })),
        depositLendingCollateral: (amount)=>tx('Deposit USDC collateral', 'lending', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
                    functionName: 'depositCollateral',
                    args: [
                        amount
                    ]
                })),
        withdrawLendingCollateral: ()=>tx('Withdraw USDC collateral', 'lending', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
                    functionName: 'withdrawCollateral'
                })),
        borrowLending: (amount)=>tx('Borrow from KredioLending', 'lending', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
                    functionName: 'borrow',
                    args: [
                        amount
                    ]
                })),
        repayLending: ()=>tx('Repay KredioLending debt', 'lending', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
                    functionName: 'repay'
                })),
        liquidateLending: (borrower)=>tx('Liquidate KredioLending position', 'lending', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
                    functionName: 'liquidate',
                    args: [
                        borrower
                    ]
                })),
        adminLiquidateLending: (borrower)=>tx('Admin liquidate KredioLending position', 'lending', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
                    functionName: 'adminLiquidate',
                    args: [
                        borrower
                    ]
                })),
        adminForceCloseLending: (user)=>tx('Force-close KredioLending position', 'lending', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
                    functionName: 'adminForceClose',
                    args: [
                        user
                    ]
                })),
        sweepLendingFees: (to)=>tx('Sweep Lending protocol fees', 'lending', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
                    functionName: 'sweepProtocolFees',
                    args: [
                        to
                    ]
                })),
        setLendingMultiplier: (borrower, multiplier)=>tx('Set Lending demo multiplier', 'lending', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
                    functionName: 'setDemoMultiplier',
                    args: [
                        borrower,
                        multiplier
                    ]
                })),
        depositPasLend: (amount)=>tx('Deposit to PAS market pool', 'pas', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
                    functionName: 'deposit',
                    args: [
                        amount
                    ]
                })),
        withdrawPasLend: (amount)=>tx('Withdraw from PAS market pool', 'pas', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
                    functionName: 'withdraw',
                    args: [
                        amount
                    ]
                })),
        harvestPasLend: ()=>tx('Harvest PAS market yield', 'pas', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
                    functionName: 'pendingYieldAndHarvest',
                    args: [
                        address
                    ]
                })),
        depositPasCollateral: (amountPasEth)=>tx('Deposit PAS collateral', 'pas', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
                    functionName: 'depositCollateral',
                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$parseUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseUnits"])(amountPasEth, 18)
                })),
        withdrawPasCollateral: ()=>tx('Withdraw PAS collateral', 'pas', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
                    functionName: 'withdrawCollateral'
                })),
        borrowPas: (amount)=>tx('Borrow from PAS market', 'pas', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
                    functionName: 'borrow',
                    args: [
                        amount
                    ]
                })),
        repayPas: ()=>tx('Repay PAS market debt', 'pas', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
                    functionName: 'repay'
                })),
        liquidatePas: (borrower)=>tx('Liquidate PAS position', 'pas', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
                    functionName: 'liquidate',
                    args: [
                        borrower
                    ]
                })),
        adminLiquidatePas: (borrower)=>tx('Admin liquidate PAS position', 'pas', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
                    functionName: 'adminLiquidate',
                    args: [
                        borrower
                    ]
                })),
        adminForceClosePas: (user)=>tx('Force-close PAS market position', 'pas', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
                    functionName: 'adminForceClose',
                    args: [
                        user
                    ]
                })),
        // ── New bulk / demo admin actions ────────────────────────────────
        adminSetLendingTick: (tick)=>tx('Set Lending global tick', 'lending', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
                    functionName: 'adminSetGlobalTick',
                    args: [
                        tick
                    ]
                })),
        adminSetPasTick: (tick)=>tx('Set PAS global tick', 'pas', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
                    functionName: 'adminSetGlobalTick',
                    args: [
                        tick
                    ]
                })),
        adminForceCloseAllLending: (users)=>tx('Force-close ALL Lending positions', 'lending', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
                    functionName: 'adminForceCloseAll',
                    args: [
                        users
                    ]
                })),
        adminForceCloseAllPas: (users)=>tx('Force-close ALL PAS positions', 'pas', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
                    functionName: 'adminForceCloseAll',
                    args: [
                        users
                    ]
                })),
        adminBulkWithdrawLending: (depositors)=>tx('Bulk-withdraw ALL Lending deposits', 'lending', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
                    functionName: 'adminBulkWithdrawDeposits',
                    args: [
                        depositors
                    ]
                })),
        adminBulkWithdrawPas: (depositors)=>tx('Bulk-withdraw ALL PAS deposits', 'pas', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
                    functionName: 'adminBulkWithdrawDeposits',
                    args: [
                        depositors
                    ]
                })),
        adminTickPoolLending: (borrowers)=>tx('Tick Lending pool interest', 'lending', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
                    functionName: 'adminTickPool',
                    args: [
                        borrowers
                    ]
                })),
        adminTickPoolPas: (borrowers)=>tx('Tick PAS pool interest', 'pas', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
                    functionName: 'adminTickPool',
                    args: [
                        borrowers
                    ]
                })),
        adminResetUserScoreLending: (users)=>tx('Reset Lending user scores', 'lending', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
                    functionName: 'adminResetUserScores',
                    args: [
                        users
                    ]
                })),
        adminResetUserScorePas: (users)=>tx('Reset PAS user scores', 'pas', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
                    functionName: 'adminResetUserScores',
                    args: [
                        users
                    ]
                })),
        adminHardResetLending: (to)=>tx('HARD RESET Lending pool', 'lending', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
                    functionName: 'adminHardReset',
                    args: [
                        to
                    ]
                })),
        adminHardResetPas: (to)=>tx('HARD RESET PAS pool', 'pas', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
                    functionName: 'adminHardReset',
                    args: [
                        to
                    ]
                })),
        adminCleanLending: (to, users, depositors)=>tx('Clean Lending pool', 'lending', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
                    functionName: 'adminCleanContract',
                    args: [
                        to,
                        users,
                        depositors
                    ]
                })),
        adminCleanPas: (to, users, depositors)=>tx('Clean PAS pool', 'pas', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
                    functionName: 'adminCleanContract',
                    args: [
                        to,
                        users,
                        depositors
                    ]
                })),
        sweepPasFees: (to)=>tx('Sweep PAS market fees', 'pas', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
                    functionName: 'sweepProtocolFees',
                    args: [
                        to
                    ]
                })),
        setPasMultiplier: (user, multiplier)=>tx('Set PAS demo multiplier', 'pas', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
                    functionName: 'setDemoMultiplier',
                    args: [
                        user,
                        multiplier
                    ]
                })),
        setPasRiskParams: (ltvBps, liqBonusBps, stalenessLimit, protocolFeeBps)=>tx('Update PAS risk params', 'pas', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
                    functionName: 'setRiskParams',
                    args: [
                        ltvBps,
                        liqBonusBps,
                        stalenessLimit,
                        protocolFeeBps
                    ]
                })),
        setPasOracle: (newOracle)=>tx('Set PAS oracle', 'pas', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
                    functionName: 'setOracle',
                    args: [
                        newOracle
                    ]
                })),
        pausePas: ()=>tx('Pause PAS market', 'pas', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
                    functionName: 'pause'
                })),
        unpausePas: ()=>tx('Unpause PAS market', 'pas', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
                    functionName: 'unpause'
                })),
        oracleCrash: (price8)=>tx('Inject oracle crash', 'system', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].oracle,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].PAS_ORACLE,
                    functionName: 'crash',
                    args: [
                        price8
                    ]
                })),
        oracleRecover: ()=>tx('Recover oracle', 'system', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].oracle,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].PAS_ORACLE,
                    functionName: 'recover'
                })),
        oracleSetPrice: (price8)=>tx('Set oracle price', 'system', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].oracle,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].PAS_ORACLE,
                    functionName: 'setPrice',
                    args: [
                        price8
                    ]
                })),
        setGovernanceData: (user, votes, conviction)=>tx('Update GovernanceCache entry', 'system', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].governanceCache,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].GOVERNANCE_CACHE,
                    functionName: 'setGovernanceData',
                    args: [
                        user,
                        votes,
                        conviction
                    ]
                })),
        // ── Intelligent Yield Strategy ────────────────────────────────────
        yieldSetPool: (pool)=>tx('Set yield pool address', 'lending', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
                    functionName: 'adminSetYieldPool',
                    args: [
                        pool
                    ]
                })),
        yieldInvest: (amount)=>tx('Invest into yield pool', 'lending', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
                    functionName: 'adminInvest',
                    args: [
                        amount
                    ]
                })),
        yieldPullBack: (amount)=>tx('Pull back from yield pool', 'lending', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
                    functionName: 'adminPullBack',
                    args: [
                        amount
                    ]
                })),
        yieldClaimAndInject: ()=>tx('Claim yield and inject into lender pool', 'lending', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
                    functionName: 'adminClaimAndInjectYield'
                })),
        yieldSetStrategyParams: (investRatioBps, minBufferBps)=>tx('Update yield strategy params', 'lending', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
                    functionName: 'adminSetStrategyParams',
                    args: [
                        investRatioBps,
                        minBufferBps
                    ]
                })),
        yieldSetRate: (rateBps)=>tx('Set MockYieldPool yield rate', 'system', ()=>walletClient.writeContract({
                    address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].yieldPool,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].MOCK_YIELD_POOL,
                    functionName: 'setYieldRate',
                    args: [
                        rateBps
                    ]
                }))
    };
}
_s(useProtocolActions, "AjIxsnO3r0B3ys45njL+0D5xhSA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useConnection__as__useAccount$3e$__["useAccount"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useChainId$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChainId"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$usePublicClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePublicClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useWalletClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWalletClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$providers$2f$ActionLogProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActionLog"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/modules/ProtocolUI.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionButton",
    ()=>ActionButton,
    "ActionInput",
    ()=>ActionInput,
    "Grid",
    ()=>Grid,
    "MarketModeSwitch",
    ()=>MarketModeSwitch,
    "PageShell",
    ()=>PageShell,
    "Panel",
    ()=>Panel,
    "RouteShortcut",
    ()=>RouteShortcut,
    "StatRow",
    ()=>StatRow,
    "StatRowSkeleton",
    ()=>StatRowSkeleton,
    "StateNotice",
    ()=>StateNotice
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
function PageShell({ title, subtitle, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl sm:text-3xl font-semibold text-white",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/components/modules/ProtocolUI.tsx",
                        lineNumber: 12,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-slate-400 mt-1",
                        children: subtitle
                    }, void 0, false, {
                        fileName: "[project]/components/modules/ProtocolUI.tsx",
                        lineNumber: 13,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/modules/ProtocolUI.tsx",
                lineNumber: 11,
                columnNumber: 13
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/components/modules/ProtocolUI.tsx",
        lineNumber: 10,
        columnNumber: 9
    }, this);
}
_c = PageShell;
function Grid({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-1 xl:grid-cols-2 gap-4",
        children: children
    }, void 0, false, {
        fileName: "[project]/components/modules/ProtocolUI.tsx",
        lineNumber: 21,
        columnNumber: 12
    }, this);
}
_c1 = Grid;
function Panel({ title, subtitle, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].section, {
        whileHover: {
            y: -2
        },
        transition: {
            duration: 0.18,
            ease: 'easeOut'
        },
        className: "rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-5 hover:border-white/20 hover:bg-black/35 transition-colors",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-base font-semibold text-white",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/components/modules/ProtocolUI.tsx",
                        lineNumber: 32,
                        columnNumber: 17
                    }, this),
                    subtitle ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-slate-400 mt-0.5",
                        children: subtitle
                    }, void 0, false, {
                        fileName: "[project]/components/modules/ProtocolUI.tsx",
                        lineNumber: 33,
                        columnNumber: 29
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/modules/ProtocolUI.tsx",
                lineNumber: 31,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: children
            }, void 0, false, {
                fileName: "[project]/components/modules/ProtocolUI.tsx",
                lineNumber: 35,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/modules/ProtocolUI.tsx",
        lineNumber: 26,
        columnNumber: 9
    }, this);
}
_c2 = Panel;
function StatRow({ label, value, tone = 'default' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-between text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-slate-400",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/modules/ProtocolUI.tsx",
                lineNumber: 43,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].span, {
                initial: {
                    opacity: 0.35,
                    y: 2
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                transition: {
                    duration: 0.2,
                    ease: 'easeOut'
                },
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('font-medium', tone === 'default' && 'text-white', tone === 'green' && 'text-emerald-300', tone === 'yellow' && 'text-amber-300', tone === 'red' && 'text-rose-300'),
                children: value
            }, `${label}-${value}`, false, {
                fileName: "[project]/components/modules/ProtocolUI.tsx",
                lineNumber: 44,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/modules/ProtocolUI.tsx",
        lineNumber: 42,
        columnNumber: 9
    }, this);
}
_c3 = StatRow;
function StatRowSkeleton({ label }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-between text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-slate-400",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/modules/ProtocolUI.tsx",
                lineNumber: 66,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "h-4 w-20 rounded bg-white/10 animate-pulse"
            }, void 0, false, {
                fileName: "[project]/components/modules/ProtocolUI.tsx",
                lineNumber: 67,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/modules/ProtocolUI.tsx",
        lineNumber: 65,
        columnNumber: 9
    }, this);
}
_c4 = StatRowSkeleton;
function StateNotice({ tone, message }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('rounded-xl border px-3 py-2 text-xs', tone === 'info' && 'border-cyan-400/30 bg-cyan-500/10 text-cyan-200', tone === 'warning' && 'border-amber-400/30 bg-amber-500/10 text-amber-200', tone === 'error' && 'border-rose-400/30 bg-rose-500/10 text-rose-200'),
        children: message
    }, void 0, false, {
        fileName: "[project]/components/modules/ProtocolUI.tsx",
        lineNumber: 80,
        columnNumber: 9
    }, this);
}
_c5 = StateNotice;
function ActionInput({ label, value, onChange, placeholder }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: "block space-y-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs uppercase tracking-wide text-slate-400",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/modules/ProtocolUI.tsx",
                lineNumber: 106,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                value: value,
                onChange: (e)=>onChange(e.target.value),
                placeholder: placeholder,
                className: "w-full rounded-xl border border-white/10 bg-black/40 text-sm text-white px-3 py-2 outline-none focus:border-white/30"
            }, void 0, false, {
                fileName: "[project]/components/modules/ProtocolUI.tsx",
                lineNumber: 107,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/modules/ProtocolUI.tsx",
        lineNumber: 105,
        columnNumber: 9
    }, this);
}
_c6 = ActionInput;
function ActionButton({ label, onClick, disabled, loading, variant = 'primary' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        disabled: disabled || loading,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('px-3 py-2 rounded-xl text-sm font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2', variant === 'primary' && 'bg-white text-black border-white hover:bg-white/90', variant === 'ghost' && 'bg-white/5 text-white border-white/15 hover:bg-white/10', variant === 'danger' && 'bg-rose-500/20 text-rose-200 border-rose-400/30 hover:bg-rose-500/25'),
        children: [
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"
            }, void 0, false, {
                fileName: "[project]/components/modules/ProtocolUI.tsx",
                lineNumber: 141,
                columnNumber: 24
            }, this) : null,
            label
        ]
    }, void 0, true, {
        fileName: "[project]/components/modules/ProtocolUI.tsx",
        lineNumber: 131,
        columnNumber: 9
    }, this);
}
_c7 = ActionButton;
function RouteShortcut({ href, label, description }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        className: "group block rounded-xl border border-white/10 bg-black/20 p-3 hover:border-white/20 hover:bg-black/35 transition-colors",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm font-medium text-white",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/modules/ProtocolUI.tsx",
                lineNumber: 150,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-slate-400 mt-1 group-hover:text-slate-300 transition-colors",
                children: description
            }, void 0, false, {
                fileName: "[project]/components/modules/ProtocolUI.tsx",
                lineNumber: 151,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/modules/ProtocolUI.tsx",
        lineNumber: 149,
        columnNumber: 9
    }, this);
}
_c8 = RouteShortcut;
function MarketModeSwitch({ base, active }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-xl border border-white/10 bg-black/30 p-1 inline-flex gap-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: `${base}/usdc`,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', active === 'usdc' ? 'bg-white text-black' : 'text-slate-300 hover:bg-white/10 hover:text-white'),
                children: "USDC Collateral"
            }, void 0, false, {
                fileName: "[project]/components/modules/ProtocolUI.tsx",
                lineNumber: 165,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: `${base}/pas`,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', active === 'pas' ? 'bg-white text-black' : 'text-slate-300 hover:bg-white/10 hover:text-white'),
                children: "PAS Collateral"
            }, void 0, false, {
                fileName: "[project]/components/modules/ProtocolUI.tsx",
                lineNumber: 174,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/modules/ProtocolUI.tsx",
        lineNumber: 164,
        columnNumber: 9
    }, this);
}
_c9 = MarketModeSwitch;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "PageShell");
__turbopack_context__.k.register(_c1, "Grid");
__turbopack_context__.k.register(_c2, "Panel");
__turbopack_context__.k.register(_c3, "StatRow");
__turbopack_context__.k.register(_c4, "StatRowSkeleton");
__turbopack_context__.k.register(_c5, "StateNotice");
__turbopack_context__.k.register(_c6, "ActionInput");
__turbopack_context__.k.register(_c7, "ActionButton");
__turbopack_context__.k.register(_c8, "RouteShortcut");
__turbopack_context__.k.register(_c9, "MarketModeSwitch");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/admin/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useConnection__as__useAccount$3e$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useConnection.js [app-client] (ecmascript) <export useConnection as useAccount>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useReadContract.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/addresses.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$input$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/input.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useProtocolActions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useProtocolActions.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$providers$2f$ActionLogProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/providers/ActionLogProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/modules/ProtocolUI.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAccess$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAccess.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
// ─── Per-action busy tracking ─────────────────────────────────────────────────
function useActionBusy() {
    _s();
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const isBusy = (key)=>busy.has(key);
    const withBusy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useActionBusy.useCallback[withBusy]": async (key, fn)=>{
            setBusy({
                "useActionBusy.useCallback[withBusy]": (prev)=>new Set(prev).add(key)
            }["useActionBusy.useCallback[withBusy]"]);
            try {
                await fn();
            } finally{
                setBusy({
                    "useActionBusy.useCallback[withBusy]": (prev)=>{
                        const s = new Set(prev);
                        s.delete(key);
                        return s;
                    }
                }["useActionBusy.useCallback[withBusy]"]);
            }
        }
    }["useActionBusy.useCallback[withBusy]"], []);
    return {
        isBusy,
        withBusy
    };
}
_s(useActionBusy, "mx2etOktGnG2IYUW4oUgJCwQ8Dk=");
function parseAddresses(raw) {
    return raw.split(',').map((s)=>s.trim()).filter((s)=>/^0x[0-9a-fA-F]{40}$/.test(s));
}
function fmt6(v) {
    if (v === undefined) return '-';
    return (Number(v) / 1e6).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
    });
}
function SectionTitle({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
        className: "text-sm font-semibold uppercase tracking-widest text-slate-400 mt-2 mb-0",
        children: children
    }, void 0, false, {
        fileName: "[project]/app/admin/page.tsx",
        lineNumber: 39,
        columnNumber: 12
    }, this);
}
_c = SectionTitle;
function InfoBox({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-xs text-slate-400 leading-relaxed",
        children: children
    }, void 0, false, {
        fileName: "[project]/app/admin/page.tsx",
        lineNumber: 43,
        columnNumber: 12
    }, this);
}
_c1 = InfoBox;
const TICK_PRESETS = [
    {
        label: '1× (normal)',
        value: '0'
    },
    {
        label: '60× (1 sec = 1 min)',
        value: '60'
    },
    {
        label: '3600× (1 sec = 1 hr)',
        value: '3600'
    },
    {
        label: '86400× (1 sec = 1 day)',
        value: '86400'
    },
    {
        label: '525600× (1 sec = 1 yr)',
        value: '525600'
    }
];
function AdminPage() {
    _s1();
    const { address, isConnected } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useConnection__as__useAccount$3e$__["useAccount"])();
    const { isAdmin, isWrongNetwork } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAccess$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAccess"])();
    const actions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useProtocolActions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProtocolActions"])();
    const { logAction } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$providers$2f$ActionLogProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActionLog"])();
    const { isBusy, withBusy } = useActionBusy();
    const [targetUser, setTargetUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [receiver, setReceiver] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [bulkUsers, setBulkUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [multiplier, setMultiplier] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('60');
    const [tickValue, setTickValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('60');
    const [oraclePrice8, setOraclePrice8] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('100000000');
    const [votes, setVotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('100');
    const [conviction, setConviction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('2');
    const [ltvBps, setLtvBps] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('6500');
    const [liqBonusBps, setLiqBonusBps] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('800');
    const [staleness, setStaleness] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('3600');
    const [feeBps, setFeeBps] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('1000');
    // ── Yield strategy state ──────────────────────────────────────────────
    const [yieldRateBps, setYieldRateBps] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('600');
    const [investAmount, setInvestAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [pullAmount, setPullAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [newInvestRatio, setNewInvestRatio] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('5000');
    const [newMinBuffer, setNewMinBuffer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('2000');
    const [newYieldPool, setNewYieldPool] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const safeTarget = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$input$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validAddress"])(targetUser);
    const safeReceiver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$input$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validAddress"])(receiver);
    const safeNewYieldPool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$input$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validAddress"])(newYieldPool);
    const bulkAddrs = parseAddresses(bulkUsers);
    const numeric = (s)=>/^\d+$/.test(s.trim()) ? BigInt(s.trim()) : null;
    const { data: lendingTick } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"])({
        address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
        abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
        functionName: 'globalTick',
        query: {
            refetchInterval: 5000
        }
    });
    const { data: pasTick } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"])({
        address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
        abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
        functionName: 'globalTick',
        query: {
            refetchInterval: 5000
        }
    });
    const { data: lendingTotalDeposited } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"])({
        address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
        abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
        functionName: 'totalDeposited',
        query: {
            refetchInterval: 5000
        }
    });
    const { data: lendingTotalBorrowed } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"])({
        address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
        abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
        functionName: 'totalBorrowed',
        query: {
            refetchInterval: 5000
        }
    });
    const { data: pasTotalDeposited } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"])({
        address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
        abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
        functionName: 'totalDeposited',
        query: {
            refetchInterval: 5000
        }
    });
    const { data: pasTotalBorrowed } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"])({
        address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
        abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
        functionName: 'totalBorrowed',
        query: {
            refetchInterval: 5000
        }
    });
    const { data: lendingFees } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"])({
        address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
        abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
        functionName: 'protocolFees',
        query: {
            refetchInterval: 5000
        }
    });
    const { data: pasFees } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"])({
        address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pasMarket,
        abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_PAS_MARKET,
        functionName: 'protocolFees',
        query: {
            refetchInterval: 5000
        }
    });
    // ── Yield strategy reads ────────────────────────────────────────────────
    const { data: stratStatus, refetch: refetchStrategy } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"])({
        address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
        abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
        functionName: 'strategyStatus',
        query: {
            refetchInterval: 10000
        }
    });
    const { data: pendingYield } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"])({
        address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lending,
        abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].KREDIO_LENDING,
        functionName: 'pendingStrategyYield',
        query: {
            refetchInterval: 10000
        }
    });
    const { data: poolYieldRate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"])({
        address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].yieldPool,
        abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].MOCK_YIELD_POOL,
        functionName: 'yieldRateBps',
        query: {
            refetchInterval: 10000
        }
    });
    const { data: poolPrincipal } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"])({
        address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].yieldPool,
        abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABIS"].MOCK_YIELD_POOL,
        functionName: 'totalPrincipal',
        query: {
            refetchInterval: 10000
        }
    });
    // strategyStatus() returns [pool, invested, totalEarned, pendingYield, investRatioBps, minBufferBps]
    const ss = stratStatus;
    const run = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AdminPage.useCallback[run]": async (key, fn)=>{
            if (!isConnected) {
                logAction({
                    level: 'warning',
                    action: key,
                    detail: 'Connect wallet first',
                    market: 'system'
                });
                return;
            }
            if (isWrongNetwork) {
                logAction({
                    level: 'warning',
                    action: key,
                    detail: 'Switch to Polkadot Hub',
                    market: 'system'
                });
                return;
            }
            withBusy(key, fn);
        }
    }["AdminPage.useCallback[run]"], [
        isConnected,
        isWrongNetwork,
        logAction,
        withBusy
    ]);
    if (!isAdmin) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageShell"], {
            title: "Admin",
            subtitle: "Owner-only controls for risk and protocol operations.",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                title: "Access Restricted",
                subtitle: "This page is visible only to the authorized admin wallet.",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatRow"], {
                        label: "Connected",
                        value: isConnected ? 'Yes' : 'No'
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 119,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatRow"], {
                        label: "Authorized Admin",
                        value: "No",
                        tone: "red"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 120,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 118,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/admin/page.tsx",
            lineNumber: 117,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageShell"], {
        title: "Admin",
        subtitle: "Owner-only controls - interest acceleration, bulk resets, oracle, risk parameters and governance.",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                title: "Access Control",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatRow"], {
                        label: "Connected Wallet",
                        value: address ? `${address.slice(0, 8)}…${address.slice(-6)}` : 'Not connected'
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 131,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatRow"], {
                        label: "Expected Owner",
                        value: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].owner.slice(0, 8)}…${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].owner.slice(-6)}`
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 132,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatRow"], {
                        label: "Authorized",
                        value: "Yes",
                        tone: "green"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 133,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 130,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                children: "Pool State"
            }, void 0, false, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 137,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Grid"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                        title: "KredioLending (USDC Market)",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatRow"], {
                                label: "Global Tick",
                                value: lendingTick !== undefined ? `${lendingTick === 0n ? '1' : String(lendingTick)}×` : '-',
                                tone: lendingTick && lendingTick > 0n ? 'green' : undefined
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 140,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatRow"], {
                                label: "Total Deposited",
                                value: `${fmt6(lendingTotalDeposited)} mUSDC`
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 141,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatRow"], {
                                label: "Total Borrowed",
                                value: `${fmt6(lendingTotalBorrowed)} mUSDC`
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 142,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatRow"], {
                                label: "Protocol Fees",
                                value: `${fmt6(lendingFees)} mUSDC`
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 143,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 139,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                        title: "KredioPASMarket (PAS Market)",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatRow"], {
                                label: "Global Tick",
                                value: pasTick !== undefined ? `${pasTick === 0n ? '1' : String(pasTick)}×` : '-',
                                tone: pasTick && pasTick > 0n ? 'green' : undefined
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 146,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatRow"], {
                                label: "Total Deposited",
                                value: `${fmt6(pasTotalDeposited)} mUSDC`
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 147,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatRow"], {
                                label: "Total Borrowed",
                                value: `${fmt6(pasTotalBorrowed)} mUSDC`
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 148,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatRow"], {
                                label: "Protocol Fees",
                                value: `${fmt6(pasFees)} mUSDC`
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 149,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 145,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 138,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                children: "Interest Tick Speed"
            }, void 0, false, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 154,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                title: "Global Interest Multiplier",
                subtitle: "Accelerates interest accrual for ALL borrowers. 60× = 1 real second equals 1 minute of interest. Setting to 0 restores 1× normal behaviour.",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoBox, {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                className: "text-white",
                                children: "How it works:"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 160,
                                columnNumber: 21
                            }, this),
                            " interest formula is",
                            ' ',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                className: "text-amber-300",
                                children: "debt × rate × elapsed × multiplier / (10000 × 365 days)"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 161,
                                columnNumber: 21
                            }, this),
                            ". Setting this to ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                children: "60"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 162,
                                columnNumber: 37
                            }, this),
                            " makes every second count as 60 seconds - ideal for live demos. The effective multiplier is ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                className: "text-amber-300",
                                children: "max(globalTick, perUserMultiplier)"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 163,
                                columnNumber: 49
                            }, this),
                            "."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 159,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 flex flex-wrap gap-2",
                        children: TICK_PRESETS.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setTickValue(p.value),
                                className: `rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${tickValue === p.value ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`,
                                children: p.label
                            }, p.value, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 167,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 165,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInput"], {
                        label: "Custom Value",
                        value: tickValue,
                        onChange: setTickValue,
                        placeholder: "e.g. 60"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 173,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2 mt-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Set Lending Tick",
                                loading: isBusy('setLendingTick'),
                                disabled: isBusy('setLendingTick'),
                                onClick: ()=>{
                                    const v = numeric(tickValue);
                                    if (v === null) return;
                                    run('setLendingTick', ()=>actions.adminSetLendingTick(v));
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 175,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Set PAS Tick",
                                loading: isBusy('setPasTick'),
                                disabled: isBusy('setPasTick'),
                                onClick: ()=>{
                                    const v = numeric(tickValue);
                                    if (v === null) return;
                                    run('setPasTick', ()=>actions.adminSetPasTick(v));
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 177,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Set Both Markets",
                                loading: isBusy('setLendingTick') || isBusy('setPasTick'),
                                disabled: isBusy('setLendingTick') || isBusy('setPasTick'),
                                onClick: ()=>{
                                    const v = numeric(tickValue);
                                    if (v === null) return;
                                    run('setLendingTick', ()=>actions.adminSetLendingTick(v));
                                    run('setPasTick', ()=>actions.adminSetPasTick(v));
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 179,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Reset to 1× (Off)",
                                variant: "ghost",
                                loading: isBusy('resetTick'),
                                disabled: isBusy('resetTick'),
                                onClick: ()=>{
                                    setTickValue('0');
                                    run('resetTick', async ()=>{
                                        await actions.adminSetLendingTick(0n);
                                        return actions.adminSetPasTick(0n);
                                    });
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 181,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 174,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 155,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                title: "Per-User Demo Rate Multiplier",
                subtitle: "Override the interest rate for a specific borrower only. 0 clears the override. Max 1,000,000. Effective rate = max(globalTick, this value).",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInput"], {
                        label: "Borrower Address",
                        value: targetUser,
                        onChange: setTargetUser,
                        placeholder: "0x..."
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 189,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInput"], {
                        label: "Rate Multiplier",
                        value: multiplier,
                        onChange: setMultiplier,
                        placeholder: "e.g. 60"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 190,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Set Lending Multiplier",
                                variant: "ghost",
                                loading: isBusy('setLendingMul'),
                                disabled: isBusy('setLendingMul') || !safeTarget,
                                onClick: ()=>{
                                    const v = numeric(multiplier);
                                    if (!safeTarget || v === null) return;
                                    run('setLendingMul', ()=>actions.setLendingMultiplier(safeTarget, v));
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 192,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Set PAS Multiplier",
                                variant: "ghost",
                                loading: isBusy('setPasMul'),
                                disabled: isBusy('setPasMul') || !safeTarget,
                                onClick: ()=>{
                                    const v = numeric(multiplier);
                                    if (!safeTarget || v === null) return;
                                    run('setPasMul', ()=>actions.setPasMultiplier(safeTarget, v));
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 194,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 191,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 187,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                children: "Yield Tick - Force-Distribute Interest to Lenders"
            }, void 0, false, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 200,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                title: "Tick Pool",
                subtitle: "Capitalises accrued interest for the listed borrowers into their debt and immediately distributes it as yield to lenders. Resets each borrower's interest clock. Shows lending yield growth in real-time.",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoBox, {
                        children: [
                            "Enter comma-separated borrower addresses. Their current accrued interest is calculated, added to their principal and distributed to the lender pool as yield - all in one tx. Lenders' ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                className: "text-white",
                                children: "pendingYield"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 206,
                                columnNumber: 35
                            }, this),
                            " increases immediately."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 203,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInput"], {
                        label: "Borrower Addresses (comma-separated)",
                        value: bulkUsers,
                        onChange: setBulkUsers,
                        placeholder: "0xAbc..., 0xDef..."
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 208,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-slate-500 mt-1",
                        children: [
                            bulkAddrs.length,
                            " address",
                            bulkAddrs.length !== 1 ? 'es' : '',
                            " parsed"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 209,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2 mt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Tick Lending Pool",
                                loading: isBusy('tickLending'),
                                disabled: isBusy('tickLending') || bulkAddrs.length === 0,
                                onClick: ()=>run('tickLending', ()=>actions.adminTickPoolLending(bulkAddrs))
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 211,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Tick PAS Pool",
                                loading: isBusy('tickPas'),
                                disabled: isBusy('tickPas') || bulkAddrs.length === 0,
                                onClick: ()=>run('tickPas', ()=>actions.adminTickPoolPas(bulkAddrs))
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 213,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 210,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 201,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                children: "Bulk Position Management"
            }, void 0, false, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 219,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                title: "Force-Close All Positions",
                subtitle: "Wipes positions for all listed addresses and returns their collateral. Outstanding debt is absorbed. Call this before a hard reset.",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInput"], {
                        label: "User Addresses (comma-separated)",
                        value: bulkUsers,
                        onChange: setBulkUsers,
                        placeholder: "0xAbc..., 0xDef..."
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 222,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-slate-500 mt-1",
                        children: [
                            bulkAddrs.length,
                            " address",
                            bulkAddrs.length !== 1 ? 'es' : '',
                            " parsed"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 223,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2 mt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Force-Close All (Lending)",
                                variant: "danger",
                                loading: isBusy('forceAllLending'),
                                disabled: isBusy('forceAllLending') || bulkAddrs.length === 0,
                                onClick: ()=>run('forceAllLending', ()=>actions.adminForceCloseAllLending(bulkAddrs))
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 225,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Force-Close All (PAS)",
                                variant: "danger",
                                loading: isBusy('forceAllPas'),
                                disabled: isBusy('forceAllPas') || bulkAddrs.length === 0,
                                onClick: ()=>run('forceAllPas', ()=>actions.adminForceCloseAllPas(bulkAddrs))
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 227,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 224,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 220,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                title: "Bulk Return Lender Deposits",
                subtitle: "Force-returns principal deposits (no yield) to a list of lenders. Bypasses liquidity check. Call after force-closing all borrow positions.",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInput"], {
                        label: "Depositor Addresses (comma-separated)",
                        value: bulkUsers,
                        onChange: setBulkUsers,
                        placeholder: "0xAbc..., 0xDef..."
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 234,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-slate-500 mt-1",
                        children: [
                            bulkAddrs.length,
                            " address",
                            bulkAddrs.length !== 1 ? 'es' : '',
                            " parsed"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 235,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2 mt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Bulk Withdraw Lending",
                                variant: "danger",
                                loading: isBusy('bulkWdLending'),
                                disabled: isBusy('bulkWdLending') || bulkAddrs.length === 0,
                                onClick: ()=>run('bulkWdLending', ()=>actions.adminBulkWithdrawLending(bulkAddrs))
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 237,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Bulk Withdraw PAS",
                                variant: "danger",
                                loading: isBusy('bulkWdPas'),
                                disabled: isBusy('bulkWdPas') || bulkAddrs.length === 0,
                                onClick: ()=>run('bulkWdPas', ()=>actions.adminBulkWithdrawPas(bulkAddrs))
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 239,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 236,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 232,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                title: "Force-Close Single Position",
                subtitle: "Wipes one user's position and returns their collateral. For targeted resets.",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInput"], {
                        label: "User Address",
                        value: targetUser,
                        onChange: setTargetUser,
                        placeholder: "0x..."
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 247,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2 mt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Force-Close Lending",
                                variant: "danger",
                                loading: isBusy('forceOneLending'),
                                disabled: isBusy('forceOneLending') || !safeTarget,
                                onClick: ()=>run('forceOneLending', ()=>actions.adminForceCloseLending(safeTarget))
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 249,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Force-Close PAS",
                                variant: "danger",
                                loading: isBusy('forceOnePas'),
                                disabled: isBusy('forceOnePas') || !safeTarget,
                                onClick: ()=>run('forceOnePas', ()=>actions.adminForceClosePas(safeTarget))
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 251,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Admin Liquidate (Lending)",
                                variant: "danger",
                                loading: isBusy('adminLiqLending'),
                                disabled: isBusy('adminLiqLending') || !safeTarget,
                                onClick: ()=>run('adminLiqLending', ()=>actions.adminLiquidateLending(safeTarget))
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 253,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Admin Liquidate (PAS)",
                                variant: "danger",
                                loading: isBusy('adminLiqPas'),
                                disabled: isBusy('adminLiqPas') || !safeTarget,
                                onClick: ()=>run('adminLiqPas', ()=>actions.adminLiquidatePas(safeTarget))
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 255,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 248,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 245,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                children: "Credit Score History"
            }, void 0, false, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 261,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                title: "Reset User Credit Scores",
                subtitle: "Clears repayment count, liquidation count, first-seen block, lifetime deposits, and per-user rate multiplier. Wallets return to new-user baseline tier.",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoBox, {
                        children: "After reset, each wallet computes its score as a brand-new user - perfect for re-running demos from a fair starting point."
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 264,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInput"], {
                        label: "User Addresses (comma-separated)",
                        value: bulkUsers,
                        onChange: setBulkUsers,
                        placeholder: "0xAbc..., 0xDef..."
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 265,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-slate-500 mt-1",
                        children: [
                            bulkAddrs.length,
                            " address",
                            bulkAddrs.length !== 1 ? 'es' : '',
                            " parsed"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 266,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2 mt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Reset Lending Scores",
                                variant: "ghost",
                                loading: isBusy('resetScoreLending'),
                                disabled: isBusy('resetScoreLending') || bulkAddrs.length === 0,
                                onClick: ()=>run('resetScoreLending', ()=>actions.adminResetUserScoreLending(bulkAddrs))
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 268,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Reset PAS Scores",
                                variant: "ghost",
                                loading: isBusy('resetScorePas'),
                                disabled: isBusy('resetScorePas') || bulkAddrs.length === 0,
                                onClick: ()=>run('resetScorePas', ()=>actions.adminResetUserScorePas(bulkAddrs))
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 270,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 267,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 262,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                children: "Nuclear Reset"
            }, void 0, false, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 276,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                title: "Hard Reset - Sweep All USDC & Zero Pool Accounting",
                subtitle: "Zeros totalBorrowed, totalDeposited, accYieldPerShare, protocolFees and globalTick, then transfers all USDC inside the contract to the receiver address. Recommended sequence below.",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoBox, {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                className: "text-red-400",
                                children: "Recommended clean-start sequence:"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 280,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                className: "mt-1.5 space-y-0.5 list-decimal list-inside",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "Set global tick to 0 (disable acceleration)."
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/page.tsx",
                                        lineNumber: 282,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "Force-Close All Positions for all active borrowers."
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/page.tsx",
                                        lineNumber: 283,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "Bulk Withdraw for all depositors."
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/page.tsx",
                                        lineNumber: 284,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "Reset User Scores for all participants."
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/page.tsx",
                                        lineNumber: 285,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "Hard Reset - sweeps remaining USDC dust and zeros accounting."
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/page.tsx",
                                        lineNumber: 286,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "Re-seed pool: deposit mUSDC as admin via the Lend page."
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/page.tsx",
                                        lineNumber: 287,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 281,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 279,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInput"], {
                        label: "Receiver Address (gets swept USDC)",
                        value: receiver,
                        onChange: setReceiver,
                        placeholder: "0x..."
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 290,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2 mt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Clean Lending Pool",
                                variant: "danger",
                                loading: isBusy('cleanLending'),
                                disabled: isBusy('cleanLending') || !safeReceiver || bulkAddrs.length === 0,
                                onClick: ()=>run('cleanLending', ()=>actions.adminCleanLending(safeReceiver, bulkAddrs, bulkAddrs))
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 292,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Clean PAS Pool",
                                variant: "danger",
                                loading: isBusy('cleanPas'),
                                disabled: isBusy('cleanPas') || !safeReceiver || bulkAddrs.length === 0,
                                onClick: ()=>run('cleanPas', ()=>actions.adminCleanPas(safeReceiver, bulkAddrs, bulkAddrs))
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 294,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "HARD RESET Lending Pool",
                                variant: "danger",
                                loading: isBusy('hardResetLending'),
                                disabled: isBusy('hardResetLending') || !safeReceiver,
                                onClick: ()=>run('hardResetLending', ()=>actions.adminHardResetLending(safeReceiver))
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 296,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "HARD RESET PAS Pool",
                                variant: "danger",
                                loading: isBusy('hardResetPas'),
                                disabled: isBusy('hardResetPas') || !safeReceiver,
                                onClick: ()=>run('hardResetPas', ()=>actions.adminHardResetPas(safeReceiver))
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 298,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 291,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-slate-500 mt-2",
                        children: "Clean uses the parsed bulk address list for both users and depositors."
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 301,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 277,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                children: "Fee Management"
            }, void 0, false, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 307,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                title: "Sweep Protocol Fees",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInput"], {
                        label: "Receiver Address",
                        value: receiver,
                        onChange: setReceiver,
                        placeholder: "0x..."
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 309,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2 mt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Sweep Lending Fees",
                                loading: isBusy('sweepLending'),
                                disabled: isBusy('sweepLending') || !safeReceiver,
                                onClick: ()=>run('sweepLending', ()=>actions.sweepLendingFees(safeReceiver))
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 311,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Sweep PAS Fees",
                                loading: isBusy('sweepPas'),
                                disabled: isBusy('sweepPas') || !safeReceiver,
                                onClick: ()=>run('sweepPas', ()=>actions.sweepPasFees(safeReceiver))
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 313,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 310,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 308,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                children: "Oracle Controls"
            }, void 0, false, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 319,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                title: "MockPASOracle - Price Manipulation",
                subtitle: "Set or crash the PAS/USD oracle. Crash drops price so open positions become liquidatable - useful for demonstrating liquidation flows. Recover restores the normal price.",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInput"], {
                        label: "Price (8 decimal places - e.g. 100000000 = $1.00)",
                        value: oraclePrice8,
                        onChange: setOraclePrice8,
                        placeholder: "100000000"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 322,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2 mt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Set Price",
                                loading: isBusy('oracleSet'),
                                disabled: isBusy('oracleSet'),
                                onClick: ()=>{
                                    const v = numeric(oraclePrice8);
                                    if (!v) return;
                                    run('oracleSet', ()=>actions.oracleSetPrice(v));
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 324,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Crash Price",
                                variant: "danger",
                                loading: isBusy('oracleCrash'),
                                disabled: isBusy('oracleCrash'),
                                onClick: ()=>{
                                    const v = numeric(oraclePrice8);
                                    if (!v) return;
                                    run('oracleCrash', ()=>actions.oracleCrash(v));
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 326,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Recover Oracle",
                                variant: "ghost",
                                loading: isBusy('oracleRecover'),
                                disabled: isBusy('oracleRecover'),
                                onClick: ()=>run('oracleRecover', ()=>actions.oracleRecover())
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 328,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 323,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 320,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                children: "PAS Market Risk Parameters"
            }, void 0, false, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 334,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                title: "Risk Parameters",
                subtitle: "Tune LTV, liquidation bonus, oracle staleness and protocol fee for the PAS collateral market.",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Grid"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInput"], {
                                label: "LTV BPS (max 8000)",
                                value: ltvBps,
                                onChange: setLtvBps,
                                placeholder: "6500"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 337,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInput"], {
                                label: "Liquidation Bonus BPS (max 2000)",
                                value: liqBonusBps,
                                onChange: setLiqBonusBps,
                                placeholder: "800"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 338,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInput"], {
                                label: "Oracle Staleness Limit (seconds)",
                                value: staleness,
                                onChange: setStaleness,
                                placeholder: "3600"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 339,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInput"], {
                                label: "Protocol Fee BPS (max 2000)",
                                value: feeBps,
                                onChange: setFeeBps,
                                placeholder: "1000"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 340,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 336,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2 mt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Update Risk Params",
                                loading: isBusy('riskParams'),
                                disabled: isBusy('riskParams'),
                                onClick: ()=>{
                                    const ltv = numeric(ltvBps), bonus = numeric(liqBonusBps), stale = numeric(staleness), fee = numeric(feeBps);
                                    if (!ltv || !bonus || !stale || !fee) return;
                                    run('riskParams', ()=>actions.setPasRiskParams(ltv, bonus, stale, fee));
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 343,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Pause PAS Market",
                                variant: "danger",
                                loading: isBusy('pausePas'),
                                disabled: isBusy('pausePas'),
                                onClick: ()=>run('pausePas', ()=>actions.pausePas())
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 345,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Unpause PAS Market",
                                variant: "ghost",
                                loading: isBusy('unpausePas'),
                                disabled: isBusy('unpausePas'),
                                onClick: ()=>run('unpausePas', ()=>actions.unpausePas())
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 347,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 342,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 335,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                children: "Intelligent Yield Strategy"
            }, void 0, false, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 353,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Grid"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                        title: "Strategy Status (KredioLending)",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatRow"], {
                                label: "Yield Pool",
                                value: ss ? `${String(ss[0]).slice(0, 8)}…${String(ss[0]).slice(-6)}` : '-',
                                tone: ss && ss[0] !== '0x0000000000000000000000000000000000000000' ? 'green' : 'red'
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 358,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatRow"], {
                                label: "Invested",
                                value: `${fmt6(ss?.[1])} mUSDC`,
                                tone: ss && ss[1] > 0n ? 'green' : undefined
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 359,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatRow"], {
                                label: "Total Earned by Strategy",
                                value: `${fmt6(ss?.[2])} mUSDC`
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 360,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatRow"], {
                                label: "Pending Yield (claimable)",
                                value: `${fmt6(pendingYield)} mUSDC`,
                                tone: pendingYield && pendingYield > 0n ? 'green' : undefined
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 361,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatRow"], {
                                label: "Invest Ratio",
                                value: ss ? `${Number(ss[4]) / 100}%` : '-'
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 362,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatRow"], {
                                label: "Min Buffer",
                                value: ss ? `${Number(ss[5]) / 100}%` : '-'
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 363,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 357,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                        title: "MockYieldPool Status",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatRow"], {
                                label: "Pool Address",
                                value: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].yieldPool ? `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].yieldPool.slice(0, 8)}…${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$addresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].yieldPool.slice(-6)}` : '-',
                                tone: "green"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 366,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatRow"], {
                                label: "Total Principal",
                                value: `${fmt6(poolPrincipal)} mUSDC`
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 367,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatRow"], {
                                label: "APY Rate",
                                value: poolYieldRate !== undefined ? `${Number(poolYieldRate) / 100}% APY` : '-',
                                tone: poolYieldRate && poolYieldRate > 1000n ? 'green' : undefined
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 368,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatRow"], {
                                label: "Mode",
                                value: poolYieldRate && poolYieldRate > 10000n ? 'DEMO (fast)' : 'Normal',
                                tone: poolYieldRate && poolYieldRate > 10000n ? 'green' : undefined
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 369,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 365,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 356,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                title: "Crank Yield Rate - MockYieldPool",
                subtitle: "Sets the annual yield rate on the mock pool. Use high values (e.g. 60000 = 600% APY) for demos where yield should be visible within minutes. Use 600 for realistic 6% APY.",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoBox, {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                className: "text-white",
                                children: "APY → Rate BPS:"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 378,
                                columnNumber: 21
                            }, this),
                            ' ',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                className: "text-amber-300",
                                children: "rate = APY% × 100"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 379,
                                columnNumber: 21
                            }, this),
                            ". At 60 000 BPS (600% APY), a 500k principal earns ~1,370 mUSDC of yield per hour. At 600 BPS (6% APY), the same 500k earns ~274 mUSDC per day."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 377,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 flex flex-wrap gap-2",
                        children: [
                            {
                                label: '6% APY (realistic)',
                                value: '600'
                            },
                            {
                                label: '60% APY (fast)',
                                value: '6000'
                            },
                            {
                                label: '600% APY (demo)',
                                value: '60000'
                            },
                            {
                                label: '1000% APY (turbo)',
                                value: '100000'
                            }
                        ].map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setYieldRateBps(p.value),
                                className: `rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${yieldRateBps === p.value ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`,
                                children: p.label
                            }, p.value, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 389,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 382,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInput"], {
                        label: "Custom Rate BPS (100 = 1% APY)",
                        value: yieldRateBps,
                        onChange: setYieldRateBps,
                        placeholder: "e.g. 600"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 395,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                        label: "Set Yield Rate",
                        loading: isBusy('yieldSetRate'),
                        disabled: isBusy('yieldSetRate'),
                        onClick: ()=>{
                            const v = numeric(yieldRateBps);
                            if (!v) return;
                            run('yieldSetRate', ()=>{
                                return actions.yieldSetRate(v).then((r)=>{
                                    refetchStrategy();
                                    return r;
                                });
                            });
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 396,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 374,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                title: "Manual Invest / Pull Back",
                subtitle: "Manually move capital between the lending pool and the yield pool. The backend monitor handles this automatically, but you can trigger it manually for demos.",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Grid"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInput"], {
                                        label: "Invest Amount (mUSDC, 6 dec)",
                                        value: investAmount,
                                        onChange: setInvestAmount,
                                        placeholder: "e.g. 250000000000"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/page.tsx",
                                        lineNumber: 405,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                        label: "Invest into Yield Pool",
                                        loading: isBusy('yieldInvest'),
                                        disabled: isBusy('yieldInvest') || !investAmount,
                                        onClick: ()=>{
                                            const v = numeric(investAmount);
                                            if (!v) return;
                                            run('yieldInvest', ()=>actions.yieldInvest(v).then((r)=>{
                                                    refetchStrategy();
                                                    return r;
                                                }));
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/page.tsx",
                                        lineNumber: 406,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 404,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInput"], {
                                        label: "Pull Back Amount (mUSDC, 6 dec)",
                                        value: pullAmount,
                                        onChange: setPullAmount,
                                        placeholder: "e.g. 100000000000"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/page.tsx",
                                        lineNumber: 410,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                        label: "Pull Back from Pool",
                                        variant: "ghost",
                                        loading: isBusy('yieldPullBack'),
                                        disabled: isBusy('yieldPullBack') || !pullAmount,
                                        onClick: ()=>{
                                            const v = numeric(pullAmount);
                                            if (!v) return;
                                            run('yieldPullBack', ()=>actions.yieldPullBack(v).then((r)=>{
                                                    refetchStrategy();
                                                    return r;
                                                }));
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/page.tsx",
                                        lineNumber: 411,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 409,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 403,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                                label: "Claim Yield & Inject into Lender Pool",
                                loading: isBusy('yieldClaim'),
                                disabled: isBusy('yieldClaim') || !pendingYield || pendingYield === 0n,
                                onClick: ()=>run('yieldClaim', ()=>actions.yieldClaimAndInject().then((r)=>{
                                            refetchStrategy();
                                            return r;
                                        }))
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 416,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-slate-500 mt-1",
                                children: [
                                    "Pending: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-amber-300",
                                        children: [
                                            fmt6(pendingYield),
                                            " mUSDC"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/admin/page.tsx",
                                        lineNumber: 419,
                                        columnNumber: 34
                                    }, this),
                                    " - distributes to all lenders via accYieldPerShare immediately."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 418,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 415,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 401,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                title: "Strategy Parameters",
                subtitle: "Tune the automated rebalancing formula. Changes take effect on the next backend monitor tick (every 30s).",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoBox, {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                className: "text-white",
                                children: "Invest Ratio:"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 428,
                                columnNumber: 21
                            }, this),
                            " fraction of idle mUSDC to put to work (50% = 5000 BPS).",
                            ' ',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                className: "text-white",
                                children: "Min Buffer:"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 429,
                                columnNumber: 21
                            }, this),
                            " minimum fraction of ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                children: "total deposits"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 429,
                                columnNumber: 93
                            }, this),
                            " that must stay liquid (20% = 2000 BPS). The monitor targets: ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                className: "text-amber-300",
                                children: "invested = idle × investRatio"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 430,
                                columnNumber: 42
                            }, this),
                            ", subject to the min buffer floor."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 427,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Grid"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInput"], {
                                label: "Invest Ratio BPS (max 9000)",
                                value: newInvestRatio,
                                onChange: setNewInvestRatio,
                                placeholder: "5000"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 433,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInput"], {
                                label: "Min Buffer BPS (max 5000)",
                                value: newMinBuffer,
                                onChange: setNewMinBuffer,
                                placeholder: "2000"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/page.tsx",
                                lineNumber: 434,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 432,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                        label: "Update Strategy Params",
                        loading: isBusy('yieldParams'),
                        disabled: isBusy('yieldParams'),
                        onClick: ()=>{
                            const r = numeric(newInvestRatio), b = numeric(newMinBuffer);
                            if (!r || !b) return;
                            run('yieldParams', ()=>actions.yieldSetStrategyParams(r, b).then((res)=>{
                                    refetchStrategy();
                                    return res;
                                }));
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 436,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 425,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                title: "Replace Yield Pool Contract",
                subtitle: "Point KredioLending at a different yield pool contract. Use when deploying a new MockYieldPool.",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInput"], {
                        label: "New Yield Pool Address",
                        value: newYieldPool,
                        onChange: setNewYieldPool,
                        placeholder: "0x..."
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 443,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                        label: "Set Yield Pool",
                        variant: "danger",
                        loading: isBusy('yieldSetPool'),
                        disabled: isBusy('yieldSetPool') || !safeNewYieldPool,
                        onClick: ()=>run('yieldSetPool', ()=>actions.yieldSetPool(safeNewYieldPool).then((r)=>{
                                    refetchStrategy();
                                    return r;
                                }))
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 444,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 441,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                children: "Governance Cache"
            }, void 0, false, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 449,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                title: "Governance Data Override",
                subtitle: "Manually set on-chain voting data for a user. Votes and conviction level feed into the KreditAgent credit score calculation.",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInput"], {
                        label: "User Address",
                        value: targetUser,
                        onChange: setTargetUser,
                        placeholder: "0x..."
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 452,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInput"], {
                        label: "Vote Count",
                        value: votes,
                        onChange: setVotes,
                        placeholder: "100"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 453,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInput"], {
                        label: "Max Conviction (0–6)",
                        value: conviction,
                        onChange: setConviction,
                        placeholder: "2"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 454,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modules$2f$ProtocolUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButton"], {
                        label: "Set Governance Data",
                        loading: isBusy('govData'),
                        disabled: isBusy('govData') || !safeTarget,
                        onClick: ()=>{
                            const vc = numeric(votes), conv = Number(conviction);
                            if (!vc || !Number.isInteger(conv) || conv < 0 || conv > 6 || !safeTarget) return;
                            run('govData', ()=>actions.setGovernanceData(safeTarget, vc, conv));
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/admin/page.tsx",
                        lineNumber: 455,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/page.tsx",
                lineNumber: 450,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/page.tsx",
        lineNumber: 127,
        columnNumber: 9
    }, this);
}
_s1(AdminPage, "4SaT/gLJ+PLeOWO88vIrNuEHCxg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useConnection__as__useAccount$3e$__["useAccount"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAccess$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAccess"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useProtocolActions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProtocolActions"],
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$providers$2f$ActionLogProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActionLog"],
        useActionBusy,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useReadContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReadContract"]
    ];
});
_c2 = AdminPage;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "SectionTitle");
__turbopack_context__.k.register(_c1, "InfoBox");
__turbopack_context__.k.register(_c2, "AdminPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_dc38cf6b._.js.map