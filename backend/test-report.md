# Kredio Product Simulation Report

- Run Date: 2026-03-19T21:44:49.345Z
- Duration: 782.8s
- Chain: 420420417
- RPC: https://eth-rpc-testnet.polkadot.io/
- Steps: 48 | Passed: 45 | Failed: 3

## Scenario Objective

- Convert testing flow into product-style multi-user simulation
- Required user flow enforced: USER1/USER2 deposit, USER3/USER4 borrow+repay, USER1/USER2 harvest+withdraw
- Intelligent yield exercised under stressed liquidity and validated via depositor pending-yield progression
- Oracle crash simulation executed and liquidation verified
- Expected failures classified separately from true failures

## Initial Targets

| Metric | Target |
|---|---:|
| User mUSDC funding floor | 200,000 |
| User PAS funding floor | 500 |

## Contract Addresses

| Contract | Address |
|---|---|
| MUSDC | 0x5998cE005b4f3923c988Ae31940fAa1DEAC0c646 |
| LENDING | 0x61c6b46f5094f2867Dce66497391d0fd41796CEa |
| PAS_MARKET | 0x5617dBa1b13155fD6fD62f82ef6D9e8F0F3B0E86 |
| YIELD_POOL | 0x1dB4Faad3081aAfe26eC0ef6886F04f28D944AAB |
| ORACLE | 0x1494432a8Af6fa8c03C0d7DD7720E298D85C55c7 |

## Step-by-Step Execution

| # | Phase | Actor | Contract | Action | Expected | Status | Tx Hash | Gas | Notes |
|---:|---|---|---|---|---|---|---|---:|---|
| 1 | PHASE 1 | ADMIN | KredioLending | Reset globalTick=0 on Lending | Lending tick reset | PASS | `0x2226ecce6d33ed628dcc43f4e2851880333daf96e006f73a484be83c4ffd3881` | 0 | - |
| 2 | PHASE 1 | ADMIN | KredioPASMarket | Reset globalTick=0 on PASMarket | PASMarket tick reset | PASS | `0xc38a8d905241bcac4e7e88374d6e21b10980714b6fffb2a5e2bfcced8ab12171` | 0 | - |
| 3 | PHASE 1 | ADMIN | KredioLending | adminCleanContract on Lending (7 users) | Lending clean state | PASS | `0x22624efc0c3bea41c00af2f9897f6b354e350e0e94a61a12d6e431e457ac5847` | 0 | - |
| 4 | PHASE 1 | ADMIN | KredioPASMarket | adminCleanContract on PASMarket (7 users) | PAS clean state | PASS | `0x0ae4f314686278c60d3ae31ebf8023cf3ff1795ce7395a0cd4f36df89024109a` | 0 | - |
| 5 | PHASE 1 | ADMIN | READ_ONLY_CHECK | Verify clean deposits are zero | Both market totalDeposited should be zero after clean | PASS | - | - | Both markets clean |
| 6 | PHASE 2 | ADMIN | KredioLending | Set lending tick multiplier = 86400 | 1 second -> 1 day interest simulation | PASS | `0xcccb676d810d385b18ff6fbd8f2e9587ef847257f8ff110a74533f829e2e3745` | 21820 | - |
| 7 | PHASE 2 | ADMIN | KredioPASMarket | Set PAS market tick multiplier = 86400 | 1 second -> 1 day interest simulation | PASS | `0xbe4aff3bf1a020b923f6d88f16c48bb18766eed6c91b063cca4e9eb8e30dc5aa` | 21820 | - |
| 8 | PHASE 2 | ADMIN | KredioLending | Wire yield pool to lending | Lending strategyStatus.pool points to deployed yield pool | PASS | `0xb9bb04f6cfdd23737ea8fd657c6d3cbe44d4fa097c7c3c8ed565d5f8efa4c98d` | 1271 | - |
| 9 | PHASE 2 | ADMIN | KredioPASMarket | Set PAS risk params (ltv=6500, bonus=800, stale=86400, fee=1000) | Stable testing risk profile | PASS | `0xae9cb9fef9a8a477395db65a8aa6abc79adc04abe071daaed9b359f328ba3b2d` | 1940 | - |
| 10 | PHASE 2 | ADMIN | MockYieldPool | Set yield pool rate to 100000 bps | Fast visible external yield accrual | PASS | `0xfcbbe934d16d5c4fc9cdc8d80e70f26b309cf65555f2b4b76ed2915ba1754928` | 1180 | - |
| 11 | PHASE 2 | ADMIN | MockPASOracle | Refresh oracle with normal price 627840000 | Fresh normal oracle baseline before borrow simulation | PASS | `0x4bc947a3870555b5d3532e13968b6c3852f00a39990cb43194ec0c1ee96971a4` | 1543 | - |
| 12 | PHASE 2 | ADMIN | MockUSDC | Approve max mUSDC -> Lending | Admin can seed liquidity and support strategy ops | PASS | `0x0548724c734989bdfe090ca26f272faf8c35fab064ed8d2f24b8ceb0f109ab06` | 1256 | - |
| 13 | PHASE 2 | ADMIN | MockUSDC | Approve max mUSDC -> PASMarket | Admin can seed PAS market + liquidations | PASS | `0xfa0ef1d8c38a5aa20b6dcb5371aa2e6c5d8d5c5b1ec51091016b355789aebd7e` | 1256 | - |
| 14 | PHASE 2 | ADMIN | KredioLending | Seed Lending with 700000 mUSDC | Initial deep liquidity for simulation | FAIL | `0x59efe4168d9ba9c49790895fe302fcc92d447a5fb1ebdb0dea119ff8d23399bc` | - | tx 0x59efe4168d9ba9c49790895fe302fcc92d447a5fb1ebdb0dea119ff8d23399bc not mined within 180s |
| 15 | PHASE 2 | ADMIN | KredioPASMarket | Seed PASMarket with 350000 mUSDC | Initial PAS market liquidity | PASS | `0xb2ed118fa9c0255d4c5c2e92ffad23f8b3443d18a336df2d3ba7ee8450eaebfa` | 106792 | - |
| 16 | PHASE 3 | USER1 | MockUSDC | Approve 120,000.00 mUSDC to Lending | USER1 allowance set | PASS | `0x2a05e4a871c5ce49b0f59be8e62bd94a0313b76c5e756d1a8b0dc6b61c743a7f` | 21885 | - |
| 17 | PHASE 3 | USER1 | KredioLending | Deposit 120,000.00 mUSDC to Lending | USER1 becomes depositor | PASS | `0xa0f3b0874734dfed4e55a64415b5c400a9926924e3fb069708723916132ca774` | 65411 | - |
| 18 | PHASE 3 | USER2 | MockUSDC | Approve 90,000.00 mUSDC to Lending | USER2 allowance set | PASS | `0x8f490b6603b7ed17fd329db6b8ec152e6ef6dccb6808a46f2828a7c5497b07f0` | 21885 | - |
| 19 | PHASE 3 | USER2 | KredioLending | Deposit 90,000.00 mUSDC to Lending | USER2 becomes depositor | PASS | `0x7a201aa5e9ae11fddc34fe0b509153f94deff90217414f981a684844a3013f61` | 44766 | - |
| 20 | PHASE 3 | ADMIN | KredioLending | Invest idle 350,000.00 mUSDC into strategy | investedAmount increases and strategy accrues yield | FAIL | - | - | execution reverted: "not enough liquid capital" |
| 21 | PHASE 3 | ADMIN | READ_ONLY_CHECK | Check strategy pending yield > 0 after invest | Strategy pending yield should increase after invest + time | PASS | - | - | pendingStrategyYield=0.2283 mUSDC |
| 22 | PHASE 3 | USER3 | MockUSDC | Approve 70,000.00 mUSDC collateral to Lending | USER3 collateral allowance ready | PASS | `0x30870fbe31a54bdbf4e53758649fb6a181f3cab9c7801bb5faeb374e62b72d87` | 1256 | - |
| 23 | PHASE 3 | USER3 | KredioLending | Deposit 70,000.00 mUSDC collateral to Lending | USER3 collateral set for borrowing | PASS | `0x7520266c3213eabf44c0926c4bd044fb961f94cf7531799b481a8b2c522e5b52` | 2318 | - |
| 24 | PHASE 3 | USER3 | KredioLending | Borrow 35,000.00 mUSDC from Lending | USER3 debt opens and pool utilization increases | PASS | `0x140998c99d761c85cce3551197b8a660d95ceeebb6d3078fb72528c722149215` | 87142 | - |
| 25 | PHASE 3 | ADMIN | KredioLending | Tick Lending pool for USER3 debt capitalization | Borrow interest converted into lender yield | PASS | `0xe65d539265f24efc21c02ac58d9a401eb5211731433fba42928db6e40d3d9a65` | 23871 | - |
| 26 | PHASE 3 | USER3 | MockUSDC | Approve 36,506.3014 mUSDC for Lending repay | Repay allowance set | PASS | `0x5b9d3636cd42e2a7a791d553f1bb90a9e7677ec8e028804c7d0ab99e10bf2ac8` | 21895 | - |
| 27 | PHASE 3 | USER3 | KredioLending | Repay Lending debt (owed 35,506.3014 mUSDC) | USER3 lending debt closed and collateral returned | PASS | `0x9ca4a90ebe9c949d6171163c6953da06caeef8917eedc144da66124135a1920b` | 0 | USER3 active=false |
| 28 | PHASE 3 | USER4 | KredioPASMarket | Deposit 40 PAS collateral into PASMarket | USER4 PAS collateral active | PASS | `0xb7da1b095b6f59a18ef4f3ee2dfc281c40884b6d69fb8f6b6a03812f8f4512ed` | 22057 | - |
| 29 | PHASE 3 | USER4 | KredioPASMarket | Borrow 114.2669 mUSDC from PASMarket | USER4 PAS debt opens | PASS | `0xcfc22f146d87c5fe3630b146d7d197f48021e6f01db0c5ce5d79f5587e4a4821` | 108093 | - |
| 30 | PHASE 3 | ADMIN | KredioPASMarket | Tick PASMarket for USER4 debt capitalization | PAS debt interest capitalized | PASS | `0x0a6efb2a1027f60cfbbb78a1ea79edae36fc940ea5fadd9d8309ce6829a8610b` | 44692 | - |
| 31 | PHASE 3 | USER4 | MockUSDC | Approve 315.0934 mUSDC for PAS repay | Repay allowance set | PASS | `0xc06cf36291fac744bb479663eba5f55cff40a11e5b7dc8a2de23585967cab927` | 1246 | - |
| 32 | PHASE 3 | USER4 | KredioPASMarket | Repay PAS debt (owed 115.0934 mUSDC) | USER4 PAS position closed after repayment | PASS | `0x0918dc65803187e002167cfb5f771510dc5e7f4a07c7ecb1731a59fccd0e2143` | 0 | USER4 active=false |
| 33 | PHASE 3 | USER4 | KredioPASMarket | Withdraw PAS collateral after full repay | Collateral withdrawal succeeds after debt close | PASS | `0x1e7a2df3a272b912f05ed3c6a94a03213653ccb8435d52ff091b81459e9f7a1f` | 0 | - |
| 34 | PHASE 3 | USER4 | KredioPASMarket | Deposit 30 PAS collateral for high-risk position | Risky collateral position opened | PASS | `0xee9f4f808d6a2b9a0bce8614d7cf772b18a4a6cd9225d2999937c5a29e52a865` | 22057 | - |
| 35 | PHASE 3 | USER4 | KredioPASMarket | Borrow 113.8588 mUSDC at high LTV | Position vulnerable to oracle downside move | PASS | `0x14254747c182b5bfa84ffaabc92529933b9c5043015a26be392776715957d66e` | 108093 | - |
| 36 | PHASE 3 | ADMIN | MockPASOracle | Crash oracle price to 52320000 for liquidation test | Collateral value drops sharply, risky position becomes liquidatable | FAIL | `0x67ddbb282b71defd32c4d4e81e2ed5d51c6b47f7cade4eecf48de3ff83eac0cb` | - | tx 0x67ddbb282b71defd32c4d4e81e2ed5d51c6b47f7cade4eecf48de3ff83eac0cb not mined within 180s |
| 37 | PHASE 3 | ADMIN | KredioPASMarket | Liquidate USER4 risky PAS position | Liquidation succeeds and closes USER4 risky PAS debt | PASS | `0x3ba2f54c4bda6b79e88a010661af38d593627cb9a1d642cdc820e005ebcb6113` | 0 | USER4 active=false |
| 38 | PHASE 3 | USER4 | KredioPASMarket | Expected failure: withdrawCollateral after liquidation | No collateral left to withdraw after liquidation | EXPECTED_FAIL | - | - | execution reverted: "no collateral" |
| 39 | PHASE 3 | ADMIN | MockPASOracle | Recover oracle to normal price 627840000 | Restore normal pricing after crash simulation | PASS | `0xbf91ff5189ca1e1021feec41c3ba691b279f98fe633c1514234339ace8377f18` | 1543 | - |
| 40 | PHASE 3 | ADMIN | KredioLending | Claim strategy yield and inject to lending pool | External strategy yield distributed to lenders | PASS | `0xef103c2730edbcd8e90502e579d7a40c39c448c70e8ab2ade36b6e959227ba8a` | 0 | U1 pending: 392.4587 -> 397.2728, U2 pending: 294.344 -> 297.9546 |
| 41 | PHASE 3 | USER1 | KredioLending | Harvest Lending yield (397.2728 mUSDC pending) | USER1 pending yield becomes near zero | PASS | `0x97652f94d792c81a175b8b5fea4085d37049fb1a104f52ecfb4c85dabd7ed045` | 23039 | remaining pending=0.00 mUSDC |
| 42 | PHASE 3 | USER2 | KredioLending | Harvest Lending yield (297.9546 mUSDC pending) | USER2 pending yield becomes near zero | PASS | `0xf92d279126bd6f47c37339c8fe87c276e30a44dbd498513f24726a801831fc73` | 23039 | remaining pending=0.00 mUSDC |
| 43 | PHASE 3 | USER1 | KredioLending | Withdraw full lending deposit (120,000.00 mUSDC) | USER1 principal withdrawn | PASS | `0x7ce8cbe8c0b9ca1ac9071692502acf26ed37dcbbba7262ffb3b1d02b0f8fb2b9` | 0 | remaining deposit=0.00 mUSDC |
| 44 | PHASE 3 | USER2 | KredioLending | Withdraw full lending deposit (90,000.00 mUSDC) | USER2 principal withdrawn | PASS | `0x8fd3e12af59dac7cb94c2cf9b6de1fd70a1d1f8ae91d85ffd88810eeaa9e9d15` | 0 | remaining deposit=0.00 mUSDC |
| 45 | PHASE 4 | ADMIN | KredioLending | Set lending tick back to 0 | Disable accelerated interest after simulation | PASS | `0x0a2b30b8c5e30f2910a62aeee8da7a05879035ddca134b5a944b8dda78fcbf9c` | 0 | - |
| 46 | PHASE 4 | ADMIN | KredioPASMarket | Set PAS market tick back to 0 | Disable accelerated interest after simulation | PASS | `0x9c273eb992e19c744a4602801d01b53b932ba85a557c24acad5e643eb42776d0` | 0 | - |
| 47 | PHASE 4 | ADMIN | KredioLending | Post-clean Lending (7 users) | Fresh lending state for next run | PASS | `0xa8973fc53680b10fb2b179fa17ac18f5abcd70a2e3b1578f12de0c5c28e9773e` | 0 | - |
| 48 | PHASE 4 | ADMIN | KredioPASMarket | Post-clean PASMarket (7 users) | Fresh PAS market state for next run | PASS | `0x65ff01590f461810ab5210e2cfe0002aece29b7b0dffe6bf567b751711789d51` | 0 | - |

## Post Simulation Snapshots

### Lending

- totalDeposited: 0.00 mUSDC
- totalBorrowed: 0.00 mUSDC
- investedAmount: 0.00 mUSDC
- protocolFees: 0.00 mUSDC
- utilizationRate: 0.00%

### PAS Market

- totalDeposited: 0.00 mUSDC
- totalBorrowed: 0.00 mUSDC
- protocolFees: 0.00 mUSDC
- utilizationRate: 0.00%

### Yield Pool

- totalPrincipal: 494,995.7808 mUSDC
- pendingForLending: 1.1986 mUSDC
- yieldRateBps: 100000

## Final User Balances

| Account | Address | mUSDC | PAS |
|---|---|---:|---:|
| ADMIN | 0xe37a8983570B39F305fe93D565A29F89366f3fFe | 2,807,872.2473 | 16,018.4712 |
| USER1 | 0x5EF0a87f578778Fc78cbFe318D3444D71Ff638da | 1,283,052.7335 | 1,999.5137 |
| USER2 | 0x8fb792EdBbA0A3b4e83Fffe790a8F080FD9C46CE | 526,680.38 | 1,099.535 |
| USER3 | 0x7B8428750F29381Ef4190a0a9F8c294ac123014e | 6,524,558.1212 | 1,097.5181 |
| USER4 | 0x6bA56a179ff0C0E08B60EBe2a3f03141CEacE50F | 398,515.3819 | 1,077.6991 |
| USER5 | 0x105952E94C36916757785C4F7f92DAf5f1cC99ad | 1,037,258.5014 | 1,000.00 |
| USER6 | 0x863930353d628aA250fB98A4Eb2C1bAa649d5617 | 831,987.9142 | 1,999.8654 |

## Failure Classification

- PASS: Action executed and validation passed
- EXPECTED_FAIL: Revert/failure that was intentionally expected
- VERIFY_FAIL: Transaction mined but expected post-state was not reached
- FAIL: Unexpected execution failure
- UNEXPECTED_SUCCESS: Action was expected to fail but succeeded
