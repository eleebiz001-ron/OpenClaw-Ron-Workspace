import requests

def scan_markets():
    print("=== Polymarket 실시간 인기 마켓 분석 ===\n")
    try:
        # Gamma API: /events 엔드포인트에서 'trending' 또는 'volume' 정렬 시도
        # 대부분의 인기 마켓은 /events 아래에 그룹화되어 있음
        url = "https://gamma-api.polymarket.com/events?closed=false&limit=15"
        resp = requests.get(url)
        events = resp.json()
        
        # 거래량 순으로 로컬 정렬 (API 정렬이 불안정할 경우 대비)
        events.sort(key=lambda x: float(x.get('volume', 0)), reverse=True)
        
        for e in events[:10]:
            title = e.get('title', 'Unknown')
            volume = float(e.get('volume', 0))
            if volume < 1000: continue
            
            print(f"🔥 {title}")
            print(f"   💰 총 거래량: ${volume:,.2f}")
            
            markets = e.get('markets', [])
            if markets:
                # 첫 번째 메인 마켓의 상세 정보 출력
                m = markets[0]
                import json
                try:
                    outcomes = json.loads(m.get('outcomes', '[]'))
                    prices = json.loads(m.get('outcomePrices', '[]'))
                    if outcomes and prices:
                        price_info = [f"{o}: {float(p)*100:.1f}%" for o, p in zip(outcomes, prices)]
                        print(f"   📊 현재 확률: {' | '.join(price_info)}")
                except:
                    pass
            print("-" * 50)
            
    except Exception as e:
        print(f"스캔 중 오류 발생: {e}")

if __name__ == "__main__":
    scan_markets()
