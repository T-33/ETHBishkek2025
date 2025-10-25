"use client";

import React, { useState } from "react";
import { GAME_ITEMS, useInventory } from "~~/hooks/game/useInventory";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const BurnTokens = () => {
  const { inventory, refetchAll } = useInventory();
  const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null);
  const [amount, setAmount] = useState("");

  const { writeContractAsync, isPending } = useScaffoldWriteContract({
    contractName: "GameItems",
  });

  const handleBurn = async () => {
    if (selectedTokenId === null || !amount || Number(amount) <= 0) {
      alert("Please select an item and enter a valid amount");
      return;
    }

    const selectedItem = inventory.find(item => item.tokenId === selectedTokenId);
    if (!selectedItem) return;

    if (Number(amount) > selectedItem.balance) {
      alert(`You only have ${selectedItem.balance} ${selectedItem.name}`);
      return;
    }

    try {
      await writeContractAsync({
        functionName: "burn",
        args: [BigInt(selectedTokenId), BigInt(amount)],
      });

      alert(`Successfully burned ${amount} ${selectedItem.name}!`);
      setAmount("");
      setSelectedTokenId(null);

      // Refetch inventory
      setTimeout(() => {
        refetchAll();
      }, 2000);
    } catch (error) {
      console.error("Burn failed:", error);
      alert("Failed to burn tokens. Please try again.");
    }
  };

  const selectedItem = inventory.find(item => item.tokenId === selectedTokenId);

  return (
    <div className="bg-gradient-to-br from-red-800 to-red-900 rounded-2xl p-8 border-2 border-red-700 shadow-2xl">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🔥 Burn Tokens</h2>
        <p className="text-red-300">Permanently destroy your items to reduce supply</p>
      </div>

      {/* Warning */}
      <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
        <p className="text-red-200 text-sm">
          ⚠️ Warning: Burning tokens is irreversible! They will be permanently destroyed.
        </p>
      </div>

      {/* Select Item */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-white mb-2">Select Item to Burn</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.values(GAME_ITEMS).map(item => {
            const inventoryItem = inventory.find(i => i.tokenId === item.id);
            const balance = inventoryItem?.balance || 0;
            const isSelected = selectedTokenId === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setSelectedTokenId(item.id)}
                disabled={balance === 0}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-red-400 bg-red-500/30 scale-105"
                    : balance > 0
                      ? "border-gray-600 bg-gray-800 hover:border-gray-500"
                      : "border-gray-700 bg-gray-900 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="text-4xl mb-2">{item.id === 0 ? "🪙" : item.id === 1 ? "⚔️" : "🛡️"}</div>
                <p className="text-white font-semibold">{item.name}</p>
                <p className="text-sm text-gray-400 mt-1">Balance: {balance}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Amount Input */}
      {selectedTokenId !== null && selectedItem && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-white mb-2">
            Amount to Burn (Max: {selectedItem.balance})
          </label>
          <input
            type="number"
            min="1"
            max={selectedItem.balance}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
          />

          {/* Quick amount buttons */}
          <div className="flex gap-2 mt-2">
            {[25, 50, 75, 100].map(percent => {
              const value = Math.floor((selectedItem.balance * percent) / 100);
              if (value === 0) return null;
              return (
                <button
                  key={percent}
                  onClick={() => setAmount(value.toString())}
                  className="flex-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition-colors"
                >
                  {percent}%
                </button>
              );
            })}
            <button
              onClick={() => setAmount(selectedItem.balance.toString())}
              className="flex-1 px-3 py-1 bg-red-700 hover:bg-red-600 rounded text-sm text-white transition-colors"
            >
              Max
            </button>
          </div>
        </div>
      )}

      {/* Burn Button */}
      <button
        onClick={handleBurn}
        disabled={isPending || !selectedItem || !amount || Number(amount) <= 0}
        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⚡</span>
            Burning...
          </span>
        ) : (
          <span>
            🔥 Burn {amount || "0"} Token{Number(amount) !== 1 ? "s" : ""}
          </span>
        )}
      </button>

      {/* Info */}
      <div className="mt-6 text-center text-sm text-red-300">
        <p>💡 Burning reduces the total supply and can increase rarity of remaining items</p>
      </div>
    </div>
  );
};
