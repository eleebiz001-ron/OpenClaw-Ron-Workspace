import os
from hyperliquid.utils import constants
from hyperliquid.info import Info
from dotenv import load_dotenv
import json

load_dotenv("secrets/hyperliquid.env")

info = Info(constants.MAINNET_API_URL, skip_ws=True)
meta = info.meta_and_asset_ctxs()
print(json.dumps(meta[1][0], indent=2))
