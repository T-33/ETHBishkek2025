"use client";

import React from "react";
import { useChainId } from "wagmi";
import { TokenDistribution } from "~~/components/analytics/TokenDistribution";
import { TokenMetrics } from "~~/components/analytics/TokenMetrics";
import { ActivityHeatmap } from "~~/components/analytics/advanced/ActivityHeatmap";
import { AggregateStats } from "~~/components/analytics/advanced/AggregateStats";
import { DailyMetricsChart } from "~~/components/analytics/advanced/DailyMetricsChart";
import { RecentEvents } from "~~/components/analytics/advanced/RecentEvents";
import { TopPlayersLeaderboard } from "~~/components/analytics/advanced/TopPlayersLeaderboard";
import { WhaleDistribution } from "~~/components/analytics/advanced/WhaleDistribution";
import { useAdvancedAnalytics } from "~~/hooks/game/useAdvancedAnalytics";
import { isZkSyncNetwork } from "~~/utils/zkSync";

export default function AnalyticsPage() {
  const chainId = useChainId();

  const {
    isLoading,
    dailyMetrics,
    tokenMetrics,
    topPlayers,
    whaleDistribution,
    activityHeatmap,
    recentEvents,
    aggregateStats,
  } = useAdvancedAnalytics(chainId);

  return (
    <main className="min-h-screen bg-[#0D1117] text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Game Economy Dashboard
        </h1>
        <p className="text-gray-400 text-lg">
          Real-time analytics and insights for your game&apos;s token economy on zkSync
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin text-6xl mb-4">⚡</div>
            <p className="text-gray-400">Loading advanced analytics...</p>
            <p className="text-xs text-gray-500 mt-2">Fetching recent events from zkSync...</p>
          </div>
        </div>
      ) : !dailyMetrics || dailyMetrics.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-2xl text-white mb-2">No Data Yet</p>
            <p className="text-gray-400 mb-4">Start by opening lootboxes to generate analytics data</p>
            <a
              href="/player"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Go to Player Page
            </a>
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
              <p className="text-xs text-yellow-400 mt-2">
                ⚠️ Note: Analytics show data from the last{" "}
                {chainId && isZkSyncNetwork(chainId) ? "~10,000 blocks (~3-4 hours)" : "~50,000 blocks"} to optimize
                zkSync RPC performance.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
