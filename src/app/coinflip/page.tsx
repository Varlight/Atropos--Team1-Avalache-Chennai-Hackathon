'use client';

import { useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { formatEther } from 'viem';
import { 
  useFixedBetAmounts, 
  useWaitingCountByIndex, 
  usePlayerWaitingAmount,
} from '@/hooks/useContractReads';
import { useJoinCoinFlip, useCancelWaiting } from '@/hooks/useContractWrites';
import { useContractEvents } from '@/hooks/useContractEvents';
import { formatErrorForUser } from '@/utils/errorHandling';
import { checkBalanceForTransaction, validateCoinFlipJoin } from '@/utils/transactionGuards';

interface PoolTileProps {
  index: number;
  betAmount: bigint;
  waitingCount: number;
  userWaitingAmount: bigint;
  isUserInQueue: boolean;
}

function PoolTile({ index, betAmount, waitingCount, userWaitingAmount, isUserInQueue }: PoolTileProps) {
  const { address } = useAccount();
  const { joinFlip, isPending: isJoining, error: joinError } = useJoinCoinFlip();
  const { cancelWaiting, isPending: isCanceling, error: cancelError } = useCancelWaiting();
  const { data: balance } = useBalance({ address });

  const handleJoin = () => {
    if (!address) return;
    
    // Validate join
    const joinValidation = validateCoinFlipJoin(userWaitingAmount, betAmount, waitingCount);
    if (!joinValidation.canProceed) {
      alert(joinValidation.errorMessage);
      return;
    }
    
    // Check balance
    const balanceCheck = checkBalanceForTransaction(balance?.value, betAmount);
    if (!balanceCheck.canProceed) {
      alert(balanceCheck.errorMessage);
      return;
    }
    
    // Show warning if balance will be low
    if (balanceCheck.warningMessage) {
      const proceed = window.confirm(`${balanceCheck.warningMessage}\n\nDo you want to continue?`);
      if (!proceed) return;
    }
    
    joinFlip(index, betAmount);
  };

  const handleCancel = () => {
    cancelWaiting();
  };

  const canJoin = !!address && !isUserInQueue && waitingCount < 2;
  const isPending = isJoining || isCanceling;

  return (
    <div className="bg-avalanche-800/50 border border-avalanche-600/30 rounded-2xl p-6 hover:border-lava-500/50 transition-all duration-300">
      <div className="text-center mb-4">
        <div className="text-3xl font-grotesk font-bold text-lava-400 mb-2">
          {formatEther(betAmount)}
        </div>
        <div className="text-sm text-avalanche-300">AVAX</div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-avalanche-200">Waiting Players</span>
          <span className="text-white font-medium">{waitingCount}/2</span>
        </div>
        <div className="w-full bg-avalanche-700 rounded-full h-3">
          <div 
            className="bg-gradient-lava h-3 rounded-full transition-all duration-300"
            style={{ width: `${(waitingCount / 2) * 100}%` }}
          />
        </div>
      </div>

      {isUserInQueue ? (
        <button
          onClick={handleCancel}
          disabled={isPending}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
        >
          {isPending ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Canceling...</span>
            </div>
          ) : (
            'Cancel'
          )}
        </button>
      ) : (
        <button
          onClick={handleJoin}
          disabled={!canJoin || isPending || waitingCount >= 2}
          className="w-full bg-gradient-lava hover:from-lava-600 hover:to-lava-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
        >
          {isPending ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Joining...</span>
            </div>
          ) : !address ? (
            'Connect Wallet'
          ) : waitingCount >= 2 ? (
            'Pool Full'
          ) : (
            'Join'
          )}
        </button>
      )}

      {(joinError || cancelError) && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-sm text-red-200 mt-4">
          {formatErrorForUser(joinError || cancelError)}
        </div>
      )}
    </div>
  );
}

function RecentFlips() {
  const { events } = useContractEvents();

  // Filter for flip events
  const flipEvents = events.filter(event => 
    event.eventName === 'FlipMatched' || 
    event.eventName === 'FlipResolved'
  ).slice(0, 10);

  return (
    <div className="bg-avalanche-800/50 border border-avalanche-600/30 rounded-2xl p-6">
      <h3 className="text-lg font-grotesk font-semibold text-white mb-4">Recent Flips</h3>
      
      {flipEvents.length > 0 ? (
        <div className="space-y-3">
          {flipEvents.map((event, index) => (
            <div key={`${event.txHash}-${event.logIndex}`} className="bg-avalanche-700/50 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium text-white text-sm mb-1">
                    {event.eventName === 'FlipMatched' && 'Players Matched'}
                    {event.eventName === 'FlipResolved' && 'Flip Completed'}
                  </div>
                  <div className="text-xs text-avalanche-300 space-y-1">
                    {event.eventName === 'FlipMatched' && (
                      <>
                        <div>Amount: {event.args?.betAmount ? formatEther(event.args.betAmount) : '0'} AVAX</div>
                        <div>Players: {event.args?.player1?.slice(0, 6)}...{event.args?.player1?.slice(-4)} vs {event.args?.player2?.slice(0, 6)}...{event.args?.player2?.slice(-4)}</div>
                      </>
                    )}
                    {event.eventName === 'FlipResolved' && (
                      <>
                        <div>Winner: {event.args?.winner?.slice(0, 6)}...{event.args?.winner?.slice(-4)}</div>
                        <div>Prize: {event.args?.prize ? formatEther(event.args.prize) : '0'} AVAX</div>
                        <div>Result: {event.args?.coinSide ? 'Heads' : 'Tails'}</div>
                      </>
                    )}
                  </div>
                </div>
                <a
                  href={`https://testnet.snowtrace.io/tx/${event.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-lava-400 hover:text-lava-300 transition-colors"
                >
                  View
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-avalanche-400 py-8">
          No recent flips
        </div>
      )}
    </div>
  );
}

export default function CoinFlipPage() {
  const { address } = useAccount();
  const { data: betAmounts } = useFixedBetAmounts();
  const { data: userWaitingAmount, refetch: refetchWaiting } = usePlayerWaitingAmount(address);
  const { events } = useContractEvents();

  // Refetch waiting amount when relevant events occur
  useEffect(() => {
    const relevantEvents = events.filter(event => 
      event.eventName === 'PlayerJoinedQueue' || 
      event.eventName === 'PlayerLeftQueue' ||
      event.eventName === 'FlipMatched'
    );
    
    if (relevantEvents.length > 0) {
      refetchWaiting();
    }
  }, [events, refetchWaiting]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-grotesk font-bold text-white mb-4">Duel</h1>
        <p className="text-xl text-avalanche-200 mb-6">
          Choose your bet amount and get matched with another player!
        </p>
        <div className="text-sm text-avalanche-300 space-y-1">
          <div>Duel fee: 5% house • Winner gets 95% of the pot.</div>
          <div>Gas is paid to the network and is separate from fees.</div>
        </div>
      </div>

      {/* User Queue Status */}
      {address && userWaitingAmount && Number(userWaitingAmount) > 0 && (
        <div className="bg-lava-500/20 border border-lava-500/50 rounded-2xl p-6 mb-8">
          <div className="text-center">
            <div className="text-lg font-grotesk font-semibold text-lava-300 mb-2">
              You're in the queue for {formatEther(userWaitingAmount)} AVAX
            </div>
            <div className="text-sm text-lava-200">Waiting for another player to join...</div>
          </div>
        </div>
      )}

      {/* Pool Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {betAmounts?.map((amount, index) => {
          if (!amount) return null;
          
          return (
            <PoolTileWithData 
              key={index} 
              index={index} 
              betAmount={amount} 
              userWaitingAmount={userWaitingAmount || 0n}
            />
          );
        })}
      </div>

      {/* Recent Activity */}
      <RecentFlips />
    </div>
  );
}

function PoolTileWithData({ index, betAmount, userWaitingAmount }: { index: number; betAmount: bigint; userWaitingAmount: bigint }) {
  const { data: waitingCount } = useWaitingCountByIndex(index);
  const isUserInQueue = userWaitingAmount === betAmount;

  return (
    <PoolTile
      index={index}
      betAmount={betAmount}
      waitingCount={Number(waitingCount || 0)}
      userWaitingAmount={userWaitingAmount}
      isUserInQueue={isUserInQueue}
    />
  );
}