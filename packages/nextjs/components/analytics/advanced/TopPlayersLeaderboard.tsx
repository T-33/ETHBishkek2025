"use client";

import React from "react";
import { Address } from "~~/components/scaffold-eth";
import { TopPlayer } from "~~/hooks/game/useAdvancedAnalytics";

interface TopPlayersLeaderboardProps {
  players: TopPlayer[];
}

const MEDAL_EMOJIS = ["🥇", "🥈", "🥉"];

export const TopPlayersLeaderboard = ({ players }: TopPlayersLeaderboardProps) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-gray-700 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">🏆 Top Players Leaderboard</h2>
        <div className="text-sm text-gray-400">Top {players.length} by total items</div>
      </div>

      {players.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">🎮</p>
          <p className="text-gray-400">No players yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {players.map((player, index) => (
            <div
              key={player.address}
              className={`bg-gradient-to-r ${
                index === 0
                  ? "from-yellow-600/20 to-yellow-800/20 border-yellow-500"
                  : index === 1
                    ? "from-gray-400/20 to-gray-600/20 border-gray-400"
                    : index === 2
                      ? "from-amber-600/20 to-amber-800/20 border-amber-600"
                      : "from-gray-700 to-gray-800 border-gray-600"
              } border rounded-xl p-4 hover:scale-102 transition-transform duration-200`}
            >
              <div className="flex items-center justify-between">
                {/* Rank and Address */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="text-3xl w-12 text-center">{index < 3 ? MEDAL_EMOJIS[index] : `#${index + 1}`}</div>

                  <div className="flex-1 min-w-0">
                    <Address address={player.address} />
                    <div className="flex gap-3 mt-1 text-sm">
                      <span className="text-gray-400">
                        🪙 <span className="text-yellow-400">{player.goldCoins}</span>
                      </span>
                      <span className="text-gray-400">
                        ⚔️ <span className="text-purple-400">{player.swords}</span>
                      </span>
                      <span className="text-gray-400">
                        🛡️ <span className="text-blue-400">{player.chestplates}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total Items */}
                <div className="text-right ml-4">
                  <p className="text-sm text-gray-400">Total Items</p>
                  <p className="text-3xl font-bold text-white">{player.totalItems}</p>
                  <p className="text-xs text-gray-500">≈ {player.totalValue.toFixed(3)} ETH</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {players.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-400">Top Player Items</p>
              <p className="text-2xl font-bold text-white">{players[0]?.totalItems || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Avg Top 10 Items</p>
              <p className="text-2xl font-bold text-white">
                {players.length > 0
                  ? Math.round(players.reduce((sum, p) => sum + p.totalItems, 0) / players.length)
                  : 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-white">
                {players.reduce((sum, p) => sum + p.totalValue, 0).toFixed(2)} ETH
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
