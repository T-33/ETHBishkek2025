"use client";

import { useMemo } from "react";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

export interface DailyMetrics {
  date: string;
  minted: number;
  burned: number;
  revenue: number;
  transactions: number;
}

export interface TokenMetrics {
  tokenId: number;
  name: string;
  totalMinted: number;
  totalBurned: number;
  circulation: number;
  holders: number;
}

export interface TopPlayer {
  address: string;
  totalItems: number;
  goldCoins: number;
  swords: number;
  chestplates: number;
  totalValue: number;
}

export interface WhaleData {
  address: string;
  percentage: number;
  items: number;
  category: "whale" | "dolphin" | "fish";
}

export interface ActivityHeatmapData {
  hour: number;
  day: number; // 0 = Sunday, 6 = Saturday
  count: number;
}

export interface RecentEvent {
  type: "mint" | "burn" | "transfer" | "lootbox";
  player: string;
  tokenId?: number;
  amount?: number;
  timestamp: number;
  txHash: string;
}

const TOKEN_NAMES: { [key: number]: string } = {
  0: "Gold Coin",
  1: "Legendary Sword",
  2: "Epic Golden Chestplate",
};

const LOOTBOX_PRICE = 0.1; // ETH

export const useAdvancedAnalytics = () => {
  // Fetch all transfer events
  const { data: transferEvents, isLoading: transferLoading } = useScaffoldEventHistory({
    contractName: "GameItems",
    eventName: "TransferSingle",
    fromBlock: 0n,
    watch: true,
  });

  // Fetch lootbox events
  const { data: lootboxEvents, isLoading: lootboxLoading } = useScaffoldEventHistory({
    contractName: "Lootbox",
    eventName: "LootboxOpened",
    fromBlock: 0n,
    watch: true,
  });

  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

  // ===================================
  // DAILY METRICS (Last 30 days)
  // ===================================
  const dailyMetrics = useMemo((): DailyMetrics[] => {
    if (!transferEvents || !lootboxEvents) return [];

    const metricsMap: { [date: string]: DailyMetrics } = {};
    const last30Days: string[] = [];

    // Generate last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      last30Days.push(dateStr);
      metricsMap[dateStr] = {
        date: dateStr,
        minted: 0,
        burned: 0,
        revenue: 0,
        transactions: 0,
      };
    }

    // Process transfer events
    // Note: In local test environment, all events appear in current period
    // For true historical data, deploy to testnet and wait over time
    transferEvents.forEach(event => {
      const timestamp = Date.now(); // Current time (limitation of local test env)
      const date = new Date(timestamp).toISOString().split("T")[0];

      if (!metricsMap[date]) return;

      const from = (event.args.from as string)?.toLowerCase();
      const to = (event.args.to as string)?.toLowerCase();
      const amount = Number(event.args.value);

      if (from === ZERO_ADDRESS.toLowerCase()) {
        metricsMap[date].minted += amount;
      } else if (to === ZERO_ADDRESS.toLowerCase()) {
        metricsMap[date].burned += amount;
      }

      metricsMap[date].transactions++;
    });

    // Process lootbox events for revenue
    lootboxEvents.forEach(() => {
      const timestamp = Date.now(); // Current time (limitation of local test env)
      const date = new Date(timestamp).toISOString().split("T")[0];

      if (metricsMap[date]) {
        metricsMap[date].revenue += LOOTBOX_PRICE;
      }
    });

    return last30Days.map(date => metricsMap[date]);
  }, [transferEvents, lootboxEvents]);

  // ===================================
  // TOKEN METRICS
  // ===================================
  const tokenMetrics = useMemo((): TokenMetrics[] => {
    if (!transferEvents) return [];

    const metrics: { [tokenId: number]: TokenMetrics } = {
      0: { tokenId: 0, name: TOKEN_NAMES[0], totalMinted: 0, totalBurned: 0, circulation: 0, holders: 0 },
      1: { tokenId: 1, name: TOKEN_NAMES[1], totalMinted: 0, totalBurned: 0, circulation: 0, holders: 0 },
      2: { tokenId: 2, name: TOKEN_NAMES[2], totalMinted: 0, totalBurned: 0, circulation: 0, holders: 0 },
    };

    const holdersByToken: { [tokenId: number]: Set<string> } = {
      0: new Set(),
      1: new Set(),
      2: new Set(),
    };

    transferEvents.forEach(event => {
      const from = (event.args.from as string)?.toLowerCase();
      const to = (event.args.to as string)?.toLowerCase();
      const tokenId = Number(event.args.id);
      const amount = Number(event.args.value);

      if (!metrics[tokenId]) return;

      if (from === ZERO_ADDRESS.toLowerCase()) {
        metrics[tokenId].totalMinted += amount;
        holdersByToken[tokenId].add(to);
      } else if (to === ZERO_ADDRESS.toLowerCase()) {
        metrics[tokenId].totalBurned += amount;
      } else {
        holdersByToken[tokenId].add(from);
        holdersByToken[tokenId].add(to);
      }
    });

    Object.keys(metrics).forEach(tokenId => {
      const id = Number(tokenId);
      metrics[id].circulation = metrics[id].totalMinted - metrics[id].totalBurned;
      metrics[id].holders = holdersByToken[id].size;
    });

    return Object.values(metrics);
  }, [transferEvents]);

  // ===================================
  // TOP PLAYERS / LEADERBOARD
  // ===================================
  const topPlayers = useMemo((): TopPlayer[] => {
    if (!transferEvents) return [];

    const playerBalances: {
      [address: string]: { gold: number; sword: number; chestplate: number };
    } = {};

    transferEvents.forEach(event => {
      const from = (event.args.from as string)?.toLowerCase();
      const to = (event.args.to as string)?.toLowerCase();
      const tokenId = Number(event.args.id);
      const amount = Number(event.args.value);

      if (from !== ZERO_ADDRESS.toLowerCase()) {
        if (!playerBalances[from]) {
          playerBalances[from] = { gold: 0, sword: 0, chestplate: 0 };
        }
        if (tokenId === 0) playerBalances[from].gold -= amount;
        else if (tokenId === 1) playerBalances[from].sword -= amount;
        else if (tokenId === 2) playerBalances[from].chestplate -= amount;
      }

      if (to !== ZERO_ADDRESS.toLowerCase()) {
        if (!playerBalances[to]) {
          playerBalances[to] = { gold: 0, sword: 0, chestplate: 0 };
        }
        if (tokenId === 0) playerBalances[to].gold += amount;
        else if (tokenId === 1) playerBalances[to].sword += amount;
        else if (tokenId === 2) playerBalances[to].chestplate += amount;
      }
    });

    const players: TopPlayer[] = Object.entries(playerBalances)
      .map(([address, balances]) => ({
        address,
        goldCoins: balances.gold,
        swords: balances.sword,
        chestplates: balances.chestplate,
        totalItems: balances.gold + balances.sword + balances.chestplate,
        totalValue: balances.gold * 0.001 + balances.sword * 0.1 + balances.chestplate * 0.05, // Estimated value
      }))
      .filter(p => p.totalItems > 0)
      .sort((a, b) => b.totalItems - a.totalItems)
      .slice(0, 10);

    return players;
  }, [transferEvents]);

  // ===================================
  // WHALE DISTRIBUTION
  // ===================================
  const whaleDistribution = useMemo((): WhaleData[] => {
    if (!transferEvents) return [];

    const playerBalances: { [address: string]: number } = {};
    let totalItems = 0;

    transferEvents.forEach(event => {
      const from = (event.args.from as string)?.toLowerCase();
      const to = (event.args.to as string)?.toLowerCase();
      const amount = Number(event.args.value);

      if (from !== ZERO_ADDRESS.toLowerCase()) {
        playerBalances[from] = (playerBalances[from] || 0) - amount;
        totalItems -= amount;
      }

      if (to !== ZERO_ADDRESS.toLowerCase()) {
        playerBalances[to] = (playerBalances[to] || 0) + amount;
        totalItems += amount;
      }
    });

    const whales: WhaleData[] = Object.entries(playerBalances)
      .filter(([, balance]) => balance > 0)
      .map(([address, items]) => {
        const percentage = totalItems > 0 ? (items / totalItems) * 100 : 0;
        let category: "whale" | "dolphin" | "fish" = "fish";
        if (percentage >= 10) category = "whale";
        else if (percentage >= 1) category = "dolphin";

        return { address, items, percentage, category };
      })
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 20);

    return whales;
  }, [transferEvents]);

  // ===================================
  // ACTIVITY HEATMAP (By hour and day of week)
  // ===================================
  const activityHeatmap = useMemo((): ActivityHeatmapData[] => {
    if (!lootboxEvents) return [];

    const heatmap: { [key: string]: number } = {};

    lootboxEvents.forEach(() => {
      const timestamp = Date.now(); // In local env, all activity appears at current time
      const date = new Date(timestamp);
      const hour = date.getHours();
      const day = date.getDay();
      const key = `${day}-${hour}`;

      heatmap[key] = (heatmap[key] || 0) + 1;
    });

    const result: ActivityHeatmapData[] = [];
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const key = `${day}-${hour}`;
        result.push({ day, hour, count: heatmap[key] || 0 });
      }
    }

    return result;
  }, [lootboxEvents]);

  // ===================================
  // RECENT EVENTS (Last 20)
  // ===================================
  const recentEvents = useMemo((): RecentEvent[] => {
    const events: RecentEvent[] = [];

    // Add lootbox events
    if (lootboxEvents) {
      lootboxEvents.slice(0, 10).forEach(event => {
        events.push({
          type: "lootbox",
          player: event.args.player as string,
          tokenId: Number(event.args.prizeTokenId),
          amount: Number(event.args.amount),
          timestamp: Date.now(), // Approximate
          txHash: event.transactionHash,
        });
      });
    }

    // Add recent transfers/mints/burns
    if (transferEvents) {
      transferEvents.slice(0, 10).forEach(event => {
        const from = (event.args.from as string)?.toLowerCase();
        const to = (event.args.to as string)?.toLowerCase();

        let type: "mint" | "burn" | "transfer" = "transfer";
        if (from === ZERO_ADDRESS.toLowerCase()) type = "mint";
        else if (to === ZERO_ADDRESS.toLowerCase()) type = "burn";

        events.push({
          type,
          player: type === "mint" ? (to as string) : (from as string),
          tokenId: Number(event.args.id),
          amount: Number(event.args.value),
          timestamp: Date.now(),
          txHash: event.transactionHash,
        });
      });
    }

    return events.sort((a, b) => b.timestamp - a.timestamp).slice(0, 20);
  }, [lootboxEvents, transferEvents]);

  // ===================================
  // AGGREGATE STATS
  // ===================================
  const aggregateStats = useMemo(() => {
    const totalMinted = tokenMetrics.reduce((sum, t) => sum + t.totalMinted, 0);
    const totalBurned = tokenMetrics.reduce((sum, t) => sum + t.totalBurned, 0);
    const totalRevenue = (lootboxEvents?.length || 0) * LOOTBOX_PRICE;

    const last24Hours = dailyMetrics[dailyMetrics.length - 1] || {
      minted: 0,
      burned: 0,
      revenue: 0,
      transactions: 0,
    };

    const mintRate24h = last24Hours.minted;
    const burnRate24h = last24Hours.burned;

    return {
      totalMinted,
      totalBurned,
      totalCirculation: totalMinted - totalBurned,
      totalRevenue,
      totalLootboxesOpened: lootboxEvents?.length || 0,
      uniquePlayers: topPlayers.length,
      mintRate24h,
      burnRate24h,
      revenue24h: last24Hours.revenue,
    };
  }, [tokenMetrics, lootboxEvents, dailyMetrics, topPlayers]);

  return {
    // Loading states
    isLoading: transferLoading || lootboxLoading,

    // Metrics
    dailyMetrics,
    tokenMetrics,
    topPlayers,
    whaleDistribution,
    activityHeatmap,
    recentEvents,
    aggregateStats,

    // Raw data
    transferEvents: transferEvents || [],
    lootboxEvents: lootboxEvents || [],
  };
};
