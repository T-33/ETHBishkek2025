import { ethers } from "hardhat";

/**
 * This script generates historical activity by opening multiple lootboxes
 * and performing various actions to populate the analytics dashboard.
 *
 * Note: In a local test environment, we cannot manipulate block timestamps
 * to create true historical data spanning 30 days. However, this script
 * will create multiple transactions that will show up in the analytics.
 */
async function main() {
  console.log("🎲 Generating activity for analytics dashboard...\n");

  // Get signers (test accounts)
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  const player1 = signers[1];
  const player2 = signers[2];
  const player3 = signers[3];
  const player4 = signers[4];

  // Get contract instances
  const lootbox = await ethers.getContract("Lootbox", deployer);
  const gameItems = await ethers.getContract("GameItems", deployer);

  const lootboxPrice = await lootbox.lootboxPrice();
  console.log(`Lootbox price: ${ethers.formatEther(lootboxPrice)} ETH\n`);

  // Array of players for variety
  const players = [player1, player2, player3, player4];
  const playerNames = ["Player1", "Player2", "Player3", "Player4"];

  // --- Generate Lootbox Opening Activity ---
  console.log("📦 Opening lootboxes for multiple players...");
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const name = playerNames[i];

    // Each player opens different number of lootboxes
    const numLootboxes = Math.floor(Math.random() * 5) + 3; // 3-7 lootboxes

    for (let j = 0; j < numLootboxes; j++) {
      try {
        const lootboxWithPlayer = lootbox.connect(player);
        const tx = await lootboxWithPlayer.openLootbox({ value: lootboxPrice });
        await tx.wait();
        console.log(`  ✓ ${name} opened lootbox ${j + 1}/${numLootboxes}`);
      } catch (error: any) {
        console.log(`  ✗ ${name} failed to open lootbox: ${error.message}`);
      }
    }
  }

  console.log("\n⏳ Waiting a moment...\n");
  await new Promise(resolve => setTimeout(resolve, 1000));

  // --- Generate Burn Activity ---
  console.log("🔥 Simulating token burns...");
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const name = playerNames[i];

    // Check player's balance of Gold (token ID 0)
    const goldBalance = await gameItems.balanceOf(player.address, 0);

    if (goldBalance > 0n) {
      // Burn 10-50% of gold
      const burnAmount = goldBalance / BigInt(Math.floor(Math.random() * 5) + 2);

      if (burnAmount > 0n) {
        try {
          const gameItemsWithPlayer = gameItems.connect(player);
          const tx = await gameItemsWithPlayer.burn(0, burnAmount);
          await tx.wait();
          console.log(`  ✓ ${name} burned ${burnAmount} Gold Coins`);
        } catch (error: any) {
          console.log(`  ✗ ${name} failed to burn: ${error.message}`);
        }
      }
    }
  }

  console.log("\n⏳ Waiting a moment...\n");
  await new Promise(resolve => setTimeout(resolve, 1000));

  // --- Generate More Lootbox Activity for Volume ---
  console.log("📦 Opening more lootboxes to increase volume...");
  for (let round = 0; round < 3; round++) {
    console.log(`\n  Round ${round + 1}/3:`);
    for (let i = 0; i < 2; i++) {
      const player = players[i % players.length];
      const name = playerNames[i % players.length];

      try {
        const lootboxWithPlayer = lootbox.connect(player);
        const tx = await lootboxWithPlayer.openLootbox({ value: lootboxPrice });
        await tx.wait();
        console.log(`    ✓ ${name} opened lootbox`);
      } catch (error: any) {
        console.log(`    ✗ ${name} failed: ${error.message}`);
      }
    }
  }

  // --- Generate Some Transfer Activity ---
  console.log("\n↔️ Simulating token transfers...");

  // Player1 sends some gold to Player2
  const player1Gold = await gameItems.balanceOf(player1.address, 0);
  if (player1Gold > 10n) {
    try {
      const gameItemsWithPlayer1 = gameItems.connect(player1);
      const tx = await gameItemsWithPlayer1.safeTransferFrom(player1.address, player2.address, 0, 10n, "0x");
      await tx.wait();
      console.log("  ✓ Player1 sent 10 Gold Coins to Player2");
    } catch (error: any) {
      console.log(`  ✗ Transfer failed: ${error.message}`);
    }
  }

  // Player3 sends a sword to Player4 (if they have one)
  const player3Swords = await gameItems.balanceOf(player3.address, 1);
  if (player3Swords > 0n) {
    try {
      const gameItemsWithPlayer3 = gameItems.connect(player3);
      const tx = await gameItemsWithPlayer3.safeTransferFrom(player3.address, player4.address, 1, 1n, "0x");
      await tx.wait();
      console.log("  ✓ Player3 sent 1 Legendary Sword to Player4");
    } catch (error: any) {
      console.log(`  ✗ Transfer failed: ${error.message}`);
    }
  }

  // --- Summary ---
  console.log("\n📊 Activity Summary:");
  console.log("─────────────────────────────────────");

  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const name = playerNames[i];

    const gold = await gameItems.balanceOf(player.address, 0);
    const swords = await gameItems.balanceOf(player.address, 1);
    const chestplates = await gameItems.balanceOf(player.address, 2);

    console.log(`\n${name} (${player.address}):`);
    console.log(`  🪙 Gold: ${gold}`);
    console.log(`  ⚔️  Swords: ${swords}`);
    console.log(`  🛡️  Chestplates: ${chestplates}`);
  }

  console.log("\n✅ Activity generation complete!");
  console.log("\n💡 Note: The analytics dashboard will now show:");
  console.log("  - Recent events feed populated with transactions");
  console.log("  - Top players leaderboard with real data");
  console.log("  - Token distribution charts");
  console.log("  - Whale analysis");
  console.log("\n⚠️  Daily metrics chart limitation:");
  console.log("  In a local test environment, we cannot create true 30-day");
  console.log("  historical data. All activity will show in the current period.");
  console.log("  For realistic historical data, deploy to a testnet and run");
  console.log("  this script periodically over several days.");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
