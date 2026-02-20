import os
import requests
from py_clob_client.client import ClobClient
from dotenv import load_dotenv

load_dotenv("secrets/polymarket.env")

def check_balance():
    host = "https://clob.polymarket.com"
    key = os.getenv("POLY_PRIVATE_KEY")
    public_address = os.getenv("POLY_PUBLIC_ADDRESS")
    client = ClobClient(host, key=key, chain_id=137)
    client.set_api_creds(client.create_or_derive_api_creds())
    
    print(f"지갑 주소: {public_address}")
    
    # 1. 지갑의 USDC.e 잔액 확인 (PolygonScan API 또는 직접 RPC 호출이 필요하지만, 여기서는 간단히 알 수 있는 방법 시도)
    # 실제로는 ERC20 컨트랙트 조회가 필요함. 
    # 대신 Polymarket Open Orders나 Trade History를 통해 활동 여부 확인
    try:
        orders = client.get_orders()
        print(f"현재 오픈된 주문 수: {len(orders)}")
    except Exception as e:
        print(f"주문 조회 오류: {e}")

if __name__ == "__main__":
    check_balance()
