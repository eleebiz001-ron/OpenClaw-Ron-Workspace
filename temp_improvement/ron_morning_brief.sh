#!/usr/bin/env bash
set -euo pipefail

report_output=$(python3 ~/clawd/mcp-twitter/x_daily_report.py)
report_path=$(printf "%s" "$report_output" | sed -n 's/^Report generated: //p' | tail -n 1 | tr -d '\r')

if [ -z "$report_path" ] || [ ! -f "$report_path" ]; then
  report_dir="/Users/ieunchul/Documents/Obsidian Vault/2nd_Brain/04_Archive/X_Daily_Reports"
  report_path=$(ls -1t "$report_dir"/*_X_Report.md 2>/dev/null | head -n 1 || true)
fi

if [ -z "$report_path" ] || [ ! -f "$report_path" ]; then
  echo "Error: could not locate the generated report." >&2
  exit 1
fi

report_content=$(cat "$report_path")
report_date=$(printf "%s" "$report_content" | sed -n 's/^# .*Report (//p' | sed 's/).*//')
if [ -z "$report_date" ]; then
  report_date=$(basename "$report_path" | sed 's/_X_Report.md//')
fi

activity_lines=$(printf "%s" "$report_content" | awk '
  /^## 🤵‍♂️ Ron"'"'"'s Activity Summary/{flag=1;next}
  /^## /{flag=0}
  flag && /^- /{print}
')

growth_lines=$(printf "%s" "$report_content" | awk '
  /^## 📈 Growth Metrics/{flag=1;next}
  /^## /{flag=0}
  flag && /^- /{print}
')

moves_lines=$(printf "%s" "$report_content" | awk '
  /^## 🎯 Next Strategic Moves/{flag=1;next}
  /^## /{flag=0}
  flag && /^- /{print}
')

printf "대표님, 좋은 아침입니다. 오늘(%s) X.com 리포트 요약입니다.\n" "$report_date"
if [ -n "$activity_lines" ]; then
  echo "- 활동 요약:"
  echo "$activity_lines"
fi
if [ -n "$growth_lines" ]; then
  echo "- 성장 지표:"
  echo "$growth_lines"
fi
if [ -n "$moves_lines" ]; then
  echo "- 다음 액션:"
  echo "$moves_lines"
fi
