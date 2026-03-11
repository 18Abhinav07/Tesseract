import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '/Users/18abhinav07/Documents/Kredio/contracts/.env' });

const provider = new ethers.JsonRpcProvider('https://eth-rpc-testnet.polkadot.io/');
const wallet = new ethers.Wallet(process.env.ADMIN, provider);
console.log('From:', wallet.address);

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const bytecode = readFileSync('/tmp/mini_test/target/ink/mini_test.polkavm');
const data = '0x' + bytecode.toString('hex') + '9bae9d5e';
console.log('bytecode size:', bytecode.length);

const nonce = await provider.getTransactionCount(wallet.address);
const feeData = await provider.getFeeData();

const tx = await wallet.sendTransaction({
    nonce,
    to: null,
    data,
    gasLimit: 10_000_000n,
    maxFeePerGas: feeData.maxFeePerGas ?? feeData.gasPrice,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ?? 0n,
});
console.log('tx:', tx.hash);
const rx = await tx.wait().catch(e => ({ status: 'failed', error: e.shortMessage }));
if (rx.status === 'failed') {
    console.log('FAILED:', rx.error);
} else {
    console.log('status:', rx.status, 'contractAddress:', rx.contractAddress, 'gasUsed:', rx.gasUsed?.toString());
}
