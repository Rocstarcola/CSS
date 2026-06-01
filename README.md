# Gadgetron — Shopify Theme

A custom **Shopify (Online Store 2.0) theme** for **Gadgetron**, a 3D-printing
business that sells businesses custom 3D-printed **treasure boxes** filled with
toy prizes for kids — plus an optional **subscription** for periodic prize refills.

Playful treasure look, fully responsive, no build step.

## Theme structure

```
assets/        theme.css, theme.js
config/         settings_schema.json, settings_data.json   (theme editor settings)
layout/         theme.liquid, password.liquid
locales/        en.default.json
sections/       header, footer, hero, how-it-works, featured-collection,
                plans, business, faq, contact, cart-drawer, and all "main-*"
                page sections (product, collection, cart, search, blog, etc.)
snippets/       product-card, cart-drawer-contents
templates/      JSON templates (index, product, collection, cart, …) +
                Liquid templates (password, gift_card, customers/*)
```

The homepage is assembled in `templates/index.json` from editable sections, so
your son can rearrange/edit everything from **Online Store → Customize** in
Shopify without touching code.

## Install it into Shopify

You can't open `theme.liquid` in a browser like a plain site — it needs Shopify
to render. Two ways to get it into the Gadgetron store:

**Option A — Shopify CLI (recommended for live preview):**
```bash
# one-time: https://shopify.dev/docs/themes/tools/cli
shopify theme dev --store gadgetron.myshopify.com   # live local preview
shopify theme push                                   # upload to the store
```

**Option B — Upload a ZIP:**
1. Zip the contents of this folder (the `assets/`, `config/`, `layout/`, etc.
   folders must be at the root of the zip — not inside another folder).
2. In Shopify admin: **Online Store → Themes → Add theme → Upload zip file**.
3. Click **Customize** to set it up, then **Publish** when ready.

## First-time setup in Shopify admin

1. **Add products** — create your treasure boxes as products. Put them in a
   collection with the handle **`treasure-boxes`** so they show on the homepage
   (or change the collection in the homepage "Featured collection" section).
2. **Navigation** — Online Store → Navigation: set up the `main-menu` (Shop,
   How It Works `/#how`, Plans `/#plans`, For Business `/#business`, FAQ `/#faq`).
3. **Subscriptions / refills** — install a subscriptions app (e.g. Shopify
   Subscriptions, Recharge, or Seal). Once a product has selling plans, the
   product page automatically shows "One-time" vs. the subscription options, and
   the cart shows the refill schedule. No theme code changes needed.
4. **Contact form** — the homepage quote form uses Shopify's built-in contact
   form, so submissions email the store's contact email
   (Settings → Store details). No extra service required.
5. **Branding** — Customize → Theme settings:
   - Upload a **logo** (otherwise the shop name shows with a 🧰 mark)
   - Set **accent (teal)** and **highlight (gold)** colors
   - Choose **cart drawer** vs. cart page

## Customizing content

Almost everything is editable in the theme editor as section/block settings:
hero text & buttons, the four "How it works" steps, plan cards (including the
subscription "Refill Club"), business benefits, the "Perfect for" list, and FAQ
items. Colors live in **Theme settings** and in the CSS variables at the top of
`assets/theme.css`.

## Notes

- Online Store 2.0 theme; works on any current Shopify plan.
- The product page supports multiple images, variants, quantity steppers, and
  subscription selling plans, with an AJAX slide-out cart drawer.
- A "treasure-boxes" collection and at least one product are needed before the
  storefront looks populated; placeholder cards show until then.
