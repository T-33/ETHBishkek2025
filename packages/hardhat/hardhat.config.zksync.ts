import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
// Import only essential zkSync plugins to avoid conflicts
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-verify";

/**
 * zkSync Hardhat Configuration for Game Economy Dashboard
 *
 * This configuration file sets up the project for zkSync deployment.
 * It includes network configurations for zkSync Sepolia Testnet and Mainnet.
 *
 * IMPORTANT: Before deploying, ensure you have:
 * 1. Set __RUNTIME_DEPLOYER_PRIVATE_KEY in .env
 * 2. Bridged ETH to zkSync Sepolia (https://bridge.zksync.io/)
 * 3. Installed zkSync dependencies (see ZKSYNC_MIGRATION_GUIDE.md)
 */

// Deployer private key from environment variable or default (for local testing only!)
const deployerPrivateKey =
  process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const config: HardhatUserConfig = {
  // zkSync compiler configuration
  zksolc: {
    version: "1.5.7", // Stable zksolc version compatible with Solidity 0.8.20
    settings: {
      optimizer: {
        enabled: true,
        mode: "3", // Optimization mode (0-3, higher = more optimized)
      },
    },
  },

  // Default network for deployment
  defaultNetwork: "zkSyncSepoliaTestnet",

  // Network configurations
  networks: {
    // zkSync Sepolia Testnet (Primary testnet for Xsolla Bounty)
    zkSyncSepoliaTestnet: {
      url: "https://sepolia.era.zksync.dev",
      ethNetwork: "sepolia", // Underlying L1 network
      zksync: true,
      verifyURL: "https://explorer.sepolia.era.zksync.dev/contract_verification",
      accounts: [deployerPrivateKey],
    },

    // zkSync Era Mainnet (Production)
    zkSyncMainnet: {
      url: "https://mainnet.era.zksync.io",
      ethNetwork: "mainnet",
      zksync: true,
      verifyURL: "https://zksync2-mainnet-explorer.zksync.io/contract_verification",
      accounts: [deployerPrivateKey],
    },

    // Local zkSync node (for local development and testing)
    // Run with: npx zksync-cli dev start
    zkSyncLocal: {
      url: "http://localhost:3050",
      ethNetwork: "http://localhost:8545",
      zksync: true,
      accounts: [deployerPrivateKey],
    },

    // Ethereum Sepolia (for reference, not used for zkSync deployment)
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY || ""}`,
      accounts: [deployerPrivateKey],
    },
  },

  // Solidity compiler configuration (for standard Solidity compilation)
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  // Paths configuration
  paths: {
    artifacts: "./artifacts-zk",
    cache: "./cache-zk",
    sources: "./contracts",
    tests: "./test",
  },
};

export default config;
