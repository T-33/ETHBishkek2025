# Quick Start Guide

## Getting Started

### 1. Start the Development Environment

```bash
# Terminal 1: Start local blockchain
yarn chain

# Terminal 2: Deploy contracts
yarn deploy

# Terminal 3: Start frontend
yarn start
```

Visit: http://localhost:3000

### 2. Generate Test Data for Analytics

The analytics dashboard requires activity data to display charts and statistics.

**Important:** On first run, the Daily Metrics chart will be empty because there are no transactions yet.

To populate the analytics dashboard with test data:

```bash
yarn generate-activity
```

This script will:
- Open lootboxes for 4 test players
- Burn some tokens
- Create transfers between accounts
- Generate realistic activity patterns

**Result:** All analytics components will now display data:
- ✅ Recent Events feed
- ✅ Top Players leaderboard
- ✅ Token distribution charts
- ✅ Whale analysis
- ✅ Activity heatmap
- ✅ Aggregate statistics

### 3. Explore the Dashboard

**Player Portal** (`/player`)
- Open lootboxes (costs 0.1 ETH)
- View your inventory
- Burn unwanted tokens

**Transaction History** (`/history`)
- View all your transactions
- See mints, burns, transfers
- Activity statistics

**Analytics Dashboard** (`/analytics`)
- Real-time economy metrics
- Top players leaderboard
- Whale distribution
- Activity heatmap
- Revenue tracking

## Understanding the Daily Metrics Chart

### Why is it empty initially?

In a local test environment:
- All transactions happen "now"
- We cannot create 30-day historical data
- The chart needs activity to display

### How to fix it?

**Option 1: Generate Test Data (Recommended)**
```bash
yarn generate-activity
```

**Option 2: Manual Activity**
1. Go to `/player`
2. Open several lootboxes
3. Burn some tokens
4. The chart will populate with current activity

**Option 3: Deploy to Testnet**
For true 30-day historical data:
1. Deploy to Sepolia testnet
2. Run `yarn generate-activity` periodically
3. Wait several days for historical trends

## Project Structure

```
├── packages/
│   ├── hardhat/           # Smart contracts
│   │   ├── contracts/     # Solidity files
│   │   │   ├── GameItems.sol         # ERC1155 NFTs
│   │   │   ├── EconomyController.sol # Game logic
│   │   │   └── Lootbox.sol           # Lootbox system
│   │   └── scripts/
│   │       ├── seed.ts               # Initial setup
│   │       └── generate-activity.ts  # Test data generator
│   │
│   └── nextjs/            # Frontend
│       ├── app/
│       │   ├── page.tsx             # Home
│       │   ├── player/page.tsx      # Player portal
│       │   ├── analytics/page.tsx   # Analytics dashboard
│       │   └── history/page.tsx     # Transaction history
│       ├── hooks/game/
│       │   └── useAdvancedAnalytics.ts  # Analytics logic
│       └── components/
│           ├── player/              # Player UI
│           └── analytics/advanced/  # Analytics components
```

## Key Features

### Smart Contracts
- ✅ Pause functionality (emergency stop)
- ✅ Price updates for lootboxes
- ✅ Token burning mechanism
- ✅ Monthly caps for rare items
- ✅ Weighted randomness

### Analytics
- ✅ Daily metrics (30-day charts)
- ✅ Top players leaderboard
- ✅ Whale distribution analysis
- ✅ Activity heatmap (hour x day)
- ✅ Recent events feed
- ✅ Money flow tracking
- ✅ Real-time updates

### Player Features
- ✅ Lootbox opening
- ✅ Inventory management
- ✅ Token burning
- ✅ Transaction history
- ✅ Real-time balance updates

## Troubleshooting

### Empty Analytics Dashboard

**Problem:** All charts show "No data"

**Solution:**
```bash
yarn generate-activity
```

### Transaction Fails

**Problem:** Lootbox opening fails with insufficient funds

**Solution:**
1. Switch to test account with funds in MetaMask
2. Or import one of the hardhat accounts (they have 10000 ETH each)

### Data Not Updating

**Problem:** Analytics don't refresh after transactions

**Solution:**
1. Check local blockchain is running (`yarn chain`)
2. Refresh the browser page
3. Verify correct network in MetaMask (Localhost 31337)

## Next Steps

1. ✅ Run `yarn generate-activity` to populate dashboard
2. 📊 Explore the analytics at `/analytics`
3. 🎮 Try the player portal at `/player`
4. 📜 Check transaction history at `/history`
5. 🔍 Debug contracts at `/debug`

## Additional Resources

- [ANALYTICS_GUIDE.md](./ANALYTICS_GUIDE.md) - Detailed analytics documentation
- [CLAUDE.md](./CLAUDE.md) - Project architecture and development guide
- [ZKSYNC_MIGRATION_GUIDE.md](./ZKSYNC_MIGRATION_GUIDE.md) - zkSync deployment guide

## Support

For detailed analytics information, see [ANALYTICS_GUIDE.md](./ANALYTICS_GUIDE.md)
