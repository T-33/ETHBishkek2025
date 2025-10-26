import { ethers } from "hardhat";

/**
 * Deploy to Status Network Sepolia
 *
 * Status Network is the first natively gasless Ethereum L2
 * All transactions have ZERO gas cost!
 */
async function main() {
  console.log("🦄 Deploying to Status Network Sepolia (Gasless L2)...\n");

  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  const balance = await ethers.provider.getBalance(deployerAddress);

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📍 Deployer:", deployerAddress);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH");
  console.log("⛓️  Network:", (await ethers.provider.getNetwork()).name);
  console.log("🆔 Chain ID:", (await ethers.provider.getNetwork()).chainId);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // ========================================
  // 1. Deploy GameItems (ERC1155)
  // ========================================
  console.log("📦 [1/3] Deploying GameItems (ERC1155)...");
  const GameItems = await ethers.getContractFactory("GameItems");
  const baseURI = "https://ipfs.io/ipfs/bafkreiabcd1234567890"; // Base URI for metadata
  const gameItems = await GameItems.deploy(baseURI, deployerAddress);
  await gameItems.waitForDeployment();
  const gameItemsAddress = await gameItems.getAddress();
  console.log("✅ GameItems deployed to:", gameItemsAddress);
  console.log("   Gas cost: 0 ETH (Gasless!) 🎉\n");

  // ========================================
  // 2. Deploy EconomyController
  // ========================================
  console.log("💰 [2/3] Deploying EconomyController...");
  const EconomyController = await ethers.getContractFactory("EconomyController");
  const economyController = await EconomyController.deploy(gameItemsAddress, deployerAddress);
  await economyController.waitForDeployment();
  const economyControllerAddress = await economyController.getAddress();
  console.log("✅ EconomyController deployed to:", economyControllerAddress);
  console.log("   Gas cost: 0 ETH (Gasless!) 🎉\n");

  // ========================================
  // 3. Deploy Lootbox
  // ========================================
  console.log("🎁 [3/3] Deploying Lootbox...");
  const Lootbox = await ethers.getContractFactory("Lootbox");
  const lootbox = await Lootbox.deploy(economyControllerAddress, deployerAddress);
  await lootbox.waitForDeployment();
  const lootboxAddress = await lootbox.getAddress();
  console.log("✅ Lootbox deployed to:", lootboxAddress);
  console.log("   Gas cost: 0 ETH (Gasless!) 🎉\n");

  // ========================================
  // 4. Configure Contracts
  // ========================================
  console.log("⚙️  Configuring contracts...");

  console.log("   [1/4] Transferring GameItems ownership to EconomyController...");
  const transferTx = await gameItems.transferOwnership(economyControllerAddress);
  await transferTx.wait();
  console.log("   ✅ Ownership transferred (Gas: 0 ETH)");

  console.log("   [2/4] Setting Lootbox address in EconomyController...");
  const setLootboxTx = await economyController.setLootboxAddress(lootboxAddress);
  await setLootboxTx.wait();
  console.log("   ✅ Lootbox address configured (Gas: 0 ETH)");

  console.log("   [3/4] Configuring item rarity weights...");
  const setRarityTx = await economyController.setRarity(
    [0, 1, 2], // Token IDs: Gold Coin, Legendary Sword, Epic Chestplate
    [70, 20, 10], // Weights: 70% common, 20% epic, 10% legendary
  );
  await setRarityTx.wait();
  console.log("   ✅ Rarity weights configured (Gas: 0 ETH):");
  console.log("      - Gold Coin (ID 0): 70% chance");
  console.log("      - Legendary Sword (ID 1): 20% chance");
  console.log("      - Epic Chestplate (ID 2): 10% chance");

  console.log("\n   [4/4] Setting supply cap for Legendary Sword...");
  const setCapTx = await economyController.setMonthlyCap(
    1, // Token ID 1 (Legendary Sword)
    100, // Max 100 per period
    30, // Period: 30 days
  );
  await setCapTx.wait();
  console.log("   ✅ Supply cap set: Max 100 Legendary Swords per 30 days (Gas: 0 ETH)\n");

  // ========================================
  // DEPLOYMENT SUMMARY
  // ========================================
  console.log("\n🎉 Deployment Complete!\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 CONTRACT ADDRESSES");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("GameItems:         ", gameItemsAddress);
  console.log("EconomyController: ", economyControllerAddress);
  console.log("Lootbox:           ", lootboxAddress);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log("🔍 Status Network Explorer Links:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("GameItems:");
  console.log(`   https://sepolia.status.im/address/${gameItemsAddress}`);
  console.log("EconomyController:");
  console.log(`   https://sepolia.status.im/address/${economyControllerAddress}`);
  console.log("Lootbox:");
  console.log(`   https://sepolia.status.im/address/${lootboxAddress}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log("💡 Key Benefits on Status Network:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✨ ALL transactions are GASLESS!");
  console.log("✨ Players open lootboxes without gas fees");
  console.log("✨ Players burn tokens for FREE");
  console.log("✨ Better UX = More engagement");
  console.log("✨ Lower barrier to entry for new players");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log("📝 Next Steps:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("1. Update packages/nextjs/contracts/deployedContracts.ts");
  console.log("2. Add Status Network Sepolia (Chain ID: 10200)");
  console.log("3. Add the contract addresses above");
  console.log("4. Update scaffold.config.ts to use Status Network");
  console.log("5. Test frontend with Status Network");
  console.log("6. Run: yarn generate-activity --network statusSepolia");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // ========================================
  // Save deployment data
  // ========================================
  const deploymentData = {
    network: "Status Network Sepolia",
    chainId: 10200,
    gasless: true,
    deployer: deployerAddress,
    timestamp: new Date().toISOString(),
    contracts: {
      GameItems: gameItemsAddress,
      EconomyController: economyControllerAddress,
      Lootbox: lootboxAddress,
    },
    configuration: {
      lootboxPrice: "0.001 ETH (set in contract)",
      rarityWeights: {
        goldCoin: "70%",
        legendarySword: "20%",
        epicChestplate: "10%",
      },
      monthlyCaps: {
        legendarySword: {
          max: 100,
          periodDays: 30,
        },
      },
    },
    benefits: [
      "Zero gas cost for all transactions",
      "Gasless lootbox openings",
      "Free token burns",
      "Better player onboarding",
      "Higher engagement",
    ],
  };

  console.log("📄 Deployment Info:");
  console.log(JSON.stringify(deploymentData, null, 2));
  console.log("\n✅ All done! Ready for Status Network Hackathon! 🦄\n");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
