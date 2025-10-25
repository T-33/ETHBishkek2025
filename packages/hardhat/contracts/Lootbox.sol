pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./EconomyController.sol"; // We need to know the interface of the controller

contract Lootbox is Ownable, Pausable {
    // --- State Variables ---

    // The address of the EconomyController. Set once and can never be changed.
    EconomyController public immutable economyController;

    // The price to open one loot box.
    uint256 public lootboxPrice = 0.1 ether; // Example: 0.1 ETH

    // A nonce to add a bit more entropy to our pseudo-randomness.
    uint256 private _nonce;

    // --- Events ---
    event LootboxOpened(address indexed player, uint256 indexed prizeTokenId, uint256 amount);
    event PriceUpdated(uint256 oldPrice, uint256 newPrice);

    // --- Constructor ---
    constructor(address _controllerAddress, address initialOwner) Ownable(initialOwner) {
        // Set the immutable address of the EconomyController.
        economyController = EconomyController(_controllerAddress);
    }

    // --- Core Public Function ---

    /**
     * @notice Allows a player to pay a fee to open a loot box and receive a random item.
     */
    function openLootbox() public payable whenNotPaused {
        // 1. CHECK: Ensure the player has paid the correct price.
        require(msg.value == lootboxPrice, "Incorrect payment amount");

        // 2. EFFECT: Determine the prize.
        (uint256 prizeTokenId, uint256 prizeAmount) = _getPrize();

        // 3. INTERACTION: Request the mint from the controller.
        // This is the crucial hand-off. This call will fail if the controller's rules are not met.
        economyController.requestMint(msg.sender, prizeTokenId, prizeAmount);

        // Emit an event to log the outcome.
        emit LootboxOpened(msg.sender, prizeTokenId, prizeAmount);
    }

    // --- Internal Randomness & Prize Logic ---

    /**
     * @dev Internal function to select a prize based on weighted randomness.
     * @return tokenId The ID of the winning item.
     * @return amount The quantity of the winning item.
     */
    function _getPrize() private returns (uint256, uint256) {
        // Get the total weight from the controller to know our range.
        uint256 totalWeight = economyController.totalRarityWeight();
        require(totalWeight > 0, "Rarity not configured");

        // Generate a pseudo-random number.
        uint256 randomValue = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, _nonce))) % totalWeight;
        _nonce++; // Increment nonce to prevent the same user from getting the same result in the same block.

        // --- Weighted Prize Selection Algorithm ---
        // We "count down" from the random number using each item's weight.
        // This is a standard and gas-efficient way to handle weighted probability.
        // For the hackathon, we'll assume a fixed number of item types for the loop.
        uint256 numItemTypes = 3; // Gold, Sword, Chestplate
        for (uint256 i = 0; i < numItemTypes; i++) {
            uint256 itemWeight = economyController.getItemWeight(i);
            if (randomValue < itemWeight) {
                // We have a winner!
                // For this example, we'll say fungible items (like gold) come in stacks,
                // while unique items (sword, armor) come one at a time.
                uint256 amount = (i == 0) ? 100 : 1; // If tokenId is 0 (Gold), give 100. Otherwise, give 1.
                return (i, amount);
            }
            randomValue -= itemWeight;
        }

        // This should be unreachable if weights are set correctly, but is a good safeguard.
        revert("Could not determine prize");
    }

    // --- Admin & Utility Functions ---

    /**
     * @notice Allows the owner to change the price of the loot box.
     */
    function setPrice(uint256 _newPrice) public onlyOwner {
        require(_newPrice > 0, "Price must be greater than 0");
        uint256 oldPrice = lootboxPrice;
        lootboxPrice = _newPrice;
        emit PriceUpdated(oldPrice, _newPrice);
    }

    /**
     * @notice Pause the contract (prevents opening lootboxes)
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause the contract (allows opening lootboxes)
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @notice Allows the owner to withdraw the accumulated fees.
     */
    function withdrawFees() public onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
}