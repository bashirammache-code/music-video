# ILAYYA — Shopify Setup Guide (A to Z)

This folder contains a custom Shopify theme (`ilayya/`) built for a minimal,
modern fine-jewelry brand, plus a placeholder product catalog
(`ilayya-placeholder-products.csv`) so the store has real structure to look
at before your actual products/photos are ready.

Follow these steps in order.

---

## 1. Create your Shopify store

1. Go to shopify.com and start a free trial.
2. Enter your business name as **ILAYYA** (you can change this later under
   Settings → General).
3. Pick a plan once you're ready to launch (Basic is fine to start). You can
   build everything below on the free trial first.

## 2. Install the theme

**Option A — Upload as a zip (fastest, no tools needed)**
1. Zip the contents of the `ilayya/` folder (zip the *contents*, not the
   folder itself — `layout/`, `sections/`, etc. must be at the root of the
   zip).
2. In Shopify admin: **Online Store → Themes → Add theme → Upload zip file**.
3. Once uploaded, click **Actions → Publish** to make it live (or preview
   first with **Actions → Preview**).

**Option B — Shopify CLI (recommended if you'll keep iterating on code)**
1. Install Node.js, then the CLI: `npm install -g @shopify/cli`
2. From inside `shopify-theme/ilayya/`, run:
   ```
   shopify theme dev --store=your-store.myshopify.com
   ```
   This gives you a live local preview URL and hot-reloads on save.
3. When ready to publish: `shopify theme push --store=your-store.myshopify.com`

**Option C — GitHub integration**
Connect this repo to your store under **Online Store → Themes → Add theme →
Connect from GitHub**, pointing at the `shopify-theme/ilayya` folder. Every
push to the connected branch updates the theme automatically.

## 3. Import placeholder products

1. **Products → Import** in Shopify admin.
2. Upload `ilayya-placeholder-products.csv`.
3. This adds 8 sample products (rings, necklaces, earrings, bracelets) with
   pricing and variants so collections/homepage aren't empty. No images are
   included — add your product photography to each product afterward
   (**Products → [product] → Media**).
4. Delete or edit these once your real catalog is ready.

## 4. Create collections

The theme expects a few collections to look for its best:

1. **Products → Collections → Create collection**
2. Make these (all as **Automated** collections):
   - **New Arrivals** — condition: Tag is equal to `new` → handle it as
     `new-arrivals`
   - **Rings** — condition: Product type is equal to `Rings`
   - **Necklaces** — condition: Product type is equal to `Necklaces`
   - **Earrings** — condition: Product type is equal to `Earrings`
   - **Bracelets** — condition: Product type is equal to `Bracelets`
3. In the theme editor (next step), point the homepage's **Featured
   collection** section at "New Arrivals," and the **Category tiles**
   section's four blocks at Rings/Necklaces/Earrings/Bracelets.

## 5. Set up navigation

1. **Online Store → Navigation**.
2. Edit (or create) the menu handled `main-menu` — this is the header nav.
   Add links: New Arrivals, Rings, Necklaces, Earrings, Bracelets, About.
3. Edit (or create) the menu handled `footer` — used in the footer columns.
   Add: Contact, Shipping & Returns, FAQ, Track Order, etc.

## 6. Customize in the Theme Editor

**Online Store → Themes → Customize.**

- **Theme settings → Logo**: upload your real ILAYYA logo/wordmark once you
  have one. Until then the CSS wordmark ("ILAYYA" with a stylized mark over
  the first A, a nod to the shadda) is used automatically.
- **Theme settings → Colors**: defaults are ivory (`#FAF7F2`), near-black
  (`#1B1B1B`), and a soft gold accent (`#B08D57`) — adjust to taste.
- **Home page**: set the Hero section's image, headline, and button link
  (point it at your New Arrivals collection). Fill in the Featured
  Collection, Category tiles, Brand story, and Testimonials sections.
- **Header/Footer**: confirm the correct menus are selected, add your
  Instagram/Pinterest links.

## 7. Payments, shipping, taxes

1. **Settings → Payments** → activate Shopify Payments (or connect
   PayPal/another provider) — you'll need business/bank details.
2. **Settings → Shipping and delivery** → set your shipping zones and rates
   (flat rate is simplest to start; e.g. free over $150 to match the
   announcement bar copy, which you can edit in the theme editor).
3. **Settings → Taxes and duties** → confirm tax registrations for the
   regions you'll sell in.

## 8. Legal pages & policies

**Settings → Policies** → use Shopify's generators for Refund, Privacy,
Terms of Service, and Shipping policy, then customize the wording. Add these
to the footer menu from Step 5.

## 9. Domain

**Settings → Domains** → buy a new domain (e.g. `ilayya.com`) directly
through Shopify, or connect one you already own by updating DNS records.

## 10. Launch checklist

- [ ] Remove the storefront password: **Online Store → Preferences →
      disable password protection** (only available once you're on a paid
      plan).
- [ ] Place a real test order and refund it to confirm checkout works.
- [ ] Check the site on mobile — the theme is responsive but always verify.
- [ ] Set up Google/Meta pixel & analytics under **Settings → Customer
      events** if you plan to run ads.
- [ ] Consider adding: an email marketing app (Klaviyo/Shopify Email) and a
      reviews app — the theme has a Testimonials section ready to hold real
      quotes once you have them.

---

## Theme structure reference

```
ilayya/
├── assets/          theme.css, theme.js
├── config/          settings_schema.json, settings_data.json
├── layout/          theme.liquid
├── locales/         en.default.json
├── sections/        header, footer, hero, featured-collection,
│                     collection-list, rich-text, testimonials,
│                     newsletter, cart-drawer, main-product,
│                     main-collection, main-cart, main-page, main-404,
│                     main-search
└── templates/       index.json, product.json, collection.json,
                      cart.json, page.json, 404.json, search.json
```

Everything is editable from the Shopify theme editor (colors, images, text,
section order) without touching code. If you want further code changes
(new sections, layout tweaks, additional pages), just ask.
