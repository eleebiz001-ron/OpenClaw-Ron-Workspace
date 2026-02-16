import os
from py_clob_client.client import ClobClient
from py_clob_client.clob_types import ApiCredential
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
    
    print(f"Connecting to Polymarket CLOB for {conf['address']}...")
    
    # In newer versions, credentials might be passed via headers or a specific struct
    creds = ApiCredential(
        api_key=conf['key'],
        api_secret=conf['secret'],
        api_passphrase=conf['passphrase']
    )
    
    client = ClobClient(host, key=conf['address'], credentials=creds)
    
    try:
        # Test basic public endpoint first
        resp = client.get_markets()
        print("Success! Public data accessible.")
        
        # Test auth endpoint
        balance = client.get_balance()
        print(f"Auth Success! Balance retrieved: {balance}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
