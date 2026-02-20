import os
from py_clob_client.client import ClobClient
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv("secrets/polymarket.env")

def test_auth():
    host = "https://clob.polymarket.com"
    key = os.getenv("POLY_PRIVATE_KEY")
    chain_id = 137 # Polygon

    # L1 Methods용 클라이언트 생성 (API 키 생성/조회용)
    client = ClobClient(host, key=key, chain_id=chain_id)
    
    try:
        # API 자격 증명 생성 또는 조회
        print("API 자격 증명 확인 중...")
        creds = client.create_or_derive_api_creds()
        print(f"성공! 공용 주소: {os.getenv('POLY_PUBLIC_ADDRESS')}")
        
        # 클라이언트에 설정
        client.set_api_creds(creds)
        
        # 테스트: 서버 상태 확인
        status = client.get_ok()
        print(f"서버 연결 상태: {status}")
        
    except Exception as e:
        print(f"인증 오류 발생: {e}")

if __name__ == "__main__":
    test_auth()
