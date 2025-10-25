"use client";

import React from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DailyMetrics } from "~~/hooks/game/useAdvancedAnalytics";

interface DailyMetricsChartProps {
  data: DailyMetrics[];
}

export const DailyMetricsChart = ({ data }: DailyMetricsChartProps) => {
  // Check if we have any data with actual activity
  const hasData = data.some(d => d.minted > 0 || d.burned > 0 || d.revenue > 0);

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-gray-700 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">📈 Daily Metrics (Last 30 Days)</h2>
        {!hasData && (
          <span className="text-sm text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full">
            No historical data yet
          </span>
        )}
      </div>

      {!hasData ? (
        <div className="bg-gray-800/50 rounded-xl p-8 text-center border-2 border-dashed border-gray-600">
          <p className="text-4xl mb-4">📊</p>
          <p className="text-gray-300 mb-2">No activity data available yet</p>
          <p className="text-sm text-gray-400 mb-4">
            Daily metrics will appear here once lootboxes are opened and tokens are minted or burned.
          </p>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm text-gray-300">
            <p className="font-semibold text-blue-400 mb-2">💡 To generate test data:</p>
            <p className="text-left">
              1. Go to the Player Portal and open some lootboxes
              <br />
              2. Try burning some tokens
              <br />
              3. Or run: <code className="bg-gray-900 px-2 py-1 rounded text-green-400">yarn seed-activity</code>
            </p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              stroke="#9CA3AF"
              tickFormatter={value => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "0.5rem",
                color: "#F3F4F6",
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="minted" stroke="#10B981" strokeWidth={2} name="Minted" />
            <Line type="monotone" dataKey="burned" stroke="#EF4444" strokeWidth={2} name="Burned" />
            <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} name="Revenue (ETH)" />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-400">Avg Daily Mints</p>
          <p className="text-2xl font-bold text-green-400">
            {data.length > 0 ? Math.round(data.reduce((sum, d) => sum + d.minted, 0) / data.length) : 0}
          </p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-400">Avg Daily Burns</p>
          <p className="text-2xl font-bold text-red-400">
            {data.length > 0 ? Math.round(data.reduce((sum, d) => sum + d.burned, 0) / data.length) : 0}
          </p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-400">Total Revenue</p>
          <p className="text-2xl font-bold text-blue-400">
            {data.reduce((sum, d) => sum + d.revenue, 0).toFixed(2)} ETH
          </p>
        </div>
      </div>
    </div>
  );
};
