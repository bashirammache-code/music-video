import crypto from "node:crypto";

const API = "https://graph.facebook.com/v21.0";

export function verifySignature(rawBody: Buffer, header: string | undefined): boolean {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret || !header?.startsWith("sha256=")) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const given = header.slice("sha256=".length);
  return given.length === expected.length && crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}

async function call(path: string, body: unknown): Promise<void> {
  const res = await fetch(`${API}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", ...(body as object) }),
  });
  if (!res.ok) console.error(`WhatsApp ${path} failed: ${res.status} ${await res.text()}`);
}

export const sendText = (to: string, text: string) =>
  call("messages", { to, type: "text", text: { body: text.slice(0, 4096) } });

export const markRead = (messageId: string) =>
  call("messages", { status: "read", message_id: messageId });
