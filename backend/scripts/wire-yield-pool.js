'use strict';
const { ethers } = require('ethers');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../../contracts/.env') });

const RPC = process.env.PASSET_RPC || 'https://eth-rpc-testnet.polkadot.io/';
const provider = new ethers.JsonRpcProvider(RPC, { chainId: 420420417, name: 'hub' });
const adminPk = process.env.ADMIN && !process.env.ADMIN.startsWith('0x') ? '0x' + process.env.ADMIN : process.env.ADMIN;
const admin = new ethers.Wallet(adminPk, provider);

const NEW_LENDING = '0x61c6b46f5094f2867Dce66497391d0fd41796CEa';
const OLD_YIELD_POOL = '0x1dB4Faad3081aAfe26eC0ef6886F04f28D944AAB';

const lendingAbi = [
    'function adminSetYieldPool(address)',
    'function strategyStatus() view returns (address pool, uint256 invested, uint256 totalEarned, uint256 pendingYield_, uint256 investRatio_, uint256 minBuffer_)',
    'function totalDeposited() view returns (uint256)',
];

const lending = new ethers.Contract(NEW_LENDING, lendingAbi, admin);

async function main() {
    console.log('Admin:', admin.address);
    console.log('Wiring MockYieldPool', OLD_YIELD_POOL, 'to KredioLending', NEW_LENDING, '...');
    const tx = await lending.adminSetYieldPool(OLD_YIELD_POOL);
    const receipt = await tx.wait();
    console.log('Done. hash:', receipt.hash, 'gas:', receipt.gasUsed.toString());
    const s = await lending.strategyStatus();
    console.log('Confirmed pool:', s.pool);
    console.log('totalDeposited:', ethers.formatUnits(await lending.totalDeposited(), 6), 'mUSDC');
}

main().catch(e => { console.error('ERROR:', e.shortMessage || e.message); process.exit(1); });
