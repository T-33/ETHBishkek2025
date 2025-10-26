/**
 * zkSync Utilities
 * Helper functions for zkSync network compatibility
 */

/**
 * Get a safe starting block for event queries on zkSync
 * zkSync RPC has limits on historical event queries, so we limit to recent blocks
 */
export const getZkSyncSafeStartBlock = async (
  currentBlock: bigint | undefined,
  blocksBack: number = 10000, // Default: last ~10k blocks (~3-4 hours on zkSync)
): Promise<bigint> => {
  if (!currentBlock) return BigInt(0);

  const startBlock = currentBlock - BigInt(blocksBack);
  return startBlock > BigInt(0) ? startBlock : BigInt(0);
};

/**
 * Get zkSync block explorer URL for the current network
 */
export const getZkSyncExplorerUrl = (chainId: number): string => {
  switch (chainId) {
    case 300: // zkSync Sepolia Testnet
      return "https://sepolia.explorer.zksync.io";
    case 324: // zkSync Mainnet
      return "https://explorer.zksync.io";
    default:
      return "https://etherscan.io"; // Fallback to Etherscan for other networks
  }
};

/**
 * Get transaction URL for block explorer
 */
export const getTxExplorerUrl = (txHash: string, chainId: number): string => {
  const baseUrl = getZkSyncExplorerUrl(chainId);
  return `${baseUrl}/tx/${txHash}`;
};

/**
 * Get address URL for block explorer
 */
export const getAddressExplorerUrl = (address: string, chainId: number): string => {
  const baseUrl = getZkSyncExplorerUrl(chainId);
  return `${baseUrl}/address/${address}`;
};

/**
 * Check if current network is zkSync
 */
export const isZkSyncNetwork = (chainId: number): boolean => {
  return chainId === 300 || chainId === 324;
};

/**
 * Get optimal batch size for event queries based on network
 */
export const getOptimalBatchSize = (chainId: number): number => {
  if (isZkSyncNetwork(chainId)) {
    return 100; // Smaller batches for zkSync to avoid RPC limits
  }
  return 500; // Default for other networks
};

/**
 * Hook to get zkSync-compatible block range
 * NOTE: This hook is currently not used in the codebase.
 * We use inline block range calculation in useAdvancedAnalytics instead.
 * Keeping for future reference.
 */
// export const useZkSyncBlockRange = (chainId: number | undefined) => {
//   const publicClient = usePublicClient({ chainId });
//
//   const getSafeBlockRange = async (blocksBack: number = 10000) => {
//     try {
//       const currentBlock = await publicClient?.getBlockNumber();
//       if (!currentBlock) return { fromBlock: 0n, toBlock: undefined };
//
//       const fromBlock = await getZkSyncSafeStartBlock(currentBlock, blocksBack);
//       return { fromBlock, toBlock: currentBlock };
//     } catch (error) {
//       console.error("Error getting block range:", error);
//       return { fromBlock: 0n, toBlock: undefined };
//     }
//   };
//
//   return { getSafeBlockRange };
// };
