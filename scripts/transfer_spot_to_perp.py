import os
from hyperliquid.exchange import Exchange
from hyperliquid.utils import constants
from dotenv import load_dotenv
from eth_account import Account

def load_config():
    load_dotenv("secrets/hyperliquid.env")
    private_key = os.getenv("API_Private_Key")
    account_address = os.getenv("Public_Address")
    if not private_key or not account_address:
        raise RuntimeError("API_Private_Key or Public_Address is missing")
    return account_address, private_key

def main():
    try:
        address, key = load_config()
        # Create a wallet object using the private key
        wallet = Account.from_key(key)
        
        # Initialize Exchange with the wallet
        exchange = Exchange(wallet, constants.MAINNET_API_URL, account_address=address)
        
        print(f"Transferring 110 USDC from Spot to Perp for {address}...")
        
        # Spot -> Perp 이체 (usd_to_perp=True)
        # 110.000000 (USDC는 보통 소수점 6자리)
        # 일부 버전에서는 spot_user_and_target_transfer 사용 권장
        try:
            result = exchange.usd_transfer("110.0", True)
        except:
            # Fallback or try different method if applicable
            result = "Failed with usd_transfer"
        
        print(f"Result: {result}")
    except Exception as exc:
        print(f"Error during transfer: {exc}")

if __name__ == "__main__":
    main()
