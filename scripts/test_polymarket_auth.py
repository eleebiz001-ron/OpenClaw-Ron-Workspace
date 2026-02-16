import os
from py_clob_client.client import ClobClient
from py_clob_client.clob_types import ApiCreds
from dotenv import load_dotenv

def load_config():
    load_dotenv("secrets/polymarket.env")
    return {
        "key": os.getenv("POLY_API_KEY"),
        "secret": os.getenv("POLY_API_SECRET"),
        "passphrase": os.getenv("POLY_API_PASSPHRASE"),
        "address": os.getenv("POLY_PUBLIC_ADDRESS"),
    }

def main():
    conf = load_config()
    host = "https://clob.polymarket.com"
    
    print(f"Testing Auth for {conf['address']}...")
    
    client = ClobClient(host)
    
    # Manually set credentials using ApiCreds struct if available, or just via set_api_creds
    # From debug output, 'set_api_creds' and 'creds' exist.
    creds = ApiCreds(
        api_key=conf['key'],
        api_secret=conf['secret'],
        api_passphrase=conf['passphrase']
    )
    client.set_api_creds(creds)
    
    try:
        # Check balance (often requires auth)
        balance = client.get_balance_allowance()
        print(f"Auth Success! Balance/Allowance: {balance}")
    except Exception as e:
        print(f"Auth failed: {e}")

if __name__ == "__main__":
    main()
