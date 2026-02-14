import asyncio
from twikit import Client

# X 계정 정보
USERNAME = 'EunLee_Global'
EMAIL = 'eleebiz001@gmail.com'
PASSWORD = 'EunRon2026!!!'

async def main():
    # 최신 User-Agent 사용 시도
    client = Client('en-US')
    
    print(f"로그인 시도 중: {USERNAME}...")
    
    try:
        # 로그인 시도
        await client.login(
            auth_info_1=USERNAME,
            auth_info_2=EMAIL,
            password=PASSWORD
        )
        print("로그인 성공!")
        
        tweet_text = (
            "글로벌 리더들의 통찰을 통해 디지털 자산의 미래를 봅니다. "
            "오늘 일론 머스크(@elonmusk)와 리플 CEO 브래드 갈링하우스(@bgarlinghouse)의 분석을 통해, "
            "2026년은 '실질적 유틸리티'의 해가 될 것임을 확신합니다. "
            "XRP, XLM, HBAR의 가치가 소피아 작가의 예술과 만날 시너지를 기대해 주십시오. 🚀🎨\n\n"
            "#XRP #XLM #HBAR #SophiaArt #EunLee_Global"
        )
        
        await client.create_tweet(tweet_text)
        print("첫 포스팅 게시 완료!")
        client.save_cookies('x_session.json')

    except Exception as e:
        print(f"상세 오류: {e}")

if __name__ == "__main__":
    asyncio.run(main())
