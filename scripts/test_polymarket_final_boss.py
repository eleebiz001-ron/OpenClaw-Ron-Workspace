import os
import requests
import time
import hmac
import hashlib
import base64
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
    endpoint = "/balance-allowance"
    # Query parameters to link the funder address
    params = f"?funder={conf['address']}&asset_id=2" # asset_id 2 is usually USDC on Polygon for Poly
    
    timestamp = str(int(time.time()))
    method = "GET"
    
    # HMAC-SHA256(secret, timestamp + method + endpoint + body)
    # Note: Body is empty for GET
    message = timestamp + method + endpoint + params
    signature = hmac.new(
        conf['secret'].encode('utf-8'),
        message.encode('utf-8'),
        digestmod=hashlib.sha256
    ).digest()
    sig_b64 = base64.b64encode(signature).decode('utf-8')
    
    headers = {
        "POLY-API-KEY": conf['key'],
        "POLY-API-SIGNATURE": sig_b64,
        "POLY-API-TIMESTAMP": timestamp,
        "POLY-API-PASSPHRASE": conf['passphrase']
    }
    
    print(f"Testing Manual REST Auth with Funder: {conf['address']}...")
    resp = requests.get(host + endpoint + params, headers=headers)
    
    if resp.status_code == 200:
        print(f"✅ FINAL AUTH SUCCESS!")
        print(f"Data: {resp.json()}")
    else:
        print(f"❌ Auth Failed ({resp.status_code}): {resp.text}")

if __name__ == "__main__":
    main()
