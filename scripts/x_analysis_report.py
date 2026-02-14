#!/usr/bin/env python3
import base64
import datetime as dt
import hashlib
import hmac
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[1]
DEFAULT_ENV_PATH = ROOT_DIR / "mcp-twitter" / ".env"
DEFAULT_HISTORY_PATH = ROOT_DIR / "x_history.json"
DEFAULT_OUTPUT_DIR = ROOT_DIR / "2nd_Brain" / "04_Archive" / "X_Daily_Reports"

UTILITY_KEYWORDS = [
    "XRP",
    "HBAR",
    "XLM",
    "LINK",
    "RLUSD",
    "ALGO",
    "XDC",
    "QNT",
    "ATOM",
    "AVAX",
    "ADA",
    "SOL",
    "BTC",
    "ETH",
]


def load_env_file(env_path: Path) -> dict:
    env = {}
    if not env_path.exists():
        return env
    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        env[key.strip()] = value.strip()
    return env


def percent_encode(value: str) -> str:
    return urllib.parse.quote(str(value), safe="~")


def build_oauth1_header(method: str, url: str, params: dict, consumer_key: str,
                        consumer_secret: str, token: str, token_secret: str) -> str:
    oauth_params = {
        "oauth_consumer_key": consumer_key,
        "oauth_nonce": base64.b64encode(os.urandom(24)).decode("utf-8").rstrip("="),
        "oauth_signature_method": "HMAC-SHA1",
        "oauth_timestamp": str(int(time.time())),
        "oauth_token": token,
        "oauth_version": "1.0",
    }

    all_params = []
    for key, value in (params or {}).items():
        if isinstance(value, (list, tuple)):
            for item in value:
                all_params.append((str(key), str(item)))
        else:
            all_params.append((str(key), str(value)))
    for key, value in oauth_params.items():
        all_params.append((str(key), str(value)))

    all_params.sort(key=lambda kv: (kv[0], kv[1]))
    normalized = "&".join(
        f"{percent_encode(k)}={percent_encode(v)}" for k, v in all_params
    )

    base_elems = [
        method.upper(),
        percent_encode(url),
        percent_encode(normalized),
    ]
    base_string = "&".join(base_elems)
    signing_key = f"{percent_encode(consumer_secret)}&{percent_encode(token_secret)}"
    signature = hmac.new(
        signing_key.encode("utf-8"),
        base_string.encode("utf-8"),
        hashlib.sha1,
    ).digest()
    oauth_params["oauth_signature"] = base64.b64encode(signature).decode("utf-8")

    header_params = ", ".join(
        f'{percent_encode(k)}="{percent_encode(v)}"' for k, v in oauth_params.items()
    )
    return f"OAuth {header_params}"


def request_json(method: str, url: str, params: dict, creds: dict) -> dict:
    auth_header = build_oauth1_header(
        method,
        url,
        params or {},
        creds["consumer_key"],
        creds["consumer_secret"],
        creds["access_token"],
        creds["access_secret"],
    )
    if method.upper() == "GET" and params:
        url = f"{url}?{urllib.parse.urlencode(params)}"
        data = None
    else:
        data = urllib.parse.urlencode(params or {}).encode("utf-8")

    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Authorization": auth_header,
            "User-Agent": "x-analysis-report/1.0",
        },
        method=method.upper(),
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            payload = resp.read().decode("utf-8")
            return json.loads(payload)
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"HTTP {exc.code} error for {url}: {body}") from exc


def get_user_info(creds: dict) -> dict:
    url = "https://api.twitter.com/2/users/me"
    return request_json("GET", url, {}, creds)


def get_user_tweets(creds: dict, user_id: str, max_pages: int = 5) -> list:
    url = f"https://api.twitter.com/2/users/{user_id}/tweets"
    params = {
        "max_results": 100,
        "exclude": "retweets",
        "tweet.fields": ",".join(
            [
                "public_metrics",
                "created_at",
                "referenced_tweets",
                "conversation_id",
                "in_reply_to_user_id",
                "text",
            ]
        ),
    }
    all_tweets = []
    next_token = None
    pages = 0
    while pages < max_pages:
        if next_token:
            params["pagination_token"] = next_token
        else:
            params.pop("pagination_token", None)

        result = request_json("GET", url, params, creds)
        all_tweets.extend(result.get("data", []))
        meta = result.get("meta", {})
        next_token = meta.get("next_token")
        pages += 1
        if not next_token:
            break
    return all_tweets


def find_keywords(text: str, keywords: list) -> list:
    matches = []
    for keyword in keywords:
        pattern = re.compile(rf"(?i)(?:\\$|\\b){re.escape(keyword)}\\b")
        if pattern.search(text or ""):
            matches.append(keyword.upper())
    return sorted(set(matches))


def engagement_score(metrics: dict) -> int:
    if not metrics:
        return 0
    return int(metrics.get("like_count", 0)) + int(metrics.get("retweet_count", 0)) + int(
        metrics.get("reply_count", 0)
    ) + int(metrics.get("quote_count", 0))


def format_iso(dt_str: str) -> str:
    if not dt_str:
        return ""
    try:
        return dt.datetime.fromisoformat(dt_str.replace("Z", "+00:00")).strftime(
            "%Y-%m-%d %H:%M:%S"
        )
    except ValueError:
        return dt_str


def build_report(replies: list, missing_targets: list, keywords: list) -> str:
    date_str = dt.datetime.now().strftime("%Y-%m-%d")
    total_targets = len(replies) + len(missing_targets)
    total_engagement = sum(r["engagement"] for r in replies)

    keyword_totals = {k: {"mentions": 0, "engagement": 0} for k in keywords}
    for item in replies:
        for kw in item["keywords"]:
            keyword_totals[kw]["mentions"] += 1
            keyword_totals[kw]["engagement"] += item["engagement"]

    keyword_rows = sorted(
        keyword_totals.items(),
        key=lambda kv: (kv[1]["engagement"], kv[1]["mentions"]),
        reverse=True,
    )

    top_keywords = [k for k, v in keyword_rows if v["engagement"] > 0][:3]

    lines = [
        f"# X Engagement Analysis - {date_str}",
        "",
        "## Summary",
        f"- Targets reviewed: {total_targets}",
        f"- Replies found: {len(replies)}",
        f"- Missing replies: {len(missing_targets)}",
        f"- Total engagement: {total_engagement}",
        f"- Top utility traction: {', '.join(top_keywords) if top_keywords else 'None'}",
        "",
        "## Reply Performance",
        "| Target Tweet ID | Reply Tweet ID | Created At | Likes | Reposts | Replies | Quotes | Engagement | Utility Keywords |",
        "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ]
    for item in replies:
        metrics = item["metrics"]
        lines.append(
            "| {target_id} | {reply_id} | {created_at} | {likes} | {retweets} | {replies} | {quotes} | {engagement} | {keywords} |".format(
                target_id=item["target_id"],
                reply_id=item["reply_id"],
                created_at=item["created_at"],
                likes=metrics.get("like_count", 0),
                retweets=metrics.get("retweet_count", 0),
                replies=metrics.get("reply_count", 0),
                quotes=metrics.get("quote_count", 0),
                engagement=item["engagement"],
                keywords=", ".join(item["keywords"]) if item["keywords"] else "-",
            )
        )

    lines.extend(
        [
            "",
            "## Utility Keyword Traction",
            "| Keyword | Mentions | Total Engagement | Avg Engagement |",
            "| --- | --- | --- | --- |",
        ]
    )
    for keyword, stats in keyword_rows:
        mentions = stats["mentions"]
        engagement = stats["engagement"]
        avg_engagement = round(engagement / mentions, 2) if mentions else 0
        lines.append(
            f"| {keyword} | {mentions} | {engagement} | {avg_engagement} |"
        )

    if missing_targets:
        lines.extend(
            [
                "",
                "## Missing Reply Targets",
                "",
                ", ".join(missing_targets),
            ]
        )

    return "\n".join(lines)


def main() -> int:
    env_path = Path(os.environ.get("X_ENV_PATH", DEFAULT_ENV_PATH))
    history_path = Path(os.environ.get("X_HISTORY_PATH", DEFAULT_HISTORY_PATH))
    output_dir = Path(os.environ.get("X_REPORT_DIR", DEFAULT_OUTPUT_DIR))

    env = load_env_file(env_path)
    for key, value in env.items():
        os.environ.setdefault(key, value)

    consumer_key = os.environ.get("X_API_KEY")
    consumer_secret = os.environ.get("X_API_SECRET")
    access_token = os.environ.get("X_ACCESS_TOKEN")
    access_secret = os.environ.get("X_ACCESS_SECRET")

    if not all([consumer_key, consumer_secret, access_token, access_secret]):
        print("Missing X API credentials. Check mcp-twitter/.env.", file=sys.stderr)
        return 1

    if not history_path.exists():
        print(f"Missing history file: {history_path}", file=sys.stderr)
        return 1

    history = json.loads(history_path.read_text(encoding="utf-8"))
    targets = history.get("replied", [])
    if not targets:
        print("No reply targets found in x_history.json.", file=sys.stderr)
        return 1

    creds = {
        "consumer_key": consumer_key,
        "consumer_secret": consumer_secret,
        "access_token": access_token,
        "access_secret": access_secret,
    }
    user_info = get_user_info(creds)
    user_data = user_info.get("data", {})
    user_id = user_data.get("id")
    if not user_id:
        print("Failed to fetch user id from Twitter API.", file=sys.stderr)
        return 1

    tweets = get_user_tweets(creds, user_id, max_pages=5)

    targets_set = set(targets)
    replies_by_target = {}

    for tweet in tweets:
        ref_list = tweet.get("referenced_tweets") or []
        for ref in ref_list:
            if ref.get("type") == "replied_to" and ref.get("id") in targets_set:
                target_id = ref["id"]
                created_at = tweet.get("created_at") or ""
                existing = replies_by_target.get(target_id)
                if existing:
                    # Keep the most recent reply per target.
                    if created_at > existing["created_at_raw"]:
                        replies_by_target[target_id] = {
                            "tweet": tweet,
                            "created_at_raw": created_at,
                        }
                else:
                    replies_by_target[target_id] = {
                        "tweet": tweet,
                        "created_at_raw": created_at,
                    }

    replies = []
    for target_id, payload in replies_by_target.items():
        tweet = payload["tweet"]
        metrics = tweet.get("public_metrics", {})
        text = tweet.get("text", "")
        keywords = find_keywords(text, UTILITY_KEYWORDS)
        replies.append(
            {
                "target_id": target_id,
                "reply_id": tweet.get("id", ""),
                "created_at": format_iso(tweet.get("created_at", "")),
                "metrics": metrics,
                "engagement": engagement_score(metrics),
                "keywords": keywords,
            }
        )

    missing_targets = [t for t in targets if t not in replies_by_target]

    report_body = build_report(replies, missing_targets, UTILITY_KEYWORDS)
    output_dir.mkdir(parents=True, exist_ok=True)
    date_str = dt.datetime.now().strftime("%Y-%m-%d")
    output_path = output_dir / f"{date_str}_Engagement_Analysis.md"
    output_path.write_text(report_body, encoding="utf-8")

    print(f"Report written: {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
