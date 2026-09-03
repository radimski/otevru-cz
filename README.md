# OTEVŘU

Plain static HTML — same layout as [rafting_oravec](https://github.com/mar-ha-90/rafting_oravec).

**On GitHub:** `index.html`, `styles.css`, `main.js`, `form.js`, `api/`, `img/`, … at repo root.

**Local only (gitignored):** `build/`, `export/`, `HANDOVER.md`

## Preview (customer)

Cloudflare Pages — static files from repo root, no build step:

**https://otevru-cz.pages.dev**

Production: **https://www.otevru.cz** (Aruba — not updated by git push)

securityheaders.com scans production. Headers live in `.htaccess`, `web.config`, `index.php`, and Cloudflare `_headers` / `functions/_middleware.js`. They only appear on www after FTP upload of `export/`.

## Cloudflare Pages

Framework: None · Build: empty · Root: `/`
