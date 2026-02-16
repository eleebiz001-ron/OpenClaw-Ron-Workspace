from py_clob_client.client import ClobClient
from py_clob_client.clob_types import ApiCreds, OrderArgs
from py_clob_client.order_builder.constants import BUY
from dotenv import load_dotenv
import os

load_dotenv('scripts/polymarket/.env')
api_key = os.getenv('POLYMARKET_API_KEY', '').strip()
api_secret = os.getenv('POLYMARKET_API_SECRET', '').strip()
passphrase = os.getenv('POLYMARKET_API_PASSPHRASE', '').strip()
private_key = os.getenv('POLYMARKET_PRIVATE_KEY', '').strip()
# NO PROXY ADDRESS
host = "https://clob.polymarket.com"
chain_id = 137

def run_order_test():
    try:
        print("1. Init (No Funder)...")
        creds = ApiCreds(api_key=api_key, api_secret=api_secret, api_passphrase=passphrase)
        # funder is None
        client = ClobClient(host, key=private_key, chain_id=chain_id, creds=creds)
        
        target_token = "73470541315377973562501025254719659796416871135081220986683321361000395461644"
        
        print(f"2. Placing Order (Limit Buy $0.01) on Token {target_token[:10]}...")
        order = client.create_order(
            OrderArgs(
                price=0.01,
                size=5.0,
                side=BUY,
                token_id=target_token
            )
        )
        resp = client.post_order(order)
        print("✅ SUCCESS! Order Placed:", resp)
        
        if resp and resp.get('orderID'):
            client.cancel(resp['orderID'])
            print("✅ Cancelled.")
            
    except Exception as e:
        print(f"❌ FAILED: {e}")

if __name__ == "__main__":
    run_order_test()
