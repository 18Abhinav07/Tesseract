import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '/Users/18abhinav07/Documents/Kredio/contracts/.env' });

const provider = new ethers.JsonRpcProvider('https://eth-rpc-testnet.polkadot.io/');
const wallet = new ethers.Wallet(process.env.ADMIN, provider);
console.log('From:', wallet.address);

const bytecode = readFileSync('/Users/18abhinav07/Documents/Kredio/contracts/pvm/risk_assessor/target/ink/risk_assessor.polkavm');
const data = '0x' + bytecode.toString('hex') + '9bae9d5e';

const nonce = await provider.getTransactionCount(wallet.address);
const feeData = await provider.getFeeData();
console.log('Nonce:', nonce, 'gasPrice:', feeData.gasPrice?.toString());

const tx = await wallet.sendTransaction({
    nonce,
    to: null,
    data,
    gasLimit: 10_000_000n,
    maxFeePerGas: feeData.maxFeePerGas ?? feeData.gasPrice,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ?? 0n,
});
console.log('tx:', tx.hash);
const rx = await tx.wait();
console.log('status:', rx.status, 'contractAddress:', rx.contractAddress);
console.log('gasUsed:', rx.gasUsed.toString());
