"use client";

import { useState } from "react";
import gameAbi from "../../../hardhat/artifacts/contracts/GameItems.sol/GameItems.json";
import { useWatchContractEvent } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { aggregateMintBurn, buildMintBurnTimeSeries } from "~~/services/analytics";
import { GameEvent } from "~~/types/game";

const ZERO = "0x0000000000000000000000000000000000000000";

// We use useWatchContractEvent which provides onLogs callback
export const useAnalytics = () => {
  const [events, setEvents] = useState<GameEvent[]>([]);
  const { data: contractInfo } = useDeployedContractInfo("GameItems");
  const contractAddress = contractInfo?.address as `0x${string}` | undefined;

  useWatchContractEvent({
    address: contractAddress,
    abi: gameAbi as any,
    eventName: "TransferSingle",
    // `onLogs` receives an array of logs when available (wagmi helper)
    onLogs(logs) {
      if (!logs || logs.length === 0) return;
      const parsed: GameEvent[] = [];
      for (const l of logs) {
        try {
          const args = (l as any).args ?? {};
          // TransferSingle(operator, from, to, id, value)
          const from = (args.from ?? ZERO) as string;
          const to = (args.to ?? ZERO) as string;
          const rawValue = args.value ?? args[4] ?? 0;
          const value = Number((rawValue as any)?.toString?.() ?? rawValue ?? 0);

          const action: GameEvent["action"] =
            from.toLowerCase() === ZERO ? "Mint" : to.toLowerCase() === ZERO ? "Burn" : "Transfer";

          const player = action === "Mint" ? to : from;

          parsed.push({
            timestamp: Date.now(),
            player,
            action,
            amount: value,
            txHash: (l as any).transactionHash,
          });
        } catch (err) {
          // ignore parse error
          console.warn("parse log", err);
        }
      }

      if (parsed.length) {
        setEvents(prev => {
          const next = [...parsed.reverse(), ...prev]; // older first from logs? ensure order
          if (next.length > 500) next.length = 500;
          return next;
        });
      }
    },
    enabled: !!contractAddress,
  });

  const metrics = aggregateMintBurn(events);
  const timeSeries = buildMintBurnTimeSeries(events);

  return { events, metrics, timeSeries };
};
