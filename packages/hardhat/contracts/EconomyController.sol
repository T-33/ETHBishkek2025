pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./GameItems.sol"; // We need to interact with our GameItems contract

contract EconomyController is Ownable {
    // --- State Variables ---

    // The address of the GameItems contract that this controller manages.
    GameItems public immutable gameItems;
    // The address of the Lootbox contract that is allowed to request mints.
    address public lootboxContract;

    // Struct to hold the rarity information for an item in the loot box.
    // 'weight' is used for weighted randomness. Higher weight = more common.
    struct RarityInfo {
        uint256 weight;
    }

    // Struct to hold the supply cap information for a rare item.
    struct MintCapInfo {
        uint256 cap; // The maximum number that can be minted in a period.
        uint256 mintedInPeriod; // How many have been minted so far.
        uint256 periodEndTimestamp; // When the current period resets.
    }

    // Mapping from a token ID to its rarity settings.
    mapping(uint256 => RarityInfo) public raritySettings;
    // Mapping from a token ID to its supply cap settings.
    mapping(uint256 => MintCapInfo) public mintCaps;

    // The total weight of all items in the loot box, for calculating probabilities.
    uint256 public totalRarityWeight;

    // --- Events ---
    event RarityUpdated(uint256[] tokenIds, uint256[] weights);
    event MintCapUpdated(uint256 tokenId, uint256 cap, uint256 periodInDays);
    event LootboxAddressSet(address lootboxAddress);

    // --- Constructor ---
    constructor(address _gameItemsAddress, address initialOwner) Ownable(initialOwner) {
        // Set the immutable address of the GameItems contract.
        gameItems = GameItems(_gameItemsAddress);
    }

    // --- Admin Functions (The Control Panel) ---

    /**
     * @notice Sets the address of the Lootbox contract. Only this address can request mints.
     * @param _lootboxAddress The address of the deployed Lootbox contract.
     */
    function setLootboxAddress(address _lootboxAddress) public onlyOwner {
        lootboxContract = _lootboxAddress;
        emit LootboxAddressSet(_lootboxAddress);
    }

    /**
    * @notice A public getter function to allow other contracts to read the rarity weight of an item.
    * @param tokenId The ID of the item to query.
    * @return The rarity weight of the item.
    */
    function getItemWeight(uint256 tokenId) public view returns (uint256) {
        return raritySettings[tokenId].weight;
    }

    /**
     * @notice Sets the rarity weights for multiple items at once.
     * @param tokenIds An array of item IDs to update.
     * @param weights An array of corresponding rarity weights.
     */
    function setRarity(uint256[] memory tokenIds, uint256[] memory weights) public onlyOwner {
        require(tokenIds.length == weights.length, "Arrays must have the same length");

        // We recalculate the total weight from scratch for accuracy.
        totalRarityWeight = 0;
        for (uint i = 0; i < tokenIds.length; i++) {
            raritySettings[tokenIds[i]] = RarityInfo(weights[i]);
            totalRarityWeight += weights[i];
        }
        emit RarityUpdated(tokenIds, weights);
    }

    /**
     * @notice Sets a periodic supply cap for a specific item.
     * @param tokenId The ID of the rare item.
     * @param cap The maximum number that can be minted in the period.
     * @param periodInDays The length of the period in days (e.g., 30 for monthly).
     */
    function setMonthlyCap(uint256 tokenId, uint256 cap, uint256 periodInDays) public onlyOwner {
        mintCaps[tokenId] = MintCapInfo({
            cap: cap,
            mintedInPeriod: 0,
            periodEndTimestamp: block.timestamp + (periodInDays * 1 days)
        });
        emit MintCapUpdated(tokenId, cap, periodInDays);
    }

    // --- Core Logic (The Gated Minting Function) ---

    /**
     * @notice The ONLY function that can authorize a mint. Called by the Lootbox contract.
     * @dev It checks all economic rules before calling the actual mint function on GameItems.
     * @param to The player's address to receive the item.
     * @param tokenId The ID of the item to mint.
     * @param amount The quantity of the item to mint.
     */
    function requestMint(address to, uint256 tokenId, uint256 amount) public {
        // SECURITY: Only the authorized Lootbox contract can call this function.
        require(msg.sender == lootboxContract, "Caller is not the authorized lootbox");

        // RULE CHECK 1: Check and update the supply cap, if one exists.
        _checkAndIncrementCap(tokenId, amount);

        // If all rules pass, execute the mint on the GameItems contract.
        gameItems.mint(to, tokenId, amount, "");
    }


    /**
     * @dev Internal function to check if a mint would exceed the cap and update the count.
     */
    function _checkAndIncrementCap(uint256 tokenId, uint256 amount) internal {
        MintCapInfo storage capInfo = mintCaps[tokenId];

        // If cap is 0, it means no cap is set for this item, so we can skip.
        if (capInfo.cap > 0) {
            // Check if the current period has ended.
            if (block.timestamp > capInfo.periodEndTimestamp) {
                // The period has ended, so reset the counter.
                capInfo.mintedInPeriod = 0;
                // For simplicity, we'll just reset from now. A more complex system
                // could calculate how many periods have passed.
                // Let's assume periodInDays was stored elsewhere or is fixed at 30.
                uint256 periodInDays = 30; // Example
                capInfo.periodEndTimestamp = block.timestamp + (periodInDays * 1 days);
            }

            // Check if this mint exceeds the cap for the current period.
            require(capInfo.mintedInPeriod + amount <= capInfo.cap, "Mint cap for period exceeded");

            // If it doesn't, increment the counter.
            capInfo.mintedInPeriod += amount;
        }
    }
}