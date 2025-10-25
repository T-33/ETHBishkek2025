"use client";

import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

// Token IDs from GameItems.sol
export const GAME_ITEMS = {
  GOLD_COIN: { id: 0, name: "Gold Coin", rarity: "common" },
  LEGENDARY_SWORD: { id: 1, name: "Legendary Sword", rarity: "legendary" },
  EPIC_GOLDEN_CHESTPLATE: { id: 2, name: "Epic Golden Chestplate", rarity: "epic" },
} as const;

export interface InventoryItem {
  tokenId: number;
  name: string;
  rarity: string;
  balance: number;
}

export const useInventory = () => {
  const { address } = useAccount();

  // Read balances for all token types
  const { data: goldBalance, refetch: refetchGold } = useScaffoldReadContract({
    contractName: "GameItems",
    functionName: "balanceOf",
    args: [address, BigInt(GAME_ITEMS.GOLD_COIN.id)],
  });

  const { data: swordBalance, refetch: refetchSword } = useScaffoldReadContract({
    contractName: "GameItems",
    functionName: "balanceOf",
    args: [address, BigInt(GAME_ITEMS.LEGENDARY_SWORD.id)],
  });

  const { data: chestplateBalance, refetch: refetchChestplate } = useScaffoldReadContract({
    contractName: "GameItems",
    functionName: "balanceOf",
    args: [address, BigInt(GAME_ITEMS.EPIC_GOLDEN_CHESTPLATE.id)],
  });

  const refetchAll = () => {
    refetchGold();
    refetchSword();
    refetchChestplate();
  };

  const inventory: InventoryItem[] = [
    {
      tokenId: GAME_ITEMS.GOLD_COIN.id,
      name: GAME_ITEMS.GOLD_COIN.name,
      rarity: GAME_ITEMS.GOLD_COIN.rarity,
      balance: goldBalance ? Number(goldBalance) : 0,
    },
    {
      tokenId: GAME_ITEMS.LEGENDARY_SWORD.id,
      name: GAME_ITEMS.LEGENDARY_SWORD.name,
      rarity: GAME_ITEMS.LEGENDARY_SWORD.rarity,
      balance: swordBalance ? Number(swordBalance) : 0,
    },
    {
      tokenId: GAME_ITEMS.EPIC_GOLDEN_CHESTPLATE.id,
      name: GAME_ITEMS.EPIC_GOLDEN_CHESTPLATE.name,
      rarity: GAME_ITEMS.EPIC_GOLDEN_CHESTPLATE.rarity,
      balance: chestplateBalance ? Number(chestplateBalance) : 0,
    },
  ];

  return {
    inventory,
    refetchAll,
    totalItems: inventory.reduce((sum, item) => sum + item.balance, 0),
  };
};
