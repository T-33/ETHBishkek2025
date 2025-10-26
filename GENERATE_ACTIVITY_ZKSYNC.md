# Generate Activity on zkSync - Quick Guide

## 🎯 Purpose

This script populates your analytics dashboard with test data by:
- Opening 10 lootboxes
- Burning tokens
- Transferring tokens
- Creating transaction history

---

## 📋 Prerequisites

### 1. Check Your Balance

Make sure your deployer account has enough zkSync Sepolia ETH:

**Your Deployer Address:** `0xDaf8B69d03D6Fc6f86CAe88db63981F5B67AD78f`

**Check Balance:**
https://sepolia.explorer.zksync.io/address/0xDaf8B69d03D6Fc6f86CAe88db63981F5B67AD78f

**Minimum Required:** ~0.015 ETH
- 10 lootboxes × 0.001 ETH = 0.01 ETH
- Gas fees ≈ 0.005 ETH

### 2. Get Testnet Funds (if needed)

If you need more funds:

**Step 1:** Get Sepolia ETH
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia

**Step 2:** Bridge to zkSync Sepolia
- https://bridge.zksync.io/
- Select: Sepolia → zkSync Sepolia
- Send at least 0.02 ETH

---

## 🚀 Run the Script

### Simple Command:

```bash
cd packages/hardhat
yarn generate-activity:zksync
```

### What It Does:

1. **Opens 10 Lootboxes** (costs 0.01 ETH + gas)
   - Generates LootboxOpened events
   - Mints random items (Gold, Swords, Chestplates)
   - Creates revenue data

2. **Burns Some Gold** (if balance > 50)
   - Creates burn events
   - Reduces circulation

3. **Transfers Gold to Test Player** (if balance > 100)
   - Creates transfer events
   - Simulates trading activity

4. **Displays Summary**
   - Shows final inventory
   - Provides next steps

---

## 📊 Expected Output

```bash
🎲 Generating activity for zkSync analytics dashboard...

👤 Deployer: 0xDaf8B69d03D6Fc6f86CAe88db63981F5B67AD78f
👤 Player1: 0x... (random test address)
👤 Player2: 0x... (random test address)
👤 Player3: 0x... (random test address)

💰 Lootbox price: 0.001 ETH

💵 Deployer balance: 0.025 ETH

💸 Funding test players with ETH for gas...
  ✓ Funded Player1 with 0.001 ETH
  ✓ Funded Player2 with 0.001 ETH
  ✓ Funded Player3 with 0.001 ETH

📦 Opening lootboxes with deployer account...
  Opening lootbox 1/10...
    ✓ Won: 100x Gold Coin
  Opening lootbox 2/10...
    ✓ Won: 1x Legendary Sword
  ...

📊 Checking deployer's inventory...
  🪙 Gold Coins: 750
  ⚔️  Legendary Swords: 3
  🛡️  Epic Chestplates: 1

🔥 Burning some Gold Coins...
  ✓ Burned 50 Gold Coins

↔️ Transferring Gold Coins to Player1...
  ✓ Transferred 100 Gold Coins to Player1

============================================================
✅ Activity Generation Complete!
============================================================

📊 Final Deployer Inventory:
  🪙 Gold Coins: 600
  ⚔️  Legendary Swords: 3
  🛡️  Epic Chestplates: 1

💡 Next Steps:
  1. Visit http://localhost:3000/analytics to see the dashboard
  2. Check http://localhost:3000/history for transaction history
  3. View contracts on zkSync Explorer:
     https://sepolia.explorer.zksync.io/address/0xdb63c3Ff0a1a1bc2DC84f4f3d1cf1a6E4457fDCb

⚠️  Note:
  - Analytics shows last ~10,000 blocks (~3-4 hours)
  - All activity will appear in the current time period
  - For historical data, run this script multiple times over days

🎉 Done! Your analytics dashboard should now have data!
```

---

## 📈 After Running the Script

### 1. View Analytics Dashboard

```bash
# If frontend isn't running, start it:
cd packages/nextjs
yarn dev
```

Open: http://localhost:3000/analytics

**You should see:**
- ✅ Aggregate stats (minted, burned, circulation)
- ✅ Daily metrics chart
- ✅ Token distribution
- ✅ Top players leaderboard (you!)
- ✅ Recent events feed
- ✅ Activity heatmap

### 2. View Transaction History

Open: http://localhost:3000/history

**You should see:**
- ✅ Your mint transactions
- ✅ Lootbox opens
- ✅ Burns (if any)
- ✅ Transfers (if any)

### 3. View on zkSync Explorer

Visit your transactions on zkSync:
https://sepolia.explorer.zksync.io/address/0xDaf8B69d03D6Fc6f86CAe88db63981F5B67AD78f

---

## 🔄 Generate More Activity

Want more data? Run the script multiple times:

```bash
# Run it 3 times for more variety
yarn generate-activity:zksync
# Wait 1 minute
yarn generate-activity:zksync
# Wait 1 minute
yarn generate-activity:zksync
```

Each run:
- Opens 10 more lootboxes
- Creates more events
- Adds to your analytics

---

## 🐛 Troubleshooting

### Error: "Insufficient funds"

**Problem:** Not enough ETH in deployer wallet

**Solution:**
1. Check balance: https://sepolia.explorer.zksync.io/address/0xDaf8B69d03D6Fc6f86CAe88db63981F5B67AD78f
2. Get more Sepolia ETH: https://sepoliafaucet.com/
3. Bridge to zkSync: https://bridge.zksync.io/

### Error: "Cannot find module 'zksync-ethers'"

**Problem:** Missing dependencies

**Solution:**
```bash
cd packages/hardhat
yarn install
```

### Error: "Contract call reverted"

**Problem:** Lootbox price changed or contract issue

**Solution:**
1. Check lootbox price in contract
2. Verify contracts are deployed correctly
3. Check deployer has enough balance

### Script runs but no data shows

**Problem:** Events not indexed yet

**Solution:**
1. Wait 30-60 seconds for indexing
2. Hard refresh browser (Ctrl+Shift+R)
3. Check RPC connection

---

## 💡 Advanced Usage

### Customize Activity

Edit `scripts/generate-activity-zksync.ts`:

```typescript
// Change number of lootboxes
const numLootboxes = 20; // Default: 10

// Change burn amount
const burnAmount = 100n; // Default: 50n

// Change transfer amount
const transferAmount = 200n; // Default: 100n
```

### Run with Different Account

```bash
# Set a different private key
__RUNTIME_DEPLOYER_PRIVATE_KEY=your_key_here yarn generate-activity:zksync
```

---

## 📝 Notes

### About Test Data:
- All activity appears in current time period
- Cannot create historical data spanning 30 days on testnet
- For realistic historical charts, run script daily over weeks

### About Costs:
- 10 lootboxes = ~0.01 ETH
- Gas fees = ~0.001-0.005 ETH per transaction
- Total cost per run = ~0.015-0.02 ETH

### About Random Players:
- Script creates 3 random test wallets
- Funds them with minimal ETH for gas
- They don't open lootboxes (only deployer does)
- Used for potential transfer testing

---

## ✅ Success Checklist

After running the script, verify:

- [ ] Script completed without errors
- [ ] Deployer balance decreased by ~0.015 ETH
- [ ] Analytics page shows new data
- [ ] Recent events feed populated
- [ ] Transaction history updated
- [ ] Top players shows deployer address
- [ ] Token metrics show minted amounts

---

## 🎉 You're Done!

Your analytics dashboard is now populated with test data!

Perfect for:
- Hackathon demos
- Screenshots
- Testing UI
- Showing investors

**Ready to showcase your game economy platform! 🚀**

---

For more information, see:
- `QUICK_START_ZKSYNC.md` - General zkSync guide
- `ZKSYNC_FIXES.md` - Technical details about fixes
