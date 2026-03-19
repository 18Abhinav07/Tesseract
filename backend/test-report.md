# Kredio Full Test Run Report

- **Run Date:** 2026-03-19T08:07:50.771Z
- **Duration:** 866.8s

## Pre-Test Snapshots
### KredioLending
- Total Deposited: 0.00 mUSDC
- Total Borrowed: 0.00 mUSDC

### Users Initial
- USER1 (0x5EF0a87f578778Fc78cbFe318D3444D71Ff638da): 200,000 mUSDC, 50,000 PAS
- USER2 (0x8fb792EdBbA0A3b4e83Fffe790a8F080FD9C46CE): 200,000 mUSDC, 50,000 PAS
- USER3 (0x7B8428750F29381Ef4190a0a9F8c294ac123014e): 200,000 mUSDC, 50,000 PAS
- USER4 (0x6bA56a179ff0C0E08B60EBe2a3f03141CEacE50F): 200,000 mUSDC, 50,000 PAS
- USER5 (0x105952E94C36916757785C4F7f92DAf5f1cC99ad): 200,000 mUSDC, 50,000 PAS
- USER6 (0x863930353d628aA250fB98A4Eb2C1bAa649d5617): 200,000 mUSDC, 50,000 PAS

## Active Execution Log

| Step | Actor | Action | Params | Expected | Status | TxHash/Err |
|---|---|---|---|---|---|---|
| 1 | ADMIN | Force-close all borrower positions in KredioLending | - | **Exp:** All borrow positions closed; USDC collateral returned; totalBorrowed → 0 <br> **Obs. Before:** N/A <br> **Obs. After:** N/A | PASS | `0xa16cf8cee86dd4d274f1517f3c662bf09e7e121425ca9bcb8278225591ff13d6` |
| 2 | ADMIN | Hard-reset KredioLending (sweep all USDC dust to admin) | - | **Exp:** totalDeposited=0, totalBorrowed=0, accYieldPerShare=0, globalTick=0 <br> **Obs. Before:** N/A <br> **Obs. After:** N/A | FAIL | could not coalesce error |
| 3 | ADMIN | Reset credit scores for all known addresses (KredioLending) | - | **Exp:** repaymentCount/liquidationCount/totalDepositedEver = 0 for all <br> **Obs. Before:** N/A <br> **Obs. After:** N/A | PASS | `0x1747050d6113d7a58679d8b81d2d870b6eb258acc1e796d2ecb0d3cafe2adf0a` |
| 4 | ADMIN | Force-close all positions in KredioPASMarket (return PAS collateral) | - | **Exp:** All PAS positions closed; PAS returned to borrowers; totalBorrowed → 0 <br> **Obs. Before:** N/A <br> **Obs. After:** N/A | PASS | `0xbffcc1454aeb46881b92a6178f2dea4b42000660a1f7d4a7aa26cc909fc23f13` |
| 5 | ADMIN | Bulk-withdraw 1 depositor(s) from KredioPASMarket | - | **Exp:** PM depositBalances zeroed; mUSDC returned <br> **Obs. Before:** N/A <br> **Obs. After:** N/A | FAIL | execution reverted: "insufficient" |
| 6 | ADMIN | Hard-reset KredioPASMarket | - | **Exp:** PM totalDeposited=0, totalBorrowed=0, accYieldPerShare=0 <br> **Obs. Before:** N/A <br> **Obs. After:** N/A | PASS | `0x13b1e63289738f496e31c4a4bed50a067b4924aea4f03669408c499e196e0ed6` |
| 7 | ADMIN | Reset credit scores for all known addresses (KredioPASMarket) | - | **Exp:** PM credit scores cleared <br> **Obs. Before:** N/A <br> **Obs. After:** N/A | PASS | `0x9362e57c3c2d913f7046e4f5728a39ab4f751889033cd162295115fa7df74953` |
| 8 | ADMIN | Set yield pool rate to 100 000 bps (1 000% APY) | - | **Exp:** yieldRateBps = 100 000; yield accrues rapidly for demo <br> **Obs. Before:** N/A <br> **Obs. After:** N/A | PASS | `0xd67cc16da1afa0ed26c7683d03720beef2d63fceb3d4d2d5c983d216f60f8c5b` |
| 9 | ADMIN | Set KredioLending globalTick = 86400 (1 s = 1 day interest) | tickMultiplier=86400 | **Exp:** globalTick = 86400 <br> **Obs. Before:** N/A <br> **Obs. After:** N/A | FAIL | could not coalesce error |
| 10 | ADMIN | Set KredioPASMarket globalTick = 86400 | tickMultiplier=86400 | **Exp:** globalTick = 86400 <br> **Obs. Before:** N/A <br> **Obs. After:** N/A | PASS | `0x67fe784fa2ccd7bb8356b202331f1aaf60db6545aacc8ae5d5d2a101cbdf3c05` |
| 11 | ADMIN | Wire MockYieldPool to KredioLending | - | **Exp:** yieldPool set; lending can now invest/pull/claim <br> **Obs. Before:** N/A <br> **Obs. After:** N/A | PASS | `0x9ccf23dcc7905c61f2cb4465885e8c504e916f7f6c95a7e2a901eb67ba894120` |
| 12 | ADMIN | Set KredioPASMarket risk params (stalenessLimit=86400, others unchanged) | - | **Exp:** stalenessLimit = 86400 s (24 h); ltvBps=6500, liqBonusBps=800, protocolFeeBps=1000 <br> **Obs. Before:** N/A <br> **Obs. After:** N/A | PASS | `0x37c778a9bd6a1dd352ded16906b172885cd214f71a8c7971210b01fbb45a9f57` |
| 13 | ADMIN | Refresh oracle price to 601680000 (reset updatedAt) | - | **Exp:** oracle.updatedAt = now; staleness check will pass for 86400 s <br> **Obs. Before:** N/A <br> **Obs. After:** N/A | PASS | `0x0abc1f9ff608d547074184bbd6280dece7ae78e8195175555b55c865cbd1271d` |
| 14 | ADMIN | Approve MaxUint256 mUSDC to KredioLending | - | **Exp:** Admin can deposit + fundReserve without re-approving <br> **Obs. Before:** N/A <br> **Obs. After:** N/A | PASS | `0x4b60fb76bd88f548a85baa5cfb9763e25445129801b297e6d23d6920b9b7bd01` |
| 15 | ADMIN | Approve MaxUint256 mUSDC to KredioPASMarket | - | **Exp:** Admin can deposit + liquidate without re-approving <br> **Obs. Before:** N/A <br> **Obs. After:** N/A | PASS | `0x300395a839a8f42b4d934e24d703879c9bc5c81d63442c6c155df17170fa34bd` |
| 16 | ADMIN | Deposit 500 000 mUSDC into KredioLending (admin liquidity base) | - | **Exp:** KredioLending.totalDeposited = 500 000; admin is a lender <br> **Obs. Before:** N/A <br> **Obs. After:** N/A | PASS | `0x977c4849ed8ebe170781cd515727ce64f30e77c573be8c47944ce2c517c96b70` |
| 17 | ADMIN | Deposit 300 000 mUSDC into KredioPASMarket (admin liquidity base) | - | **Exp:** KredioPASMarket.totalDeposited = 300 000 <br> **Obs. Before:** N/A <br> **Obs. After:** N/A | PASS | `0xcedf77ca068c759c115fd3b02ba88286373ae26c35898481e66f033662bf20f6` |
| 18 | USER1 | Approve 50 000 mUSDC to KredioLending | MAX or exact amount | **Exp:** Allowance set <br> **Obs. Before:** N/A <br> **Obs. After:** N/A | PASS | `0x8a57f679140759f00feb33eb006a31f370ce50a9a160a23bedcbf8b1746f41cb` |
| 19 | USER1 | Deposit 50 000 mUSDC into KredioLending | - | **Exp:** depositBalance[USER1] += 50 000; KredioLending.totalDeposited += 50 000 <br> **Obs. Before:** {depositBalance:0,totalDeposited:500000000000} <br> **Obs. After:** N/A | FAIL | transaction execution reverted |
| 20 | USER3 | Approve 80 000 mUSDC to KredioPASMarket | MAX or exact amount | **Exp:** Allowance set <br> **Obs. Before:** N/A <br> **Obs. After:** N/A | PASS | `0xab935e58460cfd6e29f7fe7793db7948a0a947bed1d35520562ad9e10fdc0c1d` |
| 21 | USER3 | Deposit 80 000 mUSDC into KredioPASMarket | - | **Exp:** PM depositBalance[USER3] += 80 000; PM totalDeposited += 80 000 <br> **Obs. Before:** {depositBalance:0,totalDeposited:300000000000} <br> **Obs. After:** {depositBalance:150000000000,totalDeposited:450000000000} | PASS | `0x8e0021f13240daf4dcd1826334173e685c8244202d67def08cd46646eb857282` |
| 22 | USER2 | Approve 20 000 mUSDC to KredioLending (collateral) | MAX or exact amount | **Exp:** Allowance set <br> **Obs. Before:** N/A <br> **Obs. After:** N/A | PASS | `0xd4bd84a30400d07d8c73344c6cf43e9c888aafa4fdfc8f05151ccbed2bfabe3e` |
| 23 | USER2 | Deposit 20 000 mUSDC as USDC collateral into KredioLending | - | **Exp:** collateralBalance[USER2] += 20 000 <br> **Obs. Before:** {collateralBalance:0} <br> **Obs. After:** {collateralBalance:100000000000} | PASS | `0x1ab93d5c0bbc57325c7c773a5ae3a72c4fdd634477e217d70eaa4c5ba4421af0` |
| 24 | USER2 | Borrow 50,000.00 mUSDC from KredioLending (credit-score gated) | borrowAmount=50,000.00 | **Exp:** Position opened: debt=50,000.00, collateral=100 000; totalBorrowed += 50,000.00 <br> **Obs. Before:** {totalBorrowed:0,mUSDCBal:489969655452} <br> **Obs. After:** {totalBorrowed:50000000000,mUSDCBal:539969655452} | PASS | `0x3a72fe1f499008e696a4904583735db6305978cb6c9c1c1a578dfebdbbce377b` |
| 25 | USER4 | depositCollateral - lock 300 PAS in KredioPASMarket | - | **Exp:** collateralBalance[USER4] += 300 PAS (wei) <br> **Obs. Before:** {collateralBalance:0} <br> **Obs. After:** {collateralBalance:800000000000000000000} | PASS | `0x55b9b6f0c3991a0853e1b89e10257e004552f5a0c872c815048b614d99c3bcab` |
| 26 | USER4 | Borrow 2,190.1152 mUSDC from KredioPASMarket (PAS-collateral gated) | - | **Exp:** Position opened; USER4 receives 2,190.1152 mUSDC; PM totalBorrowed += 2,190.1152 <br> **Obs. Before:** {totalBorrowed:0,mUSDCBal:399982778107} <br> **Obs. After:** {totalBorrowed:2190115200,mUSDCBal:402172893307} | PASS | `0x35b05da2e3136ae76c8a551ea1746baca71b41b9a8308ad2f84a8a5633e58db9` |
| 27 | USER5 | depositCollateral - lock 400 PAS in KredioPASMarket | - | **Exp:** collateralBalance[USER5] += 400 PAS <br> **Obs. Before:** {collateralBalance:0} <br> **Obs. After:** {collateralBalance:900000000000000000000} | PASS | `0x216dd7185208da94ad3ffaa2c814077935de9f86d12c009721d32074df8d09d2` |
| 28 | USER5 | Borrow 3,343.8366 mUSDC at 95% LTV (near liquidation) | - | **Exp:** Position opened at 95% LTV; interest accrual will breach health threshold <br> **Obs. Before:** {totalBorrowed:2190115200} <br> **Obs. After:** N/A | FAIL | execution reverted: "exceeds LTV" |
| 29 | ADMIN | adminTickPool for USER2 in KredioLending | - | **Exp:** USER2 interest capitalised into debt; accYieldPerShare++ for all lenders <br> **Obs. Before:** {accruedInterest:1808219178,pendingUser1:0} <br> **Obs. After:** {debtFull:[\100000000000\,\52169863013\,\0\,\52169863013\,\2200\,\0\,true],pendingUser1:0} | PASS | `0x9a5c7bcdf24742c276828033241a1fa6d1f3fb89b8259180d68030c40ebc7296` |
| 30 | ADMIN | adminTickPool for USER4 + USER5 in KredioPASMarket | - | **Exp:** USER4/USER5 interest capitalised; accYieldPerShare++ for PM lenders <br> **Obs. Before:** {u3Pending:0} <br> **Obs. After:** {u3Pending:23761249,adminPending:161576499} | PASS | `0x154141c571685ba2453a4c37b6e12f9c14e20031f1b828d65fa166368e363016` |
| 31 | ADMIN | adminClaimAndInjectYield - mint 14.2694 mUSDC yield → distribute to lenders | - | **Exp:** MockYieldPool mints fresh mUSDC to KredioLending; accYieldPerShare增加; USER1+ADMIN earn pro-rata yield <br> **Obs. Before:** {pendingUser1:0,pendingAdmin:1955445205,totalEarned:14083357327} <br> **Obs. After:** {pendingUser1:0,pendingAdmin:1969143835} | PASS | `0x8cf282e98655cdd85ce2fae3a2e55b5b31b44b41ef409d235555cd9f00b0c064` |
| 32 | USER1 | Harvest 0.00 mUSDC yield from KredioLending | harvestAmount=0.00 | **Exp:** USER1.mUSDC += 0.00; pendingYield[USER1] → 0 <br> **Obs. Before:** {mUSDCBal:1271145269480,pendingYield:0} <br> **Obs. After:** {mUSDCBal:1271145269480,pendingYield:0} | PASS | `0xb353104f900a48f042ccadef2a705131c37ef7083643ea65e747b3d6da79f3dd` |
| 33 | USER3 | Harvest 23.7612 mUSDC yield from KredioPASMarket | harvestAmount=23.7612 | **Exp:** USER3.mUSDC += 23.7612; pendingYield[USER3] → 0 <br> **Obs. Before:** {mUSDCBal:6374979646563,pendingYield:23761249} <br> **Obs. After:** {mUSDCBal:6375003407812,pendingYield:0} | PASS | `0x3917e2a1680cfda01fc83de259ad313a3ced3e70bc524579a8e7d571a45e359d` |
| 34 | USER2 | Approve 59,389.2886 mUSDC to KredioLending for repayment | - | **Exp:** Allowance ≥ totalOwed <br> **Obs. Before:** N/A <br> **Obs. After:** N/A | PASS | `0x2a907e1610a20b6ec82c28884314287047b5c9df507d949144564d72a3ce4d1a` |
| 35 | USER2 | repay() - pay 59,339.2886 mUSDC (principal + interest) | principal=52,169.863, interest=7,169.4256 | **Exp:** Position deleted; collateral 100 000 mUSDC returned to USER2; interest distributed to lenders; repaymentCount[USER2]++ <br> **Obs. Before:** {active:true,totalBorrowed:52169863013,mUSDCBal:539969655452} <br> **Obs. After:** N/A | FAIL | execution reverted: "not approved" |
| 36 | USER4 | Approve 2,614.7661 mUSDC to KredioPASMarket | MAX or exact amount | **Exp:** Allowance set <br> **Obs. Before:** N/A <br> **Obs. After:** N/A | PASS | `0x433b80beca1a5d643a2de2d2c670142cef0a7b6d072e6e539e44685d9ed195b7` |
| 37 | USER4 | repay() - pay 2,564.7661 mUSDC (principal + interest) | principal=2,269.3194, interest=295.4467 | **Exp:** Position inactive; totalBorrowed decreases; interest to PM lenders; repaymentCount[USER4]++ <br> **Obs. Before:** {totalBorrowed:2269319366,mUSDCBal:402172893307} <br> **Obs. After:** {totalBorrowed:0,mUSDCBal:399575299798} | PASS | `0x3913fdc4fd2e05f35905dfeb1168547ea0abb8db1426461ebe85e177b56337fe` |
| 38 | USER4 | withdrawCollateral() - retrieve 300 PAS from KredioPASMarket | - | **Exp:** USER4 receives 300 PAS; collateralBalance[USER4] → 0 <br> **Obs. Before:** {pasBal:299822225875900000000} <br> **Obs. After:** {pasBal:1099841263443500000000} | PASS | `0xc64b73f8270cd6d9b97315263edb069f57d8800d691697b0899275b35df98977` |
| 39 | USER3 | withdraw(150,000.00) - full withdrawal from KredioPASMarket | - | **Exp:** USER3 gets deposit back; PM totalDeposited decreases <br> **Obs. Before:** {depositBalance:150000000000,user3USDC:6375003407812} <br> **Obs. After:** {depositBalance:0,user3USDC:6525101890055} | PASS | `0x761f186df18a3b37035045612e4db2267b014bc709833289b3871bd374a7cc7f` |

## Post-Test Snapshots
### KredioLending (Final)
- Total Deposited: 500,000.00 mUSDC
- Total Borrowed: 52,169.863 mUSDC
- Protocol Fees: 219.4597 mUSDC

### Mock Yield Pool (Final)
- Total Principal: 494,995.7808 mUSDC
- Pending Yield: 9.5129 mUSDC
