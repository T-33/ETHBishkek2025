// // nextjs/hooks/game/useGameToken.ts
// "use client";
//
// import { useEffect, useState } from "react";
// import { useAccount } from "wagmi";
// import {
//     useContractRead,
//     usePrepareContractWrite,
//     useContractWrite,
//     useWaitForTransaction,
// } from "wagmi";
// import gameAbi from "../../contracts/GameToken.json";
// import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
//
export const useGameToken = () => "";
// const ZERO = "0x0000000000000000000000000000000000000000";
//
// export const useGameToken = () => {
//     const { address } = useAccount();
//     const contractInfo = useDeployedContractInfo("GameToken");
//     const contractAddress = contractInfo?.address as `0x${string}` | undefined;
//
//     const [balance, setBalance] = useState<number>(0);
//     const watchedArgs = [address ?? ZERO, 0];
//
//     // Read balanceOf(address, id)
//     const read = useContractRead({
//         address: contractAddress,
//         abi: gameAbi as any,
//         functionName: "balanceOf",
//         args: watchedArgs,
//         enabled: !!contractAddress && !!address,
//         watch: true, // keep updated
//     });
//
//     useEffect(() => {
//         if (!read || !read.data) {
//             setBalance(0);
//             return;
//         }
//         try {
//             const raw = read.data;
//             // handle BigNumber or numeric string
//             const val = typeof raw === "bigint" ? Number(raw) : Number((raw as any)?.toString?.() ?? 0);
//             setBalance(val);
//         } catch {
//             setBalance(0);
//         }
//     }, [read.data]);
//
//     // Prepare mint (earn)
//     const { config: mintConfig } = usePrepareContractWrite({
//         address: contractAddress,
//         abi: gameAbi as any,
//         functionName: "mint",
//         args: [address ?? ZERO, 0, 1, "0x"],
//         enabled: !!contractAddress && !!address,
//     });
//     const mintWrite = useContractWrite(mintConfig);
//
//     // Prepare burn (spend)
//     const { config: burnConfig } = usePrepareContractWrite({
//         address: contractAddress,
//         abi: gameAbi as any,
//         functionName: "burn",
//         args: [address ?? ZERO, 0, 1],
//         enabled: !!contractAddress && !!address,
//     });
//     const burnWrite = useContractWrite(burnConfig);
//
//     // optional: expose tx status for UI
//     const mintWait = useWaitForTransaction({ hash: mintWrite.data?.hash, enabled: !!mintWrite.data?.hash });
//     const burnWait = useWaitForTransaction({ hash: burnWrite.data?.hash, enabled: !!burnWrite.data?.hash });
//
//     const earn = async () => {
//         if (!mintWrite.writeAsync) throw new Error("mint not ready");
//         return mintWrite.writeAsync();
//     };
//
//     const spend = async () => {
//         if (!burnWrite.writeAsync) throw new Error("burn not ready");
//         return burnWrite.writeAsync();
//     };
//
//     return {
//         address,
//         contractAddress,
//         balance,
//         earn,
//         spend,
//         tx: {
//             mintHash: mintWrite.data?.hash,
//             mintStatus: mintWait.status,
//             burnHash: burnWrite.data?.hash,
//             burnStatus: burnWait.status,
//         },
//     };
// };
