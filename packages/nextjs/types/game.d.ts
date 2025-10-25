export type GameEvent = {
  timestamp: number;
  player: string;
  action: "Mint" | "Burn" | "Transfer";
  amount: number;
  txHash?: string;
};
