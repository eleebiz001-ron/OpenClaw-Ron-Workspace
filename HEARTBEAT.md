# HEARTBEAT.md

## 💓 Ron's Hourly Routine Checklist
Every time this heartbeat fires (approx. every hour), perform the following checks:

1.  **📊 Task Progress Check:**
    - Review `kanban.html` and `2nd_Brain/01_Projects/`.
    - Update status if any background work (Codex/Alpha/NEO) has completed.

2.  **📈 Hyperliquid & Strategy Monitoring:**
    - Run `python3 scripts/hl_status_monitor.py` to refresh the live market report.
    - Run `python3 scripts/hl_positions_sync.py` to refresh Hyperliquid positions.
    - Run `python3 scripts/poly_invest_status_sync.py` to refresh Polymarket positions.
    - Run `python3 scripts/polymarket_status.py` to refresh Polymarket inbox cache.
    - Run `python3 scripts/unified_trading_report.py` (if exists) to sync PnL data.
    - Check PnL and Funding Rates. If target profit is reached, initiate self-directed exit.

3.  **🧠 2nd Brain & Mission Control:**
    - Check `2nd_Brain/00_Inbox/` for new unfiled notes.
    - Monitor `mission-control` build status and local server health.
    - Update `war_room_status.json` with latest agent activities and system logs.

4.  **🤵‍♂️ Ron's Duties:**
    - **gogcli:** Check for urgent emails or upcoming calendar events.
    - **Polymarket:** Check builder approval status via Gmail.
    - **소피아 사모님:** 데일리 콘텐츠 준비 상황 확인.
    - **🐦 Birdie 에이전트:** X.com 수익화 프로젝트 진행 상황 확인.

*If no action is needed after checking, reply `HEARTBEAT_OK`.*
