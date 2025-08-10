'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useAccount } from 'wagmi';

export function Header() {
  const { isConnected } = useAccount();

  return (
    <header className="border-b border-avalanche-600/30 bg-avalanche-800/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-lava rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xl font-grotesk font-bold text-white">ATROPOS</span>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link 
                href="/lottery" 
                className="text-avalanche-200 hover:text-white transition-colors duration-200 font-medium"
              >
                Raffle
              </Link>
              <Link 
                href="/coinflip" 
                className="text-avalanche-200 hover:text-white transition-colors duration-200 font-medium"
              >
                Duel
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {isConnected && (
              <div className="hidden sm:flex items-center px-3 py-1 bg-avalanche-700/50 border border-avalanche-600/50 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-xs font-medium text-avalanche-200">Fuji</span>
              </div>
            )}
            
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button 
                            onClick={openConnectModal} 
                            type="button"
                            className="bg-gradient-lava hover:from-lava-600 hover:to-lava-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200"
                          >
                            Connect Wallet
                          </button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <button 
                            onClick={openChainModal} 
                            type="button"
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-200"
                          >
                            Wrong network
                          </button>
                        );
                      }

                      return (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={openAccountModal}
                            type="button"
                            className="bg-avalanche-700/50 hover:bg-avalanche-600/50 border border-avalanche-600/50 hover:border-avalanche-500/50 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200 flex items-center space-x-2"
                          >
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="hidden sm:inline">{account.displayName}</span>
                            <span className="sm:hidden">{account.displayName?.slice(0, 6)}...</span>
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>
      
      <div className="bg-lava-500/20 border-b border-lava-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-2 text-center">
            <span className="text-sm font-medium text-lava-200">
              Avalanche Fuji — test tokens only.
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}