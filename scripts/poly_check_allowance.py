import os
import json
from py_clob_client.client import ClobClient
from dotenv import load_dotenv

load_dotenv("secrets/polymarket.env")

def check_allowance():
    host = "https://clob.polymarket.com"
    key = os.getenv("POLY_PRIVATE_KEY")
    client = ClobClient(host, key=key, chain_id=137)
    client.set_api_creds(client.create_or_derive_api_creds())
    
    print("=== Polymarket API 상태 점검 ===")
    try:
        # 지갑 정보 조회
        print(f"지갑 주소: {os.getenv('POLY_PUBLIC_ADDRESS')}")
        
        # API 인증 상태 확인
        auth_status = client.get_ok()
        print(f"API 인증 상태: {auth_status}")
        
    except Exception as e:
        print(f"점검 중 오류 발생: {e}")

if __name__ == "__main__":
    check_allowance()
