# Analytics Dashboard Guide

## Overview

The Game Economy Dashboard includes comprehensive analytics features for tracking your game's token economy in real-time.

## Features

### 📊 Analytics Page (`/analytics`)

The analytics dashboard provides:

1. **Aggregate Stats** - High-level KPIs
   - Total Revenue (ETH earned from lootboxes)
   - Mint Rate (total and 24h comparison)
   - Burn Rate (percentage and 24h comparison)
   - Unique Players (active holders)

2. **Daily Metrics Chart** - 30-day historical trends
   - Items minted over time
   - Items burned over time
   - Revenue generated over time

3. **Token Metrics & Distribution**
   - Breakdown by token type (Gold, Swords, Chestplates)
   - Total minted, burned, and in circulation
   - Pie chart visualization

4. **Top Players Leaderboard**
   - Top 10 players by total items owned
   - Detailed inventory breakdown
   - Estimated portfolio value

5. **Whale Distribution**
   - Analysis of token concentration
   - Whales (>10% of supply)
   - Dolphins (1-10% of supply)
   - Fish (<1% of supply)
   - Centralization alerts

6. **Activity Heatmap**
   - Lootbox openings by hour and day of week
   - Peak activity identification
   - Interactive visualization

7. **Recent Events Feed**
   - Live feed of all transactions
   - Mints, burns, transfers, lootbox openings
   - Transaction hash links

### 📜 Transaction History (`/history`)

Personal transaction history includes:
- All mints, burns, transfers, and lootbox openings
- Activity summary statistics
- Detailed event information
- Links to blockchain explorer

### 🎮 Player Portal (`/player`)

Player features include:
- Lootbox opening
- Inventory management
- Token burning functionality

## Generating Test Data

### Local Development

In a local test environment, you cannot create true historical data spanning 30 days because all transactions happen in the present. However, you can generate test activity data.

#### Method 1: Use the Activity Generator Script

Run this command to automatically generate test data:

```bash
yarn generate-activity
```

This script will:
- Open lootboxes for multiple test accounts
- Perform token burns
- Create transfers between accounts
- Generate realistic activity patterns

#### Method 2: Manual Testing

1. Go to the Player Portal (`/player`)
2. Open multiple lootboxes
3. Burn some tokens using the burn interface
4. Switch between different accounts (in MetaMask)
5. Repeat the process

### Testnet Deployment

For realistic 30-day historical data:

1. Deploy contracts to a testnet (e.g., Sepolia)
2. Run the activity generator script periodically over several days:
   ```bash
   yarn generate-activity
   ```
3. The daily metrics chart will show actual time-series data

## Understanding the Analytics

### Daily Metrics Chart

**In Local Environment:**
- All activity appears on the current day
- Chart will be mostly empty initially
- Run `yarn generate-activity` to populate

**In Testnet/Production:**
- True historical data over 30 days
- Real-time updates as players interact
- Accurate trend analysis

### Empty State Handling

If you see "No activity data available yet" in the Daily Metrics:
1. The component will show helpful instructions
2. Generate activity using methods above
3. Once data exists, the chart will display automatically

### Real-time Updates

All analytics update in real-time as events occur:
- Use `watch: true` in event hooks
- Data refreshes automatically
- No manual reload needed

## Technical Details

### Data Sources

All analytics data comes from blockchain events:
- `TransferSingle` events from GameItems contract
- `LootboxOpened` events from Lootbox contract

### Event Processing

The `useAdvancedAnalytics` hook:
- Fetches all historical events from block 0
- Processes events to calculate metrics
- Updates automatically via WebSocket
- Caches calculations using React.useMemo

### Limitations

**Local Test Network:**
- Cannot manipulate block timestamps
- All activity appears in current time period
- Historical data simulation limited

**Solutions:**
- Use testnet for true historical data
- Run activity generator periodically
- For demos, show current period activity

## Best Practices

### For Development

1. Start with `yarn generate-activity` to populate dashboard
2. Test individual features manually
3. Verify real-time updates work correctly

### For Testnet

1. Deploy contracts early
2. Run activity generator daily
3. Allow 30+ days for full historical data

### For Production

1. Monitor analytics regularly
2. Use insights to adjust drop rates
3. Watch for whale concentration
4. Track revenue and burn rates

## Troubleshooting

### Empty Charts

**Problem:** Daily Metrics Chart shows "No activity data available"

**Solution:**
```bash
yarn generate-activity
```

### No Real-time Updates

**Problem:** Analytics not updating after transactions

**Solution:**
- Check that local blockchain is running
- Verify `watch: true` in hooks
- Refresh the page

### Incorrect Data

**Problem:** Metrics don't match expectations

**Solution:**
- Events are processed from block 0
- Check contract addresses in deployedContracts.ts
- Verify blockchain network in MetaMask

## API Reference

### Hook: `useAdvancedAnalytics()`

Returns:
```typescript
{
  isLoading: boolean;
  dailyMetrics: DailyMetrics[];
  tokenMetrics: TokenMetrics;
  topPlayers: TopPlayer[];
  whaleDistribution: WhaleDistribution;
  activityHeatmap: ActivityHeatmapData[];
  recentEvents: RecentEvent[];
  aggregateStats: AggregateStats;
}
```

### Types

See `packages/nextjs/hooks/game/useAdvancedAnalytics.ts` for complete type definitions.

## Support

For issues or questions:
1. Check this guide
2. Review the code in `hooks/game/useAdvancedAnalytics.ts`
3. Test with `yarn generate-activity`
4. Review component implementations in `components/analytics/advanced/`
