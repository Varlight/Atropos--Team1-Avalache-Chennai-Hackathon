# ATROPOS
## Verifiably Fair On-Chain Mini-Games on Avalanche

---

<div style="background: linear-gradient(135deg, #E84142 0%, #CB2B2E 100%); color: white; padding: 60px; text-align: center; border-radius: 12px;">

# ATROPOS 🎲

### **Verifiably Fair On-Chain Mini-Games on Avalanche**

#### _Fair draws you can verify. Instant payouts._

<small>Built on Avalanche Fuji Testnet</small>

</div>

---

## 🔍 Problem → Insight

<div style="background: #FFF5F5; padding: 40px; border-left: 4px solid #E84142; border-radius: 8px;">

### **The Problem**
Communities run raffles and head-to-head wagers off-chain:
- ❌ **Opaque** - No way to verify fairness
- ❌ **Slow** - Manual settlements and payouts  
- ❌ **Trust-based** - Centralized control

### **💡 Our Insight**
> If UX is real-time and payouts are instant on-chain, small games become safe, social primitives for any community.

</div>

---

## 🎮 What We Built

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">

<div style="background: white; border: 2px solid #E84142; padding: 30px; border-radius: 12px;">

### **🎟️ Lottery Rounds**

- **Turbo Mode**: 3-minute rounds
- **Classic Mode**: 15-minute rounds
- 90% to winner, 10% to treasury
- Auto-settlement on next purchase

</div>

<div style="background: white; border: 2px solid #E84142; padding: 30px; border-radius: 12px;">

### **🪙 50/50 Duels**

- Fixed tiers: 0.1/0.5/1/5 AVAX
- Instant matching system
- One-tx match & payout
- Queue visualization

</div>

</div>

<div style="text-align: center; margin-top: 20px; padding: 20px; background: #E84142; color: white; border-radius: 8px;">

**✅ Everything auditable on Snowtrace • Live UI via events + polling fallback**

</div>

---

## ⚙️ Architecture

<div style="background: #2D2D2D; color: white; padding: 40px; border-radius: 12px; font-family: monospace;">

```
┌─────────────┐     wagmi/viem      ┌──────────────────┐
│   Wallets   │ ◄──────────────────► │ ATROPOS Contract │
└─────────────┘                      └──────────────────┘
      ▲                                       │
      │                                       ▼
      │                              ┌──────────────────┐
      │                              │   Avalanche C    │
      └──────────────────────────────│   Fuji Testnet   │
         WebSocket Events            └──────────────────┘
         + 10s Polling Fallback
```

### **Smart Contract Flow**

**🎟️ Lottery**: `Buy tickets → Cap/Timer → Settle → Pay winner → Auto-start next`

**🪙 Duels**: `Join queue → Instant match → Resolve & pay in same tx`

**💰 Treasury**: Real-time contract balance, house fees, active pots tracking

</div>

---

## 🚀 Weekend Achievements

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">

<div style="background: linear-gradient(135deg, #E84142, #CB2B2E); color: white; padding: 25px; border-radius: 8px;">

### **Core Mechanics**
✅ Dual-mode rounds with lazy settlement  
✅ No cron jobs required

</div>

<div style="background: linear-gradient(135deg, #E84142, #CB2B2E); color: white; padding: 25px; border-radius: 8px;">

### **Instant Matching**
✅ 50/50 queue system  
✅ Single-tx resolution

</div>

<div style="background: linear-gradient(135deg, #E84142, #CB2B2E); color: white; padding: 25px; border-radius: 8px;">

### **Real-time UX**
✅ Event-driven state transitions  
✅ WebSocket + polling fallback

</div>

<div style="background: linear-gradient(135deg, #E84142, #CB2B2E); color: white; padding: 25px; border-radius: 8px;">

### **Developer Experience**
✅ Network guard (auto-switch)  
✅ Snowtrace integration

</div>

</div>

<div style="text-align: center; margin-top: 30px;">

### **Live State Transitions**
`Queued → Matched → Resolved` | `Selling → Ended → Settling → NewRound`

</div>

---

## 🛡️ Responsible Gaming

<div style="background: #FFF5F5; padding: 40px; border-radius: 12px;">

### **Current Safety Measures**
- 🔒 **Fuji testnet only** - Tokens have no real value
- 📊 **Transparent fees** - All payouts verifiable on-chain
- ⚡ **Instant settlement** - No fund lockups

### **Production Requirements**
- 🎲 Swap hackathon RNG for **Chainlink VRF**
- ⏰ Add **Chainlink Automation** for timed draws
- 📈 Deploy **The Graph subgraph** for historical data

</div>

---

## 🗺️ Roadmap

<div style="background: white; padding: 40px;">

### **Phase 1: Production Ready** 🔴
- ✓ Chainlink VRF integration + "VRF requested" UI phase
- ✓ Chainlink Automation for timed draws (manual fallback retained)
- ✓ Subgraph deployment + Winners board & My History views

### **Phase 2: Community Tools** 🔴
- SDK/Widget for easy integration
- Discord/Telegram bot hooks
- Community treasury controls

### **Phase 3: Game Expansion** 🔴
- **Streaks** - Win consecutive rounds
- **Jackpot** - Progressive prize pools
- **Last Buyer Wins** - Timer-based mechanics
- **Team Pots** - Group competitions
- **Brackets** - Tournament style
- **Price Prophet** - Price prediction (points-only)

</div>

---

## 💰 The Ask

<div style="background: linear-gradient(135deg, #E84142 0%, #CB2B2E 100%); color: white; padding: 50px; border-radius: 12px; text-align: center;">

### **Grant Request**

**Purpose**: Productionize VRF + Automation + Subgraph  
**Goal**: Run 3 community pilots on Avalanche

### **Success Metrics (KPIs)**
- 📊 **Unique wallets** participating
- 🎮 **Rounds settled** per day
- ⚡ **Settlement latency** < 2 blocks
- ✅ **Payout success rate** > 99.9%

### **Budget Allocation**
- 40% Development (VRF, Automation, Subgraph)
- 30% Security audit
- 20% Community pilots & marketing
- 10% Operations & maintenance

</div>

---

## 📞 Contact & Demo

<div style="text-align: center; padding: 40px;">

### **Try ATROPOS Live**
🔗 **Demo**: [Your Demo URL]  
📄 **Contract**: `0x3b65c26e8e74c8a6ba22cf4c0056ca51aec5f24f`  
🔍 **Explorer**: [Snowtrace Fuji](https://testnet.snowtrace.io/)

### **Built with ❤️ on Avalanche**

<div style="margin-top: 30px;">
<img src="https://www.avax.network/static/media/avalanche-logo.svg" alt="Avalanche" width="200">
</div>

</div>