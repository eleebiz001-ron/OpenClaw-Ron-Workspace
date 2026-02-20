import json
import subprocess
from datetime import datetime
from pathlib import Path

OUTPUT_PATH = Path("temp/polymarket_status.json")
ACCOUNT = "eleebiz001@gmail.com"
QUERY = "from:polymarket"
MAX_RESULTS = "5"


def fetch_threads():
    cmd = [
        "gog",
        "gmail",
        "search",
        QUERY,
        "--max",
        MAX_RESULTS,
        "--json",
        "--account",
        ACCOUNT,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    data = json.loads(result.stdout)
    return data.get("threads", [])


def main():
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    threads = fetch_threads()
    payload = {
        "updated": datetime.now().isoformat(timespec="seconds"),
        "threads": threads,
    }
    OUTPUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
