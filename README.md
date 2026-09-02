# OTEVŘU

Plain static HTML — same layout as [rafting_oravec](https://github.com/mar-ha-90/rafting_oravec).

**On GitHub:** `index.html`, `styles.css`, `main.js`, `form.js`, `api/`, `img/`, … at repo root.

**Local only (gitignored):** `build/`, `export/`, `HANDOVER.md`

## Preview (customer)

Cloudflare Pages — static files from repo root, no build step:

**https://otevru-cz.pages.dev**

Production: **https://www.otevru.cz**

## FTP

```bash
node build/export.mjs
```

Upload contents of `export/`.

## Cloudflare Pages

Framework: None · Build: empty · Root: `/`
