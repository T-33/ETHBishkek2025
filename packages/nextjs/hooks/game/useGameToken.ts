// nextjs/hooks/game/useGameToken.ts
"use client";

import { useMemo } from "react";
import gameAbi from "../../../hardhat/artifacts/contracts/GameItems.sol/GameItems.json";
import { type Abi } from "viem";
import { useAccount } from "wagmi";
import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

// nextjs/hooks/game/useGameToken.ts

// nextjs/hooks/game/useGameToken.ts

// nextjs/hooks/game/useGameToken.ts

// nextjs/hooks/game/useGameToken.ts

// nextjs/hooks/game/useGameToken.ts

// nextjs/hooks/game/useGameToken.ts

// nextjs/hooks/game/useGameToken.ts

// nextjs/hooks/game/useGameToken.ts

// nextjs/hooks/game/useGameToken.ts

// nextjs/hooks/game/useGameToken.ts

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const GOLD_COIN_ID = 0; // Используем константу для ID токена

export const useGameToken = () => {
  const { address } = useAccount();
  const { data: contractInfo } = useDeployedContractInfo("GameItems");
  const contractAddress = contractInfo?.address;

  // 1. Заменили useContractRead на useReadContract
  // Он проще и возвращает данные в более удобном формате.
  const { data: rawBalance, refetch: refetchBalance } = useReadContract({
    address: contractAddress,
    abi: gameAbi.abi as Abi,
    functionName: "balanceOf",
    args: [address ?? ZERO_ADDRESS, GOLD_COIN_ID],
    query: {
      enabled: !!contractAddress && !!address,
    },
  });

  // 2. Убрали лишний useEffect и useState. Вычисляем баланс напрямую.
  const balance = useMemo(() => (typeof rawBalance === "bigint" ? Number(rawBalance) : 0), [rawBalance]);

  // 3. Заменили связку usePrepare/useWrite на единый useWriteContract.
  // Он сам обрабатывает подготовку транзакции.
  const { data: mintHash, writeContractAsync: mint } = useWriteContract();
  const { data: burnHash, writeContractAsync: burn } = useWriteContract();

  const earn = async () => {
    if (!address) throw new Error("Wallet not connected");
    return mint({
      address: contractAddress!,
      abi: gameAbi.abi as Abi,
      functionName: "mint",
      args: [address, GOLD_COIN_ID, 1, "0x"],
    });
  };

  const spend = async () => {
    if (!address) throw new Error("Wallet not connected");
    // 4. ИСПРАВЛЕНО: Вызываем safeTransferFrom для сжигания токена
    // Мы отправляем токен с нашего адреса (from) на нулевой адрес (to).
    return burn({
      address: contractAddress!,
      abi: gameAbi.abi as Abi,
      functionName: "safeTransferFrom",
      args: [address, ZERO_ADDRESS, GOLD_COIN_ID, 1, "0x"],
    });
  };

  // 5. Заменили useWaitForTransaction на useWaitForTransactionReceipt
  const { status: mintStatus } = useWaitForTransactionReceipt({ hash: mintHash });
  const { status: burnStatus } = useWaitForTransactionReceipt({ hash: burnHash });

  return {
    address,
    contractAddress,
    balance,
    earn,
    spend,
    refetchBalance, // Добавили функцию для ручного обновления баланса
    tx: {
      mintHash,
      mintStatus,
      burnHash,
      burnStatus,
    },
  };
};
