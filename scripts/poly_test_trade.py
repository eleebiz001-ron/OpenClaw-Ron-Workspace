import os
import requests
import json
from py_clob_client.client import ClobClient
from py_clob_client.clob_types import OrderArgs
from py_clob_client.order_builder.constants import BUY
from dotenv import load_dotenv

load_dotenv("secrets/polymarket.env")

def find_market_and_test():
    host = "https://clob.polymarket.com"
    key = os.getenv("POLY_PRIVATE_KEY")
    client = ClobClient(host, key=key, chain_id=137)
    client.set_api_creds(client.create_or_derive_api_creds())

    # 1. 활성 마켓 하나 무작위 선정 (안전한 정치/경제 마켓)
    resp = requests.get("https://gamma-api.polymarket.com/markets?active=true&closed=false&limit=5")
    markets = resp.json()
    
    if not markets:
        print("활성 마켓을 찾을 수 없습니다.")
        return

    m = markets[0]
    question = m['question']
    clob_token_ids = json.loads(m['clobTokenIds'])
    yes_token_id = clob_token_ids[0]
    
    # 2. 현재 가격 조회
    prices = json.loads(m['outcomePrices'])
    yes_price = float(prices[0])

    print(f"📍 테스트 대상 마켓: {question}")
    print(f"   - 선택: YES (Token ID: {yes_token_id})")
    print(f"   - 현재가: {yes_price:.2f} USDC")
    print(f"   - 테스트 주문 금액: 1.0 USDC")
    
    # 3. 실제 주문 함수 (1달러 미만의 아주 소액으로 테스트)
    # 대표님 승인 후 실행하기 위해 메시지로 먼저 보고
    print("\n--- 주문 실행 가능 상태 ---")

if __name__ == "__main__":
    find_market_and_test()
