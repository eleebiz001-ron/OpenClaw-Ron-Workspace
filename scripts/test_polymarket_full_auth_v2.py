import os
from py_clob_client.client import ClobClient
from py_clob_client.clob_types import ApiCreds, OpenOrderParams
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
    
    # Clean the private key (remove 0x if present)
    pk = conf['private_key']
    if pk.startswith('0x'):
        pk = pk[2:]
        
    print(f"Initializing Full Client for {conf['address']}...")
    
    creds = ApiCreds(
        api_key=conf['key'],
        api_secret=conf['secret'],
        api_passphrase=conf['passphrase']
    )
    
    # Initialize with fundamental parameters
    # Note: Some versions prefer key (L1) and creds (L2) as explicit kwargs
    client = ClobClient(
        host, 
        chain_id=chain_id,
        key=pk,
        creds=creds
    )
    
    try:
        # Check API Status
        print("Checking API connection...")
        if client.get_ok() == "OK":
            print("API Status: ONLINE")
            
        # Get Balance (Funder mapping)
        print(f"Retrieving balance for {conf['address']}...")
        # We need to tell the client which address to check balance for
        balance = client.get_balance_allowance(params=OpenOrderParams(funder=conf['address']))
        print(f"Success! Balance/Allowance: {balance}")

    except Exception as e:
        print(f"Failed during verification: {e}")

if __name__ == "__main__":
    main()
