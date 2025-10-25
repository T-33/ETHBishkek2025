"use client";

import React from "react";
import { formatNumber, shortAddress } from "../../utils/format";

interface Props {
  address?: string;
  balance: number;
  onEarn: () => Promise<void> | void;
  onSpend: () => Promise<void> | void;
  disabled?: boolean;
}

export const GameCard: React.FC<Props> = ({ address, balance, onEarn, onSpend, disabled = false }) => {
  return (
    <div className="bg-[#151A22] p-6 rounded-2xl shadow-lg w-full max-w-sm flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Your Balance</h2>
        <small className="text-xs text-gray-400">{address ? shortAddress(address) : "Not connected"}</small>
      </div>
      <p className="text-4xl font-extrabold text-blue-400">{formatNumber(balance)} 💎</p>
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => onEarn()}
          disabled={disabled}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium disabled:opacity-50"
        >
          Earn
        </button>
        <button
          onClick={() => onSpend()}
          disabled={disabled}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium disabled:opacity-50"
        >
          Spend
        </button>
      </div>
    </div>
  );
};
