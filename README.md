# ATROPOS - Avalanche Raffles & 50/50 Duels
https://atropos-team1-avalache-chennai-hack-gamma.vercel.app/
An MVP Next.js DApp for Raffle and Duel games on Avalanche Fuji testnet.

## Features

- **Turbo Lottery**: Fast 3-minute rounds with max 10 tickets
- **Classic Lottery**: 15-minute rounds with max 30 tickets  
- **PvP Coin Flip**: Instant 1v1 matches with multiple bet amounts
- **Real-time Updates**: WebSocket events with polling fallback
- **Lazy Settlement**: Automatic round transitions
- **Mobile Responsive**: Tailwind CSS with Avalanche-inspired design

## Screenshots

![Screenshot 2025-08-10 145241](./Screenshot%202025-08-10%20145241.png)
![Screenshot 2025-08-10 150518](./Screenshot%202025-08-10%20150518.png)
![Screenshot 2025-08-10 150552](./Screenshot%202025-08-10%20150552.png)
![Screenshot 2025-08-10 151011](./Screenshot%202025-08-10%20151011.png)
![Screenshot 2025-08-10 163737](./Screenshot%202025-08-10%20163737.png)
![Screenshot 2025-08-10 185159](./Screenshot%202025-08-10%20185159.png)

## Quick Start

### Prerequisites

- Node.js 16+
- A WalletConnect Project ID from [cloud.walletconnect.com](https://cloud.walletconnect.com)
- AVAX testnet tokens from [faucet](https://faucet.avax.network/)

### Installation

1. Clone and install dependencies:
```bash
git clone <repository-url>
cd avalanche-lottery
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_CHAIN_ID=43113
NEXT_PUBLIC_CONTRACT_ADDRESS=0x3b65c26e8e74c8a6ba22cf4c0056ca51aec5f24f
NEXT_PUBLIC_FUJI_RPC_HTTP=https://api.avax-test.network/ext/bc/C/rpc
NEXT_PUBLIC_FUJI_RPC_WS=wss://api.avax-test.network/ext/bc/C/ws
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

3. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Testing Scenarios

### Acceptance Tests

#### 1. Turbo Time Expiry Test
1. Wait for Turbo round to expire with tickets
2. Buy new tickets
3. ✅ Old round settles automatically  
4. ✅ New round starts with your purchase
5. ✅ Toast shows "Round N settled. You joined Round N+1"

#### 2. Turbo Cap Fill Test  
1. Buy tickets rapidly to hit 10-ticket cap
2. ✅ Final purchase auto-draws
3. ✅ New round starts immediately
4. ✅ UI updates via events

#### 3. Classic Mode Test
1. Same as Turbo but with 30-ticket cap and 15-min timer
2. ✅ Larger capacity and duration work correctly

#### 4. Zero-Player Expiry Test
1. Let round expire with 0 tickets
2. Buy tickets 
3. ✅ Round rolls over (no payout)
4. ✅ New round starts with purchase

#### 5. Coin Flip Test
1. Wallet A queues at 0.5 AVAX
2. Wallet B joins same pool
3. ✅ Match happens in same transaction
4. ✅ Winner receives ~95% of combined pot
5. ✅ Both clients update via events

#### 6. Wrong Chain Guard Test
1. Connect to wrong network (e.g., Mainnet)
2. ✅ App prompts to add/switch to Fuji
3. ✅ All actions blocked until switched
4. ✅ Auto-adds Fuji if not present

#### 7. WebSocket Degradation Test
1. Block WebSocket connection (DevTools Network)
2. ✅ Badge shows "Live updates degraded — polling active"
3. ✅ Polling maintains state updates
4. ✅ Events still display correctly

#### 8. Account Change Test
1. Switch wallet accounts
2. ✅ "My tickets" and queue status updates
3. ✅ Balances refresh correctly
4. ✅ User-specific data updates

### Manual Testing Checklist

- [ ] Home page loads with stats
- [ ] Wallet connects (MetaMask, WalletConnect, Coinbase)  
- [ ] Network guard prompts on wrong chain
- [ ] Lottery countdown updates every second
- [ ] Buy tickets with quantity stepper
- [ ] Balance checks prevent overspend
- [ ] Coin flip pools show waiting counts
- [ ] Join/Cancel flip actions work
- [ ] Recent activity feeds update
- [ ] Error messages are user-friendly
- [ ] Mobile responsive on small screens
- [ ] All links to Snowtrace work

## Architecture

### Tech Stack
- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom Avalanche theme  
- **Blockchain**: wagmi + viem for Ethereum interactions
- **Wallet**: RainbowKit with WalletConnect v2
- **State**: React hooks + TanStack Query

### Key Components

- `NetworkGuard`: Forces Fuji network, auto-adds chain
- `useContractEvents`: WebSocket + polling for real-time updates
- `useContractReads/Writes`: Type-safe contract interactions
- `ErrorBoundary`: Graceful error handling
- `ConnectionStatus`: Shows WebSocket degradation badge

### Contract Integration

The app interacts with contract `0x3b65c26e8e74c8a6ba22cf4c0056ca51aec5f24f`:

**Key Functions:**
- `buyLotteryTickets(mode, quantity)` - Purchase lottery tickets
- `joinCoinFlip(betIndex)` - Join flip pool
- `getCurrentRoundInfo(mode)` - Get round data
- `getWaitingCountByIndex(index)` - Get flip queue size

**Events Tracked:**
- Lottery: `LotteryStarted`, `TicketPurchased`, `LotteryDrawn`
- Flip: `FlipMatched`, `FlipResolved`, `PlayerJoinedQueue`

## Deployment

### Vercel Deployment

1. Push to GitHub repository
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_CHAIN_ID=43113
NEXT_PUBLIC_CONTRACT_ADDRESS=0x3b65c26e8e74c8a6ba22cf4c0056ca51aec5f24f  
NEXT_PUBLIC_FUJI_RPC_HTTP=https://api.avax-test.network/ext/bc/C/rpc
NEXT_PUBLIC_FUJI_RPC_WS=wss://api.avax-test.network/ext/bc/C/ws
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_production_project_id
```

### Build Verification

```bash
npm run build
npm start
```

## Game Rules

### Lottery
- **Ticket Price**: 0.1 AVAX  
- **House Fee**: 10%
- **Winner Prize**: 90% of total pot
- **Turbo**: ~3 min, max 10 tickets
- **Classic**: ~15 min, max 30 tickets

### Coin Flip  
- **House Fee**: 5%
- **Winner Prize**: 95% of combined pot
- **Bet Amounts**: Fixed amounts from contract
- **Instant Matching**: 1v1 when pool fills

### Lazy Settlement
If a lottery round expires, the next purchase automatically:
1. Settles the old round (draws winner)
2. Starts a new round  
3. Places the purchase in the new round
This happens in a single transaction.

## Support

- Contract: [View on Snowtrace](https://testnet.snowtrace.io/address/0x3b65c26e8e74c8a6ba22cf4c0056ca51aec5f24f)
- Faucet: [Get test AVAX](https://faucet.avax.network/)
- Issues: [GitHub Issues](https://github.com/your-repo/issues)

## License

GPL-3.0 - see `LICENSE` file for details.
