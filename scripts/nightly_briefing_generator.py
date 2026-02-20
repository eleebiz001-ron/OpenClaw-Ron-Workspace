#!/usr/bin/env python3
"""
Nightly Briefing Generator
- Reads Live_Market_Status.md and latest X follower count
- Scans for White House meeting / Clarity Act keywords
- Writes concise CEO briefing in Markdown
"""
from __future__ import annotations

import argparse
import datetime as dt
import os
import re
from pathlib import Path
from typing import Iterable, Optional, Tuple

DEFAULT_OUTPUT = "/Users/ieunchul/Documents/Obsidian Vault/2nd_Brain/00_Inbox/☀️_Morning_Briefing.md"

KEYWORDS = [
    "white house meeting",
    "white house",
    "clarity act",
    "clarity act of",
    "clarty act",  # common typo guard
]

FOLLOWER_FILE_CANDIDATES = [
    "X_Followers.md",
    "X_Follower_Count.md",
    "X_follower_count.txt",
    "X_followers.txt",
]

KEYWORD_SOURCE_CANDIDATES = [
    "Keyword_Source.txt",
    "Keyword_Source.md",
    "Latest_Search_Results.md",
    "latest_search_results.txt",
]


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="ignore")
    except FileNotFoundError:
        return ""


def find_latest_file(candidates: Iterable[Path]) -> Optional[Path]:
    existing = [p for p in candidates if p.exists() and p.is_file()]
    if not existing:
        return None
    return max(existing, key=lambda p: p.stat().st_mtime)


def extract_follower_count(text: str) -> Optional[str]:
    if not text:
        return None
    # Prefer explicit "followers" labels
    m = re.search(r"([\d,]+)\s*(followers|follower)", text, re.IGNORECASE)
    if m:
        return m.group(1)
    # Fallback to first integer-like token
    m = re.search(r"\b([\d,]{3,})\b", text)
    if m:
        return m.group(1)
    return None


def summarize_market_status(text: str, max_lines: int = 6) -> list[str]:
    if not text:
        return ["Live market status file not found."]
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    if not lines:
        return ["Live market status file is empty."]

    priority = []
    for ln in lines:
        if any(k in ln.lower() for k in ["status", "market", "trend", "signal", "risk", "reward"]):
            priority.append(ln)
    if priority:
        return priority[:max_lines]
    return lines[:max_lines]


def scan_keywords(*texts: str) -> Tuple[list[str], list[str]]:
    found = []
    snippets = []
    combined = "\n".join(t for t in texts if t)
    lower = combined.lower()
    for kw in KEYWORDS:
        if kw in lower:
            found.append(kw)
    if found:
        # Collect short context lines
        for line in combined.splitlines():
            l = line.lower()
            if any(kw in l for kw in found):
                snippets.append(line.strip())
    return sorted(set(found)), snippets[:5]


def build_briefing(
    live_status_lines: list[str],
    follower_count: Optional[str],
    keyword_hits: list[str],
    keyword_snippets: list[str],
    sources: list[str],
) -> str:
    today = dt.datetime.now().strftime("%A, %B %d, %Y")

    follower_line = (
        f"X followers: {follower_count}" if follower_count else "X followers: not found"
    )

    keyword_line = (
        ", ".join(keyword_hits) if keyword_hits else "No relevant mentions detected"
    )

    lines = []
    lines.append(f"# ☀️ Morning Briefing — {today}")
    lines.append("")
    lines.append("**For:** Representative Lee")
    lines.append("**Persona:** Ron — concise, professional, 3:1 risk‑reward framing")
    lines.append("")
    lines.append("## Executive Snapshot")
    lines.append(f"- {follower_line}")
    lines.append(f"- Keyword watch: {keyword_line}")
    lines.append("")
    lines.append("## Market Pulse")
    for ln in live_status_lines:
        lines.append(f"- {ln}")
    lines.append("")
    lines.append("## Risk‑Reward (3:1)")
    lines.append("- Primary posture: seek setups where reward is at least 3x risk")
    lines.append("- If conditions are noisy, stand down and preserve optionality")
    lines.append("")
    lines.append("## Policy / Narrative Watch")
    if keyword_hits:
        for snip in keyword_snippets or ["Mentions found (see sources)."]:
            lines.append(f"- {snip}")
    else:
        lines.append("- No White House meeting or Clarity Act mentions in sources")
    lines.append("")
    lines.append("## Sources")
    if sources:
        for src in sources:
            lines.append(f"- {src}")
    else:
        lines.append("- No source files found")
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate a nightly CEO briefing.")
    parser.add_argument("--live-market-file", default="Live_Market_Status.md")
    parser.add_argument("--keyword-source-file", default=None)
    parser.add_argument("--follower-file", default=None)
    parser.add_argument("--output", default=DEFAULT_OUTPUT)
    args = parser.parse_args()

    cwd = Path.cwd()

    live_market_path = Path(args.live_market_file)
    if not live_market_path.is_absolute():
        live_market_path = cwd / live_market_path

    keyword_source_path = None
    if args.keyword_source_file:
        keyword_source_path = Path(args.keyword_source_file)
        if not keyword_source_path.is_absolute():
            keyword_source_path = cwd / keyword_source_path
    else:
        keyword_source_path = find_latest_file(
            [cwd / p for p in KEYWORD_SOURCE_CANDIDATES]
        )

    follower_path = None
    if args.follower_file:
        follower_path = Path(args.follower_file)
        if not follower_path.is_absolute():
            follower_path = cwd / follower_path
    else:
        follower_path = find_latest_file(
            [cwd / p for p in FOLLOWER_FILE_CANDIDATES]
        )

    live_text = read_text(live_market_path)
    keyword_text = read_text(keyword_source_path) if keyword_source_path else ""
    follower_text = read_text(follower_path) if follower_path else ""

    # Env override for follower count
    env_followers = os.getenv("X_FOLLOWER_COUNT", "").strip()
    follower_count = env_followers or extract_follower_count(follower_text)

    live_summary = summarize_market_status(live_text)
    keyword_hits, keyword_snippets = scan_keywords(live_text, keyword_text)

    sources = []
    if live_market_path.exists():
        sources.append(str(live_market_path))
    if keyword_source_path and keyword_source_path.exists():
        sources.append(str(keyword_source_path))
    if follower_path and follower_path.exists():
        sources.append(str(follower_path))

    briefing = build_briefing(
        live_summary, follower_count, keyword_hits, keyword_snippets, sources
    )

    output_path = Path(args.output)
    try:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(briefing, encoding="utf-8")
        print(f"Briefing written to {output_path}")
        return 0
    except Exception as exc:
        print(f"Failed to write briefing to {output_path}: {exc}")
        # Write to cwd as fallback
        fallback = cwd / "Morning_Briefing.md"
        fallback.write_text(briefing, encoding="utf-8")
        print(f"Fallback briefing written to {fallback}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
