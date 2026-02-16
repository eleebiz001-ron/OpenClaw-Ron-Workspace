import os
import json
from eth_account import Account
from hyperliquid.exchange import Exchange
from hyperliquid.utils import constants
from dotenv import load_dotenv

def load_config():
    load_dotenv("secrets/hyperliquid.env")
    private_key = os.getenv("API_Private_Key")
    account_address = os.getenv("Public_Address")
    if not private_key or not account_address:
        raise RuntimeError("API_Private_Key or Public_Address is missing")
    return account_address, private_key

def main():
    address, key = load_config()
    wallet = Account.from_key(key)
    exchange = Exchange(wallet, constants.MAINNET_API_URL, account_address=address)
    
    coins = ["XRP", "XLM", "HBAR"]
    amount_per_coin = 35.0  # Total 105 USDC
    leverage = 5
    
    print(f"🚀 Initializing Strategy: {coins} with {leverage}x leverage...")
    
    results = []
    for coin in coins:
        print(f"--- Processing {coin} ---")
        # 1. Set Leverage
        lev_res = exchange.update_leverage(leverage, coin)
        print(f"Leverage Response: {lev_res}")
        
        # 2. Market Buy (Long)
        # Note: amount_per_coin is USDC value. For market buy, we need to handle size correctly.
        # Simple implementation: using order value in USDC. 
        # Most SDKs use 'size' as coin units, but market buy can sometimes take USD value.
        # Let's assume this SDK's market_open takes (name, is_buy, size, px, slippage)
        # We need current price to calculate size (coin units).
        
        from hyperliquid.info import Info
        info = Info(constants.MAINNET_API_URL, skip_ws=True)
        meta = info.meta_and_asset_ctxs()
        universe = meta[0]['universe']
        asset_idx = next(i for i, a in enumerate(universe) if a['name'] == coin)
        px = float(meta[1][asset_idx]['midPx'])
        
        # size = (USDC_amount * leverage) / px
        size = (amount_per_coin * leverage) / px
        
        # Round size based on universe precision
        sz_decimals = universe[asset_idx]['szDecimals']
        size = round((amount_per_coin * leverage) / px, sz_decimals)
        
        # Ensure it's not .0 if sz_decimals is 0
        if sz_decimals == 0:
            size = int(size)
        
        print(f"Placing Market Long for {coin}: Size {size} (Price ~{px})")
        order_res = exchange.market_open(coin, True, size, px, 0.01) # 1% slippage
        print(f"Order Response: {order_res}")
        results.append({"coin": coin, "order": order_res})

    print("🏁 Strategy execution completed.")

if __name__ == "__main__":
    main()
