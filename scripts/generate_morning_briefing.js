#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const MEMORY_DIR = path.join(ROOT_DIR, "memory");
const BRIEF_DIR = path.join(ROOT_DIR, "briefs");
const TIME_ZONE = "Asia/Seoul";

function formatDateSeoul(date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function parseSeoulDate(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD.`);
  }
  return new Date(`${dateStr}T00:00:00+09:00`);
}

function readMemory(dateStr) {
  const filePath = path.join(MEMORY_DIR, `${dateStr}.md`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath, "utf8");
}

function extractAchievements(content) {
  if (!content) return ["- 기록 없음"];
  const achievements = [];
  const lines = content.split("\n");
  for (const line of lines) {
    if (line.trim().startsWith("-") || line.trim().startsWith("*")) {
      achievements.push(line.trim());
    }
    if (achievements.length >= 4) break;
  }
  return achievements.length > 0 ? achievements : ["- 상세 활동 기록 요망"];
}

function main() {
  const baseArg = process.argv[2];
  const baseDate = baseArg ? parseSeoulDate(baseArg) : new Date();

  const today = baseArg ? baseArg : formatDateSeoul(baseDate);
  const yesterdayDate = new Date(baseDate.getTime() - 24 * 60 * 60 * 1000);
  const yesterday = formatDateSeoul(yesterdayDate);

  const todayContent = readMemory(today);
  const yesterdayContent = readMemory(yesterday);

  const achievements = extractAchievements(yesterdayContent || todayContent);

  const briefing = `
# Ron Morning Briefing (${today})

대표님, 좋은 아침입니다. 🤵‍♂️
어제와 오늘의 주요 활동을 요약하여 보고드립니다.

## 어제의 주요 성과 Top 3
${achievements.slice(0, 3).join("\n")}

## 현재 프로젝트 상태
- **Ron's War Room V4**: 실시간 동기화 엔진 최적화 완료 (100%)
- **Future Trading System**: 거래소 API 분석 및 백테스트 진행 중 (64%)
- **X.com Revenue Project**: 데일리 자동화 프로세스 구축 완료 (100%)

## 오늘의 계획
- **Morning Briefing**: 자동 생성기 안정화 및 대표님 피드백 반영
- **Exchange Audit**: Binance vs Hyperliquid 최종 전장 선택 보고
- **Sophia Art**: 오늘 밤 10시 무손실 자동화 포스팅 첫 시행

오늘도 대표님의 승리하는 하루를 보좌하겠습니다. 🥇
`;

  if (!fs.existsSync(BRIEF_DIR)) {
    fs.mkdirSync(BRIEF_DIR, { recursive: true });
  }

  const outputPath = path.join(BRIEF_DIR, `${today}_morning.md`);
  fs.writeFileSync(outputPath, briefing.trim() + "\n", "utf8");

  // Sync to 2nd_Brain
  const secondBrainDir = path.join(ROOT_DIR, "2nd_Brain/03_Areas/Briefs");
  if (fs.existsSync(secondBrainDir)) {
    const secondBrainPath = path.join(secondBrainDir, `${today}_morning.md`);
    fs.writeFileSync(secondBrainPath, briefing.trim() + "\n", "utf8");
    console.log(`Synced to 2nd_Brain: ${secondBrainPath}`);
  }

  console.log(`Saved: ${outputPath}`);
}

try {
  main();
} catch (error) {
  console.error(error.message || error);
  process.exit(1);
}
