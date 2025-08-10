'use client';

import Link from 'next/link';
import { useCurrentRoundInfo } from '@/hooks/useContractReads';
import { Mode } from '@/contract/types';
import { formatEther } from 'viem';

function StatsStrip() {
  const { data: turboInfo } = useCurrentRoundInfo(Mode.Turbo);
  const { data: classicInfo } = useCurrentRoundInfo(Mode.Classic);

  return (
    <div className="bg-avalanche-800/50 border border-avalanche-600/30 rounded-2xl p-6 backdrop-blur-sm">
      <h3 className="text-lg font-grotesk font-semibold text-white mb-4">Live Stats</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-avalanche-200">Turbo Mode</h4>
          <div className="text-2xl font-bold text-lava-400">
            Round #{turboInfo?.lotteryId?.toString() || '0'}
          </div>
          <div className="text-sm text-avalanche-300">
            Pot: {turboInfo ? formatEther(turboInfo.pot) : '0'} AVAX
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-avalanche-200">Classic Mode</h4>
          <div className="text-2xl font-bold text-lava-400">
            Round #{classicInfo?.lotteryId?.toString() || '0'}
          </div>
          <div className="text-sm text-avalanche-300">
            Pot: {classicInfo ? formatEther(classicInfo.pot) : '0'} AVAX
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-lava rounded-2xl mb-8">
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-5xl md:text-7xl font-grotesk font-bold text-white mb-6 leading-tight">
          ATROPOS
        </h1>
        <p className="text-xl md:text-2xl text-avalanche-200 mb-8 max-w-3xl mx-auto leading-relaxed">
          Where fate meets AVAX. 
          Fast rounds, fair odds, instant payouts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/lottery"
            className="bg-gradient-lava hover:from-lava-600 hover:to-lava-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 text-lg"
          >
            Play Lottery Rounds
          </Link>
          <Link
            href="/coinflip"
            className="bg-avalanche-700/50 hover:bg-avalanche-600/50 border border-avalanche-600/50 hover:border-avalanche-500/50 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 text-lg"
          >
            50/50 Duels
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <div className="bg-avalanche-800/50 border border-avalanche-600/30 rounded-2xl p-8 backdrop-blur-sm group hover:border-lava-500/50 transition-all duration-300">
          <div className="w-12 h-12 bg-lava-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-lava-500/30 transition-colors">
            <svg className="w-6 h-6 text-lava-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 008 9.172V5L8 4z" />
            </svg>
          </div>
          <h2 className="text-2xl font-grotesk font-bold text-white mb-4">Lottery Rounds</h2>
          <p className="text-avalanche-200 mb-6 leading-relaxed">
            Join Turbo (3 min) or Classic (15 min) lottery rounds. Buy multiple tickets to increase your chances. 
            Winner takes 90% of the pot.
          </p>
          <div className="space-y-2 text-sm text-avalanche-300 mb-6">
            <div>• Turbo: 10 tickets max, ~3 minutes</div>
            <div>• Classic: 30 tickets max, ~15 minutes</div>
            <div>• Lottery fee: 10% house • Winner: 90% of pot</div>
          </div>
          <Link
            href="/lottery"
            className="inline-flex items-center text-lava-400 hover:text-lava-300 font-semibold transition-colors"
          >
            Play Now
            <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="bg-avalanche-800/50 border border-avalanche-600/30 rounded-2xl p-8 backdrop-blur-sm group hover:border-lava-500/50 transition-all duration-300">
          <div className="w-12 h-12 bg-lava-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-lava-500/30 transition-colors">
            <svg className="w-6 h-6 text-lava-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h2 className="text-2xl font-grotesk font-bold text-white mb-4">50/50 Duels</h2>
          <p className="text-avalanche-200 mb-6 leading-relaxed">
            Join betting pools and get matched instantly with other players. 
            50/50 odds, winner gets 95% of the combined pot.
          </p>
          <div className="space-y-2 text-sm text-avalanche-300 mb-6">
            <div>• Instant matching with other players</div>
            <div>• Multiple bet amounts available</div>
            <div>• Duel fee: 5% house • Winner gets 95% of the pot</div>
          </div>
          <Link
            href="/coinflip"
            className="inline-flex items-center text-lava-400 hover:text-lava-300 font-semibold transition-colors"
          >
            Duel Now
            <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <StatsStrip />

      {/* Info Section */}
      <div className="mt-16 text-center">
        <div className="bg-avalanche-800/30 border border-avalanche-600/30 rounded-2xl p-8 backdrop-blur-sm">
          <h3 className="text-xl font-grotesk font-semibold text-white mb-4">Important Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-avalanche-200">
            <div>
              <p className="mb-2">
                <strong className="text-white">Gas is paid to the network and is separate from fees.</strong>
              </p>
              <p>
                All transactions occur on the Avalanche Fuji testnet. Use only test AVAX tokens.
              </p>
            </div>
            <div>
              <p className="mb-2">
                <strong className="text-white">Fair and transparent:</strong>
              </p>
              <p>
                All game logic runs on-chain with verifiable randomness. No hidden mechanics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}