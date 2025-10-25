"use client";

import React from "react";
import { TokenDistribution } from "~~/components/analytics/TokenDistribution";
import { TokenMetrics } from "~~/components/analytics/TokenMetrics";
import { ActivityHeatmap } from "~~/components/analytics/advanced/ActivityHeatmap";
import { AggregateStats } from "~~/components/analytics/advanced/AggregateStats";
import { DailyMetricsChart } from "~~/components/analytics/advanced/DailyMetricsChart";
import { RecentEvents } from "~~/components/analytics/advanced/RecentEvents";
import { TopPlayersLeaderboard } from "~~/components/analytics/advanced/TopPlayersLeaderboard";
import { WhaleDistribution } from "~~/components/analytics/advanced/WhaleDistribution";
import { useAdvancedAnalytics } from "~~/hooks/game/useAdvancedAnalytics";

export default function AnalyticsPage() {
  const {
    isLoading,
    dailyMetrics,
    tokenMetrics,
    topPlayers,
    whaleDistribution,
    activityHeatmap,
    recentEvents,
    aggregateStats,
  } = useAdvancedAnalytics();

  return (
    <main className="min-h-screen bg-[#0D1117] text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Game Economy Dashboard
        </h1>
        <p className="text-gray-400 text-lg">
          Real-time analytics and insights for your game&apos;s token economy on Ethereum
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin text-6xl mb-4">⚡</div>
            <p className="text-gray-400">Loading advanced analytics...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Aggregate Stats (Top Row) */}
          <AggregateStats stats={aggregateStats} />

          {/* Daily Metrics Chart */}
          <DailyMetricsChart data={dailyMetrics} />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Token Breakdown */}
            <TokenMetrics tokenStats={tokenMetrics} />

            {/* Token Distribution */}
            <TokenDistribution tokenStats={tokenMetrics} />
          </div>

          {/* Top Players Leaderboard */}
          <TopPlayersLeaderboard players={topPlayers} />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Whale Distribution */}
            <WhaleDistribution whales={whaleDistribution} />

            {/* Recent Events */}
            <RecentEvents events={recentEvents} />
          </div>

          {/* Activity Heatmap */}
          <ActivityHeatmap data={activityHeatmap} />

          {/* Info Panel */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-blue-400 mb-3">📈 About This Dashboard</h3>
            <div className="space-y-2 text-gray-300">
              <p>
                <strong className="text-white">Purpose:</strong> Comprehensive analytics dashboard for tracking and
                analyzing your game&apos;s token economy in real-time using Ethereum blockchain data.
              </p>
              <p>
                <strong className="text-white">Key Features:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                <li>
                  <strong>Daily Metrics:</strong> Track mints, burns, and revenue over the last 30 days
                </li>
                <li>
                  <strong>Top Players:</strong> See who holds the most items and their portfolio value
                </li>
                <li>
                  <strong>Whale Analysis:</strong> Identify large holders and distribution patterns
                </li>
                <li>
                  <strong>Activity Heatmap:</strong> Understand when players are most active
                </li>
                <li>
                  <strong>Recent Events:</strong> Live feed of all mints, burns, and lootbox openings
                </li>
                <li>
                  <strong>Money Flow:</strong> Track total revenue and economic health metrics
                </li>
              </ul>
              <p className="text-sm text-gray-400 mt-4">
                💡 All data updates in real-time as players interact with the game economy. Use these insights to make
                informed decisions about drop rates, pricing, and supply caps.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
