# Crypto Wallet Swap Detection - Testing Guide

## 🔒 Feature Overview

The Purge Antivirus crypto protection uses **ML-powered risk scoring** to detect and block clipboard-based wallet address swaps in real-time.

## How It Works

### Detection Algorithm (0-100 Risk Score)

1. **Timing Analysis** (40 pts max)
   - <500ms swap = 40 pts (instant swap - highly suspicious)
   - <1s swap = 30 pts (very fast)
   - <2s swap = 20 pts (fast)

2. **Known Scam Patterns** (50 pts)
   - Matches blacklisted addresses

3. **Address Similarity** (15 pts)
   - Detects lookalike addresses (e.g., `1A2B3C...` → `1A2B3D...`)
   - Social engineering protection

4. **Frequency Tracking** (20 pts)
   - Same address appearing 3+ times = suspicious

5. **ML Pattern Matching** (15 pts)
   - Learns from previous threats
   - Matches historical malware behavior

6. **Type Mismatch** (10 pts)
   - Bitcoin → Ethereum swap detection

### Auto-Block Threshold
- **≥70% risk** = Auto-block + restore original address
- **<70% risk** = Warning only

## 🧪 How to Test

### Test 1: Basic Swap Detection
1. Run the app: `npm run electron-dev`
2. Go to **Crypto Protection** tab
3. Enable **Clipboard Monitoring**
4. Copy a Bitcoin address: `bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh`
5. Within 2 seconds, copy a different address: `1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa`
6. **Expected:** Alert with risk score and details

### Test 2: High-Risk Auto-Block (Instant Swap)
1. Copy: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
2. **Immediately** (<500ms) copy: `0x1234567890123456789012345678901234567890`
3. **Expected:**
   - Risk score ≥70%
   - Original address restored
   - "HIGH RISK THREAT BLOCKED" alert

### Test 3: Type Mismatch Detection
1. Copy Ethereum: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
2. Within 1s, copy Bitcoin: `bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh`
3. **Expected:** Risk score includes "Address type changed: ethereum → bitcoin"

### Test 4: ML Learning (Frequency Analysis)
1. Copy the same address 4+ times with different original addresses
2. **Expected:** Risk score increases with "Same address appeared X times recently"

### Test 5: Address Similarity (Social Engineering)
1. Copy: `bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh`
2. Copy similar: `bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlX` (last char different)
3. **Expected:** "Addresses look similar (social engineering)" indicator

## 📊 Supported Crypto Types

- ✅ Bitcoin (BTC) - `bc1...`, `1...`, `3...`
- ✅ Ethereum (ETH) - `0x...`
- ✅ Monero (XMR) - `4...`
- ✅ Litecoin (LTC) - `L...`, `M...`
- ✅ Ripple (XRP) - `r...`
- ✅ Cardano (ADA) - `addr1...`, `stake1...`
- ✅ Solana (SOL) - Base58 addresses

## 🧠 ML Persistence

The system learns and persists:
- Swap timing patterns
- Blocked address frequency
- Historical threat signatures

Stored in: `localStorage.cryptoMLPatterns`

## 🛡️ Real-World Protection

This protects against:
1. **Clipboard hijacking malware** - Swaps addresses when you paste
2. **Social engineering** - Lookalike addresses
3. **Phishing attacks** - Type confusion (BTC → ETH)
4. **Persistent threats** - Learns attacker patterns

## 🔧 Configuration

Risk threshold (in `CryptoProtection.ts:41`):
```typescript
private riskThreshold = 70; // Auto-block above this score
```

Lower = more sensitive (more false positives)
Higher = less sensitive (fewer false positives)

## 📈 Enhancement Ideas

1. **Blockchain validation** - Verify addresses on-chain
2. **Address reputation API** - Check against threat databases
3. **User whitelist** - Trust known addresses
4. **Hardware wallet integration** - Auto-verify on Ledger/Trezor
5. **Transaction monitoring** - Detect suspicious outbound txns
