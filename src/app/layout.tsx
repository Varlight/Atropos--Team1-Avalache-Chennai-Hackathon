'use client';

import '@rainbow-me/rainbowkit/styles.css';
import './globals.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { config } from '@/config/wagmi';
import { Header } from '@/components/Header';
import { NetworkGuard } from '@/components/NetworkGuard';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider
                theme={darkTheme({
                  accentColor: '#E84142',
                  accentColorForeground: 'white',
                  borderRadius: 'medium',
                  fontStack: 'system',
                })}
              >
                <div className="min-h-screen bg-gradient-avalanche">
                  <Header />
                  <ConnectionStatus />
                  <NetworkGuard>
                    <main>{children}</main>
                  </NetworkGuard>
                <footer className="border-t border-avalanche-600/30 bg-avalanche-800/30 mt-16">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                      <div className="text-avalanche-300 text-sm">
                        © 2024 ATROPOS - Avalanche Fuji Testnet
                      </div>
                      <a
                        href={`https://testnet.snowtrace.io/address/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lava-400 hover:text-lava-300 text-sm font-medium transition-colors"
                      >
                        View Contract on Snowtrace
                      </a>
                    </div>
                  </div>
                </footer>
                </div>
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}