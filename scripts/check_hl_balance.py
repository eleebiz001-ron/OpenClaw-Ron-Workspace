import os
from hyperliquid.utils import constants
from hyperliquid.exchange import Exchange
from hyperliquid.info import Info
import eth_account
from dotenv import load_dotenv

load_dotenv("secrets/hyperliquid.env")

account_address = os.getenv("API_Address")
private_key = os.getenv("API_Private_Key")
api_address = os.getenv("API_Address")

def check_balance():
    # Try Testnet
    print("Checking Testnet...")
    info = Info("https://api.hyperliquid-testnet.xyz", skip_ws=True)
    user_state = info.user_state(os.getenv("Public_Address"))
    print(f"Testnet Withdrawable: {user_state.get('withdrawable', '0')}")
    
    # Try Mainnet
    print("Checking Mainnet...")
    info = Info(constants.MAINNET_API_URL, skip_ws=True)
    user_state = info.user_state(os.getenv("Public_Address"))
    print(f"Mainnet Withdrawable: {user_state.get('withdrawable', '0')}")

if __name__ == "__main__":
    check_balance()
