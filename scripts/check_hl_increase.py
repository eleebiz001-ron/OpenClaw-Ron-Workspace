import os
import json
from dotenv import load_dotenv
from hyperliquid.info import Info
from hyperliquid.utils import constants

def main():
    load_dotenv("secrets/hyperliquid.env")
    public_address = os.getenv("Public_Address")
    info = Info(constants.MAINNET_API_URL, skip_ws=True)

    print("--- User State (Perp) ---")
    user_state = info.user_state(public_address)
    print(json.dumps(user_state.get("marginSummary"), indent=2))
    print(f"Withdrawable: {user_state.get('withdrawable')}")

    print("\n--- Spot Balances ---")
    spot_state = info.spot_user_state(public_address)
    print(json.dumps(spot_state.get("balances"), indent=2))

    print("\n--- User Fills (Recent) ---")
    fills = info.user_fills(public_address)
    for fill in fills[:3]:
        print(json.dumps(fill, indent=2))

if __name__ == "__main__":
    main()
