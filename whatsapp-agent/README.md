# WhatsApp customer-service agent

WhatsApp Cloud API webhook -> Claude (with tools) -> reply. Includes signature verification,
retry de-duplication, per-customer memory, and human handoff.

## Setup
1. In the Meta developer dashboard, add the **WhatsApp** product to your app and note the
   phone number ID, a permanent system-user token, and the app secret.
2. `cp .env.example .env` and fill it in. Edit `knowledge.md` with your business info.
3. `npm install && npm run dev`
4. Expose it over HTTPS (e.g. `cloudflared tunnel --url http://localhost:3000` or deploy it).
5. In Meta > WhatsApp > Configuration, set the callback URL to `https://<host>/webhook`,
   the verify token to `WHATSAPP_VERIFY_TOKEN`, and subscribe to the **messages** field.

## Handoff
When Claude calls `handoff_to_human`, the bot goes silent for that customer and sends you an
alert on `OWNER_NUMBER`. Reply to the customer from the WhatsApp Business app / inbox. To hand
the conversation back, set `"handoff": false` for that number in `data/conversations.json`.

## Extending
Add tools in `src/agent.ts` (`tools` + `runTool`) for order lookup, bookings, etc.
Limits: text only, 24-hour reply window (outside it you need approved template messages).
