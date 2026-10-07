# Ilayya — shared brief (all agents read this first)

**Brand:** Ilayya (ilayya.co), premium Lebanese jewelry on Shopify. English + Arabic (RTL, `/ar/`).
Identity: script logo, burgundy `#461619`, cream `#F6F4F1`, warm photography. Fonts: Nunito + Fraunces.
Collections: earrings, necklaces, bracelets, hand & finger chains. Nav: Home · Jewelry · Our story · Contact.
Discount in use: `WELCOME10` (10% off). Payments being set up: Whish Pay (follow-up email drafted; owner waits for their reply; owner is abroad, reach by WhatsApp +961 71 594 421). COD is used.
Reviews: Judge.me. WhatsApp customer-service bot is in progress (separate session "AI agent customer service on WhatsApp", deploy on Render).

## Hard rules (every agent)
1. **Never invent facts.** No made-up measurements, weights, plating claims, waterproof/hypoallergenic claims, reviews/ratings/counts, certifications, press ("As seen in"), celebrity endorsements, customer-count stats, or delivery/returns/warranty promises. If unverified, leave it out or ask the owner. Build structures that can hold real content later.
2. **Draft, don't send.** Never send emails/WhatsApp, publish posts, launch or change ads, issue refunds, change live prices, place supplier orders, or move money without the owner's explicit approval.
3. **Shopify theme safety:** check theme `role` before writing; `themeFilesUpsert` is blocked on the live theme, so duplicate → edit the duplicate → the owner publishes. Push a section schema change and the template that uses it as two separate sequential calls. `menuUpdate` is live immediately. Live theme at last check: `192151453977`; popup-fix draft `192208437529` (unpublished).
4. Report results to the hub ("New session", `session_01VvtvV8px328fbVRmFBX8pV`) as a short summary: what you did, what needs approval, what's blocked.
5. Be brief. Tell the owner the decision needed, not the whole process.
