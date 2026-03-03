// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "forge-std/Test.sol";
import "../src/stake/TesseractStake.sol";
import "./mocks/MockXC20.sol"; // Use as a generic ERC20 for Mock DOT
import "./mocks/MockStaking.sol";
import "../src/interfaces/IStakingPrecompile.sol";

contract TesseractStakeTest is Test {
    TesseractStake public stakeVault;
    MockXC20 public dotToken;
    MockStaking public precompile;

    address public alice = address(0x1);
    
    function setUp() public {
        dotToken = new MockXC20("Polkadot", "DOT");
        
        // Setup mock precompile
        precompile = new MockStaking(address(dotToken));
        
        // Deploy main contract and inject mock address instead of constant for testing.
        // We bypass the constant STAKING_PRECOMPILE logic by using a wrapper mock deploy
        // Or in foundry, vm.etch is a good way to mock at a constant address.
        
        vm.etch(STAKING_PRECOMPILE, address(precompile).code);
        
        stakeVault = new TesseractStake(address(dotToken));
        
        // Give the STAKING_PRECOMPILE mock code its storage context back if needed, 
        // but since we are modifying state in MockStaking, it's safer to just deploy
        // a wrapper for testing or alter TesseractStake constructor for the test.
        
        // Actually, the easiest Foundry way without modifying source just for tests is
        // to mock the call entirely if it was a constant, but we'll re-deploy for clean state.
        
        dotToken.mint(alice, 1000 ether);
        
        // Give the dummy precompile some DOT so it can handle unstaking payouts
        // Since we are etching at STAKING_PRECOMPILE (0x00...0800), we need to mint DOT to that constant address,
        // not the wrapper `precompile` address!
        dotToken.mint(STAKING_PRECOMPILE, 1000 ether);
    }
    
    function testInitialExchangeRate() public view {
        assertEq(stakeVault.exchangeRate(), 1e18);
    }

    function testStakeAndMintLstDOT() public {
        vm.startPrank(alice);
        
        dotToken.approve(address(stakeVault), 100 ether);
        uint256 lstAmount = stakeVault.stake(100 ether);
        
        assertEq(lstAmount, 100 ether); // 1:1 initially
        assertEq(stakeVault.lstDOT().balanceOf(alice), 100 ether);
        assertEq(stakeVault.totalStakedDOT(), 100 ether);
        
        vm.stopPrank();
    }
    
    function testExchangeRateIncreasesWithRewards() public {
        testStakeAndMintLstDOT();
        
        // Mock staking precompile receiving rewards
        MockStaking(STAKING_PRECOMPILE).addRewards(address(stakeVault), 10 ether);
        
        stakeVault.updateRewards();
        
        // Exhange rate should now be 1.1 (110 total value / 100 total supply)
        assertEq(stakeVault.exchangeRate(), 1.1 * 1e18);
    }

    function testUnstake() public {
        testStakeAndMintLstDOT();

        uint256 lstAmountToUnstake = 50 ether;
        
        // Need to approve lstDOT for burning in the test if using burnFrom? No, it's burned inside but let's check.
        // Actually lstDOT.burnFrom is called by the stakeVault, so the user needs to approve the stakeVault to burn their tokens
        vm.startPrank(alice);
        stakeVault.lstDOT().approve(address(stakeVault), lstAmountToUnstake);
        
        uint256 dotBalanceBefore = dotToken.balanceOf(alice);
        
        uint256 returnedDot = stakeVault.unstake(lstAmountToUnstake);

        assertEq(returnedDot, 50 ether); // 1:1 right now
        assertEq(stakeVault.lstDOT().balanceOf(alice), 50 ether); // remaining
        assertEq(dotToken.balanceOf(alice), dotBalanceBefore + 50 ether);
        vm.stopPrank();
    }
}
