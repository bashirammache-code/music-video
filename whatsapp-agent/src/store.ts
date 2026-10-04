import fs from "node:fs";
import type Anthropic from "@anthropic-ai/sdk";

// Simple JSON-file store keyed by customer phone number. Swap for Postgres/Redis in production.
export interface Conversation {
  messages: Anthropic.MessageParam[];
  handoff: boolean;
}

const FILE = "data/conversations.json";
let db: Record<string, Conversation> = {};
try { db = JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { /* first run */ }

const seen = new Set<string>(); // webhook retries: ignore message ids we already handled

export function alreadySeen(id: string): boolean {
  if (seen.has(id)) return true;
  seen.add(id);
  if (seen.size > 5000) seen.delete(seen.values().next().value!);
  return false;
}

export function get(phone: string): Conversation {
  return (db[phone] ??= { messages: [], handoff: false });
}

export function save(): void {
  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(db));
}
