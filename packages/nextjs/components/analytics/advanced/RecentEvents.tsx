"use client";

import React from "react";
import { Address } from "~~/components/scaffold-eth";
import { RecentEvent } from "~~/hooks/game/useAdvancedAnalytics";

interface RecentEventsProps {
  events: RecentEvent[];
}

const TOKEN_NAMES: { [key: number]: string } = {
  0: "Gold Coin",
  1: "Legendary Sword",
  2: "Epic Golden Chestplate",
};

const EVENT_ICONS: { [key: string]: string } = {
  mint: "✨",
  burn: "🔥",
  transfer: "↔️",
  lootbox: "🎁",
};

const EVENT_COLORS: { [key: string]: string } = {
  mint: "border-green-500 bg-green-500/10",
  burn: "border-red-500 bg-red-500/10",
  transfer: "border-blue-500 bg-blue-500/10",
  lootbox: "border-purple-500 bg-purple-500/10",
};

export const RecentEvents = ({ events }: RecentEventsProps) => {
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-gray-700 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">📡 Recent Events</h2>
        <div className="text-sm text-gray-400">Live Feed</div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-gray-400">No recent events</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {events.map((event, index) => (
            <div
              key={`${event.txHash}-${index}`}
              className={`border rounded-lg p-4 ${EVENT_COLORS[event.type]} hover:scale-102 transition-transform duration-200`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Event Info */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Icon */}
                  <div className="text-2xl mt-1">{EVENT_ICONS[event.type]}</div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold capitalize">{event.type}</span>
                      {event.tokenId !== undefined && (
                        <span className="text-sm px-2 py-0.5 bg-gray-700 rounded text-gray-300">
                          {TOKEN_NAMES[event.tokenId]}
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-gray-300">
                      <Address address={event.player} />
                      {event.amount && (
                        <span className="ml-2">
                          {event.type === "mint" && "received"}
                          {event.type === "burn" && "burned"}
                          {event.type === "lootbox" && "won"}
                          {event.type === "transfer" && "transferred"} <span className="font-bold">{event.amount}</span>{" "}
                          item{event.amount > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {/* Transaction Hash */}
                    <a
                      href={`https://etherscan.io/tx/${event.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 mt-1 inline-block"
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

      {/* Event Type Legend */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="flex flex-wrap gap-3">
          {Object.entries(EVENT_ICONS).map(([type, icon]) => (
            <div key={type} className="flex items-center gap-2 text-sm">
              <span className="text-lg">{icon}</span>
              <span className="text-gray-300 capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
