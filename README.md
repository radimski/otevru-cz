# otevru.cz

Website for **Patrik Panenka** — zámečnická pohotovost & speciální zámečnictví (Frýdek-Místek, Sviadnov).

**Local path:** `/workspace/otevru/` · **GitHub:** [radimski/otevru-cz](https://github.com/radimski/otevru-cz) · **Preview:** [otevru-cz.radim-pajurek.workers.dev](https://otevru-cz.radim-pajurek.workers.dev/)

See [../SITES.md](../SITES.md) for all paths and URLs across sites.

## Run locally

```bash
npm install
npm run dev      # http://localhost:43124
npm run build
npm run start
```

## Folder layout

Every site uses **two folders in one repo**:

| Folder | Role |
| --- | --- |
| **Project root** (`src/`, `packages/`, …) | Source code, dev server |
| **`ftp/`** | Production-ready — drag contents to hosting |

## FTP deploy (Aruba / shared hosting)

```bash
npm run build:ftp
# → otevru-cz/ftp/index.html, kontakt.html, api/form.php, …
```

Upload **all contents** of `ftp/` to web root (not the `ftp` folder itself). See `ftp/DEPLOY.txt` for SMTP and `api/config.php` setup.

## Project structure

```
src/              Next.js app (App Router)
public/           Logo and static assets
ftp/              Production output (generated — npm run build:ftp)
packages/
  legal-cz/       Czech GDPR, cookies, operator content
  form-engine/    Contact form handler + browser client
docs/             Client brief and legal checklist
```

## Before launch

- Confirm operator data in `src/config/operator.ts`
- **Cloudflare:** set `FORM_SECRET`, Turnstile keys, SMTP — see `DEPLOY.md` §B
- **FTP:** `NEXT_PUBLIC_TURNSTILE_SITE_KEY=... npm run build:ftp`, then `api/config.php` with secret + `turnstileSecretKey` + SMTP — see `DEPLOY.md` §A
- Have legal texts reviewed by a lawyer
- Run `./scripts/launch-audit.sh` before DNS cutover (Rulebook §2)
