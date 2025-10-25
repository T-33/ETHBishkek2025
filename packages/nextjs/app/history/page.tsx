"use client";

import React from "react";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const TOKEN_NAMES: { [key: number]: string } = {
  0: "Gold Coin",
  1: "Legendary Sword",
  2: "Epic Golden Chestplate",
};

const EVENT_ICONS: { [key: string]: string } = {
  mint: "✨",
  burn: "🔥",
  transfer_in: "📥",
  transfer_out: "📤",
  lootbox: "🎁",
};

const EVENT_COLORS: { [key: string]: string } = {
  mint: "border-green-500 bg-green-500/10",
  burn: "border-red-500 bg-red-500/10",
  transfer_in: "border-blue-500 bg-blue-500/10",
  transfer_out: "border-orange-500 bg-orange-500/10",
  lootbox: "border-purple-500 bg-purple-500/10",
};

export default function HistoryPage() {
  const { address, isConnected } = useAccount();

  const { data: transferEvents } = useScaffoldEventHistory({
    contractName: "GameItems",
    eventName: "TransferSingle",
    fromBlock: 0n,
    watch: true,
  });

  const { data: lootboxEvents } = useScaffoldEventHistory({
    contractName: "Lootbox",
    eventName: "LootboxOpened",
    fromBlock: 0n,
    watch: true,
  });

  // Filter and categorize events for the connected player
  // Must be called before early return to follow React Hooks rules
  const playerHistory = React.useMemo(() => {
    if (!address) return [];

    const events: Array<{
      type: string;
      tokenId?: number;
      amount?: number;
      from?: string;
      to?: string;
      timestamp: number;
      txHash: string;
    }> = [];

    // Process transfer events
    transferEvents?.forEach(event => {
      const from = event.args.from?.toLowerCase();
      const to = event.args.to?.toLowerCase();
      const playerAddr = address.toLowerCase();
      const tokenId = Number(event.args.id);
      const amount = Number(event.args.value);

      // Mint (from zero address to player)
      if (from === "0x0000000000000000000000000000000000000000" && to === playerAddr) {
        events.push({
          type: "mint",
          tokenId,
          amount,
          to,
          timestamp: Date.now(),
          txHash: event.transactionHash || "0x",
        });
      }
      // Burn (from player to zero address)
      else if (from === playerAddr && to === "0x0000000000000000000000000000000000000000") {
        events.push({
          type: "burn",
          tokenId,
          amount,
          from,
          timestamp: Date.now(),
          txHash: event.transactionHash || "0x",
        });
      }
      // Transfer in (from someone else to player)
      else if (to === playerAddr && from !== "0x0000000000000000000000000000000000000000") {
        events.push({
          type: "transfer_in",
          tokenId,
          amount,
          from,
          to,
          timestamp: Date.now(),
          txHash: event.transactionHash || "0x",
        });
      }
      // Transfer out (from player to someone else)
      else if (from === playerAddr && to !== "0x0000000000000000000000000000000000000000") {
        events.push({
          type: "transfer_out",
          tokenId,
          amount,
          from,
          to,
          timestamp: Date.now(),
          txHash: event.transactionHash || "0x",
        });
      }
    });

    // Process lootbox events
    lootboxEvents?.forEach(event => {
      const player = event.args.player?.toLowerCase();
      if (player === address.toLowerCase()) {
        events.push({
          type: "lootbox",
          tokenId: Number(event.args.prizeTokenId),
          amount: Number(event.args.amount),
          timestamp: Date.now(),
          txHash: event.transactionHash || "0x",
        });
      }
    });

    // Sort by timestamp (newest first)
    return events.sort((a, b) => b.timestamp - a.timestamp);
  }, [transferEvents, lootboxEvents, address]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🔒</p>
          <p className="text-2xl text-white mb-4">Connect Your Wallet</p>
          <p className="text-gray-400">Please connect your wallet to view your transaction history</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0D1117] text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Transaction History
        </h1>
        <div className="flex items-center gap-2">
          <p className="text-gray-400">Your Address:</p>
          <Address address={address} />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-4 border-2 border-green-500">
          <div className="text-3xl mb-2">✨</div>
          <p className="text-sm text-green-100">Mints</p>
          <p className="text-2xl font-bold">{playerHistory.filter(e => e.type === "mint").length}</p>
        </div>
        <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-4 border-2 border-red-500">
          <div className="text-3xl mb-2">🔥</div>
          <p className="text-sm text-red-100">Burns</p>
          <p className="text-2xl font-bold">{playerHistory.filter(e => e.type === "burn").length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-4 border-2 border-purple-500">
          <div className="text-3xl mb-2">🎁</div>
          <p className="text-sm text-purple-100">Lootboxes</p>
          <p className="text-2xl font-bold">{playerHistory.filter(e => e.type === "lootbox").length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-4 border-2 border-blue-500">
          <div className="text-3xl mb-2">📥</div>
          <p className="text-sm text-blue-100">Received</p>
          <p className="text-2xl font-bold">{playerHistory.filter(e => e.type === "transfer_in").length}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl p-4 border-2 border-orange-500">
          <div className="text-3xl mb-2">📤</div>
          <p className="text-sm text-orange-100">Sent</p>
          <p className="text-2xl font-bold">{playerHistory.filter(e => e.type === "transfer_out").length}</p>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-gray-700 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">📜 All Transactions</h2>

        {playerHistory.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-gray-400">No transactions yet</p>
            <p className="text-sm text-gray-500 mt-2">Start by opening a lootbox on the Player page!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {playerHistory.map((event, index) => (
              <div
                key={`${event.txHash}-${index}`}
                className={`border rounded-lg p-4 ${EVENT_COLORS[event.type]} hover:scale-[1.02] transition-transform duration-200`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Event Info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Icon */}
                    <div className="text-2xl mt-1">{EVENT_ICONS[event.type]}</div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-semibold capitalize">
                          {event.type === "transfer_in"
                            ? "Received"
                            : event.type === "transfer_out"
                              ? "Sent"
                              : event.type === "lootbox"
                                ? "Lootbox Opened"
                                : event.type}
                        </span>
                        {event.tokenId !== undefined && (
                          <span className="text-sm px-2 py-0.5 bg-gray-700 rounded text-gray-300">
                            {TOKEN_NAMES[event.tokenId]}
                          </span>
                        )}
                      </div>

                      {event.amount && (
                        <p className="text-sm text-gray-300 mb-1">
                          Amount: <span className="font-bold text-white">{event.amount}</span> item
                          {event.amount > 1 ? "s" : ""}
                        </p>
                      )}

                      {/* Transfer details */}
                      {event.type === "transfer_in" && event.from && (
                        <div className="text-xs text-gray-400 mb-1">
                          From: <Address address={event.from} />
                        </div>
                      )}
                      {event.type === "transfer_out" && event.to && (
                        <div className="text-xs text-gray-400 mb-1">
                          To: <Address address={event.to} />
                        </div>
                      )}

                      {/* Transaction Hash */}
                      <a
                        href={`https://etherscan.io/tx/${event.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 inline-block"
                      >
                        {event.txHash.slice(0, 10)}...{event.txHash.slice(-8)}
                      </a>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="text-xs text-gray-400 whitespace-nowrap">{formatTimestamp(event.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-xl font-bold text-blue-400 mb-3">📊 About Your History</h3>
        <div className="space-y-2 text-gray-300 text-sm">
          <p>
            <strong className="text-white">Transaction Types:</strong>
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              <strong>✨ Mint:</strong> When you receive items from lootboxes or other sources
            </li>
            <li>
              <strong>🔥 Burn:</strong> When you permanently destroy items to reduce supply
            </li>
            <li>
              <strong>🎁 Lootbox:</strong> When you open a mystery lootbox and win items
            </li>
            <li>
              <strong>📥 Received:</strong> When you receive items transferred from another player
            </li>
            <li>
              <strong>📤 Sent:</strong> When you transfer items to another player
            </li>
          </ul>
          <p className="text-xs text-gray-400 mt-4">
            💡 All transactions are recorded on the Ethereum blockchain and are permanent and verifiable.
          </p>
        </div>
      </div>
    </main>
  );
}
