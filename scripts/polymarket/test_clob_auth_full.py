from py_clob_client.client import ClobClient
from py_clob_client.clob_types import ApiCreds, BalanceAllowanceParams, AssetType
from dotenv import load_dotenv
import os

# Load credentials from .env
load_dotenv('scripts/polymarket/.env')

# Strip whitespace
api_key = os.getenv('POLYMARKET_API_KEY', '').strip()
api_secret = os.getenv('POLYMARKET_API_SECRET', '').strip()
passphrase = os.getenv('POLYMARKET_API_PASSPHRASE', '').strip()
private_key = os.getenv('POLYMARKET_PRIVATE_KEY', '').strip()

# Proxy Address from dashboard screenshot
proxy_address = "0xE6F78F20Eab92a9303808a403cafe588bA916932"

host = "https://clob.polymarket.com"
chain_id = 137  # Polygon Mainnet

def test_connection():
    try:
        print("Initializing ClobClient with Funder Address...")
        
        creds = ApiCreds(api_key=api_key, api_secret=api_secret, api_passphrase=passphrase)
        
        # Explicitly setting funder address (Proxy)
        client = ClobClient(
            host, 
            key=private_key, 
            chain_id=chain_id, 
            creds=creds,
            funder=proxy_address
        )
        
        print("1. Testing API Key Retrieval (Auth Check)...")
        try:
            keys = client.get_api_keys()
            print(f"   Success! Retrieved {len(keys)} API keys.")
        except Exception as e:
            print(f"   Auth Check Failed: {e}")

        print("\n2. Testing Account Balance (USDC)...")
        try:
            params = BalanceAllowanceParams(asset_type=AssetType.COLLATERAL)
            balance = client.get_balance_allowance(params=params)
            print(f"   USDC Balance: {balance}")
        except Exception as e:
            print(f"   Balance Check Failed: {e}")
        
        return True
    except Exception as e:
        print(f"\\n❌ Connection failed: {str(e)}")
        return False

if __name__ == "__main__":
    test_connection()
