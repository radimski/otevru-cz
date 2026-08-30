# Web Forge — rulebook

Rules for agents and humans working on **any site or page** in this repository — current projects (`otevru`, `kinles`, `kolmokafe`) and **future ones added later**.

Each site is a standalone Next.js app with vendored `packages/form-engine` and `packages/legal-cz` unless documented otherwise.

**Site-facing copy** (headlines, forms, legal pages) stays in **Czech** for these `.cz` clients. **This rulebook and all agent docs** are in **English**.

---

## 0. Scope — current and future work

These rules apply when you:

- Add a **new top-level site** (new folder + GitHub repo + domain)
- Add a **new route/page** to an existing site (e.g. `/akce`, `/blog`, landing pages)
- Add or change a **contact form**, embed, or third-party script
- Prepare a **production deploy** or DNS cutover

When in doubt, follow the same Turnstile, security-header, and audit workflow as existing sites.

---

## 1. Cloudflare Turnstile (required)

Every **contact / inquiry form** must use Turnstile. Do not ship a new form or remove Turnstile without explicit user approval.

### Code contract (every site with forms)

| Layer | Location | Requirement |
| --- | --- | --- |
| Server verify | `packages/form-engine/src/handler.ts` | `verifyTurnstile()` on every POST; reject in **production** if `TURNSTILE_SECRET_KEY` is missing |
| Browser widget | `public/form.js` | Load widget when `data-turnstile-site-key` is on `<body>`; submit `cf-turnstile-response` |
| Form markup | Any form component | `<div data-turnstile />` before submit; `data-msg-captcha` on `<form>` |
| Layout | `src/app/layout.tsx` | `data-turnstile-site-key={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}` |
| CSP | `src/lib/security-headers.ts` | Allow `https://challenges.cloudflare.com` in `script-src` and `connect-src` |
| Legal | `packages/legal-cz/src/content.ts` | Mention Turnstile in privacy + cookie copy |
| Env docs | `.env.example`, `DEPLOY.md` | Document production keys |

### Environment variables

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | build + runtime | Public site key → widget |
| `TURNSTILE_SECRET_KEY` | server only | Secret → Cloudflare `siteverify` |

- **Local dev:** committed `.env.development` uses Cloudflare [always-pass test keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/).
- **Production:** real keys from the Cloudflare Turnstile dashboard — **never** commit production secrets.
- **Both keys required in production.** Widget without secret (or vice versa) is a launch blocker.

### Turnstile checklist (before merge / deploy)

- [ ] Widget renders on every page that contains a `[data-form]` form
- [ ] Submit works with test keys locally
- [ ] Server returns `403 captcha` when token is missing (with production secret set)
- [ ] `.env.example` documents production vars
- [ ] CSP still allows Turnstile after header or third-party changes

---

## 2. Pre-launch audit (required)

Run **before every production deploy** and **after DNS cutover**.  
Use the **live production URL** when available; otherwise staging / tunnel and note that in the report.

### Step 1 — view-source

Save HTML for **every launch-critical path** (homepage, contact, and any new page you ship):

```bash
# Default: / and /kontakt
./scripts/launch-audit.sh https://www.example.cz

# Explicit paths
./scripts/launch-audit.sh https://www.example.cz / /kontakt /menu

# From site manifest (recommended for ongoing use)
./scripts/launch-audit.sh https://www.example.cz --file kolmokafe/audit-pages.txt
```

Each site maintains `audit-pages.txt` — **add new routes there when you add launch-critical pages**.

Review in source:

- `lang="cs"`, viewport meta, canonical / Open Graph tags
- No `http://` asset URLs (mixed content)
- Turnstile: `data-turnstile-site-key` on `<body>`; **no test key** (`1x00000000000000000000AA`) in production HTML
- Valid JSON-LD; `aggregateRating` only if backed by real reviews
- Legal links in footer (`/provozovatel`, `/ochrana-osobnich-udaju`, `/cookies`)

### Step 2 — multi-perspective review

Review **each saved HTML file** (and the diff) from three angles — separate LLM passes or explicit report sections:

1. **Security** — headers, CSP, form abuse, exposed secrets, third-party scripts, Turnstile on forms
2. **Performance** — payload size, render-blocking JS, images (WebP/AVIF), LCP candidates
3. **SEO / accessibility** — meta, headings, structured data, alt text, mobile nav, contrast

Document findings as: `OK` / `WARN` / `BLOCK` with file references.

### Step 3 — external scanners

Run against the **live base URL** (replace domain):

| Tool | URL |
| --- | --- |
| PageSpeed Insights | https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwww.example.cz |
| Security Headers | https://securityheaders.com/?q=https%3A%2F%2Fwww.example.cz&followRedirects=on |
| Mozilla Observatory | https://observatory.mozilla.org/analyze/www.example.cz |
| SSL Labs | https://www.ssllabs.com/ssltest/analyze.html?d=www.example.cz |

**Targets after deploy on Cloudflare Pages:**

| Check | Target |
| --- | --- |
| Security Headers | **A** or **A+** |
| SSL Labs | **A** or better |
| Observatory | **B+** or better (CSP may cap score — document why) |
| PageSpeed mobile | **≥ 85** performance (aspirational; fix regressions) |

Record scores + date in `docs/audit/` (script output folder or update `docs/audit/SUMMARY.md`).

### Launch blockers (do not go live)

- Production HTML contains Turnstile **test** site key
- `TURNSTILE_SECRET_KEY` or `FORM_SECRET` not set in production env
- Security Headers grade **F**
- TLS broken or DNS still pointing at old host
- Any form submits without Turnstile token when secret is configured
- New page with a form but no `<div data-turnstile />`

---

## 3. Security headers (required)

Every site ships `src/lib/security-headers.ts` and applies it in `next.config.ts`:

- `poweredByHeader: false`
- CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, COOP
- HSTS + `upgrade-insecure-requests` in **production only**

Any new third-party script (maps, analytics, Facebook, embeds) **must** update CSP in that site’s `security-headers.ts` before merge.

---

## 4. Forms and secrets

| Variable | Required in production |
| --- | --- |
| `FORM_SECRET` | yes (≥ 16 chars) |
| `FORM_ALLOWED_ORIGINS` | yes (live hostname) |
| `TURNSTILE_SECRET_KEY` | yes |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | yes |

Wire SMTP / mail delivery before treating forms as production-ready.

---

## 5. New site checklist

When adding a **new top-level project** (copy pattern from `otevru/`):

1. Next.js app + vendored `packages/form-engine` and `packages/legal-cz`
2. `src/lib/security-headers.ts` + `next.config.ts` headers (copy from an existing site)
3. `.env.development` (Turnstile test keys), `.env.example`, `DEPLOY.md`, `RULEBOOK.md`, `audit-pages.txt`
4. Layout: `data-turnstile-site-key`, `data-form-endpoint="/api/form"`, `form.js`, `FormRouteBinder`
5. Register in root `README.md` and §6 below
6. Run full launch audit before first production deploy

See [`docs/NEW-SITE.md`](./docs/NEW-SITE.md) for step-by-step details.

---

## 6. New page checklist

When adding a **new route** to an existing site:

1. **No form** — still run view-source on the new URL; update CSP if you add embeds or external scripts
2. **With form** — Turnstile mount + messages + `forms.json` entry; audit the new path
3. Add the path to `<site>/audit-pages.txt`
4. Run `./scripts/launch-audit.sh <url> --file <site>/audit-pages.txt`
5. Fix any `BLOCK` findings before merge

---

## 7. Agent workflow summary

When finishing work on any site or page:

1. Turnstile checklist (§1) if forms touched
2. `npm run build` in the site folder
3. `./scripts/launch-audit.sh` for all paths in `audit-pages.txt`
4. Fix **BLOCK** items; keep agent docs in **English**
5. Push to the site’s GitHub repo
6. Remind the user if DNS or Cloudflare env vars are still needed

---

## 8. Repos and deploy (current)

| Site | GitHub | Domain |
| --- | --- | --- |
| OTEVŘU | `radimski/otevru-cz` | www.otevru.cz |
| KINLES | `radimski/kinles-cz` | www.kinles.cz |
| Kolmo | `radimski/kolmo-kafe` | www.kolmokafe.cz |

Add new rows here when new sites are created. See per-site `DEPLOY.md` for Cloudflare Pages steps.
