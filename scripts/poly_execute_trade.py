import os
import requests
import json
import time
from py_clob_client.client import ClobClient
from py_clob_client.clob_types import OrderArgs
from py_clob_client.order_builder.constants import BUY
from dotenv import load_dotenv

load_dotenv("secrets/polymarket.env")

def execute_trade():
    host = "https://clob.polymarket.com"
    key = os.getenv("POLY_PRIVATE_KEY")
    # Polymarket 웹 UI에서 '보증금' 버튼을 눌렀을 때 나오는 주소가 Funder(Proxy) 주소입니다.
    # 대표님의 지갑 주소와 Funder 주소가 동일할 수 있지만, 
    # 웹 로그인 방식(Magic/Email)인 경우 다를 수 있습니다.
    # 일단 .env의 주소를 Funder로 사용하여 signature_type=1(Magic/Email용) 시도
    funder = os.getenv("POLY_PUBLIC_ADDRESS")
    
    print(f"지갑 주소: {funder}")
    
    # signature_type=1 (Magic/Email), 2 (EOA/Metamask)
    # 일단 1로 시도해보고 안되면 2로 전환하겠습니다.
    client = ClobClient(host, key=key, chain_id=137, signature_type=1, funder=funder)
    client.set_api_creds(client.create_or_derive_api_creds())

    # 대상 마켓: Will Trump deport less than 250,000? (YES)
    token_id = "101676997363687199724245607342877036148401850938023978421879460310389391082353"
    
    price = 0.05 
    size = 20.0 # ~$1.0
    
    print(f"주문 시도 (Magic 방식): {size} shares @ ${price} ...")
    
    try:
        order_args = OrderArgs(
            price=price,
            size=size,
            token_id=token_id,
            side=BUY
        )
        signed_order = client.create_order(order_args)
        resp = client.post_order(signed_order)
        print(f"결과: {json.dumps(resp, indent=2)}")
        return
    except Exception as e:
        print(f"Magic 방식 실패: {e}")

    # 실패 시 signature_type=2 (Direct EOA) 시도
    print("\nEOA(Direct) 방식으로 재시도...")
    try:
        client_eoa = ClobClient(host, key=key, chain_id=137, signature_type=2, funder=funder)
        client_eoa.set_api_creds(client_eoa.create_or_derive_api_creds())
        signed_order = client_eoa.create_order(order_args)
        resp = client_eoa.post_order(signed_order)
        print(f"결과: {json.dumps(resp, indent=2)}")
    except Exception as e:
        print(f"EOA 방식 실패: {e}")

if __name__ == "__main__":
    execute_trade()
