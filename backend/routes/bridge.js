'use strict';
const express = require('express');
const router = express.Router();
const bridge = require('../services/bridge-service');

// ── Rate limiting: 1 deposit request / min per IP ─────────────────────────
const depositLastCall = new Map();

function depositRateLimit(req, res, next) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const last = depositLastCall.get(ip) || 0;
    if (now - last < 60_000) {
        return res.status(429).json({ error: 'Rate limit: 1 deposit request per minute per IP' });
    }
    depositLastCall.set(ip, now);
    next();
}

// ── Input sanitisation helpers ────────────────────────────────────────────
function isValidHex(str, len) {
    return typeof str === 'string' && str.startsWith('0x') && str.length === len;
}

function isValidAddress(str) {
    return isValidHex(str, 42);
}

function isValidTxHash(str) {
    return isValidHex(str, 66);
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /bridge/quote?chainId=11155111&ethAmount=0.01
// Returns live ETH→mUSDC quote without writing anything on-chain.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/quote', async (req, res) => {
    const chainId = parseInt(req.query.chainId, 10);
    const ethAmount = parseFloat(req.query.ethAmount);

    if (!Number.isFinite(chainId)) return res.status(400).json({ error: 'chainId required' });
    if (!Number.isFinite(ethAmount) || ethAmount <= 0) {
        return res.status(400).json({ error: 'ethAmount must be a positive number' });
    }

    try {
        const quote = await bridge.getQuote(chainId, ethAmount);
        res.json(quote);
    } catch (err) {
        console.error('[bridge] /quote error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /bridge/deposit
// Body: { chainId: number, txHash: string, hubRecipient: string }
// Verifies the source tx, quotes mUSDC, and calls minter.processDeposit().
// ─────────────────────────────────────────────────────────────────────────────
router.post('/deposit', depositRateLimit, async (req, res) => {
    const { chainId, txHash, hubRecipient } = req.body || {};

    if (!Number.isFinite(Number(chainId))) {
        return res.status(400).json({ error: 'chainId required' });
    }
    if (!isValidTxHash(txHash)) {
        return res.status(400).json({ error: 'txHash must be a 0x-prefixed 32-byte hex string' });
    }
    if (!isValidAddress(hubRecipient)) {
        return res.status(400).json({ error: 'hubRecipient must be an EVM address' });
    }

    try {
        const result = await bridge.processDeposit(Number(chainId), txHash, hubRecipient);
        res.json(result);
    } catch (err) {
        console.error('[bridge] /deposit error:', err.message);
        // Expose the message to callers (not internal stack traces)
        res.status(400).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /bridge/status?txHash=0x...
// Reads on-chain DepositRecord from minter. Returns pending/minted/redeemed.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/status', async (req, res) => {
    const { txHash } = req.query;

    if (!isValidTxHash(txHash)) {
        return res.status(400).json({ error: 'txHash must be a 0x-prefixed 32-byte hex string' });
    }

    try {
        const status = await bridge.getDepositStatus(txHash);
        res.json(status);
    } catch (err) {
        console.error('[bridge] /status error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /bridge/redeem
// Body: { sourceTxHash: string }
// Verifies Hub record shows redeemed=true, then sends ETH back to sourceUser.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/redeem', async (req, res) => {
    const { sourceTxHash } = req.body || {};

    if (!isValidTxHash(sourceTxHash)) {
        return res.status(400).json({ error: 'sourceTxHash must be a 0x-prefixed 32-byte hex string' });
    }

    try {
        const result = await bridge.processRedeem(sourceTxHash);
        res.json(result);
    } catch (err) {
        console.error('[bridge] /redeem error:', err.message);
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
