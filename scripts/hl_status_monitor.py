import os
from datetime import datetime

from dotenv import load_dotenv
from hyperliquid.info import Info
from hyperliquid.utils import constants

OUTPUT_PATH = "/Users/ieunchul/Documents/Obsidian Vault/2nd_Brain/01_Projects/Futures_System/Reports/Live_Market_Status.md"
COINS = ["BTC", "XRP", "XLM", "HBAR"]


def fmt_float(value, decimals=2):
    try:
        return f"{float(value):,.{decimals}f}"
    except (TypeError, ValueError):
        return "N/A"


def fmt_rate(value, decimals=8):
    try:
        return f"{float(value):+.{decimals}f}"
    except (TypeError, ValueError):
        return "N/A"


def load_config():
    load_dotenv("secrets/hyperliquid.env")
    public_address = os.getenv("Public_Address")
    if not public_address:
        raise RuntimeError("Public_Address is missing in secrets/hyperliquid.env")
    return public_address


def get_universe_and_ctxs(info):
    meta_and_ctxs = info.meta_and_asset_ctxs()
    if not isinstance(meta_and_ctxs, (list, tuple)) or len(meta_and_ctxs) != 2:
        raise RuntimeError("Unexpected response from meta_and_asset_ctxs")

    meta, asset_ctxs = meta_and_ctxs
    if isinstance(meta, dict):
        universe = meta.get("universe", [])
    else:
        universe = meta[0].get("universe", [])

    return universe, asset_ctxs


def fetch_status():
    public_address = load_config()
    info = Info(constants.MAINNET_API_URL, skip_ws=True)

    # 선물(Perp) 계정 상태
    user_state = info.user_state(public_address)
    margin_summary = user_state.get("marginSummary", {})
    account_value = margin_summary.get("accountValue", "0.0")
    withdrawable = user_state.get("withdrawable", "0.0")
    total_margin_used = margin_summary.get("totalMarginUsed", "0.0")

    # 현물(Spot) 계정 상태
    spot_state = info.spot_user_state(public_address)
    spot_balances = spot_state.get("balances", [])
    usdc_spot = "0.0"
    for balance in spot_balances:
        if balance.get("coin") == "USDC":
            usdc_spot = balance.get("total", "0.0")
            break

    universe, asset_ctxs = get_universe_and_ctxs(info)
    coin_names = [asset.get("name") for asset in universe]

    funding_rates = {}
    for coin in COINS:
        if coin in coin_names:
            idx = coin_names.index(coin)
            funding_rates[coin] = asset_ctxs[idx].get("funding")
        else:
            funding_rates[coin] = None

    return {
        "account_value": account_value,
        "withdrawable": withdrawable,
        "total_margin_used": total_margin_used,
        "spot_usdc": usdc_spot,
        "funding_rates": funding_rates,
    }


def render_report(status, error=None):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    lines = [
        "# Live Market Status",
        f"Updated: {timestamp}",
    ]

    if error:
        lines.extend(["", "Status: ERROR", "", "Details:", f"- {error}"])
        return "\n".join(lines) + "\n"

    # Calculate Available to Trade based on user's definition: Portfolio Value - Total Margin Used
    portfolio_value = float(status['spot_usdc'])
    margin_used = float(status['total_margin_used'])
    available_to_trade = portfolio_value - margin_used

    lines.extend(["", "Status: OK", "", "## Account"])
    lines.append(f"- Portfolio Value: {fmt_float(portfolio_value, 2)} USDC")
    lines.append(f"- Perp Account Value: {fmt_float(status['account_value'], 2)} USDC")
    lines.append(f"- Total Margin Used: {fmt_float(margin_used, 2)} USDC")
    lines.append(f"- Available to Trade: {fmt_float(available_to_trade, 2)} USDC")

    lines.extend(["", "## Funding Rates"])
    for coin in COINS:
        rate = status["funding_rates"].get(coin)
        lines.append(f"- {coin}: {fmt_rate(rate, 8)}")

    return "\n".join(lines) + "\n"


def write_report(report):
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as handle:
        handle.write(report)


def main():
    try:
        status = fetch_status()
        report = render_report(status)
        write_report(report)
    except Exception as exc:
        report = render_report({}, error=str(exc))
        write_report(report)
        print(f"Failed to refresh status: {exc}")


if __name__ == "__main__":
    main()
