import express from "express";
import { respond } from "./agent.js";
import * as store from "./store.js";
import { markRead, sendText, verifySignature } from "./whatsapp.js";

const app = express();

// Meta webhook verification handshake
app.get("/webhook", (req, res) => {
  if (req.query["hub.mode"] === "subscribe" && req.query["hub.verify_token"] === process.env.WHATSAPP_VERIFY_TOKEN)
    return res.status(200).send(String(req.query["hub.challenge"]));
  res.sendStatus(403);
});

app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  if (!verifySignature(req.body, req.header("x-hub-signature-256"))) return res.sendStatus(401);
  res.sendStatus(200); // ack fast; Meta retries if we're slow
  const payload = JSON.parse(req.body.toString());
  for (const entry of payload.entry ?? [])
    for (const change of entry.changes ?? [])
      for (const msg of change.value?.messages ?? [])
        handle(msg).catch((e) => console.error("handle failed", e));
});

async function handle(msg: any): Promise<void> {
  if (store.alreadySeen(msg.id)) return;
  const from: string = msg.from;
  markRead(msg.id);

  if (msg.type !== "text") {
    await sendText(from, "Thanks! I can only read text messages for now. Could you type your question?");
    return;
  }
  const convo = store.get(from);
  if (convo.handoff) return; // a human owns this conversation; stay silent

  const reply = await respond(from, msg.text.body);
  if (reply.text) await sendText(from, reply.text);
  if (reply.handoffReason) {
    convo.handoff = true;
    store.save();
    if (process.env.OWNER_NUMBER)
      await sendText(process.env.OWNER_NUMBER, `Handoff needed: +${from}\nReason: ${reply.handoffReason}`);
  }
}

app.listen(Number(process.env.PORT ?? 3000), () => console.log("WhatsApp agent listening"));
