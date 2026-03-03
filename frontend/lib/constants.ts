export const ADDRESSES = {
    SWAP: process.env.NEXT_PUBLIC_TESSERACT_SWAP_ADDR as `0x${string}`,
    STAKE: process.env.NEXT_PUBLIC_TESSERACT_STAKE_ADDR as `0x${string}`,
    VAULT: process.env.NEXT_PUBLIC_TESSERACT_VAULT_ADDR as `0x${string}`,
    PAS: process.env.NEXT_PUBLIC_PAS_TOKEN as `0x${string}`,
};

export const ABIS = {
    ERC20: [
        "function balanceOf(address owner) view returns (uint256)",
        "function allowance(address owner, address spender) view returns (uint256)",
        "function approve(address spender, uint256 amount) returns (bool)",
        "function symbol() view returns (string)",
    ],
    SWAP: [
        "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
        "function swapAndBridgeXCM(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline, uint32 destParaId, uint64 destFee) external",
    ],
    STAKE: [
        "function exchangeRate() external view returns (uint256)",
        "function stake(uint256 amount) external",
        "function unstake(uint256 shares) external",
    ],
    VAULT: [
        "function totalAssets() external view returns (uint256)",
        "function balanceOf(address account) external view returns (uint256)",
        "function rebalance() external",
    ]
};
