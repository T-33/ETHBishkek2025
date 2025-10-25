"use client";

import React from "react";
import { useAccount } from "wagmi";
import { Inventory } from "~~/components/player/Inventory";
import { LootboxOpener } from "~~/components/player/LootboxOpener";
import { Address } from "~~/components/scaffold-eth";

export default function PlayerPage() {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🔒</p>
          <p className="text-2xl text-white mb-4">Connect Your Wallet</p>
          <p className="text-gray-400">Please connect your wallet to access the game</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0D1117] text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Game Items
        </h1>
        <div className="flex items-center gap-2">
          <p className="text-gray-400">Player:</p>
          <Address address={address} />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Lootbox */}
        <div>
          <LootboxOpener />
        </div>

        {/* Right Column - Inventory */}
        <div>
          <Inventory />
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-xl font-bold text-blue-400 mb-3">How to Play</h3>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">1.</span>
            <span>Click &quot;Open Lootbox&quot; to purchase and open a mystery chest</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">2.</span>
            <span>Each lootbox contains random items with different rarities</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">3.</span>
            <span>Collect items to build your inventory</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">4.</span>
            <span>
              Rarities: <span className="text-gray-400">Common</span> • <span className="text-purple-400">Epic</span> •{" "}
              <span className="text-yellow-400">Legendary</span>
            </span>
          </li>
        </ul>
      </div>
    </main>
  );
}
