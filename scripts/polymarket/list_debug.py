from py_clob_client.client import ClobClient
from py_clob_client.clob_types import ApiCreds
from dotenv import load_dotenv
import os

load_dotenv('scripts/polymarket/.env')
api_key = os.getenv('POLYMARKET_API_KEY', '').strip()
api_secret = os.getenv('POLYMARKET_API_SECRET', '').strip()
passphrase = os.getenv('POLYMARKET_API_PASSPHRASE', '').strip()
private_key = os.getenv('POLYMARKET_PRIVATE_KEY', '').strip()
proxy_address = "0xE6F78F20Eab92a9303808a403cafe588bA916932"
host = "https://clob.polymarket.com"

def list_markets():
    try:
        creds = ApiCreds(api_key=api_key, api_secret=api_secret, api_passphrase=passphrase)
        client = ClobClient(host, key=private_key, chain_id=137, creds=creds, funder=proxy_address)
        resp = client.get_markets()
        
        # It is a dict, likely {'data': [...], 'next_cursor': ...}
        markets = resp.get('data', [])
        
        for m in markets:
            if m.get('active') and m.get('tokens'):
                print(f"ID: {m.get('condition_id')} Q: {m.get('question')}")
                print(f"TOKEN: {m['tokens'][0]['token_id']}")
                break
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_markets()
