# Latest Deployment Addresses (Polkadot EVM Testnet)

- Network RPC: https://eth-rpc-testnet.polkadot.io/
- **KredioLending (v7 - adminHardReset fix + clean deploy): 0x61c6b46f5094f2867Dce66497391d0fd41796CEa**
- **KredioPASMarket (v6 - full admin batch functions, clean deploy): 0x5617dBa1b13155fD6fD62f82ef6D9e8F0F3B0E86**
- **KredioXCMSettler (v1): 0xE0C102eCe5F6940D5CAF77B6980456F188974e52**
- **KredioAccountRegistry (v1): 0xe3603f70ACeBe6A7f3975cf3Edbd12EfeA78aDeA**
- MockYieldPool (v1 - reused, wired to new KredioLending): 0x12CEF08cb9D58357A170ee2fA70b3cE2c0419bd6
- Mock USDC: 0x5998cE005b4f3923c988Ae31940fAa1DEAC0c646
- KreditAgent: 0x8c13E6fFDf27bB51304Efff108C9B646d148E5F3
- GovernanceCache: 0xe4DE7eadE2c0A65BdA6863Ad7bA22416c77F3e55
- MockPASOracle: 0x1494432a8Af6fa8c03C0d7DD7720E298D85C55c7
- KredioSwap (v1): 0xaF1d183F4550500Beb517A3249780290A88E6e39

Deploy date: 2026-03-19 (full redeployment - clean state, all contracts at parity with source)

Changes from previous deployment:
- KredioLending v7: new deploy with adminHardReset fix and adminCleanContract support
- KredioPASMarket v6: new deploy with adminCleanContract support and full admin batch parity
- KredioXCMSettler + KredioAccountRegistry: now deployed (were PENDING)
- Deploy.s.sol: updated to use ADMIN env var (was PRIVATE_KEY), deploy MockYieldPool, wire yield pool, seed 500k/300k
- MockYieldPool: reused existing; wired to new KredioLending via adminSetYieldPool post-deploy
- KredioLending seeded with 500 000 mUSDC; KredioPASMarket seeded with 300 000 mUSDC

Previous deployments:
- KredioLending (v6 - Intelligent Yield Strategy): 0x1eDaD1271FB9d1296939C6f4Fb762752b041C64E
- KredioPASMarket (v5 - new credit score, stale deploy): 0x05d9B20573A6C7500d8b320902B473e1A442dbA5
- KredioPASMarket (v5 old - missing batch admin functions): 0x879F48C0f1982F6Bb7932ed651f278e47c261E03
- KredioPASMarket (v3 - withdraw fix): 0xE748Afa4c5e5bDD3c31c779759Baf294dFb7f95E
- KredioLending (v3): 0x717A1e2967af17CbE92abd70072aCe823a9B22B4

Accounts:
- ADMIN: 0xe37a8983570B39F305fe93D565A29F89366f3fFe
