# Pour Vida Mobile Bar Services website

Static site (HTML/CSS/JS, no build step) hosted on GitHub Pages from `main` / root.
Live: https://pourvidamobilebarservices.com/ (custom domain, bought on Spaceship; the `CNAME` file tells GitHub Pages to serve it)

## Swap in before launch

| What | Where |
|---|---|
| Photos | No event photos yet, so the hero arch shows the illustrated logo, and the gallery section is removed. When real photos exist, add a gallery back between Signature Sips and How It Works (the `.photo` placeholder styles are still in `css/styles.css`). |
| Social share image | Add `images/og-image.jpg` (1200x630), then add `<meta property="og:image" content="https://pourvidamobilebarservices.com/images/og-image.jpg">` in the `<head>` and change `twitter:card` to `summary_large_image`. |
| Email & phone | Inquire section, FAQ, JSON-LD in `<head>`, `llms.txt`, and the email address in `js/main.js` |
| Inquiry form | Sends through Web3Forms (access key in the form in `index.html`). Change the receiving inbox in the Web3Forms dashboard, not in the code. |
| Service-area cities | FAQ, hero line, About facts, JSON-LD `areaServed` in `<head>`, and `llms.txt` |
| Drinks, packages, booking/deposit wording | Signature Sips, Packages, FAQ (and the FAQ JSON-LD in `<head>` so search results match) |

## Custom domain

The site is served at pourvidamobilebarservices.com. DNS lives at Spaceship: four `A` records on `@` (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153) and a `CNAME` on `www` pointing to `jadenlazo2020.github.io`. GitHub Pages reads the domain from the `CNAME` file in this repo; keep that file, or the site falls back to the github.io address. If the domain ever changes, update `CNAME`, the canonical link, `og:url`, the JSON-LD `@id`/`url`/`logo`, `robots.txt`, `sitemap.xml`, `llms.txt`, and the allowed domain in the Web3Forms dashboard.

## Other files

- `robots.txt`, `sitemap.xml`: search engine crawling. AI crawlers are explicitly allowed.
- `llms.txt`: plain-text summary for AI assistants.
- `404.html`: branded not-found page.
- `.nojekyll`: tells GitHub Pages to serve files as-is.
