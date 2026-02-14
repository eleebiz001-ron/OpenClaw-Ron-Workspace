# X.com Auto-Revenue System: Technical Blueprint (Alpha)

## 1. System Overview
The **X.com Auto-Revenue System** is a human-in-the-loop automation pipeline designed to generate high-engagement content for X.com (Twitter) using Codex CLI. It leverages Ron & Birdie's growth strategy to hit follower targets (1k/5k/10k) while maintaining user control over final publication.

## 2. Architecture Components
The system follows a three-tier architecture:
1.  **Logic Tier (Ron & Birdie):** Orchestrates content strategy, hooks, and growth loops.
2.  **Automation Tier (Alpha / Codex CLI):** Handles content generation, scheduling, and API/CLI interfacing.
3.  **Review Tier (User):** Final approval via a local staging area before posting.

## 3. Tooling: Codex CLI Integration
Codex CLI will be used as the primary execution engine for the following:
*   **Content Generation:** `codex e "Generate 5 high-hook tweets based on [TRENDS] using Ron's viral strategy."`
*   **Workflow Execution:** Using `codex exec` to pipe generated content into local JSON/Markdown databases.
*   **Approval Loop:** Utilizing `--ask-for-approval` or a custom CLI review tool built with Codex.

## 4. Implementation Plan

### Phase 1: Content Pipeline (Immediate)
*   **Prompt Engineering:** Develop "Ron-logic" and "Birdie-logic" system prompts for Codex.
*   **Staging System:** Create a `/staging` directory for drafted tweets.
*   **CLI Scheduler:** Use `cron` or a heartbeat mechanism to trigger Codex generation 3 times daily.

### Phase 2: User Review Interface
*   **Review Script:** A simple CLI tool (`review.sh`) that reads from `/staging`, displays the tweet, and asks for `[Y/N/Edit]`.
*   **Success Storage:** Approved tweets move to `/queue`.

### Phase 3: Posting & OAuth Integration
*   **OAuth Management:** Future integration where Ron manages API keys and OAuth tokens.
*   **CLI Posting:** Use a tool like `twity` or a custom Python script called via `codex e`.

## 5. Technical Specification (Draft)
```bash
# Example Generation Command
codex exec "Analyze current tech trends and write a 3-tweet thread in Birdie's voice. Save to ./staging/$(date +%F).md"

# Example Review Flow
# User runs: ./scripts/review_content.sh
# System: Displays draft -> User Approves -> Moves to /queue
```

## 6. Next Steps for Alpha
1.  Initialize the project directory structure.
2.  Create the initial `ron_birdie_strategy.prompt` file.
3.  Draft the first set of automation scripts using Codex CLI.
