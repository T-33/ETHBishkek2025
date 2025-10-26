# Status Network Deployed Addresses

После деплоя на Status Network Sepolia, запишите сюда адреса:

## Contract Addresses

```
GameItems:         0x____________________
EconomyController: 0x____________________
Lootbox:           0x____________________
```

## Explorer Links

```
GameItems:         https://sepolia.status.im/address/0x____________________
EconomyController: https://sepolia.status.im/address/0x____________________
Lootbox:           https://sepolia.status.im/address/0x____________________
```

## Deployment Info

- Network: Status Network Sepolia
- Chain ID: 10200
- RPC: https://sepolia.status.im
- Deployed By: 0x____________________
- Deployed At: ____________________
- Lootbox Price: 0.001 ETH

## Next Steps

1. Update `packages/nextjs/contracts/deployedContracts.ts`
   - Add chain ID 10200
   - Add these addresses

2. Update `packages/nextjs/scaffold.config.ts`
   - Change `targetNetworks: [statusSepolia]`

3. Test on frontend:
   ```bash
   yarn start
   # Connect MetaMask to Status Network Sepolia
   # Try opening lootbox (gasless!)
   # Try burning tokens (gasless!)
   ```

4. Generate activity:
   ```bash
   yarn generate-activity:status
   # All transactions will be gasless!
   ```

## Configuration for deployedContracts.ts

```typescript
10200: { // Status Network Sepolia
  GameItems: {
    address: "0x____________________", // Paste GameItems address
    abi: [/* Copy from hardhat/deployments/localhost/GameItems.json */],
  },
  EconomyController: {
    address: "0x____________________", // Paste EconomyController address
    abi: [/* Copy from hardhat/deployments/localhost/EconomyController.json */],
  },
  Lootbox: {
    address: "0x____________________", // Paste Lootbox address
    abi: [/* Copy from hardhat/deployments/localhost/Lootbox.json */],
  },
},
```

## How to Get ABIs

ABIs are in the `packages/nextjs/contracts/deployedContracts.ts` file under the `hardhat` or `localhost` chain.
Just copy the same ABIs - they don't change between networks!

## Verification (Optional)

Status Network uses Blockscout explorer. You can verify contracts manually through the explorer UI.

---

**Remember: ALL transactions on Status Network are GASLESS! 🎉**
