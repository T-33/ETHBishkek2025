// nextjs/components/game-dashboard/EventLogTable.tsx
import React from "react";
import { GameEvent } from "../../types/game";
import { shortAddress } from "../../utils/format";

interface Props {
  events: GameEvent[];
}

export const EventLogTable: React.FC<Props> = ({ events }) => {
  return (
    <div className="mt-8 bg-[#0B0E12] p-4 rounded-lg">
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-gray-400 uppercase text-xs">
          <tr>
            <th className="py-2">Time</th>
            <th>Player</th>
            <th>Action</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e, i) => (
            <tr key={i} className="border-t border-gray-800">
              <td className="py-2">{new Date(e.timestamp).toLocaleString()}</td>
              <td className="font-mono text-blue-400">{shortAddress(e.player)}</td>
              <td>{e.action}</td>
              <td className="text-right">{e.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
