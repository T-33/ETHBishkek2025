"use client";

import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Address } from "~~/components/scaffold-eth";
import { WhaleData } from "~~/hooks/game/useAdvancedAnalytics";

interface WhaleDistributionProps {
  whales: WhaleData[];
}

const CATEGORY_COLORS = {
  whale: "#EAB308", // Yellow
  dolphin: "#3B82F6", // Blue
  fish: "#6B7280", // Gray
};

const CATEGORY_LABELS = {
  whale: "🐋 Whales (>10%)",
  dolphin: "🐬 Dolphins (1-10%)",
  fish: "🐟 Fish (<1%)",
};

export const WhaleDistribution = ({ whales }: WhaleDistributionProps) => {
  // Group by category
  const categoryData = whales.reduce(
    (acc, whale) => {
      acc[whale.category].count += 1;
      acc[whale.category].percentage += whale.percentage;
      acc[whale.category].items += whale.items;
      return acc;
    },
    {
      whale: { count: 0, percentage: 0, items: 0 },
      dolphin: { count: 0, percentage: 0, items: 0 },
      fish: { count: 0, percentage: 0, items: 0 },
    },
  );

  const pieData = Object.entries(categoryData).map(([category, data]) => ({
    name: CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS],
    value: data.percentage,
    count: data.count,
    items: data.items,
    color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS],
  }));

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-gray-700 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">🐋 Whale Distribution</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${(name || "Unknown").split(" ")[0]} ${Number(value).toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "0.5rem",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Category Stats */}
          <div className="space-y-2 mt-4">
            {Object.entries(categoryData).map(([category, data]) => (
              <div
                key={category}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] }}
                  ></div>
                  <span className="text-white font-medium">
                    {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{data.count} holders</p>
                  <p className="text-sm text-gray-400">{data.percentage.toFixed(1)}% supply</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Whales List */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Top Holders</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
            {whales.slice(0, 10).map((whale, index) => (
              <div
                key={whale.address}
                className={`p-3 rounded-lg border ${
                  whale.category === "whale"
                    ? "bg-yellow-500/10 border-yellow-500/30"
                    : whale.category === "dolphin"
                      ? "bg-blue-500/10 border-blue-500/30"
                      : "bg-gray-700 border-gray-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    <div className="flex-1 min-w-0">
                      <Address address={whale.address} />
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-white font-bold">{whale.percentage.toFixed(2)}%</p>
                    <p className="text-sm text-gray-400">{whale.items} items</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alert for whale dominance */}
      {categoryData.whale.percentage > 50 && (
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-400 font-semibold">⚠️ Whale Alert</p>
          <p className="text-sm text-gray-300 mt-1">
            Whales control {categoryData.whale.percentage.toFixed(1)}% of the supply. Consider incentivizing broader
            distribution.
          </p>
        </div>
      )}
    </div>
  );
};
