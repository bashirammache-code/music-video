import fs from "node:fs";
import Anthropic from "@anthropic-ai/sdk";
import * as store from "./store.js";

const client = new Anthropic();
const MODEL = process.env.CLAUDE_MODEL ?? "claude-sonnet-5-5";
const MAX_HISTORY = 40;

const SYSTEM = () => `You are a customer service assistant for a business, replying on WhatsApp.
Be friendly, concise (a few short sentences), plain text only (no markdown headers/tables). Reply in the customer's language.
Answer only from the business knowledge below. If you don't know, or the customer asks for a refund, is upset, or asks for a person, call the handoff tool instead of guessing.

${fs.readFileSync("knowledge.md", "utf8")}`;

const tools: Anthropic.Tool[] = [
  {
    name: "handoff_to_human",
    description: "Escalate the conversation to a human agent. Use when you can't answer, for refunds/disputes, or on request.",
    input_schema: {
      type: "object",
      properties: { reason: { type: "string", description: "One-line summary for the human agent" } },
      required: ["reason"],
    },
  },
  // Add your own tools here (order lookup, booking, stock check...) and handle them in runTool().
];

export interface Reply { text: string; handoffReason?: string }

function runTool(name: string, input: any): { result: string; handoffReason?: string } {
  if (name === "handoff_to_human") return { result: "A human agent has been notified.", handoffReason: input.reason };
  return { result: `Unknown tool ${name}` };
}

export async function respond(phone: string, userText: string): Promise<Reply> {
  const convo = store.get(phone);
  convo.messages.push({ role: "user", content: userText });
  if (convo.messages.length > MAX_HISTORY) convo.messages = convo.messages.slice(-MAX_HISTORY);
  // History must start with a user text turn
  while (convo.messages.length && !(convo.messages[0].role === "user" && typeof convo.messages[0].content === "string"))
    convo.messages.shift();

  let handoffReason: string | undefined;
  for (let i = 0; i < 5; i++) {
    const res = await client.messages.create({
      model: MODEL, max_tokens: 1024, system: SYSTEM(), tools, messages: convo.messages,
    });
    convo.messages.push({ role: "assistant", content: res.content });

    if (res.stop_reason !== "tool_use") {
      const text = res.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("\n").trim();
      store.save();
      return { text, handoffReason };
    }
    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const b of res.content) {
      if (b.type !== "tool_use") continue;
      const out = runTool(b.name, b.input);
      handoffReason ??= out.handoffReason;
      results.push({ type: "tool_result", tool_use_id: b.id, content: out.result });
    }
    convo.messages.push({ role: "user", content: results });
  }
  store.save();
  return { text: "Let me connect you with a teammate who can help.", handoffReason: handoffReason ?? "agent loop limit" };
}
