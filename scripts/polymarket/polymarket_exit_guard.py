#!/usr/bin/env python3
"""Polymarket Exit Guard: compare positions vs current price and flag exits.

Positions file format (JSON array):
[
  {
    "market_id": "1234",
    "side": "YES",
    "entry": 0.42,
    "target": 0.60,
    "stop": 0.30
  }
]

Usage:
  python polymarket_exit_guard.py
"""
import argparse
import json
import sys
from pathlib import Path

try:
    import requests
except ImportError:
    print("Missing dependency: requests. Install with: pip install requests")
    sys.exit(1)

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data" / "polymarket"
CONFIG_PATH = Path(__file__).resolve().parent / "config.json"
POSITIONS_PATH = DATA_DIR / "positions.json"


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


def extract_price(market, side="YES"):
    # Best-effort extraction
    if "outcomePrices" in market and market.get("outcomePrices"):
        try:
            idx = 0 if side.upper() == "YES" else 1
            return float(market["outcomePrices"][idx])
        except Exception:
            pass
    for key in ("price", "lastPrice", "yesPrice", "probability"):
        if key in market:
            return float(market[key])
    return None


def main():
    config = load_config()
    parser = argparse.ArgumentParser()
    parser.add_argument("--positions", default=str(POSITIONS_PATH))
    args = parser.parse_args()

    positions_path = Path(args.positions)
    if not positions_path.exists():
        print(f"Missing positions file: {positions_path}")
        sys.exit(1)

    with open(positions_path, "r") as f:
        positions = json.load(f)

    flags = []
    for pos in positions:
        mid = pos.get("market_id")
        side = pos.get("side", "YES")
        if not mid:
            continue
        try:
            market = fetch_market(config["api_base"], mid, config.get("timeout_sec", 15))
            price = extract_price(market, side=side)
            if price is None:
                continue
            title = market.get("question", market.get("title", ""))
            target = pos.get("target")
            stop = pos.get("stop")
            if target is not None and price >= target:
                flags.append((title, "TARGET", price, target))
            if stop is not None and price <= stop:
                flags.append((title, "STOP", price, stop))
        except Exception as e:
            print(f"Error fetching {mid}: {e}")

    if flags:
        print("EXIT FLAGS:")
        for title, kind, price, level in flags:
            print(f"- {title} | {kind}: price {price:.4f} vs level {level}")
    else:
        print("No exit flags.")


if __name__ == "__main__":
    main()
