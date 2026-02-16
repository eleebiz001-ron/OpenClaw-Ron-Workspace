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
    
    # Let's try to just initialize with what we have and see what the help says
    try:
        client = ClobClient(host)
        print("Methods in ClobClient:")
        print([m for m in dir(client) if not m.startswith('_')])
        
        # Test public endpoint
        resp = client.get_markets()
        print("Get Markets (Public): SUCCESS")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
