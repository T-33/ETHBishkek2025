// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GameItems is ERC1155, Ownable {
    uint256 public constant GOLD_COIN = 0;
    uint256 public constant LEGENDARY_SWORD = 1;
    uint256 public constant EPIC_GOLDEN_CHESTPLATE = 2;

    string private _baseURI;

    constructor(string memory baseURI, address initialOwner) ERC1155(baseURI) Ownable(initialOwner){
        _baseURI = baseURI;
    }

    function mint(address to, uint256 tokenId, uint256 amount, bytes memory data)
    public
    onlyOwner
    {
        _mint(to, tokenId, amount, data);
    }

    /**
     * @notice Allows players to burn their own tokens
     * @param tokenId The ID of the token to burn
     * @param amount The amount to burn
     */
    function burn(uint256 tokenId, uint256 amount) public {
        _burn(msg.sender, tokenId, amount);
    }

    /**
     * @notice Allows players to burn multiple token types at once
     * @param tokenIds Array of token IDs to burn
     * @param amounts Array of amounts to burn
     */
    function burnBatch(uint256[] memory tokenIds, uint256[] memory amounts) public {
        _burnBatch(msg.sender, tokenIds, amounts);
    }

    // --- URI Management ---
    // This function returns the metadata URL for a given token ID.
    // OpenZeppelin's ERC1155 contract handles this for us by combining the base URI
    // with the token ID. For example, if baseURI is "ipfs://MyMetadataFolder/" and
    // we ask for token ID 0, it will return "ipfs://MyMetadataFolder/0.json".
    function uri(uint256 tokenId) public view override returns (string memory) {
        // Get the base URI that was set in the constructor
        string memory baseURI = super.uri(tokenId);

        // Manually concatenate the base URI, the token ID, and the ".json" suffix
        return string.concat(baseURI, Strings.toString(tokenId), ".json");
    }

    // Allows the owner to update the base URI if they move their metadata.
    function setURI(string memory newURI) public onlyOwner {
        _setURI(newURI);
    }
}
