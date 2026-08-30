# Deploying OTEVŘU to Cloudflare Pages

**Repo:** `radimski/otevru-cz` · **Domain:** www.otevru.cz

## 1. Create Pages project

1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Repository: `radimski/otevru-cz`, branch `main`
3. Framework: **Next.js** (auto-detect)

## 2. Production environment variables

```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<Turnstile site key>
TURNSTILE_SECRET_KEY=<Turnstile secret>
FORM_SECRET=<random 16+ chars>
FORM_ALLOWED_ORIGINS=www.otevru.cz
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=<smtp user>
SMTP_PASS=<smtp password>
SMTP_FROM=OTEVŘU web <patrik@otevru.cz>
```

Do not use test keys from `.env.development` in Production.

## 3. Custom domain

Add `www.otevru.cz` and `otevru.cz`. Remove old Aruba DNS/hosting once verified.

## 4. Post-deploy checks

- https://pagespeed.web.dev/?url=https://www.otevru.cz
- https://securityheaders.com/?q=https://www.otevru.cz
- https://developer.mozilla.org/en-US/observatory/analyze?host=www.otevru.cz
- https://www.ssllabs.com/ssltest/analyze.html?d=www.otevru.cz

## 5. Forms

Set SMTP variables (see `.env.example`) so contact forms deliver email in production. Without SMTP, submissions are stored locally only.
