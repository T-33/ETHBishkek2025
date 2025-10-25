"use client";

import { useAccount } from "wagmi";
import { useScaffoldEventHistory, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export interface LootboxReward {
  tokenId: number;
  amount: number;
  transactionHash?: string;
  timestamp?: number;
}

export const useLootbox = () => {
  const { address } = useAccount();

  // Read lootbox price
  const { data: lootboxPrice } = useScaffoldReadContract({
    contractName: "Lootbox",
    functionName: "lootboxPrice",
  });

  // Write contract for opening lootbox
  const { writeContractAsync: openLootboxAsync, isPending } = useScaffoldWriteContract({
    contractName: "Lootbox",
  });

  // Watch for LootboxOpened events
  const { data: lootboxEvents, isLoading: eventsLoading } = useScaffoldEventHistory({
    contractName: "Lootbox",
    eventName: "LootboxOpened",
    fromBlock: 0n,
    watch: true,
    filters: { player: address },
  });

  const openLootbox = async () => {
    if (!lootboxPrice) {
      throw new Error("Lootbox price not loaded");
    }

    try {
      const tx = await openLootboxAsync({
        functionName: "openLootbox",
        value: lootboxPrice as bigint,
      });

      // Wait a bit for the event to be emitted
      await new Promise(resolve => setTimeout(resolve, 2000));

      return tx;
    } catch (error) {
      console.error("Error opening lootbox:", error);
      throw error;
    }
  };

  // Get last reward from events
  const getLastReward = (): LootboxReward | null => {
    if (!lootboxEvents || lootboxEvents.length === 0) return null;

    const lastEvent = lootboxEvents[0]; // Events are sorted by newest first
    return {
      tokenId: Number(lastEvent.args.prizeTokenId),
      amount: Number(lastEvent.args.amount),
      transactionHash: lastEvent.transactionHash,
      timestamp: Date.now(),
    };
  };

  return {
    address,
    lootboxPrice,
    openLootbox,
    isPending,
    lastReward: getLastReward(),
    lootboxHistory: lootboxEvents || [],
    eventsLoading,
  };
};
