import os
from hyperliquid.utils import constants
from hyperliquid.info import Info
from dotenv import load_dotenv

load_dotenv("secrets/hyperliquid.env")

def check_spot():
    info = Info(constants.MAINNET_API_URL, skip_ws=True)
    address = os.getenv("Public_Address")
    print(f"Checking Spot for {address}")
    spot_state = info.spot_user_state(address)
    print(spot_state)

if __name__ == "__main__":
    check_spot()
