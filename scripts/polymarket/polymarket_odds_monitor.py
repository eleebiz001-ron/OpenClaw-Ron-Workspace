#!/usr/bin/env python3
"""Polymarket Odds Monitor: compare current prices vs prior snapshot.

Requires a watchlist file with market IDs.
Default watchlist: scripts/data/polymarket/watchlist.json

Usage:
  python polymarket_odds_monitor.py --threshold 0.05
"""
import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path

try:
    import requests
except ImportError:
    print("Missing dependency: requests. Install with: pip install requests")
    sys.exit(1)

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data" / "polymarket"
CONFIG_PATH = Path(__file__).resolve().parent / "config.json"
WATCHLIST_PATH = DATA_DIR / "watchlist.json"
STATE_PATH = DATA_DIR / "odds_state.json"


def load_config():
    if CONFIG_PATH.exists():
        with open(CONFIG_PATH, "r") as f:
            return json.load(f)
    return {"api_base": "https://gamma-api.polymarket.com", "timeout_sec": 15}


def fetch_market(api_base, market_id, timeout):
    url = f"{api_base}/markets/{market_id}"
    resp = requests.get(url, timeout=timeout)
    resp.raise_for_status()
    return resp.json()


def get_last_state():
    if STATE_PATH.exists():
        with open(STATE_PATH, "r") as f:
            return json.load(f)
    return {}


def save_state(state):
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(STATE_PATH, "w") as f:
        json.dump(state, f, indent=2)


def extract_price(market):
    # Best-effort extraction across API variants
    for key in ("price", "lastPrice", "yesPrice", "probability"):
        if key in market:
            return float(market[key])
    # gamma API uses outcomes + outcomePrices
    if "outcomePrices" in market and market.get("outcomePrices"):
        try:
            # assume YES is first
            return float(market["outcomePrices"][0])
        except Exception:
            pass
    return None


def main():
    config = load_config()
    parser = argparse.ArgumentParser()
    parser.add_argument("--threshold", "-t", type=float, default=0.05, help="Alert threshold (absolute change)")
    parser.add_argument("--watchlist", default=str(WATCHLIST_PATH))
    args = parser.parse_args()

    watchlist_path = Path(args.watchlist)
    if not watchlist_path.exists():
        print(f"Missing watchlist: {watchlist_path}. Create JSON array of market IDs.")
        sys.exit(1)

    with open(watchlist_path, "r") as f:
        market_ids = json.load(f)

    last_state = get_last_state()
    alerts = []
    new_state = {"timestamp": datetime.utcnow().isoformat(), "markets": {}}

    for mid in market_ids:
        try:
            market = fetch_market(config["api_base"], mid, config.get("timeout_sec", 15))
            price = extract_price(market)
            if price is None:
                continue
            prev = last_state.get("markets", {}).get(str(mid))
            new_state["markets"][str(mid)] = {
                "price": price,
                "title": market.get("question", market.get("title", ""))
            }
            if prev:
                delta = price - prev.get("price", price)
                if abs(delta) >= args.threshold:
                    alerts.append({
                        "market_id": mid,
                        "title": new_state["markets"][str(mid)]["title"],
                        "prev": prev.get("price"),
                        "now": price,
                        "delta": delta,
                    })
        except Exception as e:
            print(f"Error fetching {mid}: {e}")

    save_state(new_state)

    if alerts:
        print("ALERTS (price change >= threshold):")
        for a in alerts:
            print(f"- {a['title']} | {a['prev']} -> {a['now']} (Δ {a['delta']:+.4f})")
    else:
        print("No alerts.")


if __name__ == "__main__":
    main()
