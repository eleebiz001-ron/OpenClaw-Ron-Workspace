import requests
import time
import datetime

def get_xrp_price():
    url = "https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=krw,usd"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        return data['ripple']
    except Exception as e:
        print(f"Error fetching price: {e}")
        return None

def main():
    print(f"🚀 XRP Portfolio Monitor Started at {datetime.datetime.now()}")
    print("--------------------------------------------------")
    
    price = get_xrp_price()
    if price:
        krw = price['krw']
        usd = price['usd']
        print(f"Current XRP Price:")
        print(f"  🇰🇷 {krw:,.0f} KRW")
        print(f"  🇺🇸 ${usd:.4f} USD")
    else:
        print("Failed to retrieve price.")

if __name__ == "__main__":
    main()
