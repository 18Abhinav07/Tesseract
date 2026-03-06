// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title EthBridgeInbox
/// @notice Deployed on each source EVM chain (e.g. Ethereum Sepolia).
///         Users deposit ETH here. The backend relayer verifies the
///         EthDeposited event and mints equivalent mUSDC on Hub.
///         Locked ETH is released by the admin for redeem payouts.
contract EthBridgeInbox {
    address public immutable owner;

    uint256 public constant MIN_DEPOSIT = 0.001 ether;
    uint256 public constant MAX_DEPOSIT = 1 ether;

    uint256 public depositCount;

    struct DepositInfo {
        address depositor;
        uint256 amount;
        bytes32 hubRecipient; // abi.encodePacked(address) zero-left-padded to 32 bytes
        uint256 timestamp;
    }

    mapping(uint256 => DepositInfo) public deposits;

    event EthDeposited(uint256 indexed depositId, address indexed from, uint256 amount, bytes32 indexed hubRecipient);

    event AdminWithdraw(address indexed to, uint256 amount);

    error NotOwner();
    error AmountOutOfRange(uint256 sent, uint256 min, uint256 max);
    error ZeroRecipient();
    error ZeroAddress();
    error InsufficientBalance(uint256 requested, uint256 available);
    error TransferFailed();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Deposit ETH and lock it in this contract.
    /// @param hubRecipient  The Hub EVM address encoded as bytes32
    ///                      (use: bytes32(uint256(uint160(addr))) in frontend).
    function deposit(
        bytes32 hubRecipient
    ) external payable {
        if (msg.value < MIN_DEPOSIT || msg.value > MAX_DEPOSIT) {
            revert AmountOutOfRange(msg.value, MIN_DEPOSIT, MAX_DEPOSIT);
        }
        if (hubRecipient == bytes32(0)) revert ZeroRecipient();

        uint256 id = depositCount++;
        deposits[id] = DepositInfo({
            depositor: msg.sender, amount: msg.value, hubRecipient: hubRecipient, timestamp: block.timestamp
        });

        emit EthDeposited(id, msg.sender, msg.value, hubRecipient);
    }

    /// @notice Admin releases locked ETH to fund redeem payouts back to users.
    ///         Called after a user initiates a redeem on Hub and the backend
    ///         confirms the Redeemed event.
    function adminWithdraw(
        address payable to,
        uint256 amount
    ) external onlyOwner {
        if (to == address(0)) revert ZeroAddress();
        if (amount > address(this).balance) {
            revert InsufficientBalance(amount, address(this).balance);
        }
        (bool ok,) = to.call{value: amount}("");
        if (!ok) revert TransferFailed();
        emit AdminWithdraw(to, amount);
    }

    /// @notice Returns the ETH balance held in this contract.
    function lockedBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /// @dev Reject plain ETH transfers so users always go through deposit().
    receive() external payable {
        revert("use deposit()");
    }
}
