export enum Mode {
  Turbo = 0,
  Classic = 1,
}

export interface RoundInfo {
  lotteryId: bigint;
  pot: bigint;
  startTime: bigint;
  endTime: bigint;
  isActive: boolean;
  winner: string;
  winnerPrize: bigint;
  tickets: bigint;
  maxTickets: bigint;
  durationSeconds: bigint;
}

export interface FlipHistory {
  player1: string;
  player2: string;
  betAmount: bigint;
  winner: string;
  timestamp: bigint;
  coinSide: boolean;
}

export interface ContractEvent {
  txHash: string;
  logIndex: number;
  blockNumber: number;
  timestamp: number;
}

export interface LotteryEvent extends ContractEvent {
  mode: Mode;
  lotteryId: bigint;
  args: any;
}

export interface FlipEvent extends ContractEvent {
  args: any;
}

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS! as `0x${string}`;
export const TICKET_PRICE = BigInt('100000000000000000'); // 0.1 AVAX in wei