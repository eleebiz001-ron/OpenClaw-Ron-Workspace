#!/usr/bin/env python3
"""Polymarket Scout: pull markets by query/category and save snapshot.

Usage:
  python polymarket_scout.py --query "election" --limit 100
  python polymarket_scout.py --category "Politics" --active true
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


def load_config():
    if CONFIG_PATH.exists():
        with open(CONFIG_PATH, "r") as f:
            return json.load(f)
    return {"api_base": "https://gamma-api.polymarket.com", "default_limit": 50, "default_active": True, "timeout_sec": 15}


def fetch_markets(api_base, params, timeout):
    url = f"{api_base}/markets"
    resp = requests.get(url, params=params, timeout=timeout)
    resp.raise_for_status()
    return resp.json()


def main():
    config = load_config()
    parser = argparse.ArgumentParser()
    parser.add_argument("--query", "-q", help="Search query")
    parser.add_argument("--category", "-c", help="Category filter")
    parser.add_argument("--limit", "-l", type=int, default=config.get("default_limit", 50))
    parser.add_argument("--active", default=str(config.get("default_active", True)).lower())
    args = parser.parse_args()

    params = {
        "limit": args.limit,
        "active": args.active,
    }
    if args.query:
        params["query"] = args.query
    if args.category:
        params["category"] = args.category

    data = fetch_markets(config["api_base"], params, config.get("timeout_sec", 15))

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    ts = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    out_path = DATA_DIR / f"markets_{ts}.json"
    with open(out_path, "w") as f:
        json.dump(data, f, indent=2)

    count = len(data) if isinstance(data, list) else (len(data.get("markets", [])) if isinstance(data, dict) else 0)
    print(f"Saved {count} markets to {out_path}")


if __name__ == "__main__":
    main()
