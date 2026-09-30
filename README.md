# Pour Vida Mobile Bar Services website

Static site (HTML/CSS/JS, no build step) hosted on GitHub Pages from `main` / root.
Live: https://jadenlazo2020.github.io/pour-vida-mobile/

## Swap in before launch

| What | Where |
|---|---|
| Photos | Put in `images/` with these exact names: `hero-bar.jpg`, `about-drinks.jpg`, `gallery-1.jpg` to `gallery-5.jpg`. Until a file exists, its slot shows a beige placeholder with the filename. Update the `alt` text in `index.html` to describe the real photo. |
| Social share image | Add `images/og-image.jpg` (1200x630), then add `<meta property="og:image" content="https://jadenlazo2020.github.io/pour-vida-mobile/images/og-image.jpg">` in the `<head>` and change `twitter:card` to `summary_large_image`. |
| Email & phone | Inquire section of `index.html` (currently placeholders) |
| Inquiry form | Create a form at formspree.io with the client's email, replace `YOUR_FORM_ID` in `index.html` |
| Service-area cities | FAQ, hero line ("from Merced to Visalia"), JSON-LD `areaServed` in `<head>`, and `llms.txt` |
| Drinks, packages, booking/deposit wording | Signature Sips, Packages, FAQ (and the FAQ JSON-LD in `<head>` so search results match) |

## If the client buys a domain

Update the URL in: `<link rel="canonical">`, `og:url`, the JSON-LD `url`/`@id`/`logo`, `robots.txt`, `sitemap.xml`, `llms.txt`, and the home link in `404.html` (change `/pour-vida-mobile/` to `/`). Then add the domain under Settings > Pages > Custom domain.

## Other files

- `robots.txt`, `sitemap.xml`: search engine crawling. AI crawlers are explicitly allowed.
- `llms.txt`: plain-text summary for AI assistants.
- `404.html`: branded not-found page.
- `.nojekyll`: tells GitHub Pages to serve files as-is.
