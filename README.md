# Kredio

**On-chain credit scoring for DeFi lending on Polkadot.**

Kredio is a DeFi lending protocol that rewards borrowers for their on-chain track record. Every repayment, deposit, and month of history builds a tamper-proof credit score — computed live by a Wasm smart contract, with no off-chain inputs, no identity requirement, and no way to manipulate the result. Higher scores unlock lower collateral requirements and lower interest rates.

Live and verified on **Polkadot Asset Hub Testnet** · Chain ID `420420417`

---

## The Problem

DeFi lending treats every participant identically. A borrower with two years of clean repayment history faces the same terms as someone who just arrived — because the protocol has no memory. There is no mechanism to earn better terms no matter how consistently you behave.

## The Solution

Kredio gives the protocol memory.

A smart contract scores each borrower from their on-chain history alone: repayments, deposit volume, and tenure. The score updates on every borrow, locking the resulting collateral ratio and interest rate into the position. Nothing is self-reported, nothing is captured off-chain, and no admin can alter a borrower's score.

Better behaviour earns materially better terms — automatically and continuously.

---

## Credit Tiers

| Tier | Score | Collateral Ratio | Interest Rate |
|------|-------|-----------------|---------------|
| ANON | 0–14 | 200% | 15% APR |
| BRONZE | 15–29 | 175% | 12% APR |
| SILVER | 30–49 | 150% | 10% APR |
| GOLD | 50–64 | 130% | 8% APR |
| PLATINUM | 65–79 | 120% | 6% APR |
| DIAMOND | 80–100 | 110% | 4% APR |

Reaching DIAMOND means borrowing $1 for every $1.10 locked — compared to $2.00 at ANON. Each tier transition represents real capital efficiency returned to the borrower, earned through consistent on-chain behaviour.

---

## What Polkadot Enables

Three capabilities unique to Polkadot's architecture underpin Kredio's design:

### Hybrid Execution — ink! Wasm + EVM in One Block

`KreditAgent`, the credit scoring engine, is an ink! Wasm contract. The lending markets are Solidity EVM contracts. On Asset Hub, these two execution environments share state and can call each other within the same transaction — via SCALE-encoded cross-VM staticcalls. No other production blockchain supports this. It means the scoring algorithm can be upgraded in-place without redeploying the lending markets, and the scorer can be queried directly by XCM calls from other parachains in the future.

### Cross-Chain Intent Settlement via XCM

`KredioXCMSettler` receives compact-encoded intent payloads from any connected parachain via XCM Transact. A user on Bifrost, Moonbeam, or Acala can open a Kredio position, repay debt, or exit a position entirely — without leaving their wallet or manually bridging assets. The intent executes on Asset Hub in the same block as the XCM call, with full atomicity.

### Substrate Identity Binding

`KredioAccountRegistry` links an EVM address to a Substrate (SR25519) public key on-chain with cryptographic proof. This binding makes a user's broader Polkadot identity — including OpenGov voting history and conviction — available to the lending protocol. Governance participation is a planned input to the credit scoring model in Phase 4.

---

## Protocol Architecture

| Layer | Contract | Role |
|-------|----------|------|
| Credit Scoring | `KreditAgent` (ink!) | Deterministic score 0–100 from on-chain history |
| AI Scoring | `NeuralScorer` (ink! PVM) | Neural cross-validation and confidence estimation |
| Risk Engine | `RiskAssessor` (ink! PVM) | Real-time per-position liquidation risk scoring |
| Allocation | `YieldMind` (ink! PVM) | Optimal idle capital allocation across yield strategies |
| Lending | `KredioLending` | mUSDC collateral lending pool with credit-scored borrowing |
| Collateral | `KredioPASMarket` | Native PAS collateral market, oracle-priced |
| Swap | `KredioSwap` | Instant PAS → mUSDC at oracle price, 0.3% fee |
| Bridge | `EthBridgeInbox` + `KredioBridgeMinter` | ETH on source chain → mUSDC on Asset Hub |
| Cross-chain | `KredioXCMSettler` | Executes XCM Transact intents from any parachain |
| Identity | `KredioAccountRegistry` | SR25519 Substrate key ↔ EVM address binding |
| Governance | `GovernanceCache` | On-chain OpenGov participation cache |
| Price Feed | `PASOracle` | Chainlink-compatible PAS/USD price feed |
| Yield | `YieldPool` | External yield destination for idle lending capital |

---

## Yield Strategy

When lending pool utilisation drops below 40%, idle capital is automatically deployed to the external yield pool by the protocol backend. When borrowing demand returns, it is recalled instantly. Lenders earn additional return without any manual action. `YieldMind` — an on-chain ink! contract — computes the optimal allocation split across conservative, balanced, and aggressive buckets, accounting for pool utilisation, price volatility, and the average borrower credit score.

---

## Deployed Contracts — Paseo Testnet

**Network:** Polkadot Asset Hub Testnet
**RPC:** `https://eth-rpc-testnet.polkadot.io/`
**Explorer:** [blockscout-testnet.polkadot.io](https://blockscout-testnet.polkadot.io)
**Faucet:** [faucet.polkadot.io](https://faucet.polkadot.io/)

| Contract | Address |
|----------|---------|
| KredioLending | [`0x1eDaD1271FB9d1296939C6f4Fb762752b041C64E`](https://blockscout-testnet.polkadot.io/address/0x1eDaD1271FB9d1296939C6f4Fb762752b041C64E) |
| KredioPASMarket | [`0x0F90Fe6141AC29a6031C3ae2155749e9f38a0174`](https://blockscout-testnet.polkadot.io/address/0x0F90Fe6141AC29a6031C3ae2155749e9f38a0174) |
| KredioSwap | [`0xaF1d183F4550500Beb517A3249780290A88E6e39`](https://blockscout-testnet.polkadot.io/address/0xaF1d183F4550500Beb517A3249780290A88E6e39) |
| KredioXCMSettler | [`0xbaaE8f7b97ac387DE8C433A218d63166Ce104Bb1`](https://blockscout-testnet.polkadot.io/address/0xbaaE8f7b97ac387DE8C433A218d63166Ce104Bb1) |
| KredioAccountRegistry | [`0xBf7ac0e6f0024ED0F2Cf2efb3669E7c389258BFf`](https://blockscout-testnet.polkadot.io/address/0xBf7ac0e6f0024ED0F2Cf2efb3669E7c389258BFf) |
| KreditAgent (ink!) | [`0x8c13E6fFDf27bB51304Efff108C9B646d148E5F3`](https://blockscout-testnet.polkadot.io/address/0x8c13E6fFDf27bB51304Efff108C9B646d148E5F3) |
| NeuralScorer (ink! PVM) | [`0xac6bd3ff3447d8d1689dd4f02899ff558f108e0d`](https://blockscout-testnet.polkadot.io/address/0xac6bd3ff3447d8d1689dd4f02899ff558f108e0d) |
| RiskAssessor (ink! PVM) | [`0xdB9E48932E061D95E22370235ac3a35332d289f7`](https://blockscout-testnet.polkadot.io/address/0xdB9E48932E061D95E22370235ac3a35332d289f7) |
| YieldMind (ink! PVM) | [`0x0b68fbfb596846e4f3a23da10365e0888a182ef3`](https://blockscout-testnet.polkadot.io/address/0x0b68fbfb596846e4f3a23da10365e0888a182ef3) |
| PAS/USD Oracle | [`0x1494432a8Af6fa8c03C0d7DD7720E298D85C55c7`](https://blockscout-testnet.polkadot.io/address/0x1494432a8Af6fa8c03C0d7DD7720E298D85C55c7) |
| mUSDC | [`0x5998cE005b4f3923c988Ae31940fAa1DEAC0c646`](https://blockscout-testnet.polkadot.io/address/0x5998cE005b4f3923c988Ae31940fAa1DEAC0c646) |
| GovernanceCache | [`0xe4DE7eadE2c0A65BdA6863Ad7bA22416c77F3e55`](https://blockscout-testnet.polkadot.io/address/0xe4DE7eadE2c0A65BdA6863Ad7bA22416c77F3e55) |
| YieldPool | [`0x1dB4Faad3081aAfe26eC0ef6886F04f28D944AAB`](https://blockscout-testnet.polkadot.io/address/0x1dB4Faad3081aAfe26eC0ef6886F04f28D944AAB) |

---

## Mainnet Vision

On mainnet, each connected parachain adds a distinct dimension to the Kredio network:

- **Bifrost** — vDOT and vKSM as collateral; liquid staking derivatives enter Kredio markets
- **Acala** — aUSD deepens stablecoin liquidity; LDOT adds a collateral type
- **Hydration** — Omnipool as a live yield destination for idle lending capital
- **Interlay** — iBTC and IUSDT bring Bitcoin liquidity to Kredio borrow markets
- **Moonbeam** — large EVM user base accesses Kredio credit without leaving their environment

The long-term goal is portable credit history: a borrower's repayments and tenure on any connected chain aggregate into one score. The history follows the user, not the chain. That is a cross-chain network effect no single-chain protocol can replicate.

---

## Security & Trust Model

| Component | Current state | Mainnet path |
|-----------|--------------|--------------|
| Credit scoring | Fully trustless ink! Wasm contract — no admin override path | No change required |
| Liquidation | Open — any account may liquidate an undercollateralised position | No change required |
| Oracle | Backend-operated price feed | Acurast decentralised oracle computation (Phase 5) |
| Bridge | Trusted relayer key for deposit processing | XCM reserve transfers — no relayer key required (Phase 5) |
| Governance data | Admin-written on-chain cache | Automated Subquery indexer (Phase 4) |

The admin key controls oracle price updates, bridge minting authorisation, and governance data writes. It does not control credit scores, position terms once opened, or the liquidation mechanism.

---

## Roadmap

| Phase | Status | Scope |
|-------|--------|-------|
| Phase 1 | ✅ Complete | KreditAgent scorer, KredioLending, KredioPASMarket, KredioSwap, PAS oracle |
| Phase 2 | ✅ Complete | Liquidation engine, yield distribution, governance cache |
| Phase 3 | ✅ Complete | KredioXCMSettler, KredioAccountRegistry, ETH bridge, yield strategy automation, PVM AI layer |
| Phase 4 | ⏳ In Development | `onBehalf()` XCM position variants, governance score enrichment, SR25519 precompile integration |
| Phase 5 | 📋 Scoped | Trustless bridge via XCM reserve transfers, Acurast oracle, multi-parachain collateral |
| Phase 6 | 💡 Research | Cross-parachain credit history aggregation — portable score across Bifrost, Acala, Moonbeam |

---

## Repository

| Layer | Documentation |
|-------|---------------|
| Smart Contracts | [contracts/README.md](contracts/README.md) |
| Backend Service | [backend/README.md](backend/README.md) |
| Frontend dApp | [frontend/README.md](frontend/README.md) |
