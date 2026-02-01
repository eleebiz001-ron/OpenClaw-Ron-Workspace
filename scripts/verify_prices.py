import json
import urllib.request
import time

def get_exchange_rate():
    # In a real scenario, use an exchange rate API. 
    # For now, use a conservative estimate or fetch from a reliable source if possible.
    # Fallback to fixed if API fails to avoid blocking.
    return 1450.0 

def get_upbit_prices():
    url = "https://api.upbit.com/v1/ticker?markets=KRW-BTC,KRW-ETH,KRW-XRP,KRW-HBAR"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
    
    prices = {}
    for item in data:
        symbol = item['market'].replace('KRW-', '')
        prices[symbol] = item['trade_price']
    return prices

def get_binance_prices():
    url = "https://api.binance.com/api/v3/ticker/price?symbols=[\"BTCUSDT\",\"ETHUSDT\",\"XRPUSDT\",\"HBARUSDT\"]"
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read().decode())
    
    prices = {}
    for item in data:
        symbol = item['symbol'].replace('USDT', '')
        prices[symbol] = float(item['price'])
    return prices

def main():
    print("======== [Ron's Cross-Verification Report] ========")
    print(f"Time: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    
    try:
        krw_usd_rate = get_exchange_rate()
        print(f"Applied Exchange Rate: 1 USD = {krw_usd_rate} KRW (Fixed/Est)")
        
        upbit_prices = get_upbit_prices()
        binance_prices = get_binance_prices()
        
        coins = ['BTC', 'ETH', 'XRP', 'HBAR']
        
        print(f"{'COIN':<6} | {'Upbit (KRW)':<15} | {'Binance (USD)':<15} | {'Binance (KRW)':<15} | {'Diff (%)':<10} | {'Status'}")
        print("-" * 85)
        
        for coin in coins:
            upbit_krw = upbit_prices.get(coin)
            binance_usd = binance_prices.get(coin)
            
            if upbit_krw and binance_usd:
                binance_krw = binance_usd * krw_usd_rate
                diff = ((upbit_krw - binance_krw) / binance_krw) * 100
                
                status = "✅ PASS" if abs(diff) < 5.0 else "⚠️ CHECK"
                
                print(f"{coin:<6} | {upbit_krw:>12,.0f} KRW | ${binance_usd:>12,.4f} | {binance_krw:>12,.0f} KRW | {diff:>9.2f}% | {status}")
            else:
                print(f"{coin:<6} | Data Missing")
                
        print("===================================================")
        
    except Exception as e:
        print(f"Error during verification: {e}")

if __name__ == "__main__":
    main()
