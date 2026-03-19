# Failed Transaction Diagnostics

- Generated At: 2026-03-19T21:56:31.819Z
- Source Report: /Users/18abhinav07/Documents/Kredio/backend/test-report.json
- RPC: https://eth-rpc-testnet.polkadot.io/
- Chain ID: 420420417
- Failed Steps Analyzed: 3
- Expected Failures Ignored: 1

> Note: Similar use-case checks run against current chain state. reportObservedBefore/reportObservedAfter fields capture original run-time snapshots from the source report.

- Similar Execution Trials: enabled (2 attempts per failed step)

## Summary

- Step 14 (PHASE 2) Seed Lending with 700000 mUSDC: Likely dropped/replaced pending tx (not available in node now). | recurrence=consistently_failing, successRate=0% (0/2)
- Step 20 (PHASE 3) Invest idle 350,000.00 mUSDC into strategy: Liquidity constraint revert: requested invest exceeded max investable (~0 mUSDC) at check time. | recurrence=consistently_failing, successRate=0% (0/2)
- Step 36 (PHASE 3) Crash oracle price to 52320000 for liquidation test: Likely dropped/replaced pending tx (not available in node now). | recurrence=consistently_failing, successRate=0% (0/2)

## Detailed Analysis

### Step 14: Seed Lending with 700000 mUSDC

- Contract: KredioLending
- Actor: ADMIN
- Status In Report: FAIL
- Reported Error: tx 0x59efe4168d9ba9c49790895fe302fcc92d447a5fb1ebdb0dea119ff8d23399bc not mined within 180s
- Tx Hash: 0x59efe4168d9ba9c49790895fe302fcc92d447a5fb1ebdb0dea119ff8d23399bc
- Root Cause: Likely dropped/replaced pending tx (not available in node now).

| Execution Trial Metric | Value |
|---|---|
| Recurrence | consistently_failing |
| Attempts | 2 |
| Success Count | 0 |
| Failure Count | 2 |
| Success Rate | 0% |

#### Live Similar Execution Attempts

| Attempt | OK | Tx Hash | Error | Duration ms |
|---:|---:|---|---|---:|
| 1 | no | - | waitForReceiptWithTimeout is not defined | 1754 |
| 2 | no | - | could not coalesce error | 1871 |

| Check | Value |
|---|---|
| Tx found in node | false |
| Receipt found | false |
| Network reason hint | Tx hash not found now: likely dropped from mempool, replaced, or node no longer retains pending tx. |
| Use-case category | similar-usecase/timeout-or-sendability |

#### Similar Use-Case Checks

| Check | OK | Gas | Error |
|---|---:|---:|---|
| estimateGas deposit(requested) | yes | 106755 | - |
| staticCall deposit(requested) | yes | - | - |
| estimateGas deposit(1 mUSDC) | yes | 106755 | - |
| staticCall deposit(1 mUSDC) | yes | - | - |

#### Snapshot Data

```json
{
  "reportObservedBefore": null,
  "reportObservedAfter": null,
  "adminMusdc": "2807872247296",
  "adminMusdcFmt": "2,807,872.247296",
  "allowanceToLending": "115792089237316195423570985008687907853269984665640564039457584007913129639935",
  "allowanceToLendingFmt": "115,792,089,237,316,200,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000",
  "requestedAmount": "700000000000",
  "requestedAmountFmt": "700,000"
}
```

### Step 20: Invest idle 350,000.00 mUSDC into strategy

- Contract: KredioLending
- Actor: ADMIN
- Status In Report: FAIL
- Reported Error: execution reverted: "not enough liquid capital"
- Tx Hash: -
- Root Cause: Liquidity constraint revert: requested invest exceeded max investable (~0 mUSDC) at check time.

| Execution Trial Metric | Value |
|---|---|
| Recurrence | consistently_failing |
| Attempts | 2 |
| Success Count | 0 |
| Failure Count | 2 |
| Success Rate | 0% |

#### Live Similar Execution Attempts

| Attempt | OK | Tx Hash | Error | Duration ms |
|---:|---:|---|---|---:|
| 1 | no | - | execution reverted: "not enough liquid capital" | 618 |
| 2 | no | - | execution reverted: "would breach min buffer" | 543 |

| Check | Value |
|---|---|
| Tx found in node | undefined |
| Receipt found | undefined |
| Network reason hint | - |
| Use-case category | similar-usecase/liquidity-constraint |

#### Similar Use-Case Checks

| Check | OK | Gas | Error |
|---|---:|---:|---|
| estimateGas adminInvest(requested) | no | - | execution reverted: "not enough liquid capital" |
| staticCall adminInvest(requested) | no | - | execution reverted: "not enough liquid capital" |
| staticCall adminInvest(maxInvestable) | no | - | execution reverted: "zero amt" |
| staticCall adminInvest(maxInvestable + 1) | no | - | execution reverted: "not enough liquid capital" |

#### Snapshot Data

```json
{
  "reportObservedBefore": {
    "investedAmount": "60000000000",
    "strategyPending": "0"
  },
  "reportObservedAfter": null,
  "totalDeposited": "0",
  "totalDepositedFmt": "0",
  "totalBorrowed": "0",
  "totalBorrowedFmt": "0",
  "investedAmount": "0",
  "investedAmountFmt": "0",
  "pendingStrategyYield": "1198630",
  "pendingStrategyYieldFmt": "1.19863",
  "lendingMusdcBalance": "0",
  "lendingMusdcBalanceFmt": "0",
  "strategyInvestRatio": "5000",
  "strategyMinBuffer": "2000",
  "requestedAmount": "350000000000",
  "requestedAmountFmt": "350,000",
  "discoveredMaxInvestable": "0",
  "discoveredMaxInvestableFmt": "0",
  "probeResults": [
    {
      "amount": "350000000000",
      "amountFmt": "350,000",
      "ok": false,
      "error": "execution reverted: \"not enough liquid capital\""
    },
    {
      "amount": "1000000000000",
      "amountFmt": "1,000,000",
      "ok": false,
      "error": "execution reverted: \"not enough liquid capital\""
    },
    {
      "amount": "750000000000",
      "amountFmt": "750,000",
      "ok": false,
      "error": "execution reverted: \"not enough liquid capital\""
    },
    {
      "amount": "500000000000",
      "amountFmt": "500,000",
      "ok": false,
      "error": "execution reverted: \"not enough liquid capital\""
    },
    {
      "amount": "333333333333",
      "amountFmt": "333,333.333333",
      "ok": false,
      "error": "execution reverted: \"not enough liquid capital\""
    },
    {
      "amount": "250000000000",
      "amountFmt": "250,000",
      "ok": false,
      "error": "execution reverted: \"not enough liquid capital\""
    },
    {
      "amount": "125000000000",
      "amountFmt": "125,000",
      "ok": false,
      "error": "execution reverted: \"not enough liquid capital\""
    },
    {
      "amount": "62500000000",
      "amountFmt": "62,500",
      "ok": false,
      "error": "execution reverted: \"not enough liquid capital\""
    },
    {
      "amount": "1000000000",
      "amountFmt": "1,000",
      "ok": false,
      "error": "execution reverted: \"not enough liquid capital\""
    },
    {
      "amount": "100000000",
      "amountFmt": "100",
      "ok": false,
      "error": "execution reverted: \"not enough liquid capital\""
    },
    {
      "amount": "1000000",
      "amountFmt": "1",
      "ok": false,
      "error": "execution reverted: \"not enough liquid capital\""
    }
  ]
}
```

### Step 36: Crash oracle price to 52320000 for liquidation test

- Contract: MockPASOracle
- Actor: ADMIN
- Status In Report: FAIL
- Reported Error: tx 0x67ddbb282b71defd32c4d4e81e2ed5d51c6b47f7cade4eecf48de3ff83eac0cb not mined within 180s
- Tx Hash: 0x67ddbb282b71defd32c4d4e81e2ed5d51c6b47f7cade4eecf48de3ff83eac0cb
- Root Cause: Likely dropped/replaced pending tx (not available in node now).

| Execution Trial Metric | Value |
|---|---|
| Recurrence | consistently_failing |
| Attempts | 2 |
| Success Count | 0 |
| Failure Count | 2 |
| Success Rate | 0% |

#### Live Similar Execution Attempts

| Attempt | OK | Tx Hash | Error | Duration ms |
|---:|---:|---|---|---:|
| 1 | no | - | waitForReceiptWithTimeout is not defined | 1938 |
| 2 | no | - | could not coalesce error | 2062 |

| Check | Value |
|---|---|
| Tx found in node | false |
| Receipt found | false |
| Network reason hint | Tx hash not found now: likely dropped from mempool, replaced, or node no longer retains pending tx. |
| Use-case category | similar-usecase/oracle-update-timeout |

#### Similar Use-Case Checks

| Check | OK | Gas | Error |
|---|---:|---:|---|
| estimateGas setPrice(targetCrash) | yes | 1602 | - |
| staticCall setPrice(targetCrash) | yes | - | - |
| staticCall setPrice(currentPrice) | yes | - | - |

#### Snapshot Data

```json
{
  "reportObservedBefore": null,
  "reportObservedAfter": null,
  "currentOraclePrice": "627840000",
  "targetCrashPrice": "52320000",
  "crashedFlag": false
}
```

