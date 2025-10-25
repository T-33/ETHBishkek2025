# 🚀 zkSync Migration Guide - Game Economy Dashboard

## Complete Migration to Xsolla ZK Sepolia Testnet

This guide provides step-by-step instructions to migrate the existing Game Economy Dashboard project to zkSync using the Xsolla ZK Starter Kit.

---

## 📦 Step 1: Install zkSync Dependencies

### Update `packages/hardhat/package.json`:

Add these dependencies to your `devDependencies`:

```json
{
  "devDependencies": {
    "@matterlabs/hardhat-zksync": "^1.2.0",
    "@matterlabs/hardhat-zksync-deploy": "^1.5.0",
    "@matterlabs/hardhat-zksync-solc": "^1.2.4",
    "@matterlabs/hardhat-zksync-verify": "^1.6.0",
    "@matterlabs/zksync-contracts": "^0.6.1",
    "zksync-ethers": "^6.11.0"
  }
}
```

### Install dependencies:

```bash
cd packages/hardhat
yarn add -D @matterlabs/hardhat-zksync @matterlabs/hardhat-zksync-deploy @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-verify @matterlabs/zksync-contracts
yarn add zksync-ethers
```

---

## 🔧 Step 2: Update Hardhat Configuration

Replace `packages/hardhat/hardhat.config.ts` with zkSync configuration:

```typescript
import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@matterlabs/hardhat-zksync";
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-verify";

const deployerPrivateKey =
  process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY ||
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const config: HardhatUserConfig = {
  zksolc: {
    version: "latest",
    settings: {
      optimizer: {
        enabled: true,
        mode: "3"
      },
    },
  },
  defaultNetwork: "zkSyncSepoliaTestnet",
  networks: {
    zkSyncSepoliaTestnet: {
      url: "https://sepolia.era.zksync.dev",
      ethNetwork: "sepolia",
      zksync: true,
      verifyURL: "https://explorer.sepolia.era.zksync.dev/contract_verification",
      accounts: [deployerPrivateKey],
    },
    zkSyncMainnet: {
      url: "https://mainnet.era.zksync.io",
      ethNetwork: "mainnet",
      zksync: true,
      verifyURL: "https://zksync2-mainnet-explorer.zksync.io/contract_verification",
      accounts: [deployerPrivateKey],
    },
    // Local zkSync node (for testing)
    zkSyncLocal: {
      url: "http://localhost:3050",
      ethNetwork: "http://localhost:8545",
      zksync: true,
      accounts: [deployerPrivateKey],
    },
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

export default config;
```

---

## 📝 Step 3: Create zkSync Deployment Script

Create `packages/hardhat/deploy-zksync/deploy.ts`:

```typescript
import { Wallet } from "zksync-ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import * as ethers from "ethers";

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for zkSync`);

  // Get deployer wallet
  const wallet = new Wallet(
    process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY ||
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  );

  const deployer = new Deployer(hre, wallet);
  const deployerAddress = await deployer.zkWallet.getAddress();

  console.log(`Deployer address: ${deployerAddress}`);
  console.log(`Deployer balance: ${ethers.formatEther(await deployer.zkWallet.getBalance())} ETH`);

  // 1. Deploy GameItems (ERC1155)
  console.log("\n📦 Deploying GameItems...");
  const gameItemsArtifact = await deployer.loadArtifact("GameItems");
  const gameItems = await deployer.deploy(gameItemsArtifact, [
    "https://ipfs.io/ipfs/", // Base URI for metadata
    deployerAddress,          // Initial owner (will transfer to EconomyController)
  ]);
  await gameItems.waitForDeployment();
  const gameItemsAddress = await gameItems.getAddress();
  console.log(`✅ GameItems deployed to: ${gameItemsAddress}`);

  // 2. Deploy EconomyController
  console.log("\n📦 Deploying EconomyController...");
  const economyControllerArtifact = await deployer.loadArtifact("EconomyController");
  const economyController = await deployer.deploy(economyControllerArtifact, [
    gameItemsAddress,
    deployerAddress,
  ]);
  await economyController.waitForDeployment();
  const economyControllerAddress = await economyController.getAddress();
  console.log(`✅ EconomyController deployed to: ${economyControllerAddress}`);

  // 3. Deploy Lootbox
  console.log("\n📦 Deploying Lootbox...");
  const lootboxArtifact = await deployer.loadArtifact("Lootbox");
  const lootbox = await deployer.deploy(lootboxArtifact, [
    economyControllerAddress,
    deployerAddress,
  ]);
  await lootbox.waitForDeployment();
  const lootboxAddress = await lootbox.getAddress();
  console.log(`✅ Lootbox deployed to: ${lootboxAddress}`);

  // 4. Configuration
  console.log("\n⚙️  Configuring contracts...");

  // Transfer GameItems ownership to EconomyController
  console.log("Transferring GameItems ownership to EconomyController...");
  const transferTx = await gameItems.transferOwnership(economyControllerAddress);
  await transferTx.wait();
  console.log("✅ Ownership transferred");

  // Set Lootbox address in EconomyController
  console.log("Setting Lootbox address in EconomyController...");
  const setLootboxTx = await economyController.setLootboxAddress(lootboxAddress);
  await setLootboxTx.wait();
  console.log("✅ Lootbox address set");

  // Configure rarity weights
  console.log("Configuring item rarity...");
  const setRarityTx = await economyController.setRarity(
    [0, 1, 2],        // Token IDs: Gold Coin, Legendary Sword, Epic Chestplate
    [70, 20, 10]      // Weights: 70%, 20%, 10%
  );
  await setRarityTx.wait();
  console.log("✅ Rarity configured");

  // Set monthly cap for legendary items
  console.log("Setting monthly cap for Legendary Sword...");
  const setCapTx = await economyController.setMonthlyCap(
    1,    // Token ID 1 (Legendary Sword)
    10,   // Max 10 per month
    30    // Period: 30 days
  );
  await setCapTx.wait();
  console.log("✅ Monthly cap set");

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  console.log(`GameItems:         ${gameItemsAddress}`);
  console.log(`EconomyController: ${economyControllerAddress}`);
  console.log(`Lootbox:           ${lootboxAddress}`);
  console.log("=".repeat(60));
  console.log(`\n📝 Verify on zkSync Explorer:`);
  console.log(`https://sepolia.explorer.zksync.io/address/${gameItemsAddress}`);
  console.log(`https://sepolia.explorer.zksync.io/address/${economyControllerAddress}`);
  console.log(`https://sepolia.explorer.zksync.io/address/${lootboxAddress}`);

  // Save deployment addresses
  const fs = require("fs");
  const deploymentData = {
    network: "zkSyncSepoliaTestnet",
    chainId: 300, // zkSync Sepolia
    contracts: {
      GameItems: gameItemsAddress,
      EconomyController: economyControllerAddress,
      Lootbox: lootboxAddress,
    },
    deployer: deployerAddress,
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    "deployments/zksync-sepolia.json",
    JSON.stringify(deploymentData, null, 2)
  );
  console.log("\n✅ Deployment data saved to deployments/zksync-sepolia.json");
}
```

---

## 🧪 Step 4: Update package.json Scripts

Add zkSync-specific scripts to `packages/hardhat/package.json`:

```json
{
  "scripts": {
    "deploy:zksync": "hardhat deploy-zksync --script deploy.ts",
    "verify:zksync": "hardhat verify --network zkSyncSepoliaTestnet",
    "compile:zksync": "hardhat compile"
  }
}
```

---

## 🌐 Step 5: Update Frontend for zksync-ethers

### Update `packages/nextjs/package.json`:

```json
{
  "dependencies": {
    "zksync-ethers": "^6.11.0"
  }
}
```

### Install:

```bash
cd packages/nextjs
yarn add zksync-ethers
```

---

## 🔌 Step 6: Update Scaffold Config for zkSync

Update `packages/nextjs/scaffold.config.ts`:

```typescript
import * as chains from "viem/chains";
import { defineChain } from "viem";

// Define zkSync Sepolia Testnet
export const zkSyncSepoliaTestnet = defineChain({
  id: 300,
  name: 'zkSync Sepolia Testnet',
  network: 'zksync-sepolia-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.era.zksync.dev'],
      webSocket: ['wss://sepolia.era.zksync.dev/ws'],
    },
    public: {
      http: ['https://sepolia.era.zksync.dev'],
      webSocket: ['wss://sepolia.era.zksync.dev/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'zkSync Explorer',
      url: 'https://sepolia.explorer.zksync.io',
    },
  },
  testnet: true,
});

const scaffoldConfig = {
  targetNetworks: [zkSyncSepoliaTestnet],
  pollingInterval: 30000,
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "",
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
  onlyLocalBurnerWallet: false,
} as const;

export default scaffoldConfig;
```

---

## 💰 Step 7: Get Testnet Funds

1. **Get Sepolia ETH** from faucet:
   - https://sepoliafaucet.com/
   - https://www.alchemy.com/faucets/ethereum-sepolia

2. **Bridge to zkSync Sepolia**:
   - Visit: https://bridge.zksync.io/
   - Connect wallet
   - Select: Sepolia → zkSync Sepolia
   - Bridge your ETH

3. **Verify balance**:
   ```bash
   # Check your zkSync Sepolia balance
   https://sepolia.explorer.zksync.io/address/YOUR_ADDRESS
   ```

---

## 🚀 Step 8: Deploy to zkSync

```bash
cd packages/hardhat

# Compile contracts
yarn compile:zksync

# Deploy to zkSync Sepolia
yarn deploy:zksync
```

---

## ✅ Step 9: Verify Contracts

```bash
# Verify GameItems
yarn verify:zksync <GAME_ITEMS_ADDRESS> "https://ipfs.io/ipfs/" <DEPLOYER_ADDRESS>

# Verify EconomyController
yarn verify:zksync <ECONOMY_CONTROLLER_ADDRESS> <GAME_ITEMS_ADDRESS> <DEPLOYER_ADDRESS>

# Verify Lootbox
yarn verify:zksync <LOOTBOX_ADDRESS> <ECONOMY_CONTROLLER_ADDRESS> <DEPLOYER_ADDRESS>
```

---

## 🔍 Step 10: Update Frontend Contract Addresses

After deployment, update `packages/nextjs/contracts/deployedContracts.ts`:

```typescript
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  300: { // zkSync Sepolia chainId
    GameItems: {
      address: "0xYOUR_GAMEITEMS_ADDRESS",
      abi: [...], // Copy from artifacts
    },
    EconomyController: {
      address: "0xYOUR_ECONOMY_CONTROLLER_ADDRESS",
      abi: [...],
    },
    Lootbox: {
      address: "0xYOUR_LOOTBOX_ADDRESS",
      abi: [...],
    },
  },
} as const satisfies GenericContractsDeclaration;

export default deployedContracts;
```

---

## 🧪 Step 11: Test the Application

```bash
# Terminal 1: Start frontend
cd packages/nextjs
yarn dev

# Open browser
http://localhost:3000
```

1. **Connect MetaMask** to zkSync Sepolia
2. **Go to /player** page
3. **Open lootbox** (pay 0.1 ETH)
4. **Check /analytics** for statistics

---

## 📚 Additional Resources

- **zkSync Docs**: https://docs.zksync.io/
- **Xsolla ZK Starter Kit**: https://github.com/GoldenSylph/xsolla-zk-smart-contracts-starter-kit
- **zkSync Explorer**: https://sepolia.explorer.zksync.io/
- **Bridge**: https://bridge.zksync.io/

---

## ⚠️ Important Notes

1. **Gas on zkSync**: Much cheaper than Ethereum L1
2. **Contract Verification**: Use zkSync explorer verification
3. **Testnet Faucets**: Keep some Sepolia ETH for bridging
4. **Wallet Setup**: Add zkSync Sepolia network to MetaMask:
   - Network Name: zkSync Sepolia Testnet
   - RPC URL: https://sepolia.era.zksync.dev
   - Chain ID: 300
   - Currency Symbol: ETH
   - Block Explorer: https://sepolia.explorer.zksync.io

---

## 🎯 Hackathon Checklist

- [ ] Contracts deployed on zkSync Sepolia
- [ ] Contracts verified on zkSync Explorer
- [ ] Frontend connected to zkSync network
- [ ] Player page working (open lootbox)
- [ ] Analytics page showing data
- [ ] README updated with zkSync deployment info
- [ ] Demo video/screenshots prepared
- [ ] Submission form completed

---

**Good luck with the Xsolla Backpack Gaming dApp Bounty! 🚀**
