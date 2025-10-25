// nextjs/services/analytics.ts
import { GameEvent } from "../types/game";

/**
 * Simple pure functions to compute metrics from events.
 */

export function aggregateMintBurn(events: GameEvent[]) {
  let minted = 0,
    burned = 0;
  const byPlayer: Record<string, number> = {};
  for (const e of events) {
    if (e.action === "Mint") minted += e.amount;
    if (e.action === "Burn") burned += e.amount;
    byPlayer[e.player] = (byPlayer[e.player] || 0) + e.amount;
  }
  const distribution = Object.entries(byPlayer).map(([k, v]) => ({ name: k, value: v }));
  return { minted, burned, distribution, circulation: minted - burned };
}

/**
 * Convert events into time-series buckets (minute/hour/day).
 * Minimal example: group by hour
 */
export function buildMintBurnTimeSeries(events: GameEvent[]) {
  const map = new Map<number, { time: string; mint: number; burn: number }>();
  for (const e of events) {
    const hour = new Date(e.timestamp).setMinutes(0, 0, 0);
    const item = map.get(hour) ?? { time: new Date(hour).toLocaleString(), mint: 0, burn: 0 };
    if (e.action === "Mint") item.mint += e.amount;
    if (e.action === "Burn") item.burn += e.amount;
    map.set(hour, item);
  }
  return Array.from(map.values()).sort((a, b) => a.time.localeCompare(b.time));
}
