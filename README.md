# otevru.cz

Website for **Patrik Panenka** — zámečnická pohotovost & speciální zámečnictví (Frýdek-Místek, Sviadnov).

## Run locally

```bash
npm install
npm run dev      # http://localhost:43124
npm run build
npm run start
```

## Structure

```
src/              Next.js app (App Router)
public/           Logo and static assets
packages/
  legal-cz/       Czech GDPR, cookies, operator content
  form-engine/    Contact form handler + browser client
docs/             Client brief and legal checklist
```

## Before launch

- Confirm operator data in `src/config/operator.ts`
- Set `FORM_SECRET` and SMTP for production forms
- Have legal texts reviewed by a lawyer
- Point `otevru.cz` at this deployment
