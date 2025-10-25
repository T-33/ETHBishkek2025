import { Wallet } from "zksync-ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import * as ethers from "ethers";
import * as fs from "fs";
import * as path from "path";

/**
 * zkSync Deployment Script for Game Economy Dashboard
 *
 * This script deploys all contracts to zkSync Sepolia Testnet:
 * 1. GameItems (ERC1155 NFT contract)
 * 2. EconomyController (Economic rules and minting authorization)
 * 3. Lootbox (Player-facing lootbox mechanics)
 *
 * Usage: yarn deploy:zksync
 */
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log("=".repeat(70));
  console.log("🚀 GAME ECONOMY DASHBOARD - zkSync Deployment");
  console.log("=".repeat(70));

  // Initialize deployer wallet
  const privateKey =
    process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

  const wallet = new Wallet(privateKey);
  const deployer = new Deployer(hre, wallet);
  const deployerAddress = await deployer.zkWallet.getAddress();

  console.log(`\n📋 Deployment Info:`);
  console.log(`   Network: ${hre.network.name}`);
  console.log(`   Deployer: ${deployerAddress}`);
  console.log(`   Balance: ${ethers.formatEther(await deployer.zkWallet.getBalance())} ETH`);
  console.log();

  // Deployment addresses storage
  const deployedAddresses: { [key: string]: string } = {};

  try {
    // ========================================
    // STEP 1: Deploy GameItems (ERC1155)
    // ========================================
    console.log("📦 [1/3] Deploying GameItems (ERC1155)...");
    const gameItemsArtifact = await deployer.loadArtifact("GameItems");
    const gameItems = await deployer.deploy(gameItemsArtifact, [
      "https://ipfs.io/ipfs/bafkreiabcd1234567890", // Base URI - update with your IPFS hash
      deployerAddress, // Initial owner (will be transferred to EconomyController)
    ]);

    await gameItems.waitForDeployment();
    const gameItemsAddress = await gameItems.getAddress();
    deployedAddresses.GameItems = gameItemsAddress;

    console.log(`   ✅ GameItems deployed to: ${gameItemsAddress}`);
    console.log(`   📍 Explorer: https://sepolia.explorer.zksync.io/address/${gameItemsAddress}`);

    // ========================================
    // STEP 2: Deploy EconomyController
    // ========================================
    console.log("\n📦 [2/3] Deploying EconomyController...");
    const economyControllerArtifact = await deployer.loadArtifact("EconomyController");
    const economyController = await deployer.deploy(economyControllerArtifact, [gameItemsAddress, deployerAddress]);

    await economyController.waitForDeployment();
    const economyControllerAddress = await economyController.getAddress();
    deployedAddresses.EconomyController = economyControllerAddress;

    console.log(`   ✅ EconomyController deployed to: ${economyControllerAddress}`);
    console.log(`   📍 Explorer: https://sepolia.explorer.zksync.io/address/${economyControllerAddress}`);

    // ========================================
    // STEP 3: Deploy Lootbox
    // ========================================
    console.log("\n📦 [3/3] Deploying Lootbox...");
    const lootboxArtifact = await deployer.loadArtifact("Lootbox");
    const lootbox = await deployer.deploy(lootboxArtifact, [economyControllerAddress, deployerAddress]);

    await lootbox.waitForDeployment();
    const lootboxAddress = await lootbox.getAddress();
    deployedAddresses.Lootbox = lootboxAddress;

    console.log(`   ✅ Lootbox deployed to: ${lootboxAddress}`);
    console.log(`   📍 Explorer: https://sepolia.explorer.zksync.io/address/${lootboxAddress}`);

    // ========================================
    // STEP 4: Configure Contracts
    // ========================================
    console.log("\n⚙️  Configuring contracts...");

    // 4.1: Transfer GameItems ownership to EconomyController
    console.log("   [1/3] Transferring GameItems ownership...");
    const transferTx = await gameItems.transferOwnership(economyControllerAddress);
    await transferTx.wait();
    console.log("   ✅ Ownership transferred to EconomyController");

    // 4.2: Set Lootbox address in EconomyController
    console.log("   [2/3] Setting Lootbox address in EconomyController...");
    const setLootboxTx = await economyController.setLootboxAddress(lootboxAddress);
    await setLootboxTx.wait();
    console.log("   ✅ Lootbox address configured");

    // 4.3: Configure item rarity weights
    console.log("   [3/3] Configuring item rarity weights...");
    const setRarityTx = await economyController.setRarity(
      [0, 1, 2], // Token IDs: Gold Coin, Legendary Sword, Epic Chestplate
      [70, 20, 10], // Weights: 70% common, 20% epic, 10% legendary
    );
    await setRarityTx.wait();
    console.log("   ✅ Rarity weights configured:");
    console.log("      - Gold Coin (ID 0): 70% chance");
    console.log("      - Legendary Sword (ID 1): 20% chance");
    console.log("      - Epic Chestplate (ID 2): 10% chance");

    // 4.4: Set monthly cap for legendary items (optional)
    console.log("\n   Setting supply cap for Legendary Sword...");
    const setCapTx = await economyController.setMonthlyCap(
      1, // Token ID 1 (Legendary Sword)
      100, // Max 100 per period
      30, // Period: 30 days
    );
    await setCapTx.wait();
    console.log("   ✅ Supply cap set: Max 100 Legendary Swords per 30 days");

    // ========================================
    // DEPLOYMENT SUMMARY
    // ========================================
    console.log("\n" + "=".repeat(70));
    console.log("🎉 DEPLOYMENT SUCCESSFUL!");
    console.log("=".repeat(70));
    console.log("\n📍 Deployed Contract Addresses:");
    console.log(`   GameItems:         ${deployedAddresses.GameItems}`);
    console.log(`   EconomyController: ${deployedAddresses.EconomyController}`);
    console.log(`   Lootbox:           ${deployedAddresses.Lootbox}`);

    console.log("\n🔗 zkSync Sepolia Explorer:");
    console.log(`   https://sepolia.explorer.zksync.io/address/${deployedAddresses.GameItems}`);
    console.log(`   https://sepolia.explorer.zksync.io/address/${deployedAddresses.EconomyController}`);
    console.log(`   https://sepolia.explorer.zksync.io/address/${deployedAddresses.Lootbox}`);

    // ========================================
    // Save deployment data to file
    // ========================================

    const deploymentData = {
      network: hre.network.name,
      chainId: 300, // zkSync Sepolia
      contracts: deployedAddresses,
      deployer: deployerAddress,
      timestamp: new Date().toISOString(),
      configuration: {
        rarityWeights: {
          goldCoin: 70,
          legendarySword: 20,
          epicChestplate: 10,
        },
        supplyCaps: {
          legendarySword: {
            max: 100,
            periodDays: 30,
          },
        },
        lootboxPrice: "0.1 ETH",
      },
    };

    const deploymentsDir = path.join(__dirname, "..", "deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const deploymentFilePath = path.join(deploymentsDir, "zksync-sepolia.json");
    fs.writeFileSync(deploymentFilePath, JSON.stringify(deploymentData, null, 2));

    console.log(`\n💾 Deployment data saved to: deployments/zksync-sepolia.json`);

    // ========================================
    // Next steps
    // ========================================
    console.log("\n📝 Next Steps:");
    console.log("   1. Update packages/nextjs/contracts/deployedContracts.ts");
    console.log("   2. Add contract addresses to your frontend");
    console.log("   3. Test on /player page");
    console.log("   4. Check analytics on /analytics page");
    console.log("\n" + "=".repeat(70));
  } catch (error) {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    throw error;
  }
}
