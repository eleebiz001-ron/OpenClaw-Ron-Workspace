#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$BASE_DIR"

python3 polymarket_scout.py --limit 100
python3 polymarket_odds_monitor.py --threshold 0.05
python3 polymarket_whale_tracker.py --volume-threshold 5000
python3 polymarket_exit_guard.py
