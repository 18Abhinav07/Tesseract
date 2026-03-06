const { ethers } = require('./oracle-feeder/node_modules/ethers');
const provider = new ethers.JsonRpcProvider('https://eth-rpc-testnet.polkadot.io/');
const ADMIN = '0xe37a8983570B39F305fe93D565A29F89366f3fFe';
const abi = [
    'function totalDeposited() view returns (uint256)',
    'function depositBalance(address) view returns (uint256)',
    'function totalBorrowed() view returns (uint256)',
];
const lending = new ethers.Contract('0xcf18DC673511885e2FC4aEafEc734bC408A9bA9A', abi, provider);
const pas = new ethers.Contract('0x6345aE4ff56F3b74c32221180afbF710371Deed5', abi, provider);
Promise.all([
    lending.totalDeposited(), lending.depositBalance(ADMIN), lending.totalBorrowed(),
    pas.totalDeposited(), pas.depositBalance(ADMIN), pas.totalBorrowed(),
]).then(([ltd, ldb, ltb, ptd, pdb, ptb]) => {
    const f6 = v => (Number(v) / 1e6).toFixed(2);
    console.log('KredioLending   totalDeposited:', f6(ltd), ' depositBalance(ADMIN):', f6(ldb), ' totalBorrowed:', f6(ltb));
    console.log('KredioPASMarket totalDeposited:', f6(ptd), ' depositBalance(ADMIN):', f6(pdb), ' totalBorrowed:', f6(ptb));
});
