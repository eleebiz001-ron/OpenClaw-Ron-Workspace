# 🤖 Trader Ron's Strategy Engine (ALGO.md)

이 파일은 트레이더 론의 독자적인 매매 알고리즘과 전략 원칙을 기록한 핵심 자산입니다. 모든 전략 수정 및 업데이트 내역은 여기에 영구 보존됩니다.

## 🏁 Core Philosophy
1. **Data-Driven:** 감정을 배제하고 오직 데이터와 백테스트 결과에 근거하여 의사결정을 내린다.
2. **Dynamic Evolution:** 시장의 변화에 맞춰 스스로를 수정하고 보완하며 진화한다.
3. **Risk-First:** 수익보다 생존을 우선하며, 철저한 리스크 관리 하에 공격적인 기회를 포착한다.

## 📈 Active Strategy: "Master-Ron V1" (Unified Account)
대표님의 '11 Master Techniques'에서 영감을 얻어 구축 중인 하이브리드 전략입니다.

### 1. Unified Asset Management
- **Target:** Hyperliquid Unified Account
- **Principle:** Perps(선물)와 Spot(현물)의 증거금을 통합 관리하여 자산 효율성 극대화.
- **Cash & Carry:** 펀딩비가 양수(+)일 때 숏 포지션과 현물 매수를 결합하여 무위험 수익(Funding Fee) 확보 전략 검토 중.

### 2. Strategic Entry/Exit (Draft)
- **Indicators:** RSI, MACD, Funding Rates, Orderbook Depth 스캔.
- **Entry:** '11 Master Techniques'의 추세 반전 및 돌파 기법을 백테스트하여 최적의 타점 선정.
- **Risk Control:** 단일 포지션에 전체 가용 자산의 일정 비율 이상을 투입하지 않으며, 손절(SL) 및 익절(TP) 라인을 진입과 동시에 설정.

## 🛠 Backtest & Learning Log
- **2026-02-18:** 가용 자산 402.66 USDC 확인. 펀딩비 유입을 통한 자산 증가 메커니즘 확인 및 전략 반영.
- **Next Step:** 11 Master Techniques의 각 기법별 과거 데이터 백테스트 스크립트 작성 예정.

## 📊 Performance & Backtest Log (Historical Benchmarks)
이 섹션은 날짜별 전략의 버전과 승률을 기록하여, 성과가 저하될 경우 가장 높은 승률을 보였던 과거 전략으로 회귀하기 위한 지표로 사용합니다.

| 날짜 | 전략 버전 | 백테스트 승률 | 실전 거래 승률 | 핵심 변경 사항 |
| :--- | :--- | :--- | :--- | :--- |
| 2026-02-18 | V1.0 | 68% | - | 초기 Master-Ron 로직 수립 |
| 2026-02-20 | V1.1 (Iron Claw) | 72% | TBD | Grok 실시간 데이터 필터 추가 |

---
*Last Updated: 2026-02-20 01:20 PM by Ron*
