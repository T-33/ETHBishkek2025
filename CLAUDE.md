# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Scaffold-ETH 2** based project for ETH Bishkek 2025 - a game economy platform with NFT lootboxes and ERC1155 game items. Built on NextJS (App Router), RainbowKit, Wagmi, Viem, and TypeScript with Hardhat for smart contract development.

## Development Commands

### Local Development Workflow
```bash
# Start local blockchain (Terminal 1)
yarn chain

# Deploy contracts (Terminal 2)
yarn deploy

# Start frontend (Terminal 3)
yarn start
# Frontend runs at http://localhost:3000
# Debug contracts UI at http://localhost:3000/debug

# Generate test data for analytics (Optional, after deployment)
yarn generate-activity
# Populates analytics dashboard with test transactions
```

### Testing & Quality
```bash
# Run contract tests
yarn test                    # or yarn hardhat:test
yarn hardhat:test            # Runs with gas reporting enabled

# Type checking
yarn hardhat:check-types     # Smart contracts
yarn next:check-types        # Frontend

# Linting & Formatting
yarn lint                    # Both packages
yarn format                  # Both packages
yarn hardhat:lint            # Smart contracts only
yarn next:lint               # Frontend only
```

### Contract Development
```bash
yarn compile                 # Compile contracts (generates TypeChain types)
yarn hardhat:clean           # Clean artifacts and cache
yarn flatten                 # Flatten contracts for verification
yarn verify                  # Verify on Etherscan
```

### Account Management
```bash
yarn account                 # List account info
yarn generate                # Generate new account
yarn account:import          # Import existing private key
yarn account:reveal-pk       # Reveal private key
```

### Deployment
```bash
yarn vercel                  # Deploy frontend to Vercel
yarn ipfs                    # Deploy to IPFS
```

## Architecture

### Monorepo Structure
- **packages/hardhat**: Solidity contracts, deployment scripts, tests
- **packages/nextjs**: Next.js frontend with App Router

### Smart Contract System

**Core Contracts:**

1. **GameItems.sol** (ERC1155)
   - Multi-token standard for game items
   - Token IDs: 0 (GOLD_COIN), 1 (LEGENDARY_SWORD), 2 (EPIC_GOLDEN_CHESTPLATE)
   - Minting restricted to owner only
   - Metadata URI pattern: `{baseURI}{tokenId}.json`

2. **EconomyController.sol**
   - Central economic control layer
   - Manages rarity weights for loot drops (weighted randomness)
   - Enforces supply caps with time-based periods
   - Only authorized Lootbox contract can request mints via `requestMint()`
   - Set lootbox address with `setLootboxAddress()`
   - Configure rarity: `setRarity(tokenIds[], weights[])`
   - Set caps: `setMonthlyCap(tokenId, cap, periodInDays)`

3. **Lootbox.sol**
   - Players pay ETH (default 0.1 ETH) to open lootbox
   - Uses pseudo-randomness (block.timestamp, msg.sender, nonce)
   - Weighted prize selection based on EconomyController rarity settings
   - Gold coins (tokenId 0) reward 100 units, other items reward 1 unit
   - Owner can withdraw accumulated fees

**Contract Interaction Flow:**
```
Player → Lootbox.openLootbox()
       → EconomyController.requestMint() (validates caps/rules)
       → GameItems.mint() (actual minting)
```

### Frontend Architecture

**Key Directories:**
- `app/`: Next.js App Router pages (dashboard, debug, blockexplorer)
- `components/`: UI components (including game-dashboard components)
- `hooks/`: Custom React hooks
  - `hooks/scaffold-eth/`: SE-2 blockchain interaction hooks
  - `hooks/game/`: Game-specific hooks (useGameToken, useAnalytics)
- `contracts/`: Contract ABIs and addresses
  - `deployedContracts.ts`: Auto-generated from deployments
  - `externalContracts.ts`: External contract configurations
- `services/`: Business logic and utilities
- `utils/`: Helper functions

**Custom Dashboard Features:**
- Game economy analytics dashboard at `/dashboard`
- Real-time metrics (minted, burned, circulation)
- Event log table and chart panels
- Integrated with game hooks for token operations

### Contract Interaction Patterns

**ALWAYS use these Scaffold-ETH 2 hooks (never use wagmi/viem directly):**

**Reading from contracts:**
```typescript
const { data: balance } = useScaffoldReadContract({
  contractName: "GameItems",
  functionName: "balanceOf",
  args: [address, tokenId],
});
```

**Writing to contracts:**
```typescript
const { writeContractAsync } = useScaffoldWriteContract({
  contractName: "Lootbox"
});

await writeContractAsync({
  functionName: "openLootbox",
  value: parseEther("0.1"),
});
```

**Reading events:**
```typescript
const { data: events } = useScaffoldEventHistory({
  contractName: "Lootbox",
  eventName: "LootboxOpened",
  watch: true,
});
```

**Other hooks available:**
- `useScaffoldWatchContractEvent`: Watch for new events in real-time
- `useDeployedContractInfo`: Get contract address and ABI
- `useScaffoldContract`: Get contract instance
- `useTransactor`: Transaction wrapper with notifications

### Display Components (packages/nextjs/components/scaffold-eth)

**Always use these for Ethereum data:**
- `<Address address={...} />`: Display ETH addresses (with ENS resolution)
- `<AddressInput />`: Input field for addresses
- `<Balance address={...} />`: Show ETH/token balance
- `<EtherInput />`: Number input with ETH/USD conversion

## Configuration

**Network Configuration:** `packages/nextjs/scaffold.config.ts`
- Set `targetNetworks` (default: hardhat local)
- Configure `pollingInterval` (default: 30000ms)
- Set Alchemy API key
- Configure RPC overrides per chain
- Control burner wallet behavior

**Hardhat Configuration:** `packages/hardhat/hardhat.config.ts`
- Default network: localhost
- Deployer account from `__RUNTIME_DEPLOYER_PRIVATE_KEY` env var
- Solidity 0.8.20 with 200 optimizer runs
- Pre-configured networks: mainnet, sepolia, arbitrum, optimism, polygon, base, scroll, celo, gnosis
- Auto-generates TypeScript ABIs after deployment

## Deployment Scripts

Located in `packages/hardhat/deploy/`:
- Deployment scripts are numbered (e.g., `00_deploy_your_contract.ts`)
- Uses hardhat-deploy plugin
- Automatically generates `deployedContracts.ts` for frontend
- After deployment, contracts appear in Debug UI automatically

## Important Notes

- This project uses **Next.js App Router**, not Pages Router
- Contract hot reload: Frontend auto-updates when contracts change
- TypeChain types are auto-generated on compile
- The Debug Contracts page (`/debug`) provides instant UI for contract interaction
- Environment variables should be in `.env` (hardhat) or `.env.local` (nextjs)
- Deployer private key defaults to Hardhat account #0 if not set
- Run `yarn deploy` after contract changes to update frontend ABIs
