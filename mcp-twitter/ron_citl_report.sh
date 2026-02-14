#!/usr/bin/env bash
set -euo pipefail

# Paths (update if you move this script or if paths change)
CITL_LIST="/Users/ieunchul/clawd/mcp-twitter/core_intelligence_list.md"
FETCH_SCRIPT="/Users/ieunchul/clawd/mcp-twitter/x_get_latest_tweet.js"
OUTPUT_DIR="/Users/ieunchul/Documents/Obsidian Vault/2nd_Brain/04_Archive/X_Daily_Reports"

if [[ ! -f "$CITL_LIST" ]]; then
  echo "CITL list not found: $CITL_LIST" >&2
  exit 1
fi

if [[ ! -f "$FETCH_SCRIPT" ]]; then
  echo "Fetch script not found: $FETCH_SCRIPT" >&2
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

REPORT_DATE="$(date +%Y-%m-%d)"
REPORT_PATH="$OUTPUT_DIR/CITL_Report_${REPORT_DATE}.md"

# Extract usernames: supports lines like "1. @user", "- @user", etc.
# Strips the @ sign for the node script call
USERNAMES=$(grep -o "@[A-Za-z0-9_]\+" "$CITL_LIST" | sed 's/@//g' | sort -u)

{
  echo "# CITL Daily Report — ${REPORT_DATE}"
  echo
  echo "## Ron’s Strategic Takeaway"
  echo "Today's leader signals indicate a heavy focus on [Topic]. [Strategy/Context]."
  echo
  echo "---"
  echo
  echo "## Leader Activity"
  echo

  if [[ -z "$USERNAMES" ]]; then
    echo "_No usernames found in CITL list._"
  else
    for username in $USERNAMES; do
      echo "### @${username}"
      echo
      echo '```'
      node "$FETCH_SCRIPT" "$username" || echo "(error fetching activity)"
      echo '```'
      echo
    done
  fi
} > "$REPORT_PATH"

echo "Report written: $REPORT_PATH"
