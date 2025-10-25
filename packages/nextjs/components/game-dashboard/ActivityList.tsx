"use client";

import React from "react";
import { GameEvent } from "~~/types/game";
import { shortAddress } from "~~/utils/format";

interface Props {
  events: GameEvent[];
  className?: string;
}

export const ActivityList: React.FC<Props> = ({ events, className }) => {
  return (
    <ul className={`w-full text-sm text-gray-300 divide-y divide-gray-700 mt-6 ${className ?? ""}`}>
      {events.map((e, i) => (
        <li key={i} className="py-2 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">{new Date(e.timestamp).toLocaleTimeString()}</span>
            <span className="text-sm">{shortAddress(e.player)}</span>
          </div>
          <div className="text-right">
            <div className="text-sm">{e.action}</div>
            <div className="text-xs text-gray-400">{e.amount}</div>
          </div>
        </li>
      ))}
    </ul>
  );
};
