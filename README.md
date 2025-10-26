# Game Economy Dashboard

> **A transparent, on-chain game economy solution with NFT lootboxes and real-time analytics**

[![zkSync](https://img.shields.io/badge/zkSync-Sepolia-blue)](https://sepolia.explorer.zksync.io/)
[![Built with Scaffold-ETH 2](https://img.shields.io/badge/Built%20with-Scaffold--ETH%202-orange)](https://scaffoldeth.io/)

---

```
HOW TO RUN LOCALLY
(assuming you are in project directory)
yarn install
cd packages/nextjs
yarn dev
```

Contracts are already deployed to XSOLLA ZkSync sepolian network.


## Overview

Game Economy Dashboard is a comprehensive blockchain-based platform that enables transparent game economies with provably fair lootbox mechanics, ERC1155 NFT items, and advanced analytics for developers.

**Problem:** Game developers struggle with opacity in item distribution, economic inflation, and player distrust in centralized systems.

**Solution:** On-chain lootboxes with transparent probabilities, real-time analytics, and supply controls that give developers full visibility while players truly own their items.

---

## Key Features

### For Players
- **Transparent Lootboxes**: Open mystery boxes with provably fair on-chain randomness
- **True Ownership**: Items are ERC1155 NFTs you actually own
- **Visible Economics**: See total supply, circulation, and rarity of items
- **Burn Mechanism**: Remove unwanted items from circulation to increase rarity

### For Developers
- **Real-Time Analytics**: Track minting, burning, transfers, and player activity
- **Economic Controls**: Configure rarity weights and monthly supply caps
- **Anti-Inflation System**: Enforce time-based minting limits per item type
- **Activity Tracking**: Comprehensive event logs and transaction history
- **Modular Architecture**: Easy integration into existing games

---

## Tech Stack

**Blockchain**
- zkSync Era (Layer 2)
- Solidity 0.8.20
- Hardhat + zkSync plugins

**Smart Contracts**
- ERC1155 Multi-Token Standard (OpenZeppelin)
- Modular architecture: GameItems, EconomyController, Lootbox
- Pausable & Ownable security patterns

**Frontend**
- Next.js 14 (App Router)
- TypeScript
- Wagmi v2 + Viem
- TailwindCSS + DaisyUI
- Recharts for analytics

---

## Deployed Contracts (zkSync Sepolia)

| Contract | Address | Explorer |
|----------|---------|----------|
| **GameItems** | `0x809EB00D049f2D58ad7C7b7005B900C09FB68b5D` | [View](https://sepolia.explorer.zksync.io/address/0x809EB00D049f2D58ad7C7b7005B900C09FB68b5D) |
| **EconomyController** | `0xcD24d6bbB32dC8bfB3eB2C8674584303CeFb84A7` | [View](https://sepolia.explorer.zksync.io/address/0xcD24d6bbB32dC8bfB3eB2C8674584303CeFb84A7) |
| **Lootbox** | `0xdb63c3Ff0a1a1bc2DC84f4f3d1cf1a6E4457fDCb` | [View](https://sepolia.explorer.zksync.io/address/0xdb63c3Ff0a1a1bc2DC84f4f3d1cf1a6E4457fDCb) |

**Network**: zkSync Sepolia Testnet (Chain ID: 300)

---

## Architecture

### Smart Contract Flow

```
Player → Lootbox.openLootbox() (pays ETH)
           ↓
       EconomyController.requestMint()
           ├─ Check rarity weights
           ├─ Validate supply caps
           └─ Enforce time-based limits
           ↓
       GameItems.mint() (ERC1155)
           ↓
       Player receives NFT items
```

### Game Items

- **Gold Coin** (ID: 0) - Common, 70% drop rate, 100 units per lootbox
- **Legendary Sword** (ID: 1) - Epic, 20% drop rate, monthly cap: 100
- **Epic Golden Chestplate** (ID: 2) - Legendary, 10% drop rate

### Key Design Principles

1. **Separation of Concerns**: GameItems (storage), EconomyController (rules), Lootbox (mechanics)
2. **Security**: Only authorized contracts can mint; all rules enforced on-chain
3. **Modularity**: Swap mechanics without changing core contracts

---

## Quick Start

### Prerequisites

- Node.js >= 20.18.3
- Yarn v1 or v2+
- MetaMask with zkSync Sepolia ETH

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd ETHBishkek2025

# Install dependencies
yarn install
```

### Local Development

```bash
# Terminal 1: Start local blockchain
yarn chain

# Terminal 2: Deploy contracts
yarn deploy

# Terminal 3: Start frontend
yarn start
```

Open [http://localhost:3000](http://localhost:3000)

### Deploy to zkSync Sepolia

```bash
# Set up environment
cp packages/hardhat/.env.example packages/hardhat/.env
# Add your private key to .env

# Deploy contracts
cd packages/hardhat
yarn deploy:zksync

# Start frontend
cd ../nextjs
yarn dev
```

### Generate Test Data

```bash
# Populate analytics with test transactions
yarn generate-activity
```

---

## Usage

### Player Portal (`/player`)
1. Connect MetaMask to zkSync Sepolia
2. Click "Open Lootbox" (costs 0.001 ETH on testnet)
3. Receive random items based on weighted probabilities
4. View inventory and burn unwanted items

### Analytics Dashboard (`/analytics`)
- **Aggregate Stats**: Total minted, burned, in circulation, unique holders
- **Token Distribution**: Breakdown by item type with charts
- **Top Players**: Leaderboard of largest holders
- **Whale Analysis**: Token concentration metrics
- **Activity Heatmap**: Usage patterns by time
- **Recent Events**: Live transaction feed

### Transaction History (`/history`)
- Personal transaction log (mints, burns, transfers)
- Links to zkSync Explorer for verification

---

## Project Structure

```
ETHBishkek2025/
├── packages/
│   ├── hardhat/              # Smart contracts
│   │   ├── contracts/        # Solidity contracts
│   │   ├── deploy/           # Deployment scripts
│   │   └── scripts/          # Helper scripts
│   │
│   └── nextjs/               # Frontend
│       ├── app/              # Next.js pages
│       ├── components/       # React components
│       ├── hooks/            # Custom hooks
│       ├── contracts/        # ABIs & addresses
│       └── utils/            # Utility functions
│
├── CLAUDE.md                 # Developer guide
└── README.md                 # This file
```

---

## Development Commands

```bash
# Contract development
yarn compile                  # Compile contracts
yarn deploy                   # Deploy to local network
yarn deploy:zksync           # Deploy to zkSync Sepolia
yarn test                     # Run contract tests

# Frontend development
yarn start                    # Start Next.js dev server
yarn next:check-types        # TypeScript type checking
yarn next:lint               # Lint frontend code

# Testing
yarn generate-activity       # Generate test transactions
yarn hardhat:test           # Run contract tests with gas reports

# Utilities
yarn account                 # Show deployer account info
yarn format                  # Format code (both packages)
```

---

## Key Technologies

### zkSync Era
- Layer 2 scaling for lower gas costs
- Faster transactions than Ethereum mainnet
- Optimized for gaming use cases

### ERC1155
- Multi-token standard for game items
- Efficient batch transfers
- Flexible metadata system

### Scaffold-ETH 2
- Rapid dApp development framework
- Hot-reload for contracts
- Custom hooks for blockchain interactions

---

## Security Features

- **Access Control**: Only authorized contracts can mint items
- **Pausable**: Emergency stop mechanism for all contracts
- **Supply Caps**: Monthly limits prevent inflation
- **On-Chain Randomness**: Transparent lootbox mechanics (block-based)
- **Ownership Transfer**: Controlled handoff between contracts

---

## Analytics Features

The platform tracks comprehensive metrics:

- **Economic Metrics**: Minting rate, burn rate, circulation
- **Player Metrics**: Unique holders, top players, whale distribution
- **Activity Metrics**: Lootbox opens, transfers, time-based patterns
- **Revenue Metrics**: Total ETH collected from lootbox sales

All data is calculated from on-chain events in real-time.

---

## Roadmap

### Current (v1.0)
- Lootbox mechanics with weighted randomness
- ERC1155 item ownership
- Real-time analytics dashboard
- zkSync Sepolia deployment

### Future
- Multi-game support
- Secondary marketplace integration
- Crafting and fusion mechanics
- Advanced tokenomics (staking, rewards)
- Mainnet deployment

---

## License

MIT License

---

## Contact & Links

- **Documentation**: See `CLAUDE.md` for detailed developer guide
- **zkSync Docs**: https://docs.zksync.io/
- **Scaffold-ETH 2**: https://docs.scaffoldeth.io/

---

**Built with Scaffold-ETH 2 for ETH Bishkek 2025**
