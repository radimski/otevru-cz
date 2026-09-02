# Deploying OTEVŘU

**Repo:** `radimski/otevru-cz` · **Domain:** www.otevru.cz

Two deploy paths — see [RULEBOOK.md](./RULEBOOK.md) §9.

---

## A. FTP / shared hosting (Aruba)

### Build

```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<production site key> npm run build:ftp
# Optional: bake Web Analytics beacon (loads after cookie consent)
NEXT_PUBLIC_CF_BEACON_TOKEN=<token> npm run build:ftp
# → ftp/  (gitignored)
```

Without production Turnstile key, the build uses test keys from `.env.development` for local preview only.

Upload **all contents** of `ftp/` to web root — not the `ftp` folder itself.

### Server setup (`ftp/api/config.php`)

Copy `config.example.php` → `config.php` and set:

| Setting | Required |
| --- | --- |
| `secret` | yes — `php -r "echo bin2hex(random_bytes(32));"` |
| `turnstileSecretKey` | yes — Cloudflare Turnstile secret |
| `mail.smtp.pass` | yes — mailbox password for form delivery |

Ensure PHP 7.4+ and `api/data/` is writable.

### Turnstile (Rulebook §1)

- **Build time:** `NEXT_PUBLIC_TURNSTILE_SITE_KEY` baked into HTML
- **Runtime:** `turnstileSecretKey` in `api/config.php`
- Never ship the test key (`1x00000000000000000000AA`) to production

### Post-deploy

Run `./scripts/launch-audit.sh https://www.otevru.cz` and external scanners (Rulebook §2–3).

---

## B. Cloudflare Workers / Pages

### 1. Create Pages project

1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Repository: `radimski/otevru-cz`, branch `main`
3. Framework: **Next.js** (auto-detect)

### 2. Production environment variables

```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<Turnstile site key>
TURNSTILE_SECRET_KEY=<Turnstile secret>
NEXT_PUBLIC_CF_BEACON_TOKEN=<Web Analytics beacon token, optional>
FORM_SECRET=<random 16+ chars>
FORM_ALLOWED_ORIGINS=www.otevru.cz
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=<smtp user>
SMTP_PASS=<smtp password>
SMTP_FROM=OTEVŘU web <patrik@otevru.cz>
```

Do not use test keys from `.env.development` in Production.

### 3. Custom domain

Add `www.otevru.cz` and `otevru.cz`.

### 4. Post-deploy checks

- https://pagespeed.web.dev/?url=https://www.otevru.cz
- https://securityheaders.com/?q=https://www.otevru.cz
- https://developer.mozilla.org/en-US/observatory/analyze?host=www.otevru.cz
- https://www.ssllabs.com/ssltest/analyze.html?d=www.otevru.cz

### 5. Forms

Set SMTP variables so contact forms deliver email in production.
