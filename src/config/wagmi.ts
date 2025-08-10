'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { avalancheFuji } from './chains';

export const config = getDefaultConfig({
  appName: 'ATROPOS Raffle & Duel',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [avalancheFuji],
  ssr: false,
});