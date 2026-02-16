import os
from py_clob_client.client import ClobClient
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
    chain_id = 137  # Polygon Mainnet
    
    print(f"Connecting to Polymarket CLOB for {conf['address']}...")
    
    # Initialize client (Following SDK pattern where credentials are often passed via headers or specific methods)
    # The SDK usually expects a more structured initialization
    from py_clob_client.constants import POLYGON
    
    client = ClobClient(host, key=conf['key'], secret=conf['secret'], passphrase=conf['passphrase'], chain_id=chain_id)
    
    try:
        # Check API authentication and get some basic info
        # get_order_book or sampling markets
        resp = client.get_sampling_markets()
        print("Success! Connected to Polymarket API.")
        print(f"Retrieved {len(resp.get('data', []))} sampling markets.")
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    main()
