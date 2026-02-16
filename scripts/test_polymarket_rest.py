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
    }

def main():
    conf = load_config()
    host = "https://clob.polymarket.com"
    endpoint = "/balance-allowance"
    
    timestamp = str(int(time.time()))
    method = "GET"
    
    # Polymarket Auth Header Construction
    # HMAC-SHA256(secret, timestamp + method + endpoint + body)
    message = timestamp + method + endpoint
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
        "POLY-API-PASSPHRASE": conf['passphrase'],
        "POLY-ADDRESS": conf['address']
    }
    
    print(f"Testing Manual REST Auth for {conf['address']}...")
    resp = requests.get(host + endpoint, headers=headers)
    
    if resp.status_code == 200:
        print(f"Auth Success! Data: {resp.json()}")
    else:
        print(f"Auth Failed ({resp.status_code}): {resp.text}")

if __name__ == "__main__":
    main()
