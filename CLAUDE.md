# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ATROPOS is a Next.js 14 DApp for lottery and coin flip games on Avalanche Fuji testnet. It features real-time WebSocket events with polling fallback, wallet integration via RainbowKit, and type-safe contract interactions using wagmi/viem.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production  
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom Avalanche theme
- **Blockchain**: wagmi + viem for Ethereum interactions  
- **Wallet**: RainbowKit with WalletConnect v2
- **State**: React hooks + TanStack Query

### Key Components & Patterns

**Core Infrastructure:**
- `NetworkGuard`: Forces Fuji network connection, auto-adds chain if missing
- `ErrorBoundary`: Wraps entire app for graceful error handling
- `ConnectionStatus`: Shows WebSocket degradation badge when polling active

**Event System:**
- `useContractEvents`: WebSocket-first with polling fallback for real-time updates
- Events are deduplicated by `${txHash}-${logIndex}` and limited to last 100
- Automatically falls back to 10-second polling if WebSocket fails

**Contract Integration:**
- Contract address: `0x3b65c26e8e74c8a6ba22cf4c0056ca51aec5f24f`
- All interactions use typed hooks: `useContractReads`, `useContractWrites`
- ABI defined in `src/contract/abi.ts` with TypeScript types in `src/contract/types.ts`

### Directory Structure

```
src/
├── app/                 # Next.js 14 App Router pages
├── components/          # Reusable UI components
├── config/              # wagmi and chain configurations
├── contract/            # Contract ABI and TypeScript types  
├── hooks/               # Custom React hooks for contract interactions
└── utils/               # Error handling and transaction guards
```

### Environment Variables

Required for development:
```env
NEXT_PUBLIC_CHAIN_ID=43113
NEXT_PUBLIC_CONTRACT_ADDRESS=0x3b65c26e8e74c8a6ba22cf4c0056ca51aec5f24f
NEXT_PUBLIC_FUJI_RPC_HTTP=https://api.avax-test.network/ext/bc/C/rpc
NEXT_PUBLIC_FUJI_RPC_WS=wss://api.avax-test.network/ext/bc/C/ws
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

## Key Contract Functions

- `buyLotteryTickets(mode, quantity)` - Purchase lottery tickets
- `joinCoinFlip(betIndex)` - Join coin flip pool  
- `getCurrentRoundInfo(mode)` - Get round data
- `getWaitingCountByIndex(index)` - Get flip queue size

## Important Events Tracked

**Lottery Events:**
- `LotteryStarted`, `TicketPurchased`, `LotteryDrawn`

**Coin Flip Events:**  
- `FlipMatched`, `FlipResolved`, `PlayerJoinedQueue`

## Game Mechanics

**Lazy Settlement**: When lottery rounds expire, the next ticket purchase automatically settles the old round and starts a new one in a single transaction.

**Real-time Updates**: UI updates via WebSocket events first, with polling fallback maintaining 10-second intervals when WebSocket unavailable.