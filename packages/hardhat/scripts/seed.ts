import { ethers } from "hardhat";

async function main() {
  console.log("🌱 Seeding the economy with initial data...");

  // Get the deployer account, which is the initial owner
  const [deployer] = await ethers.getSigners();

  // Get our deployed contract instances
  const gameItems = await ethers.getContract("GameItems", deployer);
  const economyController = await ethers.getContract("EconomyController", deployer);
  const lootbox = await ethers.getContract("Lootbox", deployer);

  console.log("Contracts fetched:");
  console.log("- GameItems:", gameItems.target);
  console.log("- EconomyController:", economyController.target);
  console.log("- Lootbox:", lootbox.target);

  // --- 1. Configure the Economy Controller ---
  console.log("\nSetting up economic parameters...");
  // Set item rarities
  const tokenIds = [0, 1, 2]; // Gold, Sword, Chestplate
  const weights = [10, 5, 10]; // Common, Legendary, Epic
  await economyController.setRarity(tokenIds, weights);
  console.log("- Item rarities have been set.");

  // Set a monthly cap for the legendary sword (ID 1)
  await economyController.setMonthlyCap(1, 10, 30); // ID 1, 10 per 30 days
  console.log("- Monthly cap for Legendary Sword (ID 1) set to 10.");

  // --- 2. Mint some initial items for the deployer for testing ---
  console.log("\nMinting some initial items for the deployer...");
  await gameItems.mint(deployer.address, 0, 1000, "0x"); // 1000 Gold
  await gameItems.mint(deployer.address, 1, 1, "0x"); // 1 Sword
  console.log("- Minted 1000 Gold and 1 Legendary Sword to the deployer.");

  console.log("Transferring ownership of game items to economic controller");
  const gameItemsOwner = await gameItems.owner();
  console.log("GameItems Owber:", gameItemsOwner);
  console.log("... Transferring GameItems ownership to EconomyController");
  await gameItems.transferOwnership(economyController.target);
  console.log("... Ownership transferred!");

  console.log("\n✅ Seeding complete!");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
