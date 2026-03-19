const { ethers } = require('ethers');
const provider = new ethers.JsonRpcProvider('https://eth-rpc-testnet.polkadot.io/');
require('dotenv').config({ path: '../contracts/.env' });
const admin = new ethers.Wallet(process.env.ADMIN, provider);
const LENDING_ADDR = '0x12CEF08cb9D58357A170ee2fA70b3cE2c0419bd6';
const LENDING_ABI = [
    'function admin() view returns (address)'
];
const lending = new ethers.Contract(LENDING_ADDR, LENDING_ABI, admin);

async function run() {
    try {
        console.log("Yield pool admin:", await lending.admin());
        console.log("My admin:", admin.address);
    } catch (e) {
        console.error("Error:", e);
    }
}
run();
