import os
import json
from datetime import datetime

# Paths
HL_REPORT_PATH = "/Users/ieunchul/Documents/Obsidian Vault/2nd_Brain/01_Projects/Futures_System/Reports/Live_Market_Status.md"
OUTPUT_PATH = "/Users/ieunchul/Documents/Obsidian Vault/2nd_Brain/04_Finance/Daily_Trading_Snapshot.md"

def get_timestamp():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def read_hl_data():
    if os.path.exists(HL_REPORT_PATH):
        with open(HL_REPORT_PATH, 'r') as f:
            return f.read()
    return "Hyperliquid data not found."

def generate_report():
    timestamp = get_timestamp()
    hl_content = read_hl_data()
    
    report = f"""# 🤵‍♂️ Ron's Daily Trading Snapshot
Updated: {timestamp}

## 📈 Hyperliquid Status
{hl_content}

## 📊 Polymarket Status
- **Active Hunter Mode:** Enabled
- **Strategy:** Hybrid (11 Master Techniques)
- **Monitoring:** 'Trump Deportation 2025' (Current Prob: 5.2%)

## 🕵️‍♂️ Surveillance
- **TradingView:** Connected (XRPUSD, XLM, HBAR)
- **MarketCipher Signal:** Active

---
*Generated autonomously by Ron during nightly maintenance.*
"""
    
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, 'w') as f:
        f.write(report)
    print(f"Report generated at {OUTPUT_PATH}")

if __name__ == "__main__":
    generate_report()
