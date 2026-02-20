import os
import json
from datetime import datetime
from dotenv import load_dotenv
from hyperliquid.info import Info
from hyperliquid.utils import constants

OUTPUT_PATH = "temp/hyperliquid_positions.json"


def load_config():
    load_dotenv("secrets/hyperliquid.env")
    public_address = os.getenv("Public_Address")
    if not public_address:
        raise RuntimeError("Public_Address is missing in secrets/hyperliquid.env")
    return public_address


def main():
    public_address = load_config()
    info = Info(constants.MAINNET_API_URL, skip_ws=True)
    user_state = info.user_state(public_address)
    asset_positions = user_state.get("assetPositions", [])

    positions = []
    for item in asset_positions:
        pos = item.get("position", {})
        if not pos:
            continue
        size = float(pos.get("szi", 0))
        if size == 0:
            continue
        positions.append(
            {
                "coin": pos.get("coin"),
                "size": size,
                "entryPx": pos.get("entryPx"),
                "unrealizedPnl": pos.get("unrealizedPnl"),
                "liquidationPx": pos.get("liquidationPx"),
                "leverage": pos.get("leverage"),
                "posSide": "Long" if size > 0 else "Short",
            }
        )

    payload = {
        "updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "positions": positions,
        "count": len(positions),
    }

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
