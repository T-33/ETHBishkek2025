"use client";

import React, { useEffect } from "react";
import { useInventory } from "~~/hooks/game/useInventory";

const RARITY_COLORS = {
  common: "from-gray-600 to-gray-800 border-gray-500",
  epic: "from-purple-600 to-purple-900 border-purple-500",
  legendary: "from-yellow-600 to-yellow-900 border-yellow-500",
};

const ITEM_ICONS: { [key: string]: string } = {
  "Gold Coin": "🪙",
  "Legendary Sword": "⚔️",
  "Epic Golden Chestplate": "🛡️",
};

export const Inventory = () => {
  const { inventory, refetchAll, totalItems } = useInventory();

  // Refetch inventory every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchAll();
    }, 5000);

    return () => clearInterval(interval);
  }, [refetchAll]);

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-gray-700 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Your Inventory</h2>
        <div className="bg-blue-500/20 px-4 py-2 rounded-lg border border-blue-500">
          <p className="text-sm text-gray-400">Total Items</p>
          <p className="text-2xl font-bold text-blue-400">{totalItems}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {inventory.map(item => (
          <div
            key={item.tokenId}
            className={`bg-gradient-to-br ${
              RARITY_COLORS[item.rarity as keyof typeof RARITY_COLORS]
            } rounded-xl p-6 border-2 transition-all duration-200 hover:scale-105 hover:shadow-xl`}
          >
            {/* Item Icon */}
            <div className="text-6xl text-center mb-4">{ITEM_ICONS[item.name] || "❓"}</div>

            {/* Item Name */}
            <h3 className="text-xl font-bold text-white text-center mb-2">{item.name}</h3>

            {/* Rarity Badge */}
            <div className="flex justify-center mb-3">
              <span className="px-3 py-1 bg-black/30 rounded-full text-xs font-semibold text-white uppercase">
                {item.rarity}
              </span>
            </div>

            {/* Balance */}
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-400 mb-1">Owned</p>
              <p className="text-3xl font-bold text-white">{item.balance}</p>
            </div>

            {/* Token ID */}
            <p className="text-center text-xs text-gray-500 mt-3">Token ID: {item.tokenId}</p>
          </div>
        ))}
      </div>

      {totalItems === 0 && (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">📦</p>
          <p className="text-gray-400 text-lg">Your inventory is empty</p>
          <p className="text-gray-500 text-sm mt-2">Open a lootbox to get your first items!</p>
        </div>
      )}
    </div>
  );
};
