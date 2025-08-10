'use client';

import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { Mode } from '@/contract/types';
import { 
  useCurrentRoundInfo, 
  useTicketsBought, 
  useTimeUntilDraw,
  useUserTickets,
  useCanDrawLottery,
  useTicketPrice,
} from '@/hooks/useContractReads';
import { useBuyLotteryTickets, useTriggerLotteryDraw } from '@/hooks/useContractWrites';
import { useContractEvents } from '@/hooks/useContractEvents';
import { Countdown } from '@/components/Countdown';
import { formatErrorForUser } from '@/utils/errorHandling';
import { checkBalanceForTransaction, validateLotteryPurchase } from '@/utils/transactionGuards';

interface BuyPanelProps {
  mode: Mode;
  ticketPrice: bigint;
  maxTickets: number;
  currentTickets: number;
  disabled: boolean;
}

function BuyPanel({ mode, ticketPrice, maxTickets, currentTickets, disabled }: BuyPanelProps) {
  const { address } = useAccount();
  const [quantity, setQuantity] = useState(1);
  const { buyTickets, isPending, error } = useBuyLotteryTickets();
  const { data: balance } = useBalance({ address });
  
  const total = ticketPrice * BigInt(quantity);
  const remaining = maxTickets - currentTickets;
  const maxBuyable = Math.min(remaining, 10); // UI limit

  const handleBuy = () => {
    if (!address || disabled) return;
    
    // Validate purchase
    const purchaseValidation = validateLotteryPurchase(mode, quantity, maxTickets, currentTickets);
    if (!purchaseValidation.canProceed) {
      alert(purchaseValidation.errorMessage);
      return;
    }
    
    // Check balance
    const balanceCheck = checkBalanceForTransaction(balance?.value, total);
    if (!balanceCheck.canProceed) {
      alert(balanceCheck.errorMessage);
      return;
    }
    
    // Show warning if balance will be low
    if (balanceCheck.warningMessage) {
      const proceed = window.confirm(`${balanceCheck.warningMessage}\n\nDo you want to continue?`);
      if (!proceed) return;
    }
    
    buyTickets(mode, quantity, total);
  };

  const canBuy = !disabled && currentTickets < maxTickets && quantity > 0;

  return (
    <div className="bg-avalanche-800/50 border border-avalanche-600/30 rounded-2xl p-6">
      <h3 className="text-lg font-grotesk font-semibold text-white mb-4">Buy Tickets</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-avalanche-200 mb-2">
            Quantity (Max: {maxBuyable})
          </label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || isPending}
              className="w-10 h-10 bg-avalanche-700 hover:bg-avalanche-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center text-white font-bold transition-colors"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(maxBuyable, parseInt(e.target.value) || 1)))}
              min="1"
              max={maxBuyable}
              disabled={isPending}
              className="flex-1 bg-avalanche-700 border border-avalanche-600 rounded-lg px-3 py-2 text-white text-center font-medium focus:outline-none focus:ring-2 focus:ring-lava-500 focus:border-transparent disabled:opacity-50"
            />
            <button
              onClick={() => setQuantity(Math.min(maxBuyable, quantity + 1))}
              disabled={quantity >= maxBuyable || isPending}
              className="w-10 h-10 bg-avalanche-700 hover:bg-avalanche-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center text-white font-bold transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div className="bg-avalanche-700/50 rounded-lg p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-avalanche-200">Price per ticket</span>
            <span className="text-white">{formatEther(ticketPrice)} AVAX</span>
          </div>
          <div className="flex justify-between text-lg font-semibold border-t border-avalanche-600 pt-2">
            <span className="text-white">Total</span>
            <span className="text-lava-400">{formatEther(total)} AVAX</span>
          </div>
        </div>

        <button
          onClick={handleBuy}
          disabled={!canBuy || isPending || !address}
          className="w-full bg-gradient-lava hover:from-lava-600 hover:to-lava-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
        >
          {isPending ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Buying...</span>
            </div>
          ) : !address ? (
            'Connect Wallet'
          ) : currentTickets >= maxTickets ? (
            'Round Full'
          ) : (
            `Buy ${quantity} Ticket${quantity > 1 ? 's' : ''}`
          )}
        </button>

        {currentTickets < maxTickets && (
          <p className="text-xs text-avalanche-300 text-center">
            If the round just ended, your purchase will be placed into the next round automatically.
          </p>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-sm text-red-200">
            {formatErrorForUser(error)}
          </div>
        )}
      </div>
    </div>
  );
}

function LotteryMode({ mode }: { mode: Mode }) {
  const { address } = useAccount();
  const { data: roundInfo, refetch: refetchRound } = useCurrentRoundInfo(mode);
  const { data: ticketsBought, refetch: refetchTickets } = useTicketsBought(mode);
  const { data: timeUntilDraw } = useTimeUntilDraw(mode);
  const { data: userTickets } = useUserTickets(mode, address);
  const { data: canDraw } = useCanDrawLottery(mode);
  const { data: ticketPrice } = useTicketPrice();
  const { triggerDraw, isPending: isDrawing } = useTriggerLotteryDraw();
  const { events, resync } = useContractEvents();

  const modeName = mode === Mode.Turbo ? 'Turbo' : 'Classic';
  const maxTickets = Number(roundInfo?.maxTickets || 0);
  const currentTickets = Number(ticketsBought || 0);
  const isExpired = timeUntilDraw === 0n;
  const isCapReached = currentTickets >= maxTickets;

  // Filter events for this mode
  const modeEvents = events.filter(event => 
    (event.eventName === 'LotteryStarted' || 
     event.eventName === 'TicketPurchased' || 
     event.eventName === 'TicketBatchPurchased' ||
     event.eventName === 'LotteryDrawn' ||
     event.eventName === 'LotteryRolledOver') &&
    event.args?.mode === mode
  ).slice(0, 10);

  useEffect(() => {
    // Refetch data when relevant events occur
    const relevantEvents = events.filter(event => 
      event.eventName.includes('Lottery') && event.args?.mode === mode
    );
    
    if (relevantEvents.length > 0) {
      refetchRound();
      refetchTickets();
    }
  }, [events, mode, refetchRound, refetchTickets]);

  return (
    <div className="space-y-8">
      {/* Round Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-avalanche-800/50 border border-avalanche-600/30 rounded-2xl p-6 text-center">
          <Countdown 
            endTime={roundInfo?.endTime || 0n}
            onExpired={() => {
              refetchRound();
              refetchTickets();
            }}
          />
        </div>
        
        <div className="bg-avalanche-800/50 border border-avalanche-600/30 rounded-2xl p-6 text-center">
          <div className="text-4xl font-grotesk font-bold text-lava-400 mb-2">
            {currentTickets}/{maxTickets}
          </div>
          <div className="text-sm text-avalanche-300">Tickets Sold</div>
          <div className="w-full bg-avalanche-700 rounded-full h-2 mt-3">
            <div 
              className="bg-gradient-lava h-2 rounded-full transition-all duration-300"
              style={{ width: `${maxTickets > 0 ? (currentTickets / maxTickets) * 100 : 0}%` }}
            />
          </div>
        </div>
        
        <div className="bg-avalanche-800/50 border border-avalanche-600/30 rounded-2xl p-6 text-center">
          <div className="text-4xl font-grotesk font-bold text-white mb-2">
            {roundInfo ? formatEther(roundInfo.pot) : '0'}
          </div>
          <div className="text-sm text-avalanche-300">AVAX</div>
          <div className="text-xs text-avalanche-400 mt-1">
            Round #{roundInfo?.lotteryId?.toString() || '0'}
          </div>
        </div>
      </div>

      {/* User Stats */}
      {address && userTickets && Number(userTickets) > 0 && (
        <div className="bg-lava-500/20 border border-lava-500/50 rounded-2xl p-6">
          <div className="text-center">
            <div className="text-2xl font-grotesk font-bold text-lava-300 mb-2">
              {userTickets.toString()}
            </div>
            <div className="text-sm text-lava-200">Your Tickets in This Round</div>
          </div>
        </div>
      )}

      {/* Buy Panel */}
      <BuyPanel
        mode={mode}
        ticketPrice={ticketPrice || parseEther('0.1')}
        maxTickets={maxTickets}
        currentTickets={currentTickets}
        disabled={false} // Never disable - lazy settlement allows buying after expiry
      />

      {/* Admin Controls */}
      {canDraw && (
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-yellow-200 mb-4">Admin Controls</h3>
          <button
            onClick={() => triggerDraw(mode)}
            disabled={isDrawing}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {isDrawing ? 'Drawing...' : 'Trigger Draw'}
          </button>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-avalanche-800/50 border border-avalanche-600/30 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-grotesk font-semibold text-white">Recent Activity</h3>
          <button
            onClick={resync}
            className="text-lava-400 hover:text-lava-300 text-sm font-medium transition-colors"
          >
            Resync
          </button>
        </div>
        
        {modeEvents.length > 0 ? (
          <div className="space-y-3">
            {modeEvents.map((event, index) => (
              <div key={`${event.txHash}-${event.logIndex}`} className="bg-avalanche-700/50 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-white text-sm">
                      {event.eventName === 'LotteryStarted' && 'New Round Started'}
                      {event.eventName === 'TicketPurchased' && 'Ticket Purchased'}
                      {event.eventName === 'TicketBatchPurchased' && `${event.args?.quantity} Tickets Purchased`}
                      {event.eventName === 'LotteryDrawn' && 'Round Complete'}
                      {event.eventName === 'LotteryRolledOver' && 'Round Rolled Over'}
                    </div>
                    <div className="text-xs text-avalanche-300">
                      {event.eventName === 'LotteryDrawn' && event.args?.winner && (
                        <>Winner: {event.args.winner.slice(0, 6)}...{event.args.winner.slice(-4)}</>
                      )}
                      {(event.eventName === 'TicketPurchased' || event.eventName === 'TicketBatchPurchased') && event.args?.player && (
                        <>Player: {event.args.player.slice(0, 6)}...{event.args.player.slice(-4)}</>
                      )}
                      {event.eventName === 'LotteryStarted' && event.args?.lotteryId && (
                        <>Round #{event.args.lotteryId.toString()}</>
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
            No recent activity for {modeName} mode
          </div>
        )}
      </div>
    </div>
  );
}

export default function LotteryPage() {
  const [activeMode, setActiveMode] = useState<Mode>(Mode.Turbo);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-grotesk font-bold text-white mb-4">Lottery</h1>
        <p className="text-xl text-avalanche-200 mb-6">
          Choose your mode and try your luck!
        </p>
        <div className="text-sm text-avalanche-300 space-y-1">
          <div>Lottery fee: 10% house • Winner: 90% of pot.</div>
          <div>Gas is paid to the network and is separate from fees.</div>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="bg-avalanche-800/50 border border-avalanche-600/30 rounded-2xl p-2 mb-8 flex">
        <button
          onClick={() => setActiveMode(Mode.Turbo)}
          className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
            activeMode === Mode.Turbo
              ? 'bg-gradient-lava text-white shadow-lg'
              : 'text-avalanche-200 hover:text-white hover:bg-avalanche-700/50'
          }`}
        >
          Turbo Mode
          <div className="text-xs opacity-80 mt-1">~3 min • 10 tickets max</div>
        </button>
        <button
          onClick={() => setActiveMode(Mode.Classic)}
          className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
            activeMode === Mode.Classic
              ? 'bg-gradient-lava text-white shadow-lg'
              : 'text-avalanche-200 hover:text-white hover:bg-avalanche-700/50'
          }`}
        >
          Classic Mode
          <div className="text-xs opacity-80 mt-1">~15 min • 30 tickets max</div>
        </button>
      </div>

      <LotteryMode mode={activeMode} />
    </div>
  );
}