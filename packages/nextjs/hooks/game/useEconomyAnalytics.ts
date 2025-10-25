"use client";

import { useEffect, useState } from "react";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

export interface TokenStats {
  tokenId: number;
  name: string;
  totalMinted: number;
  totalBurned: number;
  circulation: number;
}

export interface UserDistribution {
  address: string;
  balance: number;
}

export interface EconomyMetrics {
  tokenStats: TokenStats[];
  totalMinted: number;
  totalBurned: number;
  totalCirculation: number;
  uniqueHolders: number;
  totalTransactions: number;
}

const TOKEN_NAMES: { [key: number]: string } = {
  0: "Gold Coin",
  1: "Legendary Sword",
  2: "Epic Golden Chestplate",
};

export const useEconomyAnalytics = () => {
  const [metrics, setMetrics] = useState<EconomyMetrics>({
    tokenStats: [],
    totalMinted: 0,
    totalBurned: 0,
    totalCirculation: 0,
    uniqueHolders: 0,
    totalTransactions: 0,
  });

  // Watch for all TransferSingle events (mints, burns, transfers)
  const { data: transferEvents, isLoading } = useScaffoldEventHistory({
    contractName: "GameItems",
    eventName: "TransferSingle",
    fromBlock: 0n,
    watch: true,
  });

  // Watch for LootboxOpened events to track player activity
  const { data: lootboxEvents } = useScaffoldEventHistory({
    contractName: "Lootbox",
    eventName: "LootboxOpened",
    fromBlock: 0n,
    watch: true,
  });

  useEffect(() => {
    if (!transferEvents || transferEvents.length === 0) {
      return;
    }

    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

    // Track stats per token
    const tokenStatsMap: { [key: number]: { minted: number; burned: number } } = {
      0: { minted: 0, burned: 0 },
      1: { minted: 0, burned: 0 },
      2: { minted: 0, burned: 0 },
    };

    // Track user balances for distribution
    const userBalances: { [address: string]: { [tokenId: number]: number } } = {};
    const uniqueUsers = new Set<string>();

    transferEvents.forEach(event => {
      const from = (event.args.from as string)?.toLowerCase();
      const to = (event.args.to as string)?.toLowerCase();
      const tokenId = Number(event.args.id);
      const amount = Number(event.args.value);

      // Mint event (from zero address)
      if (from === ZERO_ADDRESS.toLowerCase()) {
        tokenStatsMap[tokenId].minted += amount;

        // Update user balance
        if (!userBalances[to]) {
          userBalances[to] = { 0: 0, 1: 0, 2: 0 };
        }
        userBalances[to][tokenId] = (userBalances[to][tokenId] || 0) + amount;
        uniqueUsers.add(to);
      }
      // Burn event (to zero address)
      else if (to === ZERO_ADDRESS.toLowerCase()) {
        tokenStatsMap[tokenId].burned += amount;

        // Update user balance
        if (userBalances[from]) {
          userBalances[from][tokenId] = (userBalances[from][tokenId] || 0) - amount;
        }
      }
      // Transfer event
      else {
        if (!userBalances[from]) {
          userBalances[from] = { 0: 0, 1: 0, 2: 0 };
        }
        if (!userBalances[to]) {
          userBalances[to] = { 0: 0, 1: 0, 2: 0 };
        }

        userBalances[from][tokenId] = (userBalances[from][tokenId] || 0) - amount;
        userBalances[to][tokenId] = (userBalances[to][tokenId] || 0) + amount;

        uniqueUsers.add(from);
        uniqueUsers.add(to);
      }
    });

    // Calculate totals
    let totalMinted = 0;
    let totalBurned = 0;
    const tokenStats: TokenStats[] = Object.entries(tokenStatsMap).map(([tokenId, stats]) => {
      totalMinted += stats.minted;
      totalBurned += stats.burned;

      return {
        tokenId: Number(tokenId),
        name: TOKEN_NAMES[Number(tokenId)] || `Token ${tokenId}`,
        totalMinted: stats.minted,
        totalBurned: stats.burned,
        circulation: stats.minted - stats.burned,
      };
    });

    setMetrics({
      tokenStats,
      totalMinted,
      totalBurned,
      totalCirculation: totalMinted - totalBurned,
      uniqueHolders: uniqueUsers.size,
      totalTransactions: transferEvents.length,
    });
  }, [transferEvents]);

  return {
    metrics,
    isLoading,
    lootboxOpenings: lootboxEvents?.length || 0,
  };
};
