"use client";

import React from "react";
import { TokenStats } from "~~/hooks/game/useEconomyAnalytics";

interface TokenDistributionProps {
  tokenStats: TokenStats[];
}

export const TokenDistribution = ({ tokenStats }: TokenDistributionProps) => {
  const totalCirculation = tokenStats.reduce((sum, token) => sum + token.circulation, 0);

  const getPercentage = (value: number) => {
    if (totalCirculation === 0) return "0";
    return ((value / totalCirculation) * 100).toFixed(1);
  };

  const COLORS = {
    0: { bg: "bg-gray-500", text: "text-gray-400", border: "border-gray-500" },
    1: { bg: "bg-yellow-500", text: "text-yellow-400", border: "border-yellow-500" },
    2: { bg: "bg-purple-500", text: "text-purple-400", border: "border-purple-500" },
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-gray-700 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">Token Distribution</h2>

      {totalCirculation === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">📊</p>
          <p className="text-gray-400 text-lg">No tokens in circulation yet</p>
          <p className="text-gray-500 text-sm mt-2">Open some lootboxes to see the distribution</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Visual bars */}
          <div className="space-y-4">
            {tokenStats.map(token => {
              const percentage = getPercentage(token.circulation);
              const color = COLORS[token.tokenId as keyof typeof COLORS];

              return (
                <div key={token.tokenId}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">{token.name}</span>
                    <span className={`${color.text} font-bold`}>{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden border border-gray-600">
                    <div
                      className={`${color.bg} h-full transition-all duration-500 flex items-center justify-end pr-3`}
                      style={{ width: `${percentage}%` }}
                    >
                      {parseFloat(percentage) > 10 && (
                        <span className="text-white text-xs font-bold">{token.circulation}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="pt-6 border-t border-gray-700">
            <div className="grid grid-cols-3 gap-4 text-center">
              {tokenStats.map(token => {
                const color = COLORS[token.tokenId as keyof typeof COLORS];
                return (
                  <div key={token.tokenId} className={`border-2 ${color.border} rounded-lg p-4 bg-gray-800/50`}>
                    <div className={`w-4 h-4 ${color.bg} rounded-full mx-auto mb-2`}></div>
                    <p className="text-xs text-gray-400">{token.name}</p>
                    <p className={`text-lg font-bold ${color.text}`}>{token.circulation}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
