# Web Forge — rulebook

Rules for agents and humans working on **otevru**, **kinles**, or **kolmokafe**.  
Every site is a standalone Next.js app with vendored `packages/form-engine` and `packages/legal-cz`.

---

## 1. Cloudflare Turnstile (required)

Contact forms **must** use Turnstile on every site. Do not ship a new form or remove Turnstile without explicit user approval.

### Code contract (all three sites)

| Layer | Location | Requirement |
| --- | --- | --- |
| Server verify | `packages/form-engine/src/handler.ts` | `verifyTurnstile()` on every POST; reject in **production** if `TURNSTILE_SECRET_KEY` missing |
| Browser widget | `public/form.js` | Load widget when `data-turnstile-site-key` on `<body>`; submit `cf-turnstile-response` |
| Form markup | `*ContactForm*` / `InquiryForm` | `<div data-turnstile />` before submit; `data-msg-captcha` on `<form>` |
| Layout | `src/app/layout.tsx` | `data-turnstile-site-key={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}` |
| CSP | `src/lib/security-headers.ts` | Allow `https://challenges.cloudflare.com` in `script-src` and `connect-src` |
| Legal | `packages/legal-cz/src/content.ts` | Mention Turnstile in privacy + cookie copy |
| Env docs | `.env.example`, `DEPLOY.md` | Document production keys |

### Environment variables

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | build + runtime | Public site key → widget |
| `TURNSTILE_SECRET_KEY` | server only | Secret → `siteverify` |

- **Local dev:** committed `.env.development` uses Cloudflare [always-pass test keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/).
- **Production:** real keys from Cloudflare Turnstile dashboard — **never** commit production secrets.
- **Both keys required in production.** Widget without secret (or vice versa) is a launch blocker.

### Turnstile checklist (before merge / deploy)

- [ ] Widget renders on `/kontakt` (or homepage form for kinles)
- [ ] Submit works with test keys locally
- [ ] Server returns `403 captcha` when token missing (production secret set)
- [ ] `.env.example` documents production vars
- [ ] CSP still allows Turnstile after header changes

---

## 2. Pre-launch audit (required)

Run this **before every production deploy** and **after DNS cutover**.  
Use the **live production URL** when available; otherwise staging / tunnel with a note in the report.

### Step 1 — view-source

Save HTML for homepage **and** contact page:

```bash
./scripts/launch-audit.sh https://www.example.cz
# or manually: curl -sL URL > view-source.html
```

Review in source:

- `lang="cs"`, viewport meta, canonical / OG tags
- No `http://` asset URLs (mixed content)
- Turnstile: `data-turnstile-site-key` present; **no test key** (`1x00000000000000000000AA`) in production HTML
- JSON-LD valid; `aggregateRating` only if backed by real reviews
- Legal links in footer (`/provozovatel`, `/ochrana-osobnich-udaju`, `/cookies`)

### Step 2 — multi-perspective review

Review the saved HTML (and diff) from **three angles** — use separate LLM passes or explicit sections in the report:

1. **Security** — headers, CSP, form abuse, exposed secrets, third-party scripts, Turnstile wired
2. **Performance** — payload size, render-blocking JS, images (WebP/AVIF), LCP candidates
3. **SEO / accessibility** — meta, headings, structured data, alt text, mobile nav, contrast

Document findings as: `OK` / `WARN` / `BLOCK` with file references.

### Step 3 — external scanners

Open each URL (replace domain):

| Tool | URL |
| --- | --- |
| PageSpeed Insights | https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwww.example.cz |
| Security Headers | https://securityheaders.com/?q=https%3A%2F%2Fwww.example.cz&followRedirects=on |
| Mozilla Observatory | https://observatory.mozilla.org/analyze/www.example.cz |
| SSL Labs | https://www.ssllabs.com/ssltest/analyze.html?d=www.example.cz |

**Target after deploy on Cloudflare Pages:**

| Check | Target |
| --- | --- |
| Security Headers | **A** or **A+** (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) |
| SSL Labs | **A** or better |
| Observatory | **B+** or better (CSP may cap score — document why) |
| PageSpeed mobile | **≥ 85** performance (aspirational; fix regressions) |

Record scores + date in `docs/audit/YYYY-MM-DD-<site>.md` or the script output folder.

### Launch blockers (do not go live)

- Production HTML contains Turnstile **test** site key
- `TURNSTILE_SECRET_KEY` or `FORM_SECRET` not set in production env
- Security Headers grade **F**
- TLS broken or DNS still pointing at old host (e.g. Aruba placeholder)
- Contact form submits without Turnstile token when secret is configured

---

## 3. Security headers (required)

Each site ships `src/lib/security-headers.ts` and applies it in `next.config.ts`:

- `poweredByHeader: false`
- CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, COOP
- HSTS + `upgrade-insecure-requests` in **production only**

Any change to third-party scripts (maps, analytics, FB) **must** update CSP in all three copies if shared pattern changes.

---

## 4. Forms & secrets

| Variable | Required prod |
| --- | --- |
| `FORM_SECRET` | yes (≥ 16 chars) |
| `FORM_ALLOWED_ORIGINS` | yes (live hostname) |
| `TURNSTILE_SECRET_KEY` | yes |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | yes |

SMTP / mail delivery must be wired before treating forms as production-ready.

---

## 5. Agent workflow summary

When finishing site work:

1. Confirm Turnstile checklist (§1)
2. Run `npm run build` in the site folder
3. Run `./scripts/launch-audit.sh <url>` when a URL is reachable
4. Fix **BLOCK** items; commit rulebook-compliant changes
5. Sync to GitHub repo (`radimski/otevru-cz`, `kinles-cz`, `kolmo-kafe`)
6. Remind user if DNS / Cloudflare env vars still needed

---

## 6. Repos & deploy

| Site | GitHub | Domain |
| --- | --- | --- |
| OTEVŘU | `radimski/otevru-cz` | www.otevru.cz |
| KINLES | `radimski/kinles-cz` | www.kinles.cz |
| Kolmo | `radimski/kolmo-kafe` | www.kolmokafe.cz |

See per-site `DEPLOY.md` for Cloudflare Pages steps.
