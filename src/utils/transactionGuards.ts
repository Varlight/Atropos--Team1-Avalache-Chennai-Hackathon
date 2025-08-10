import { formatEther, parseEther } from 'viem';

export interface TransactionGuardResult {
  canProceed: boolean;
  errorMessage?: string;
  warningMessage?: string;
}

export function checkBalanceForTransaction(
  userBalance: bigint | undefined,
  transactionValue: bigint,
  estimatedGas: bigint = parseEther('0.001') // Default gas estimate
): TransactionGuardResult {
  if (!userBalance) {
    return {
      canProceed: false,
      errorMessage: 'Unable to check balance. Please try again.',
    };
  }

  const totalRequired = transactionValue + estimatedGas;

  if (userBalance < totalRequired) {
    const shortfall = totalRequired - userBalance;
    return {
      canProceed: false,
      errorMessage: `Insufficient AVAX. Need ${formatEther(totalRequired)} AVAX but you have ${formatEther(userBalance)} AVAX. Missing: ${formatEther(shortfall)} AVAX`,
    };
  }

  // Warn if balance is getting low (less than 5x estimated gas after transaction)
  const remainingAfterTx = userBalance - totalRequired;
  const lowBalanceThreshold = estimatedGas * 5n;

  if (remainingAfterTx < lowBalanceThreshold) {
    return {
      canProceed: true,
      warningMessage: `Balance will be low after this transaction: ${formatEther(remainingAfterTx)} AVAX remaining`,
    };
  }

  return { canProceed: true };
}

export function validateLotteryPurchase(
  mode: number,
  quantity: number,
  maxTickets: number,
  currentTickets: number
): TransactionGuardResult {
  if (quantity <= 0) {
    return {
      canProceed: false,
      errorMessage: 'Quantity must be at least 1',
    };
  }

  if (quantity > 10) {
    return {
      canProceed: false,
      errorMessage: 'Maximum 10 tickets per transaction',
    };
  }

  const remaining = maxTickets - currentTickets;
  if (quantity > remaining && remaining > 0) {
    return {
      canProceed: true,
      warningMessage: `Only ${remaining} tickets remaining. Your purchase will be for ${Math.min(quantity, remaining)} tickets.`,
    };
  }

  return { canProceed: true };
}

export function validateCoinFlipJoin(
  userWaitingAmount: bigint,
  betAmount: bigint,
  waitingCount: number
): TransactionGuardResult {
  if (userWaitingAmount > 0n) {
    return {
      canProceed: false,
      errorMessage: 'You are already waiting in a coin flip queue. Cancel first or wait for a match.',
    };
  }

  if (waitingCount >= 2) {
    return {
      canProceed: false,
      errorMessage: 'This pool is full. Please try a different amount.',
    };
  }

  return { canProceed: true };
}

export function checkNetworkConditions(): TransactionGuardResult {
  // Basic network checks
  if (!navigator.onLine) {
    return {
      canProceed: false,
      errorMessage: 'No internet connection. Please check your network.',
    };
  }

  return { canProceed: true };
}