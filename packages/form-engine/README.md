# @websites/form-engine

Self-hosted form back end. Vendored from
[mar-ha-90/web_form](https://github.com/mar-ha-90/web_form) and adapted for
Next.js.

## What is vendored unchanged

| File here | Upstream |
| --- | --- |
| `src/core.mjs` | `site/functions/_core.mjs` |
| `sites/*/public/form.js` | `site/form.js` |

Both are used as-is. `core.mjs` is pure (no I/O), and `form.js` is a dependency-free
browser client, so neither needed changes.

## What is new

`src/handler.ts` is a third adapter alongside the upstream PHP endpoint and
Cloudflare Pages Function. It speaks the same wire protocol and supplies the I/O
that `core.mjs` leaves to the caller:

- **nonce replay protection** — single-use tokens
- **rate limiting** — sliding hour and day windows
- **storage** — appends to `<dataDir>/<form>/<YYYY-MM>.jsonl`
- **mail** — writes a `.eml` into `<dataDir>/outbox/` (no SMTP dependency)

Quarantined submissions are stored with `spam: true`, not mailed, and reported to
the browser as success — the upstream behaviour.

## Usage

```ts
// src/app/api/form/route.ts
import { createFormRoute } from "@websites/form-engine";
import formsJson from "@/config/forms.json";

export const { GET, POST } = createFormRoute({ formsJson, siteId: "otevru" });
export const runtime = "nodejs";
```

Point the markup at it with `<body data-form-endpoint="/api/form">`.

## Environment

| Variable | Default | Purpose |
| --- | --- | --- |
| `FORM_SECRET` | dev fallback | HMAC key for submission tokens |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | unset | Cloudflare Turnstile site key (public) |
| `TURNSTILE_SECRET_KEY` | unset | Cloudflare Turnstile secret for server verification |
| `FORM_ALLOWED_ORIGINS` | unset (any) | Comma-separated allowed hostnames |
| `FORM_NONCE_TTL` | `7200` | Token lifetime in seconds |
| `FORM_DATA_DIR` | `.form-data` | Where submissions and the outbox are written |
| `FORM_DEBUG` | unset | `1` adds error detail to responses |

Set a real `FORM_SECRET` in production. The dev fallback is shared and logs a
warning.

Set both Turnstile keys before going live — the widget renders only when
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set, and the server rejects submissions
without a valid token once `TURNSTILE_SECRET_KEY` is configured.

## Note on serverless

Storage writes to the local filesystem, which is ephemeral on Vercel and similar
platforms. For a persistent deployment either run these apps on a VM or
container, swap the storage hook for a database, or deploy the upstream
`api/form.php` on shared hosting and set `data-form-endpoint="/api/form.php"`.
