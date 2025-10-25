"use client";

import React, { useEffect, useState } from "react";
import { formatEther } from "viem";
import { GAME_ITEMS } from "~~/hooks/game/useInventory";
import { useLootbox } from "~~/hooks/game/useLootbox";

const RARITY_COLORS = {
  common: "text-gray-400",
  epic: "text-purple-400",
  legendary: "text-yellow-400",
};

export const LootboxOpener = () => {
  const { lootboxPrice, openLootbox, isPending, lastReward, lootboxHistory } = useLootbox();
  const [isOpening, setIsOpening] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [currentReward, setCurrentReward] = useState<any>(null);

  useEffect(() => {
    if (lastReward && !isPending && isOpening) {
      setCurrentReward(lastReward);
      setShowReward(true);
      setIsOpening(false);

      // Hide reward after 5 seconds
      setTimeout(() => {
        setShowReward(false);
      }, 5000);
    }
  }, [lastReward, isPending, isOpening]);

  const handleOpenLootbox = async () => {
    try {
      setIsOpening(true);
      setShowReward(false);
      await openLootbox();
    } catch (error) {
      console.error("Failed to open lootbox:", error);
      setIsOpening(false);
    }
  };

  const getItemInfo = (tokenId: number) => {
    const items = Object.values(GAME_ITEMS);
    return items.find(item => item.id === tokenId) || { name: "Unknown Item", rarity: "common" };
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-gray-700 shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Mystery Lootbox</h2>
        <p className="text-gray-400">Open to receive random items!</p>
      </div>

      {/* Lootbox Visual */}
      <div className="flex justify-center mb-8">
        <div
          className={`relative w-64 h-64 ${
            isOpening ? "animate-bounce" : "hover:scale-105"
          } transition-transform duration-300`}
        >
          {/* Chest */}
          <div className="w-full h-full bg-gradient-to-br from-amber-700 to-amber-900 rounded-lg border-4 border-amber-600 flex items-center justify-center relative overflow-hidden">
            {/* Glow effect when opening */}
            {isOpening && (
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-500 opacity-50 animate-pulse" />
            )}

            {/* Lock icon when closed */}
            {!isOpening && (
              <div className="text-8xl">
                <span className="text-yellow-500">🎁</span>
              </div>
            )}

            {/* Sparkles when opening */}
            {isOpening && (
              <div className="absolute inset-0 flex items-center justify-center text-6xl animate-spin">✨</div>
            )}
          </div>
        </div>
      </div>

      {/* Reward Display */}
      {showReward && currentReward && (
        <div className="mb-6 p-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl border-2 border-purple-500 animate-pulse">
          <div className="text-center">
            <p className="text-xl text-gray-300 mb-2">You received:</p>
            <p
              className={`text-3xl font-bold ${
                RARITY_COLORS[getItemInfo(currentReward.tokenId).rarity as keyof typeof RARITY_COLORS]
              }`}
            >
              {currentReward.amount}x {getItemInfo(currentReward.tokenId).name}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Rarity: {getItemInfo(currentReward.tokenId).rarity.toUpperCase()}
            </p>
          </div>
        </div>
      )}

      {/* Open Button */}
      <div className="text-center">
        <button
          onClick={handleOpenLootbox}
          disabled={isPending || isOpening || !lootboxPrice}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
        >
          {isPending || isOpening ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⚡</span>
              Opening...
            </span>
          ) : (
            <span>
              Open Lootbox{" "}
              {lootboxPrice && <span className="text-sm">({formatEther(lootboxPrice as bigint)} ETH)</span>}
            </span>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="mt-8 pt-6 border-t border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-gray-400 text-sm">Total Opened</p>
            <p className="text-2xl font-bold text-white">{lootboxHistory.length}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Price</p>
            <p className="text-2xl font-bold text-white">
              {lootboxPrice ? `${formatEther(lootboxPrice as bigint)} ETH` : "..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
