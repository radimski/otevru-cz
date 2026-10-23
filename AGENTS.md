# Agent entry point — otevru.cz (OTEVŘU, zámečnická pohotovost)

Read before any work in this repo:

1. `../redeye/docs/rulebook.md` — canonical technical rulebook for every REDEYE site (folder structure, build pipeline, forms, security headers, cookie consent, pre-launch checklist). Rules marked **[HARD]** are not optional. Folder rules are in `../redeye/docs/struktura.md`.
2. `../_build_tools/` — the generator, photo/font pipelines, header emitter, export step, analysis scripts. Start from here, not a blank folder.
3. `../redeye/docs/redeye-playbook.md` — REDEYE's business layer: positioning, pricing tiers, portfolio rules, brand story.
4. Before calling this site launch-ready: run it against `../redeye/audity/redeye-launch-checklist.html` (sections A–K), on mobile (375px) and desktop (1440px+) — or ask Claude to run the `redeye-site-launch-audit` skill.

## This project's deviations from the standard layout

Flat layout: `index.html`, `build/`, `export/`, `api/` all live directly at repo root, not the `site/`+`build/` split the rulebook names as its preferred default. This is actually the pattern in most of the fleet (otevru-cz, civil-cz, kinles-cz, kolmo-kafe all do it this way) — only vodotop-fm follows the documented split. Worth reconciling in the rulebook itself rather than treating each repo as its own one-off exception; flagged here, not fixed.

## Design a texty

- Při jakékoli práci na vzhledu (layout, barvy, typografie, obrázky, animace) použij skill `redeye-webdesign`.
- Při jakékoli práci na textech (nadpisy, služby, CTA, SEO stránky, nabídky, audity) použij skill `redeye-copywriting`.
