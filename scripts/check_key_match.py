import os
import eth_account
from dotenv import load_dotenv

load_dotenv("secrets/hyperliquid.env")

private_key = os.getenv("API_Private_Key")
public_address = os.getenv("Public_Address")

account = eth_account.Account.from_key(private_key)
print(f"Key Address: {account.address}")
print(f"Public Address: {public_address}")
if account.address.lower() == public_address.lower():
    print("MATCH: This is the main private key.")
else:
    print("NO MATCH: This is an agent or different key.")
