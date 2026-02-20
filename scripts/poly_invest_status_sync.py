import os
import json
import requests
from py_clob_client.client import ClobClient
from py_clob_client.clob_types import BalanceAllowanceParams, AssetType
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime

# 설정 로드
load_dotenv("secrets/polymarket.env")

OUTPUT_PATH = Path("temp/polymarket_invest_status.json")

def fetch_invest_status():
    host = "https://clob.polymarket.com"
    key = os.getenv("POLY_PRIVATE_KEY")
    client = ClobClient(host, key=key, chain_id=137)
    client.set_api_creds(client.create_or_derive_api_creds())
    
    # 1. 잔고 조회 (USDC.e 담보)
    # signature_type=1 은 지갑 잔고와 CLOB 승인량을 모두 고려한 실질 가용 잔고를 반환하는 경향이 있음
    params = BalanceAllowanceParams(asset_type=AssetType.COLLATERAL, signature_type=1)
    balance_data = client.get_balance_allowance(params)
    raw_balance = int(balance_data.get('balance', '0'))
    usdc_balance = raw_balance / 10**6
    
    # 2. 포지션 조회 (Data API 사용)
    active_positions = []
    try:
        data_api_url = f"https://data-api.polymarket.com/positions?user={os.getenv('POLY_PUBLIC_ADDRESS')}"
        resp = requests.get(data_api_url)
        if resp.status_code == 200:
            positions_data = resp.json()
            for p in positions_data:
                size = float(p.get('size', 0))
                if size > 0:
                    active_positions.append({
                        "title": p.get('title'),
                        "outcome": p.get('outcome'),
                        "size": size,
                        "current_value": float(p.get('currentValue', 0)),
                        "pnl_percent": float(p.get('percentPnl', 0))
                    })
    except Exception as e:
        print(f"Position fetch error: {e}")
            
    return {
        "updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "usdc_balance": f"{usdc_balance:,.2f}",
        "active_positions_count": len(active_positions),
        "active_positions": active_positions,
        "status": "Connected"
    }

def main():
    try:
        status = fetch_invest_status()
        OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
            json.dump(status, f, ensure_ascii=False, indent=2)
        print("Polymarket invest status updated.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
