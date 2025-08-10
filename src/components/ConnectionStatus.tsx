'use client';

import { useContractEvents } from '@/hooks/useContractEvents';

export function ConnectionStatus() {
  const { isConnected, isPolling } = useContractEvents();

  if (isConnected) return null;

  return (
    <div className="fixed top-20 right-4 z-50">
      <div className="bg-yellow-500/20 border border-yellow-500/50 backdrop-blur-sm rounded-lg px-3 py-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-yellow-200">
            Live updates degraded — polling active
          </span>
        </div>
      </div>
    </div>
  );
}