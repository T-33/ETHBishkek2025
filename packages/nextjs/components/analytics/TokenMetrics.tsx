"use client";

import React from "react";
import { TokenStats } from "~~/hooks/game/useEconomyAnalytics";

interface TokenMetricsProps {
  tokenStats: TokenStats[];
}

const ITEM_ICONS: { [key: string]: string } = {
  "Gold Coin": "🪙",
  "Legendary Sword": "⚔️",
  "Epic Golden Chestplate": "🛡️",
};

export const TokenMetrics = ({ tokenStats }: TokenMetricsProps) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-gray-700 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">Token Breakdown</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tokenStats.map(token => (
          <div
            key={token.tokenId}
            className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-6 border border-gray-600"
          >
            {/* Icon and Name */}
            <div className="text-center mb-4">
              <div className="text-5xl mb-2">{ITEM_ICONS[token.name] || "❓"}</div>
              <h3 className="text-lg font-bold text-white">{token.name}</h3>
              <p className="text-xs text-gray-500">Token ID: {token.tokenId}</p>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Minted</p>
                <p className="text-2xl font-bold text-green-400">+{token.totalMinted}</p>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Burned</p>
                <p className="text-2xl font-bold text-red-400">-{token.totalBurned}</p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">In Circulation</p>
                <p className="text-2xl font-bold text-blue-400">{token.circulation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
