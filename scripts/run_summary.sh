#!/bin/bash

# Configuration
export NIM_API_KEY="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"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORK_DIR="$(dirname "$SCRIPT_DIR")"

# Calculate Yesterday's Date (macOS/BSD date command compatible)
YESTERDAY=$(date -v-1d +%Y-%m-%d)
MEMORY_FILE="$WORK_DIR/memory/$YESTERDAY.md"

echo "🔍 Processing memory for: $YESTERDAY"
echo "📂 File: $MEMORY_FILE"

if [ -f "$MEMORY_FILE" ]; then
    echo "----------------------------------------"
    python3 "$SCRIPT_DIR/summarize_memory.py" "$MEMORY_FILE"
    echo "----------------------------------------"
else
    echo "⚠️  No memory file found for yesterday ($YESTERDAY)."
fi
