// // nextjs/hooks/game/useAnalytics.ts
// "use client";
//
// import { useEffect, useState } from "react";
// import { useContractEvent } from "wagmi";
// import gameAbi from "../../contracts/GameToken.json";
// import { GameEvent } from "../../types/game";
export const useAnalytics = () => "";
// export const useAnalytics = () => {
//     const [events, setEvents] = useState<GameEvent[]>([]);
//     const contractInfo = useDeployedContractInfo("GameToken");
//     const contractAddress = contractInfo?.address as `0x${string}` | undefined;
//
//     // Listen TransferSingle(operator, from, to, id, value)
//     useContractEvent({
//         address: contractAddress,
//         abi: gameAbi as any,
//         eventName: "TransferSingle",
//         listener: (operator, from, to, id, value, event) => {
//             try {
//                 // id and value could be BigNumber-like
//                 const nValue = Number((value as any)?.toString?.() ?? 0);
//                 const fromAddr = (from as string) ?? ZERO;
//                 const toAddr = (to as string) ?? ZERO;
//
//                 const action: GameEvent["action"] =
//                     fromAddr === ZERO ? "Mint" : toAddr === ZERO ? "Burn" : "Transfer";
//
//                 const player = action === "Mint" ? toAddr : fromAddr;
//
//                 const evt: GameEvent = {
//                     timestamp: Date.now(),
//                     player,
//                     action,
//                     amount: nValue,
//                     txHash: (event as any)?.transactionHash ?? undefined,
//                 };
//
//                 setEvents(prev => {
//                     const next = [evt, ...prev];
//                     if (next.length > 500) next.length = 500;
//                     return next;
//                 });
//             } catch (err) {
//                 // non-fatal: log for debug
//                 // eslint-disable-next-line no-console
//                 console.error("useAnalytics: failed to parse TransferSingle event", err);
//             }
//         },
//         once: false,
//         enabled: !!contractAddress,
//     });
//
//     // Derived metrics
//     const metrics = aggregateMintBurn(events);
//     const timeSeries = buildMintBurnTimeSeries(events);
//
//     return { events, metrics, timeSeries };
// };
