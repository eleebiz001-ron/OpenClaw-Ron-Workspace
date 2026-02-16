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
        "private_key": os.getenv("POLY_PRIVATE_KEY"),
    }

def main():
    conf = load_config()
    host = "https://clob.polymarket.com"
    chain_id = 137
    
    print(f"Initializing L1 + L2 Client for {conf['address']}...")
    
    creds = ApiCreds(
        api_key=conf['key'],
        api_secret=conf['secret'],
        api_passphrase=conf['passphrase']
    )
    
    # Initialize with private_key (L1) and credentials (L2)
    # The SDK uses the private key to sign L1 headers and credentials for L2.
    client = ClobClient(
        host, 
        key=conf['private_key'], 
        creds=creds, 
        chain_id=chain_id,
        funder=conf['address'] # This maps the funding to the user's main wallet
    )
    
    try:
        print("Testing Authentication (Level 2 + Funder)...")
        # Try a protected read endpoint first
        resp = client.get_balance_allowance()
        print(f"Auth SUCCESS! Data: {resp}")
        
        # Next, list some sampling markets to see what's tradable
        markets = client.get_sampling_markets()
        print(f"Market Data Access: SUCCESS ({len(markets.get('data', []))} markets)")
        
    except Exception as e:
        print(f"Authentication Failed: {e}")

if __name__ == "__main__":
    main()
