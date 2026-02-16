import requests
import pandas as pd
import time
from datetime import datetime, timedelta

BASE_URL = "https://api.hyperliquid.xyz/info"

def fetch_candles(coin, interval, start_time, end_time):
    all_candles = []
    current_start = start_time
    
    while current_start < end_time:
        payload = {
            "type": "candleSnapshot",
            "req": {
                "coin": coin,
                "interval": interval,
                "startTime": int(current_start),
                "endTime": int(end_time)
            }
        }
        
        response = requests.post(BASE_URL, json=payload)
        if response.status_code != 200:
            print(f"Error fetching candles for {coin}: {response.text}")
            break
            
        candles = response.json()
        if not candles:
            break
            
        all_candles.extend(candles)
        
        # Hyperliquid candles are sorted by time? Let's check. 
        # Usually they are. We need the last candle's time to continue.
        last_time = candles[-1]['t']
        if last_time <= current_start:
            break
        current_start = last_time + 1
        
        # Rate limiting sleep
        time.sleep(0.1)
        
    df = pd.DataFrame(all_candles)
    if not df.empty:
        df = df.rename(columns={
            't': 'timestamp',
            'o': 'open',
            'h': 'high',
            'l': 'low',
            'c': 'close',
            'v': 'volume',
            'n': 'num_trades'
        })
        df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
        # Ensure numeric types
        for col in ['open', 'high', 'low', 'close', 'volume']:
            df[col] = pd.to_numeric(df[col])
        df = df.drop_duplicates(subset=['timestamp']).sort_values('timestamp')
    return df

def fetch_funding(coin, start_time):
    payload = {
        "type": "fundingHistory",
        "coin": coin,
        "startTime": int(start_time)
    }
    response = requests.post(BASE_URL, json=payload)
    if response.status_code == 200:
        funding = response.json()
        df = pd.DataFrame(funding)
        if not df.empty:
            df['time'] = pd.to_datetime(df['time'], unit='ms')
            df['fundingRate'] = pd.to_numeric(df['fundingRate'])
            return df
    return pd.DataFrame()

if __name__ == "__main__":
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=7)
    
    start_ts = start_date.timestamp() * 1000
    end_ts = end_date.timestamp() * 1000
    
    coins = ["XRP", "HBAR", "XLM"]
    
    for coin in coins:
        print(f"Fetching {coin} candles...")
        df_candles = fetch_candles(coin, "1m", start_ts, end_ts)
        df_candles.to_csv(f"scripts/data/{coin}_1m.csv", index=False)
        
        print(f"Fetching {coin} funding history...")
        df_funding = fetch_funding(coin, start_ts)
        df_funding.to_csv(f"scripts/data/{coin}_funding.csv", index=False)
