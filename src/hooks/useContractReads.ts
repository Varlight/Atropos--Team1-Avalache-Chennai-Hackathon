'use client';

import { useReadContract } from 'wagmi';
import { contractABI } from '@/contract/abi';
import { CONTRACT_ADDRESS, Mode, RoundInfo } from '@/contract/types';

export function useTicketPrice() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'TICKET_PRICE',
  });
}

export function useTimeUntilDraw(mode: Mode) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'getTimeUntilDraw',
    args: [mode],
  });
}

export function useTicketsBought(mode: Mode) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'getTicketsBought',
    args: [mode],
  });
}

export function useCurrentRoundInfo(mode: Mode) {
  const { data, ...rest } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'getCurrentRoundInfo',
    args: [mode],
  });

  const roundInfo: RoundInfo | undefined = data ? {
    lotteryId: data[0],
    pot: data[1],
    startTime: data[2],
    endTime: data[3],
    isActive: data[4],
    winner: data[5],
    winnerPrize: data[6],
    tickets: data[7],
    maxTickets: data[8],
    durationSeconds: data[9],
  } : undefined;

  return {
    data: roundInfo,
    ...rest,
  };
}

export function useUserTickets(mode: Mode, address?: string) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'getUserTickets',
    args: address ? [mode, address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

export function useCanDrawLottery(mode: Mode) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'canDrawLottery',
    args: [mode],
  });
}

export function useFixedBetAmounts() {
  const bet0 = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'fixedBetAmounts',
    args: [0],
  });
  
  const bet1 = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'fixedBetAmounts',
    args: [1],
  });
  
  const bet2 = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'fixedBetAmounts',
    args: [2],
  });
  
  const bet3 = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'fixedBetAmounts',
    args: [3],
  });

  return {
    data: [bet0.data, bet1.data, bet2.data, bet3.data] as const,
    isLoading: bet0.isLoading || bet1.isLoading || bet2.isLoading || bet3.isLoading,
    error: bet0.error || bet1.error || bet2.error || bet3.error,
  };
}

export function useWaitingCountByIndex(index: number) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'getWaitingCountByIndex',
    args: [index],
  });
}

export function usePlayerWaitingAmount(address?: string) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'playerWaitingAmount',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}