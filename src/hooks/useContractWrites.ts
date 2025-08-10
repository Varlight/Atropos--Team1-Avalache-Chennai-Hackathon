'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { contractABI } from '@/contract/abi';
import { CONTRACT_ADDRESS, Mode } from '@/contract/types';

export function useBuyLotteryTickets() {
  const {
    data: hash,
    writeContract,
    error,
    isPending: isWriting,
  } = useWriteContract();

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const buyTickets = (mode: Mode, quantity: number, value: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: contractABI,
      functionName: 'buyLotteryTickets',
      args: [mode, BigInt(quantity)],
      value,
    });
  };

  return {
    buyTickets,
    hash,
    isWriting,
    isConfirming,
    isConfirmed,
    error: error || receiptError,
    isPending: isWriting || isConfirming,
  };
}

export function useJoinCoinFlip() {
  const {
    data: hash,
    writeContract,
    error,
    isPending: isWriting,
  } = useWriteContract();

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const joinFlip = (betIndex: number, value: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: contractABI,
      functionName: 'joinCoinFlip',
      args: [BigInt(betIndex)],
      value,
    });
  };

  return {
    joinFlip,
    hash,
    isWriting,
    isConfirming,
    isConfirmed,
    error: error || receiptError,
    isPending: isWriting || isConfirming,
  };
}

export function useCancelWaiting() {
  const {
    data: hash,
    writeContract,
    error,
    isPending: isWriting,
  } = useWriteContract();

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const cancelWaiting = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: contractABI,
      functionName: 'cancelWaiting',
    });
  };

  return {
    cancelWaiting,
    hash,
    isWriting,
    isConfirming,
    isConfirmed,
    error: error || receiptError,
    isPending: isWriting || isConfirming,
  };
}

export function useTriggerLotteryDraw() {
  const {
    data: hash,
    writeContract,
    error,
    isPending: isWriting,
  } = useWriteContract();

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const triggerDraw = (mode: Mode) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: contractABI,
      functionName: 'triggerLotteryDraw',
      args: [mode],
    });
  };

  return {
    triggerDraw,
    hash,
    isWriting,
    isConfirming,
    isConfirmed,
    error: error || receiptError,
    isPending: isWriting || isConfirming,
  };
}