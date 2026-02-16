# Polymarket Win-Rate Design — Automated Agent Workflow

**Goal:** Lightweight, local-only monitoring (no external messaging unless approved). Focus on **Scout / Odds Monitor / Whale Tracker / Exit Guard**.

## ✅ Components

### 1) Scout (Market Discovery)
**Purpose:** Pull market lists by query/category and save snapshots.
- Script: `scripts/polymarket/polymarket_scout.py`
- Output: `scripts/data/polymarket/markets_YYYYMMDD_HHMMSS.json`
- Use to discover candidate markets and maintain watchlist.

### 2) Odds Monitor (Price Drift)
**Purpose:** Track price changes vs prior snapshot.
- Script: `scripts/polymarket/polymarket_odds_monitor.py`
- Input: `scripts/data/polymarket/watchlist.json`
- State: `scripts/data/polymarket/odds_state.json`
- Alerts: console only (no messaging)

### 3) Whale Tracker (Volume Spikes)
**Purpose:** Detect large volume deltas between runs.
- Script: `scripts/polymarket/polymarket_whale_tracker.py`
- Input: `scripts/data/polymarket/watchlist.json`
- State: `scripts/data/polymarket/whale_state.json`
- Alerts: console only

### 4) Exit Guard (Target/Stop)
**Purpose:** Flag positions that hit target/stop.
- Script: `scripts/polymarket/polymarket_exit_guard.py`
- Input: `scripts/data/polymarket/positions.json`
- Alerts: console only

---

## 📁 Files & Setup

### Configure watchlist
Edit `scripts/data/polymarket/watchlist.json`
```json
["MARKET_ID_1", "MARKET_ID_2"]
```

### Configure positions
Edit `scripts/data/polymarket/positions.json`
```json
[
  {
    "market_id": "MARKET_ID_1",
    "side": "YES",
    "entry": 0.42,
    "target": 0.60,
    "stop": 0.30
  }
]
```

### API base (optional)
Edit `scripts/polymarket/config.json` if you need to switch from gamma API to another.

---

## ▶️ Execution Steps

### Daily Scan (manual)
```bash
cd /Users/ieunchul/clawd/scripts/polymarket
./run_polymarket_daily.sh
```

### Alert Check (manual, more frequent)
```bash
cd /Users/ieunchul/clawd/scripts/polymarket
./run_polymarket_alerts.sh
```

---

## 🔔 Alert Rules (Console Only)
- **Odds Monitor:** change ≥ threshold (default 0.05)
- **Whale Tracker:** volume delta ≥ threshold (default 5000)
- **Exit Guard:** price ≥ target OR ≤ stop

---

## 🧩 Notes / Next Steps
- If you want notifications (Telegram/Email), confirm explicitly before enabling.
- You can tune thresholds per run via CLI flags.
- Next upgrade: add CSV/Markdown summaries and auto-tag “candidate” markets.
