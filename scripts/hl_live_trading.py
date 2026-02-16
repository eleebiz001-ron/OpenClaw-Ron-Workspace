import os
import time
import pandas as pd
from hyperliquid.utils import constants
from hyperliquid.info import Info
from hyperliquid.exchange import Exchange
import eth_account
from dotenv import load_dotenv

load_dotenv("secrets/hyperliquid.env")

# Configuration
DRY_RUN = True # Set to False for real trading
SYMBOL = "XRP"
LEVERAGE = 3
TRADE_SIZE_USD = 30
STOP_LOSS_PCT = 0.05
EMA_PERIOD = 10
FUNDING_THRESHOLD = 0.000005

account_address = os.getenv("Public_Address")
agent_private_key = os.getenv("API_Private_Key")
agent_address = os.getenv("API_Address")

info = Info(constants.MAINNET_API_URL, skip_ws=True)
account = eth_account.Account.from_key(agent_private_key)
exchange = Exchange(account, constants.MAINNET_API_URL, account_address=account_address)

def get_ema(symbol, period):
    candles = info.l2_snapshot(symbol) # This might not give enough for EMA
    # Better use candles API
    now = int(time.time() * 1000)
    start = now - (period * 2 * 60 * 1000)
    candles = info.candles_snapshot(symbol, "1m", start, now)
    df = pd.DataFrame(candles)
    df['c'] = df['c'].astype(float)
    ema = df['c'].ewm(span=period, adjust=False).mean().iloc[-1]
    return ema, df['c'].iloc[-1]

def get_funding(symbol):
    meta = info.meta_and_asset_ctxs()
    # Find index of symbol
    coins = [m['name'] for m in meta[0]['universe']]
    asset_index = coins.index(symbol)
    return float(meta[1][asset_index]['funding'])

def manage_position():
    user_state = info.user_state(account_address)
    positions = user_state["assetPositions"]
    current_pos = next((p["position"] for p in positions if p["type"] == "oneWay" and p["coin"] == SYMBOL), None)
    
    if current_pos:
        # Check stop loss
        entry_price = float(current_pos["entryPrice"])
        mark_price = float(current_pos["markPrice"])
        side = "Long" if float(current_pos["szi"]) > 0 else "Short"
        
        pnl_pct = (mark_price - entry_price) / entry_price if side == "Long" else (entry_price - mark_price) / entry_price
        
        print(f"Current Position: {side} at {entry_price}, Mark: {mark_price}, PnL: {pnl_pct*100:.2f}%")
        
        if pnl_pct < -STOP_LOSS_PCT:
            print(f"STOP LOSS TRIGGERED at {pnl_pct*100:.2f}%")
            # Close position
            szi = float(current_pos["szi"])
            exchange.market_close(SYMBOL)
            return True
    return False

def run_strategy():
    print(f"Running strategy for {SYMBOL}...")
    
    # 1. Manage existing
    if manage_position():
        return
    
    # 2. Check for entry
    ema, current_price = get_ema(SYMBOL, EMA_PERIOD)
    funding = get_funding(SYMBOL)
    
    print(f"Price: {current_price}, EMA({EMA_PERIOD}): {ema:.4f}, Funding: {funding:.8f}")
    
    # Trend: Price relative to EMA
    trend = 1 if current_price > ema else -1
    
    # Entry Logic
    # Funding > 0 (Short receives) and Trend is Down -> Short
    if funding > FUNDING_THRESHOLD and trend == -1:
        print("Entry Signal: SHORT")
        # Check balance
        user_state = info.user_state(account_address)
        withdrawable = float(user_state.get("withdrawable", "0"))
        if withdrawable < 10:
            print("Insufficient funds in Futures wallet.")
            return
            
        exchange.update_leverage(LEVERAGE, SYMBOL)
        exchange.market_open(SYMBOL, False, TRADE_SIZE_USD / current_price)
        
    # Funding < -threshold (Long receives) and Trend is Up -> Long
    elif funding < -FUNDING_THRESHOLD and trend == 1:
        print("Entry Signal: LONG")
        # Check balance
        user_state = info.user_state(account_address)
        withdrawable = float(user_state.get("withdrawable", "0"))
        if withdrawable < 10:
            print("Insufficient funds in Futures wallet.")
            return

        exchange.update_leverage(LEVERAGE, SYMBOL)
        exchange.market_open(SYMBOL, True, TRADE_SIZE_USD / current_price)
    else:
        print("No signal.")

if __name__ == "__main__":
    try:
        run_strategy()
    except Exception as e:
        print(f"Error: {e}")
