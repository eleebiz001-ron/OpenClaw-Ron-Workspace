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
    
    # Clean the private key (remove 0x if present)
    pk = conf['private_key']
    if pk.startswith('0x'):
        pk = pk[2:]
        
    print(f"Initializing Client with Headers and Funder for {conf['address']}...")
    
    creds = ApiCreds(
        api_key=conf['key'],
        api_secret=conf['secret'],
        api_passphrase=conf['passphrase']
    )
    
    client = ClobClient(
        host, 
        chain_id=chain_id,
        key=pk,
        creds=creds
    )
    
    try:
        # Check balance for the specific funder address
        # In this SDK version, we pass the address directly to balance check
        balance = client.get_balance_allowance(funder=conf['address'])
        print(f"✅ Auth and Funder Mapping Success!")
        print(f"Balance/Allowance Data: {balance}")

    except Exception as e:
        print(f"❌ Failed: {e}")

if __name__ == "__main__":
    main()
