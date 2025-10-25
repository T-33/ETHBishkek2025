"use client";

import React from "react";
import { EconomyOverview } from "~~/components/analytics/EconomyOverview";
import { TokenDistribution } from "~~/components/analytics/TokenDistribution";
import { TokenMetrics } from "~~/components/analytics/TokenMetrics";
import { useEconomyAnalytics } from "~~/hooks/game/useEconomyAnalytics";

export default function AnalyticsPage() {
  const { metrics, isLoading, lootboxOpenings } = useEconomyAnalytics();

  return (
    <main className="min-h-screen bg-[#0D1117] text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          Game Economy Dashboard
        </h1>
        <p className="text-gray-400">Real-time analytics and insights for your game&apos;s token economy on Ethereum</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin text-6xl mb-4">⚡</div>
            <p className="text-gray-400">Loading economy data...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Overview Cards */}
          <EconomyOverview metrics={metrics} lootboxOpenings={lootboxOpenings} />

          {/* Token Breakdown */}
          <TokenMetrics tokenStats={metrics.tokenStats} />

          {/* Distribution */}
          <TokenDistribution tokenStats={metrics.tokenStats} />

          {/* Additional Stats */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-gray-700 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Economy Health</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Burn Rate */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Burn Rate</h3>
                  <span className="text-3xl">🔥</span>
                </div>
                <p className="text-4xl font-bold text-red-400 mb-2">
                  {metrics.totalMinted > 0 ? ((metrics.totalBurned / metrics.totalMinted) * 100).toFixed(1) : "0"}%
                </p>
                <p className="text-sm text-gray-400">
                  {metrics.totalBurned} of {metrics.totalMinted} tokens burned
                </p>
              </div>

              {/* Activity Level */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Total Transactions</h3>
                  <span className="text-3xl">📊</span>
                </div>
                <p className="text-4xl font-bold text-blue-400 mb-2">{metrics.totalTransactions}</p>
                <p className="text-sm text-gray-400">All token transfer events</p>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-blue-400 mb-3">📈 About This Dashboard</h3>
            <div className="space-y-2 text-gray-300">
              <p>
                <strong className="text-white">Purpose:</strong> Track and analyze your game&apos;s token economy in
                real-time using Ethereum blockchain data.
              </p>
              <p>
                <strong className="text-white">Key Metrics:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                <li>
                  <strong>Total Minted:</strong> All tokens created through lootbox openings
                </li>
                <li>
                  <strong>Total Burned:</strong> Tokens removed from circulation
                </li>
                <li>
                  <strong>In Circulation:</strong> Active tokens in player wallets
                </li>
                <li>
                  <strong>Unique Holders:</strong> Number of distinct player addresses
                </li>
              </ul>
              <p className="text-sm text-gray-400 mt-4">
                💡 This dashboard updates in real-time as players interact with the game economy.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
