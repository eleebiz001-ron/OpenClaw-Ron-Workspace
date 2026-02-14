#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const SESSIONS_DIR = "/Users/ieunchul/.openclaw/agents/main/sessions";
const WAR_ROOM_STATUS = path.join(__dirname, "..", "war_room_status.json");
const POLL_MS = 2000;

const filePositions = new Map();

function listSessionFiles() {
  return fs
    .readdirSync(SESSIONS_DIR)
    .filter((f) => f.endsWith(".jsonl"))
    .map((f) => path.join(SESSIONS_DIR, f));
}

function loadStatus() {
  if (!fs.existsSync(WAR_ROOM_STATUS)) {
    return { logs: [], tasks: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(WAR_ROOM_STATUS, "utf8"));
  } catch {
    return { logs: [], tasks: [] };
  }
}

function appendLog(message) {
  const status = loadStatus();
  status.logs = status.logs || [];
  const now = new Date();
  const time = now.toLocaleTimeString("en-GB", { hour12: false });
  status.logs.push({ time, msg: message });
  status.logs = status.logs.slice(-30);
  fs.writeFileSync(WAR_ROOM_STATUS, JSON.stringify(status, null, 2));
}

function normalizeContent(content) {
  if (!content) return "";
  if (Array.isArray(content)) {
    return content.map((c) => c.text || c.content || "").join(" ").trim();
  }
  if (typeof content === "object") {
    return (content.text || content.content || "").trim();
  }
  return String(content).trim();
}

function parseLine(line) {
  try {
    const obj = JSON.parse(line);
    const role = obj.role || obj?.message?.role || obj?.event?.role;
    const content = obj.content || obj?.message?.content || obj?.event?.content;
    const text = normalizeContent(content);
    if (!text || !role) return null;
    if (role === "user") return `대표님: ${text}`;
    if (role === "assistant") return `RON: ${text}`;
    return null;
  } catch {
    return null;
  }
}

function pollFile(filePath) {
  const stats = fs.statSync(filePath);
  const lastPos = filePositions.get(filePath) || 0;
  const start = stats.size < lastPos ? 0 : lastPos;
  if (stats.size === start) return;

  const fd = fs.openSync(filePath, "r");
  const buffer = Buffer.alloc(stats.size - start);
  fs.readSync(fd, buffer, 0, buffer.length, start);
  fs.closeSync(fd);

  filePositions.set(filePath, stats.size);
  const chunk = buffer.toString("utf8");
  const lines = chunk.split("\n").filter(Boolean);
  for (const line of lines) {
    const msg = parseLine(line);
    if (msg) appendLog(msg);
  }
}

function poll() {
  const files = listSessionFiles();
  files.forEach((f) => {
    if (!filePositions.has(f)) filePositions.set(f, 0);
    pollFile(f);
  });
}

setInterval(poll, POLL_MS);
console.log("Log bridge started. Watching ALL session logs for real-time chat mirroring.");
