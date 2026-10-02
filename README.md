# Pour Vida Mobile Bar Services website

Static site (HTML/CSS/JS, no build step) hosted on GitHub Pages from `main` / root.
Live: https://jadenlazo2020.github.io/pour-vida-mobile/

## Swap in before launch

| What | Where |
|---|---|
| Photos | No event photos yet, so the hero arch shows the illustrated logo, and the gallery section is removed. When real photos exist, add a gallery back between Signature Sips and How It Works (the `.photo` placeholder styles are still in `css/styles.css`). |
| Social share image | Add `images/og-image.jpg` (1200x630), then add `<meta property="og:image" content="https://jadenlazo2020.github.io/pour-vida-mobile/images/og-image.jpg">` in the `<head>` and change `twitter:card` to `summary_large_image`. |
| Email & phone | Inquire section, FAQ, JSON-LD in `<head>`, `llms.txt`, and the email address in `js/main.js` |
| Inquiry form | Until `YOUR_FORM_ID` in `index.html` is replaced with a Formspree form ID, Send Inquiry opens the visitor's email app with the details filled in, addressed to the client. |
| Service-area cities | FAQ, hero line, About facts, JSON-LD `areaServed` in `<head>`, and `llms.txt` |
| Drinks, packages, booking/deposit wording | Signature Sips, Packages, FAQ (and the FAQ JSON-LD in `<head>` so search results match) |

## If the client buys a domain

Update the URL in: `<link rel="canonical">`, `og:url`, the JSON-LD `url`/`@id`/`logo`, `robots.txt`, `sitemap.xml`, `llms.txt`, and the home link in `404.html` (change `/pour-vida-mobile/` to `/`). Then add the domain under Settings > Pages > Custom domain.

## Other files

- `robots.txt`, `sitemap.xml`: search engine crawling. AI crawlers are explicitly allowed.
- `llms.txt`: plain-text summary for AI assistants.
- `404.html`: branded not-found page.
- `.nojekyll`: tells GitHub Pages to serve files as-is.
