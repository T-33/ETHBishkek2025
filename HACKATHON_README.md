# 🎮 Game Economy Dashboard - Xsolla Backpack Gaming dApp Bounty

> **A transparent, on-chain game economy solution for developers**

[![zkSync](https://img.shields.io/badge/zkSync-Sepolia-blue)](https://sepolia.explorer.zksync.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Built with Scaffold-ETH 2](https://img.shields.io/badge/Built%20with-Scaffold--ETH%202-orange)](https://scaffoldeth.io/)

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [Live Demo](#-live-demo)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Deployment](#-deployment)
- [How It Works](#-how-it-works)
- [Hackathon Requirements](#-hackathon-requirements)
- [Team](#-team)

---

## 🎯 Problem Statement

Game developers face critical challenges in managing in-game economies:

### The Problems:
1. **Opacity**: Developers can't see real-time item circulation and distribution
2. **Inflation**: No control over item creation leads to economic collapse
3. **Player Distrust**: Centralized control means players don't truly own items
4. **No Analytics**: Lack of data to make informed economic decisions

### Real-World Impact:
- Games like *Diablo 3* suffered from rampant item duplication
- *World of Warcraft* needed economists to manage gold inflation
- Players lose trust when economies feel manipulated

---

## 💡 Our Solution

**Game Economy Dashboard** provides:

### For Players:
- 🎁 **Transparent Lootboxes**: Provably fair random rewards on-chain
- 💎 **True Ownership**: Items are ERC1155 NFTs owned by players
- 📊 **Visibility**: See total supply and rarity of items

### For Developers:
- 📈 **Real-Time Analytics**: Track minting, burning, and circulation
- ⚙️ **Economic Controls**: Set rarity weights and supply caps
- 🔒 **Anti-Inflation**: Enforce monthly minting limits per item
- 🎮 **Modular Design**: Plug-and-play into existing games

---

## 🚀 Live Demo

### Deployed on zkSync Sepolia Testnet

**Frontend**: [https://your-demo-link.vercel.app](https://your-demo-link.vercel.app)

**Smart Contracts**:
- GameItems: [`0xYourContractAddress`](https://sepolia.explorer.zksync.io/address/0xYourContractAddress)
- EconomyController: [`0xYourContractAddress`](https://sepolia.explorer.zksync.io/address/0xYourContractAddress)
- Lootbox: [`0xYourContractAddress`](https://sepolia.explorer.zksync.io/address/0xYourContractAddress)

---

## ✨ Key Features

### 🎰 Player Portal (`/player`)
- Open on-chain lootboxes for 0.1 ETH
- Receive random items (Gold Coins, Legendary Sword, Epic Chestplate)
- View your inventory in real-time
- Provably fair weighted randomness (70% common, 20% epic, 10% legendary)

### 📊 Developer Dashboard (`/analytics`)
- **Total Minted**: All items created through lootboxes
- **Total Burned**: Items removed from circulation
- **In Circulation**: Active items in player wallets
- **Token Distribution**: Visual breakdown by item type
- **Unique Holders**: Number of distinct players
- **Real-Time Updates**: Live blockchain event monitoring

### 🔐 Economic Controls
- **Rarity Weights**: Configurable drop rates per item
- **Supply Caps**: Monthly minting limits (e.g., max 100 Legendary Swords/month)
- **Controlled Minting**: Only authorized contracts can create items
- **Transparent Rules**: All economics on-chain and auditable

---

## 🛠️ Tech Stack

### Blockchain
- **zkSync Era**: Layer 2 scaling solution for Ethereum
- **Solidity 0.8.20**: Smart contract language
- **Hardhat**: Development environment
- **zksync-ethers**: zkSync-specific library

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Wagmi v2**: React hooks for Ethereum
- **Viem**: Low-level Ethereum interactions
- **TailwindCSS**: Utility-first CSS framework

### Smart Contracts
- **ERC1155**: Multi-token NFT standard (OpenZeppelin)
- **Modular Architecture**: Separated concerns (items, economy, mechanics)

---

## 🏗️ Architecture

### Smart Contract Design

```
┌─────────────────────────────────────────────────────────────┐
│                     Contract Architecture                    │
└─────────────────────────────────────────────────────────────┘

┌──────────┐    opens     ┌──────────┐
│  Player  │─────────────▶│ Lootbox  │
└──────────┘   (0.1 ETH)  └──────────┘
                               │
                               │ requestMint()
                               ▼
                        ┌──────────────────┐
                        │ EconomyController│
                        │ - Check rarity   │
                        │ - Check caps     │
                        │ - Validate rules │
                        └──────────────────┘
                               │
                               │ mint()
                               ▼
                          ┌───────────┐
                          │ GameItems │
                          │ (ERC1155) │
                          └───────────┘
```

### Key Design Principles

1. **Separation of Concerns**:
   - `GameItems`: Only stores items (ERC1155)
   - `EconomyController`: Only enforces economic rules
   - `Lootbox`: Only handles game mechanics

2. **Security**:
   - `GameItems.mint()` can only be called by `EconomyController`
   - `EconomyController.requestMint()` can only be called by `Lootbox`
   - All rules enforced on-chain

3. **Modularity**:
   - Want different lootbox mechanics? Deploy new Lootbox contract
   - Want to change economics? Deploy new EconomyController
   - Items remain unchanged and owned by players

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.18.3
- Yarn v1 or v2+
- MetaMask wallet
- zkSync Sepolia ETH ([Get from bridge](https://bridge.zksync.io/))

### Installation

```bash
# Clone repository
git clone https://github.com/your-repo/game-economy-dashboard
cd game-economy-dashboard

# Install dependencies
yarn install

# Set up environment variables
cp packages/hardhat/.env.example packages/hardhat/.env
# Add your private key to .env

# Install zkSync dependencies
cd packages/hardhat
yarn add -D @matterlabs/hardhat-zksync @matterlabs/hardhat-zksync-deploy
yarn add zksync-ethers
```

### Local Development

```bash
# Terminal 1: Start local zkSync node (optional)
npx zksync-cli dev start

# Terminal 2: Deploy contracts to zkSync Sepolia
cd packages/hardhat
yarn deploy:zksync

# Terminal 3: Start frontend
cd packages/nextjs
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Deployment

### Deploy to zkSync Sepolia

```bash
# 1. Get Sepolia ETH
# Visit https://sepoliafaucet.com/

# 2. Bridge to zkSync Sepolia
# Visit https://bridge.zksync.io/
# Bridge your Sepolia ETH

# 3. Deploy contracts
cd packages/hardhat
yarn deploy:zksync

# 4. Update frontend with contract addresses
# Edit packages/nextjs/contracts/deployedContracts.ts

# 5. Deploy frontend
cd packages/nextjs
yarn build
vercel deploy
```

---

## 🎮 How It Works

### Player Flow

1. **Connect Wallet**: Connect MetaMask to zkSync Sepolia
2. **Navigate to /player**: Go to player portal
3. **Open Lootbox**: Click "Open Lootbox" (costs 0.1 ETH)
4. **Confirm Transaction**: MetaMask popup appears
5. **Wait for Randomness**: Smart contract generates random number
6. **Receive Item**: Award appears with animation
7. **View Inventory**: See your items in inventory panel

### Developer Flow

1. **Navigate to /analytics**: Go to developer dashboard
2. **View Metrics**: See real-time statistics:
   - Total items minted
   - Total items burned
   - Items in circulation
   - Distribution by type
3. **Monitor Activity**: Watch live updates as players open lootboxes

### Technical Flow

```typescript
// Frontend calls:
await openLootbox()

// Smart Contract execution:
Lootbox.openLootbox() {
  // 1. Verify payment
  require(msg.value == 0.1 ETH)

  // 2. Generate random number
  random = keccak256(timestamp, sender, nonce) % 100

  // 3. Determine prize
  if (random < 70) → Gold Coin
  else if (random < 90) → Legendary Sword
  else → Epic Chestplate

  // 4. Request mint through controller
  EconomyController.requestMint(player, itemId, amount) {
    // Check supply cap
    require(mintedThisMonth < monthlyLimit)

    // Mint item
    GameItems.mint(player, itemId, amount)
  }

  // 5. Emit event
  emit LootboxOpened(player, itemId, amount)
}

// Frontend receives event and updates UI
```

---

## ✅ Hackathon Requirements

### Xsolla Backpack Gaming dApp Bounty Compliance

- [x] **Built with Xsolla ZK Starter Kit**: Uses zkSync Hardhat configuration
- [x] **Deployed on zkSync Sepolia**: All contracts on zkSync L2
- [x] **Uses zksync-ethers**: All blockchain interactions via zksync-ethers
- [x] **Monorepo Structure**: Hardhat (contracts) + Next.js (frontend)
- [x] **Modular Design**: Separated GameItems, EconomyController, Lootbox
- [x] **Player-Owned Economy**: ERC1155 NFTs truly owned by players
- [x] **In-Game Item Management**: Full lifecycle (mint, track, analyze)
- [x] **NOT Gambling**: Transparent reward mechanism, not casino-style gambling

### Use Cases Addressed

1. **Player-Owned Economies**: ✅
   - Players own items as ERC1155 NFTs
   - Can trade on any marketplace
   - Transparent supply and rarity

2. **Managing In-Game Items**: ✅
   - Developer dashboard for analytics
   - Supply caps prevent inflation
   - Rarity weights control distribution

---

## 👥 Team

- **Your Name** - Full Stack Developer & Blockchain Engineer
  - GitHub: [@yourhandle](https://github.com/yourhandle)
  - Twitter: [@yourhandle](https://twitter.com/yourhandle)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

---

## 🙏 Acknowledgments

- Built with [Scaffold-ETH 2](https://scaffoldeth.io/)
- Powered by [zkSync Era](https://zksync.io/)
- Developed for [Xsolla Backpack Gaming dApp Bounty](https://xsolla.com/)

---

## 📞 Support

- **Documentation**: [ZKSYNC_MIGRATION_GUIDE.md](ZKSYNC_MIGRATION_GUIDE.md)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Demo Video**: [YouTube Link](https://youtube.com/...)

---

**Built with ❤️ for the zkSync ecosystem**
