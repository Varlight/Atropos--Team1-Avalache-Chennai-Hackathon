'use client';

import { useEffect, useState } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { avalancheFuji } from '@/config/chains';

export function useNetworkGuard() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  useEffect(() => {
    setIsCorrectNetwork(chainId === avalancheFuji.id);
  }, [chainId]);

  const handleSwitchNetwork = async () => {
    if (!switchChain) return;

    try {
      await switchChain({ chainId: avalancheFuji.id });
    } catch (error: any) {
      // If chain doesn't exist, try to add it
      if (error.code === 4902 || error.message?.includes('Unrecognized chain')) {
        try {
          await (window as any).ethereum?.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${avalancheFuji.id.toString(16)}`,
              chainName: avalancheFuji.name,
              nativeCurrency: avalancheFuji.nativeCurrency,
              rpcUrls: avalancheFuji.rpcUrls.default.http,
              blockExplorerUrls: avalancheFuji.blockExplorers?.default?.url ? [avalancheFuji.blockExplorers.default.url] : [],
            }],
          });
        } catch (addError) {
          console.error('Failed to add Fuji network:', addError);
        }
      } else {
        console.error('Failed to switch to Fuji network:', error);
      }
    }
  };

  return {
    isConnected,
    isCorrectNetwork,
    isPending,
    handleSwitchNetwork,
    targetChain: avalancheFuji,
  };
}