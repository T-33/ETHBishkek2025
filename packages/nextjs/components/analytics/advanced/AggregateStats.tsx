"use client";

import React from "react";

interface AggregateStatsProps {
  stats: {
    totalMinted: number;
    totalBurned: number;
    totalCirculation: number;
    totalRevenue: number;
    totalLootboxesOpened: number;
    uniquePlayers: number;
    mintRate24h: number;
    burnRate24h: number;
    revenue24h: number;
  };
}

export const AggregateStats = ({ stats }: AggregateStatsProps) => {
  const burnRate = stats.totalMinted > 0 ? ((stats.totalBurned / stats.totalMinted) * 100).toFixed(1) : "0";
  const avgRevenuePerBox =
    stats.totalLootboxesOpened > 0 ? (stats.totalRevenue / stats.totalLootboxesOpened).toFixed(3) : "0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Revenue */}
      <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 border-2 border-green-500 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-green-100">Total Revenue</h3>
          <span className="text-3xl">💰</span>
        </div>
        <p className="text-4xl font-bold text-white mb-1">{stats.totalRevenue.toFixed(2)}</p>
        <p className="text-green-200 text-sm">
          {stats.totalLootboxesOpened} lootboxes · {avgRevenuePerBox} ETH avg
        </p>
        <div className="mt-3 pt-3 border-t border-green-400/30">
          <p className="text-xs text-green-200">Last 24h: {stats.revenue24h.toFixed(3)} ETH</p>
        </div>
      </div>

      {/* Mint Rate */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 border-2 border-blue-500 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-blue-100">Mint Rate</h3>
          <span className="text-3xl">📈</span>
        </div>
        <p className="text-4xl font-bold text-white mb-1">{stats.totalMinted}</p>
        <p className="text-blue-200 text-sm">Total minted items</p>
        <div className="mt-3 pt-3 border-t border-blue-400/30">
          <p className="text-xs text-blue-200">Last 24h: +{stats.mintRate24h} items</p>
        </div>
      </div>

      {/* Burn Rate */}
      <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-6 border-2 border-red-500 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-red-100">Burn Rate</h3>
          <span className="text-3xl">🔥</span>
        </div>
        <p className="text-4xl font-bold text-white mb-1">{burnRate}%</p>
        <p className="text-red-200 text-sm">
          {stats.totalBurned} of {stats.totalMinted} burned
        </p>
        <div className="mt-3 pt-3 border-t border-red-400/30">
          <p className="text-xs text-red-200">Last 24h: {stats.burnRate24h} items</p>
        </div>
      </div>

      {/* Unique Players */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 border-2 border-purple-500 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-purple-100">Unique Players</h3>
          <span className="text-3xl">👥</span>
        </div>
        <p className="text-4xl font-bold text-white mb-1">{stats.uniquePlayers}</p>
        <p className="text-purple-200 text-sm">Active holders</p>
        <div className="mt-3 pt-3 border-t border-purple-400/30">
          <p className="text-xs text-purple-200">
            Avg: {stats.uniquePlayers > 0 ? (stats.totalCirculation / stats.uniquePlayers).toFixed(1) : 0} items/player
          </p>
        </div>
      </div>
    </div>
  );
};
