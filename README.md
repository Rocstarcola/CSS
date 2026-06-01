# Gadgetron — Shopify Theme

A custom **Shopify (Online Store 2.0) theme** for **Gadgetron**, a 3D-printing
business that sells a range of made-to-order **3D-printed gadgets** — treasure
boxes, desk toys, tools, gifts and more — plus a **Surprise Box of the Month**
subscription: a mystery gadget whose retail value is always more than you pay.

Playful, colorful look, fully responsive, no build step.

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

1. **Add products** — create your gadgets as products (treasure boxes, desk
   toys, tools, gifts, etc.). The homepage "Featured" row pulls from the
   automatic **`frontpage`** collection — in the product editor, mark items as
   featured / add them to your Home page collection, or change the collection in
   the homepage "Featured collection" section. Use collections + the `main-menu`
   to organize categories (Treasure boxes, Desk toys, Tools, Gifts, …).
2. **Navigation** — Online Store → Navigation: set up the `main-menu` (Shop,
   How It Works `/#how`, Surprise Box `/#plans`, Why Gadgetron `/#business`,
   FAQ `/#faq`).
3. **Surprise Box subscription (Shopify Subscriptions app)** — the monthly
   mystery box is just a product with a subscription selling plan:
   1. Install **Shopify Subscriptions** from the Shopify App Store (free).
   2. Create a product called e.g. **"Surprise Box of the Month"** (you don't
      have to reveal what's inside — that's the point). Price it *below* the
      typical retail value of the gadget you'll send.
   3. Create a **subscription plan** on it — deliver every 1 month, and
      optionally 3- or 12-month prepaid options with a "save" discount.
   That's it — no theme code changes. The product page then shows a
   **"One-time purchase" vs. subscription** picker, updates the price (and shows
   any "save" discount) when a plan is selected, marks subscription products with
   a 🔁 badge on cards, passes the chosen `selling_plan` to the cart, and the
   cart/drawer display the delivery schedule. Subscription-only products
   (`requires_selling_plan`) automatically hide the one-time option — handy for
   the Surprise Box.
4. **Contact form** — the homepage contact form uses Shopify's built-in contact
   form, so submissions email the store's contact email
   (Settings → Store details). No extra service required.
5. **Branding** — Customize → Theme settings:
   - Upload a **logo** (otherwise the shop name shows with a 🧰 mark)
   - Set **accent (teal)** and **highlight (gold)** colors
   - Choose **cart drawer** vs. cart page

## Customizing content

Almost everything is editable in the theme editor as section/block settings:
hero text & buttons, the four "How it works" steps, the Surprise Box plan cards,
the "Why Gadgetron" benefits, the "Shop by category" list, and FAQ items. Colors
live in **Theme settings** and in the CSS variables at the top of
`assets/theme.css`.

## Notes

- Online Store 2.0 theme; works on any current Shopify plan.
- The product page supports multiple images, variants, quantity steppers, and
  subscription selling plans, with an AJAX slide-out cart drawer.
- A `frontpage` collection with at least one product makes the homepage
  "Featured" row populate; until then, friendly placeholder cards show.
