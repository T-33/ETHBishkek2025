// nextjs/app/dashboard/page.tsx
"use client";

import React from "react";
import { ChartPanel } from "../../components/game-dashboard/ChartPanel";
import { EventLogTable } from "../../components/game-dashboard/EventLogTable";
import { GameCard } from "../../components/game-dashboard/GameCard";
import { StatCard } from "../../components/game-dashboard/StatCard";
import { useAnalytics } from "../../hooks/game/useAnalytics";
import { useGameToken } from "../../hooks/game/useGameToken";

// nextjs/app/dashboard/page.tsx

// nextjs/app/dashboard/page.tsx

// nextjs/app/dashboard/page.tsx

// nextjs/app/dashboard/page.tsx

// nextjs/app/dashboard/page.tsx

// nextjs/app/dashboard/page.tsx

// nextjs/app/dashboard/page.tsx

// nextjs/app/dashboard/page.tsx

// nextjs/app/dashboard/page.tsx

// nextjs/app/dashboard/page.tsx

export default function DashboardPage() {
  const { address, balance, earn, spend } = useGameToken();
  const { events, metrics, timeSeries } = useAnalytics();

  // add wrappers
  const handleEarn = async () => {
    try {
      await earn();
    } catch (e) {
      console.error("earn failed", e);
    }
  };

  const handleSpend = async () => {
    try {
      await spend();
    } catch (e) {
      console.error("spend failed", e);
    }
  };
  return (
    <main className="min-h-screen bg-[#0D1117] text-white p-8">
      <h1 className="text-2xl font-bold mb-8">Game Economy Dashboard</h1>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <GameCard address={address} balance={balance} onEarn={handleEarn} onSpend={handleSpend} />
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard title="Total Minted" value={metrics.minted} color="blue" />
            <StatCard title="Total Burned" value={metrics.burned} color="purple" />
            <StatCard title="Circulation" value={metrics.circulation} color="green" />
          </div>

          <ChartPanel mintBurnData={timeSeries} distributionData={metrics.distribution} />
        </div>
      </div>

      <EventLogTable events={events} />
    </main>
  );
}
