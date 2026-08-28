# ILAYYA — Shopify Setup Guide (A to Z)

This folder contains the ILAYYA Shopify theme (`ilayya/`), a placeholder
product catalog (`ilayya-placeholder-products.csv`) matching the current
design preview, and the two real product photos for the Gold Moon Hoop
Earrings (`product-photos/`).

The theme now matches the design you've been reviewing: the red/cream/
charcoal palette, Nunito everywhere, the real logo, the rotating promo bar,
a working search drawer, a real AJAX cart with an "Added to your cart"
confirmation, a first-order discount pop-up, quick-add "+" on every product
card, a redesigned product page (image carousel with a counter, quantity
stepper, "Why not add" cross-sell), and an FAQ accordion.

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
3. This adds the 7 products from the current design preview: Gold Moon Hoop
   Earrings ($17), The Ilayya Pendant ($58), Nour Pendant Necklace ($68),
   Wisp Drop Earrings ($42), Layla Layered Chain ($76), Halo Huggie Hoops
   ($38), and Sana Bar Necklace ($64). All but the Moon Hoop Earrings are
   still placeholders (no photos yet, flagged as such in their description)
   — add real photography to each as it's ready (**Products → [product] →
   Media**).
4. **Upload the two real Gold Moon Hoop Earrings photos**: open that
   product, go to Media, and upload both files from `product-photos/` —
   `gold-moon-hoop-earrings-1-product.jpg` (the white-background shot) first
   so it's the default/primary image, then
   `gold-moon-hoop-earrings-2-worn.jpg` second. The product card will
   crossfade to the second image on hover automatically; the product page
   carousel will show both with a "1/2" counter.
5. Delete or edit these once your real catalog is ready.

## 4. Create collections

The theme's nav and homepage category tiles expect exactly these three
collections — matching the Earrings / Bracelets / Necklaces categories in
the design:

1. **Products → Collections → Create collection**
2. Make these (all as **Automated** collections), with these exact handles
   so the nav links line up:
   - **Earrings** — condition: Product type is equal to `Earrings` → handle
     it as `earrings`
   - **Bracelets** — condition: Product type is equal to `Bracelets` →
     handle it as `bracelets` (no products yet — the collection page will
     just say "No products found in this collection yet" until you add
     one, matching the "coming soon" state in the preview)
   - **Necklaces** — condition: Product type is equal to `Necklaces` →
     handle it as `necklaces`
3. In the theme editor (next step), point the **Category tiles** section's
   three blocks at Earrings/Bracelets/Necklaces, and set the homepage's
   **Featured collection** section to whichever collection you want
   spotlighted (e.g. a "New Arrivals" collection if you create one).

## 5. Set up navigation

The header renders nested dropdowns automatically from whatever menu
structure you build — nest a link under a parent to get a dropdown; leave
it flat for a plain link.

1. **Online Store → Navigation**.
2. Edit (or create) the menu handled `main-menu` — this is the header nav.
   Build it as:
   - **Home** → your homepage
   - **Jewelry** → nest **Earrings**, **Bracelets**, **Necklaces** under it
     (linking to those three collections)
   - **About** → nest **About** and **FAQs** under it (linking to your About
     and FAQs pages — see Step 8 for the FAQs page)
   - **Contact** → wherever your contact info lives (e.g. the footer/contact
     anchor, or a dedicated Contact page)
3. Edit (or create) the menu handled `footer` — used in the footer columns.
   Add: Contact, Shipping & Returns, FAQs, Track Order, etc.

## 6. Customize in the Theme Editor

**Online Store → Themes → Customize.**

- **Theme settings → Logo**: the real ILAYYA wordmark is already built into
  the theme as the default — upload your own here only if you want to
  override it.
- **Theme settings → Colors**: already defaults to the final palette (red
  `#8D0B0B`, cream `#F6F4F1`, charcoal `#241F1D`) — adjust only if the
  brand palette changes.
- **Announcement bar**: comes with the two rotating messages ("Free
  delivery on orders $75+" / "Join the list for 10% off your first order")
  already set up as blocks — edit the text or add more blocks to rotate
  through, and set how many seconds between messages.
- **Announcement bar (pop-up) → "Show first-order discount pop-up"**: on by
  default. It appears once per visitor (remembered in their browser),
  after a short delay.
- **Home page**: the Hero section is a full-bleed **swipeable slideshow** —
  add a **Slide** block per image (it ships with two commissioned lifestyle
  portraits), reorder or add more from the theme editor's block list. It
  autoplays (interval
  editable under the section's **Autoplay speed** setting, 0 to disable),
  and visitors can swipe on touch or use the arrows/dots on desktop. The
  headline/copy stays fixed over the slides. Fill in the Featured
  Collection, Category tiles, Brand story, and Testimonials sections.
- **Header/Footer**: confirm the correct menus are selected, add your
  Instagram/Pinterest links.
- **Product page**: the "Materials & Care" and "Shipping & Returns"
  accordion text is editable per-product-template under the **Product
  information** section settings — the materials text already defaults to
  the standard quality copy ("Made from 316L stainless steel with PVD gold
  plating…").

## 7. Add the FAQ page

1. **Online Store → Pages → Add page.**
2. Title it **FAQs**.
3. In the **Theme template** dropdown (right sidebar), choose `page.faq`.
4. Save — this renders the six-question FAQ accordion from the design
   preview automatically. Edit the questions/answers under
   **Customize → FAQ** section if you need to change the wording.
5. Link to this page from the About ▾ dropdown (Step 5) and/or the footer
   menu.

## 8. Payments, shipping, taxes

1. **Settings → Payments** → activate Shopify Payments (or connect
   PayPal/another provider) — you'll need business/bank details. If you
   want the "Cash on Delivery" option referenced in the FAQ, add it under
   **Settings → Payments → Manual payment methods**.
2. **Settings → Shipping and delivery** → set your shipping zones and rates
   (flat rate is simplest to start; e.g. free over $75 to match the
   announcement bar copy, which you can edit in the theme editor).
3. **Settings → Taxes and duties** → confirm tax registrations for the
   regions you'll sell in.

## 9. Legal pages & policies

**Settings → Policies** → use Shopify's generators for Refund, Privacy,
Terms of Service, and Shipping policy, then customize the wording. Add these
to the footer menu from Step 5.

## 10. Domain

**Settings → Domains** → buy a new domain (e.g. `ilayya.com`) directly
through Shopify, or connect one you already own by updating DNS records.

## 11. Launch checklist

- [ ] Remove the storefront password: **Online Store → Preferences →
      disable password protection** (only available once you're on a paid
      plan).
- [ ] Place a real test order and refund it to confirm checkout works.
- [ ] Check the site on mobile — the theme is responsive but always verify,
      especially the mobile menu accordion and the product page carousel.
- [ ] Set up Google/Meta pixel & analytics under **Settings → Customer
      events** if you plan to run ads.
- [ ] Consider adding: an email marketing app (Klaviyo/Shopify Email) if you
      want the newsletter/pop-up signups to flow into real campaigns — right
      now they add the customer with a "newsletter" tag — and a reviews app
      (the theme shows a star rating automatically once a review app
      populates `product.metafields.reviews.rating`).

---

## Theme structure reference

```
ilayya/
├── assets/          theme.css, theme.js, logo-wordmark.png, logo-full-lockup.png
├── config/          settings_schema.json, settings_data.json
├── layout/          theme.liquid
├── locales/         en.default.json
├── sections/        header, footer, announcement-bar, hero,
│                     featured-collection, collection-list, rich-text,
│                     testimonials, newsletter, cart-drawer, faq,
│                     product-recommendations, main-product, main-collection,
│                     main-cart, main-page, main-404, main-search
├── snippets/        icon, price, product-card, signup-popup,
│                     added-to-cart-modal
└── templates/       index.json, product.json, collection.json, cart.json,
                      page.json, page.faq.json, 404.json, search.json
```

Everything is editable from the Shopify theme editor (colors, images, text,
section order) without touching code. If you want further code changes
(new sections, layout tweaks, additional pages), just ask.
