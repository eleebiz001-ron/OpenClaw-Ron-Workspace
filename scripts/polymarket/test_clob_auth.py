from clob_client.client import ClobClient
from clob_client.clob_types import ApiCreds
from dotenv import load_dotenv
import os

# Load credentials
api_key = "019c6021-2930-7f12-b0e4-b5b2b440de7e"
secret = "xJ7BNOk4TfBtwEq-L-xr4g-vtdypFePSdRJTAaaEj1k="
passphrase = "ae484a07ef86bec1a625bf5288598f7729c88169dc781a9f03aed08bb2caeeee"

# Using a placeholder or common host if not specified. 
# Usually https://clob.polymarket.com for production
host = "https://clob.polymarket.com"

def test_connection():
    try:
        # Note: Validating without private key first to see if API keys are accepted
        creds = ApiCreds(api_key=api_key, secret=secret, passphrase=passphrase)
        client = ClobClient(host, key=None, creds=creds)
        
        print("Testing API Key health...")
        resp = client.get_api_key_status()
        print("API Key Status:", resp)
        return True
    except Exception as e:
        print("Connection failed:", str(e))
        return False

if __name__ == "__main__":
    test_connection()
