import { Wallet, Provider } from "zksync-ethers";
import * as ethers from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

// Import contract ABIs
import LootboxArtifact from "../artifacts-zk/contracts/Lootbox.sol/Lootbox.json";
import GameItemsArtifact from "../artifacts-zk/contracts/GameItems.sol/GameItems.json";

/**
 * This script generates activity on zkSync by opening lootboxes,
 * burning tokens, and making transfers to populate the analytics dashboard.
 */

// Contract addresses on zkSync Sepolia (from deployments)
const CONTRACTS = {
  GameItems: "0x809EB00D049f2D58ad7C7b7005B900C09FB68b5D",
  Lootbox: "0xdb63c3Ff0a1a1bc2DC84f4f3d1cf1a6E4457fDCb",
};

async function main() {
  console.log("🎲 Generating activity for zkSync analytics dashboard...\n");

  // Setup provider for zkSync Sepolia
  const provider = new Provider("https://sepolia.era.zksync.dev");

  // Get deployer wallet
  const deployerPrivateKey =
    process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

  const deployer = new Wallet(deployerPrivateKey, provider);

  // For testing, we'll create some additional wallets from the deployer
  // In production, you'd use actual user wallets
  const player1 = Wallet.createRandom().connect(provider);
  const player2 = Wallet.createRandom().connect(provider);
  const player3 = Wallet.createRandom().connect(provider);

  console.log("👤 Deployer:", deployer.address);
  console.log("👤 Player1:", player1.address);
  console.log("👤 Player2:", player2.address);
  console.log("👤 Player3:", player3.address);

  // Get contract instances
  const lootbox = new ethers.Contract(CONTRACTS.Lootbox, LootboxArtifact.abi, deployer);
  const gameItems = new ethers.Contract(CONTRACTS.GameItems, GameItemsArtifact.abi, deployer);

  const lootboxPrice = await lootbox.lootboxPrice();
  console.log(`\n💰 Lootbox price: ${ethers.formatEther(lootboxPrice)} ETH\n`);

  // Check deployer balance
  const deployerBalance = await provider.getBalance(deployer.address);
  console.log(`💵 Deployer balance: ${ethers.formatEther(deployerBalance)} ETH\n`);

  if (deployerBalance < ethers.parseEther("0.01")) {
    console.log("⚠️  Warning: Deployer balance is low. Make sure you have enough ETH on zkSync Sepolia.");
    console.log("   Get testnet ETH: https://sepoliafaucet.com/");
    console.log("   Bridge to zkSync: https://bridge.zksync.io/\n");
  }

  // Fund test players with some ETH for gas
  console.log("💸 Funding test players with ETH for gas...");
  const fundAmount = ethers.parseEther("0.001"); // Small amount for gas
  const players = [player1, player2, player3];

  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    try {
      const tx = await deployer.sendTransaction({
        to: player.address,
        value: fundAmount,
      });
      await tx.wait();
      console.log(`  ✓ Funded Player${i + 1} with ${ethers.formatEther(fundAmount)} ETH`);
    } catch (error: any) {
      console.log(`  ✗ Failed to fund Player${i + 1}: ${error.message}`);
    }
  }

  console.log("\n⏳ Waiting for transactions to confirm...\n");
  await new Promise(resolve => setTimeout(resolve, 3000));

  // --- Generate Lootbox Opening Activity ---
  console.log("📦 Opening lootboxes with deployer account...");

  const numLootboxes = 10; // Open 10 lootboxes to generate data

  for (let i = 0; i < numLootboxes; i++) {
    try {
      console.log(`  Opening lootbox ${i + 1}/${numLootboxes}...`);
      const tx = await lootbox.openLootbox({ value: lootboxPrice });
      const receipt = await tx.wait();

      // Find the LootboxOpened event
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = lootbox.interface.parseLog(log);
          return parsed?.name === "LootboxOpened";
        } catch {
          return false;
        }
      });

      if (event) {
        const parsed = lootbox.interface.parseLog(event);
        const tokenId = Number(parsed?.args?.prizeTokenId);
        const amount = Number(parsed?.args?.amount);
        const tokenNames = ["Gold Coin", "Legendary Sword", "Epic Golden Chestplate"];
        console.log(`    ✓ Won: ${amount}x ${tokenNames[tokenId]}`);
      }
    } catch (error: any) {
      console.log(`    ✗ Failed to open lootbox: ${error.message}`);
    }

    // Small delay between opens to avoid nonce issues
    if (i < numLootboxes - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log("\n⏳ Waiting for all transactions to confirm...\n");
  await new Promise(resolve => setTimeout(resolve, 5000));

  // --- Check Balances ---
  console.log("📊 Checking deployer's inventory...");
  const goldBalance = await gameItems.balanceOf(deployer.address, 0);
  const swordBalance = await gameItems.balanceOf(deployer.address, 1);
  const chestplateBalance = await gameItems.balanceOf(deployer.address, 2);

  console.log(`  🪙 Gold Coins: ${goldBalance}`);
  console.log(`  ⚔️  Legendary Swords: ${swordBalance}`);
  console.log(`  🛡️  Epic Chestplates: ${chestplateBalance}`);

  // --- Generate Burn Activity (Optional) ---
  if (goldBalance > 50n) {
    console.log("\n🔥 Burning some Gold Coins...");
    const burnAmount = 50n;
    try {
      const tx = await gameItems.burn(0, burnAmount);
      await tx.wait();
      console.log(`  ✓ Burned ${burnAmount} Gold Coins`);
    } catch (error: any) {
      console.log(`  ✗ Failed to burn: ${error.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  // --- Generate Transfer Activity (Optional) ---
  if (goldBalance > 100n) {
    console.log("\n↔️ Transferring Gold Coins to Player1...");
    const transferAmount = 100n;
    try {
      const tx = await gameItems.safeTransferFrom(deployer.address, player1.address, 0, transferAmount, "0x");
      await tx.wait();
      console.log(`  ✓ Transferred ${transferAmount} Gold Coins to Player1`);
    } catch (error: any) {
      console.log(`  ✗ Failed to transfer: ${error.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  // --- Final Summary ---
  console.log("\n" + "=".repeat(60));
  console.log("✅ Activity Generation Complete!");
  console.log("=".repeat(60));

  const finalGold = await gameItems.balanceOf(deployer.address, 0);
  const finalSwords = await gameItems.balanceOf(deployer.address, 1);
  const finalChestplates = await gameItems.balanceOf(deployer.address, 2);

  console.log("\n📊 Final Deployer Inventory:");
  console.log(`  🪙 Gold Coins: ${finalGold}`);
  console.log(`  ⚔️  Legendary Swords: ${finalSwords}`);
  console.log(`  🛡️  Epic Chestplates: ${finalChestplates}`);

  console.log("\n💡 Next Steps:");
  console.log("  1. Visit http://localhost:3000/analytics to see the dashboard");
  console.log("  2. Check http://localhost:3000/history for transaction history");
  console.log("  3. View contracts on zkSync Explorer:");
  console.log(`     https://sepolia.explorer.zksync.io/address/${CONTRACTS.Lootbox}`);

  console.log("\n⚠️  Note:");
  console.log("  - Analytics shows last ~10,000 blocks (~3-4 hours)");
  console.log("  - All activity will appear in the current time period");
  console.log("  - For historical data, run this script multiple times over days");

  console.log("\n🎉 Done! Your analytics dashboard should now have data!");
}

main().catch(error => {
  console.error("\n❌ Error:", error);
  process.exit(1);
});
