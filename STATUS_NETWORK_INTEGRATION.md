uj# Status Network Integration Guide

## Overview

This guide explains how to integrate Status Network Sepolia into the Game Economy Dashboard project to enable **gasless transactions** for a better user experience.

## Why Status Network for This Project?

### Perfect Use Case: Gaming & Lootboxes

**Status Network is the first natively gasless Ethereum L2** - ideal for games where:
- ✅ Players open lootboxes **without paying gas**
- ✅ Players burn tokens for free
- ✅ Low barrier to entry = more players
- ✅ Better UX = higher engagement

### Current Pain Points (Solved by Status Network)

**Before Status Network:**
- ❌ Players need ETH for gas to open lootboxes
- ❌ Each burn costs gas
- ❌ High friction for new users
- ❌ Gas costs reduce player engagement

**After Status Network:**
- ✅ Zero gas fees for all transactions
- ✅ Instant onboarding
- ✅ More burns = healthier token economy
- ✅ Players focus on gameplay, not gas costs

## Integration Steps

### Step 1: Add Status Network Sepolia to Hardhat Config

Update `packages/hardhat/hardhat.config.ts`:

```typescript
import { HardhatUserConfig } from "hardhat/config";
// ... other imports

const config: HardhatUserConfig = {
  // ... existing config

  networks: {
    // ... existing networks

    // Status Network Sepolia Testnet
    statusSepolia: {
      url: "https://sepolia.status.im", // Official RPC
      chainId: 10200, // Status Network Sepolia Chain ID
      accounts: [deployerPrivateKey],
      gasPrice: 0, // Gasless transactions!
    },
  },

  // ... rest of config
};
```

### Step 2: Deploy Contracts to Status Network

Create deployment script `packages/hardhat/scripts/deploy-status.ts`:

```typescript
import { ethers } from "hardhat";

/**
 * Deploy to Status Network Sepolia
 * All transactions are gasless!
 */
async function main() {
  console.log("🦄 Deploying to Status Network Sepolia (Gasless)...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy GameItems (ERC1155)
  console.log("📦 Deploying GameItems...");
  const GameItems = await ethers.getContractFactory("GameItems");
  const gameItems = await GameItems.deploy();
  await gameItems.waitForDeployment();
  console.log("✅ GameItems deployed to:", await gameItems.getAddress());

  // Deploy EconomyController
  console.log("\n💰 Deploying EconomyController...");
  const EconomyController = await ethers.getContractFactory("EconomyController");
  const economyController = await EconomyController.deploy(await gameItems.getAddress());
  await economyController.waitForDeployment();
  console.log("✅ EconomyController deployed to:", await economyController.getAddress());

  // Deploy Lootbox (0.001 ETH for testing)
  console.log("\n🎁 Deploying Lootbox...");
  const Lootbox = await ethers.getContractFactory("Lootbox");
  const lootbox = await Lootbox.deploy(
    await gameItems.getAddress(),
    await economyController.getAddress(),
    ethers.parseEther("0.001") // Very cheap for testnet
  );
  await lootbox.waitForDeployment();
  console.log("✅ Lootbox deployed to:", await lootbox.getAddress());

  // Setup relationships
  console.log("\n🔗 Setting up contract relationships...");

  await gameItems.transferOwnership(await economyController.getAddress());
  console.log("✅ GameItems ownership transferred to EconomyController");

  await economyController.setMinter(await lootbox.getAddress(), true);
  console.log("✅ Lootbox set as authorized minter");

  // Configure economy
  console.log("\n⚙️ Configuring game economy...");

  // Set rarity weights
  await economyController.setRarity([0, 1, 2], [70, 20, 10]); // 70% gold, 20% sword, 10% chestplate
  console.log("✅ Rarity weights configured");

  // Set monthly cap for legendary sword
  await economyController.setMonthlyCap(1, 100, 30); // 100 swords per 30 days
  console.log("✅ Monthly cap set for Legendary Sword");

  console.log("\n🎉 Deployment Complete!");
  console.log("\n📋 Contract Addresses:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("GameItems:        ", await gameItems.getAddress());
  console.log("EconomyController:", await economyController.getAddress());
  console.log("Lootbox:          ", await lootbox.getAddress());
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  console.log("\n🔍 Explorer Links:");
  console.log(`https://sepolia.status.im/address/${await gameItems.getAddress()}`);
  console.log(`https://sepolia.status.im/address/${await economyController.getAddress()}`);
  console.log(`https://sepolia.status.im/address/${await lootbox.getAddress()}`);

  console.log("\n💡 All transactions were GASLESS! 🎉");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### Step 3: Add Status Network to Frontend

Update `packages/nextjs/scaffold.config.ts`:

```typescript
import { Chain } from "viem";

// Define Status Network Sepolia
export const statusSepolia = {
  id: 10200,
  name: "Status Network Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia.status.im"],
    },
    public: {
      http: ["https://sepolia.status.im"],
    },
  },
  blockExplorers: {
    default: {
      name: "Status Explorer",
      url: "https://sepolia.status.im",
    },
  },
  testnet: true,
} as const satisfies Chain;

const scaffoldConfig = {
  targetNetworks: [statusSepolia], // Use Status Network!
  // ... rest of config
};
```

### Step 4: Update Contract Addresses

After deployment, update `packages/nextjs/contracts/deployedContracts.ts`:

```typescript
const deployedContracts = {
  10200: { // Status Network Sepolia Chain ID
    GameItems: {
      address: "0x...", // Your deployed address
      abi: [...],
    },
    EconomyController: {
      address: "0x...",
      abi: [...],
    },
    Lootbox: {
      address: "0x...",
      abi: [...],
    },
  },
} as const;
```

### Step 5: Test Gasless Transactions

```bash
# Deploy to Status Network
yarn hardhat run scripts/deploy-status.ts --network statusSepolia

# Generate activity (gasless!)
yarn hardhat run scripts/generate-activity.ts --network statusSepolia

# Start frontend
yarn start
```

## Key Features Enabled by Status Network

### 1. Gasless Lootbox Opening

```solidity
// In Lootbox.sol - users pay lootbox price, but NO gas!
function openLootbox() public payable {
    require(msg.value >= lootboxPrice, "Insufficient payment");
    // ... lootbox logic
    // Users pay lootboxPrice in ETH, but gas is FREE!
}
```

**User Experience:**
- Connect wallet
- Click "Open Lootbox"
- Pay only 0.001 ETH (lootbox price)
- **Gas cost: 0 ETH** ✨

### 2. Gasless Token Burns

```solidity
// In GameItems.sol - completely free burns!
function burn(uint256 tokenId, uint256 amount) public {
    _burn(msg.sender, tokenId, amount);
    // No gas cost = more burns = deflationary economy!
}
```

**User Experience:**
- Select tokens to burn
- Click "Burn"
- **No gas cost** ✨
- Encourages deflationary mechanics

### 3. Gasless Analytics

All your analytics events are tracked on-chain for free:
- Mint events
- Burn events
- Transfer events
- Lootbox opens

**Result:** Full transparency + zero cost!

## Marketing Points for Hackathon

### Problem Statement

"Traditional blockchain games have high barriers to entry due to gas costs. Players need to:
1. Buy cryptocurrency
2. Pay gas for every transaction
3. Understand blockchain complexity

This limits adoption and engagement."

### Solution with Status Network

"Our Game Economy Dashboard on Status Network enables:
1. **Gasless onboarding** - connect wallet and play
2. **Free lootbox openings** - only pay item price, not gas
3. **Free token burns** - encourages healthy economy
4. **Real-time analytics** - all on-chain, zero cost

Result: **10x more accessible** gaming experience!"

### Demo Flow

1. **Show old way (Ethereum)**
   - "Opening lootbox costs 0.1 ETH + 0.003 ETH gas"
   - "Burning tokens costs 0.002 ETH gas"
   - "Total friction for new users"

2. **Show new way (Status Network)**
   - "Opening lootbox costs 0.001 ETH + **0 ETH gas**"
   - "Burning tokens costs **0 ETH**"
   - "Instant onboarding!"

3. **Show analytics**
   - "All data on-chain, gasless tracking"
   - "Full transparency for developers"

## Hackathon Submission Checklist

- [ ] Contracts deployed to Status Network Sepolia
- [ ] Frontend connected to Status Network
- [ ] Demo video showing gasless transactions
- [ ] Highlight onboarding UX improvements
- [ ] Show analytics dashboard with real data
- [ ] Emphasize burn mechanics enabled by zero gas
- [ ] Compare with traditional blockchain games

## Additional Resources

- **Status Network Docs:** https://docs.status.network/
- **Status Network Sepolia RPC:** https://sepolia.status.im
- **Status Network Explorer:** https://sepolia.status.im
- **Chain ID:** 10200

## Technical Benefits

### For Players
✅ No gas costs for gameplay
✅ Lower barrier to entry
✅ Focus on fun, not fees
✅ More burns = rarer items

### For Developers
✅ Full on-chain analytics (gasless)
✅ Better player retention
✅ Sustainable economy design
✅ Built on Linea zkEVM (proven tech)

## Competitive Advantages

Compared to other hackathon projects:
1. **Real utility** - not just a demo, actual gaming economy
2. **Data-driven** - comprehensive analytics dashboard
3. **Gasless = Better UX** - Status Network advantage
4. **Sustainable** - burn mechanics work because they're free
5. **Scalable** - can support many players without gas concerns

## Next Steps

1. Deploy to Status Network Sepolia
2. Test all features (lootbox, burn, analytics)
3. Record demo video
4. Prepare pitch deck
5. Submit to hackathon

---

**Remember:** The key selling point is that Status Network's gasless feature makes your game economy **actually usable** for real players, not just crypto experts!
