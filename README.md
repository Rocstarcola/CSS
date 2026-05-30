# Treasure Trove 3D

A website for a 3D-printing business that supplies other businesses with custom
3D-printed **treasure boxes** filled with toy prizes for kids — plus an optional
**subscription** for periodic prize refills.

## What's here

| File | Purpose |
| --- | --- |
| `index.html` | The full single-page site (hero, how-it-works, boxes, plans, B2B section, FAQ, contact). |
| `styles.css` | All styling — playful treasure theme, fully responsive. |
| `script.js` | Mobile menu, contact-form validation, scroll reveal. |

No build step or dependencies. It's plain HTML/CSS/JS.

## Run it locally

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Customize

- **Business name / logo** — search for `Treasure Trove 3D` and the `🧰` emoji in
  `index.html` and swap in the real name/logo.
- **Box names, plans, prices** — edit the "The Boxes" and "Plans & Refills"
  sections in `index.html`. Prices currently say "get a quote"; add real numbers
  when ready.
- **Contact form** — `script.js` currently shows a success message only. To
  actually receive submissions, point the form at a service like
  [Formspree](https://formspree.io), [Netlify Forms](https://docs.netlify.com/forms/setup/),
  or your own email API (see the `TODO` in `script.js`).
- **Colors** — tweak the CSS variables at the top of `styles.css`.

## Deploy

This is a static site, so it works on any static host:
GitHub Pages, Netlify, Vercel, or Cloudflare Pages. For GitHub Pages, enable
Pages on this branch and point it at the root.
