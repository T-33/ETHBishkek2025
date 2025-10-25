"use client";

import React from "react";
import { EconomyMetrics } from "~~/hooks/game/useEconomyAnalytics";

interface EconomyOverviewProps {
  metrics: EconomyMetrics;
  lootboxOpenings: number;
}

export const EconomyOverview = ({ metrics, lootboxOpenings }: EconomyOverviewProps) => {
  const circulationRate =
    metrics.totalMinted > 0 ? ((metrics.totalCirculation / metrics.totalMinted) * 100).toFixed(1) : "0";

  const burnRate = metrics.totalMinted > 0 ? ((metrics.totalBurned / metrics.totalMinted) * 100).toFixed(1) : "0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Minted */}
      <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 border-2 border-green-500 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-green-100">Total Minted</h3>
          <span className="text-3xl">📈</span>
        </div>
        <p className="text-4xl font-bold text-white mb-1">{metrics.totalMinted}</p>
        <p className="text-green-200 text-sm">All tokens created</p>
      </div>

      {/* Total Burned */}
      <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-6 border-2 border-red-500 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-red-100">Total Burned</h3>
          <span className="text-3xl">🔥</span>
        </div>
        <p className="text-4xl font-bold text-white mb-1">{metrics.totalBurned}</p>
        <p className="text-red-200 text-sm">{burnRate}% of minted</p>
      </div>

      {/* In Circulation */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 border-2 border-blue-500 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-blue-100">In Circulation</h3>
          <span className="text-3xl">💎</span>
        </div>
        <p className="text-4xl font-bold text-white mb-1">{metrics.totalCirculation}</p>
        <p className="text-blue-200 text-sm">{circulationRate}% circulation rate</p>
      </div>

      {/* Unique Holders */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 border-2 border-purple-500 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-purple-100">Unique Holders</h3>
          <span className="text-3xl">👥</span>
        </div>
        <p className="text-4xl font-bold text-white mb-1">{metrics.uniqueHolders}</p>
        <p className="text-purple-200 text-sm">{lootboxOpenings} lootboxes opened</p>
      </div>
    </div>
  );
};
