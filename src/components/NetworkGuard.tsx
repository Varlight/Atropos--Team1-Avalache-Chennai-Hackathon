'use client';

import { useNetworkGuard } from '@/hooks/useNetworkGuard';

interface NetworkGuardProps {
  children: React.ReactNode;
}

export function NetworkGuard({ children }: NetworkGuardProps) {
  const { isConnected, isCorrectNetwork, isPending, handleSwitchNetwork, targetChain } = useNetworkGuard();

  if (!isConnected) {
    return <>{children}</>;
  }

  if (!isCorrectNetwork) {
    return (
      <div className="min-h-screen bg-gradient-avalanche flex items-center justify-center p-4">
        <div className="bg-avalanche-700/50 backdrop-blur-sm border border-avalanche-600/50 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-lava-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-lava-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-grotesk font-bold text-white mb-4">
            Wrong Network
          </h2>
          <p className="text-avalanche-200 mb-6">
            This app requires the Avalanche Fuji C-Chain testnet. Please switch to continue.
          </p>
          <button
            onClick={handleSwitchNetwork}
            disabled={isPending}
            className="w-full bg-gradient-lava hover:from-lava-600 hover:to-lava-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Switching...</span>
              </div>
            ) : (
              `Switch to ${targetChain.name}`
            )}
          </button>
          <p className="text-xs text-avalanche-300 mt-4">
            If the network doesn't appear, it will be added automatically
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}