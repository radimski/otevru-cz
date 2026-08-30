# Česká legislativa pro weby – checklist

Tento projekt je nastaven pro **Českou republiku**, ne pro Slovensko. Pokud máte pravidla nebo šablony ze slovenského prostředí, nepřenášejte je 1:1 — jiné jsou zákony, dozorové úřady i odkazy na registry.

| Oblast | Česká republika | Slovensko (nepoužívat zde) |
| --- | --- | --- |
| Ochrana údajů | zákon č. 110/2019 Sb., ÚOOÚ | zákon č. 18/2018 Z. z., ÚOOÚ SR |
| Cookies / e-komunikace | zákon č. 127/2005 Sb. | zákon č. 351/2011 Z. z. |
| Spotřebitelské spory | ČOI | SOI |
| Citace zákonů | Sb. (Sbírka zákonů) | Z. z. (Zbierka zákonov) |

Před ostrým spuštěním doplňte skutečné údaje provozovatele v `src/config/site.ts` a nechte texty zkontrolovat právníkem.

## Co je již připraveno

| Požadavek | Implementace |
| --- | --- |
| Identifikace provozovatele (§ 435 OZ) | `/provozovatel`, patička, `src/config/site.ts` |
| Zásady ochrany osobních údajů (GDPR, zákon č. 110/2019 Sb.) | `/ochrana-osobnich-udaju` |
| Cookie lišta s opt-in souhlasem | `src/components/CookieConsent.tsx` |
| Zásady cookies | `/cookies` |
| Jazyk webu | `lang="cs"` v layoutu |

## Povinné údaje provozovatele (§ 435 OZ, § 13a živnostenského zákona)

Upravte v `src/config/site.ts`:

- název / jméno podnikatele
- sídlo
- IČO
- zápis v obchodním nebo živnostenském rejstříku
- kontaktní e-mail (telefon doporučen)
- DIČ, pokud jste plátce DPH

## GDPR a cookies

- Analytické a marketingové cookies se aktivují až po souhlasu.
- Lišta nabízí **Odmítnout vše**, **Nastavení** a **Přijmout vše** se stejnou viditelností.
- Souhlas se ukládá do `localStorage` a lze ho změnit.
- Při napojení Google Analytics / Ads nastavte také **Consent Mode v2**.

## E-shop – doplňte před prodejem

Pokud budete prodávat zboží nebo služby spotřebitelům, přidejte:

- obchodní podmínky
- informace o 14denním odstoupení od smlouvy
- reklamační řád
- informaci o mimosoudním řešení sporů u [ČOI](https://www.coi.cz)
- u slev: nejnižší cenu za posledních 30 dní
- u recenzí: jak ověřujete, že je psali skuteční zákazníci
- pro B2C e-shopy od 28. 6. 2025: přístupnost dle zákona č. 424/2023 Sb. (EAA)

**Poznámka:** Odkaz na evropskou platformu ODR byl zrušen k 20. 7. 2025 – na web jej nepřidávejte.

## Formuláře a newsletter

- U každého formuláře s osobními údaji přidejte informaci o zpracování a odkaz na zásady ochrany osobních údajů.
- U newsletteru vyžadujte samostatný souhlas se zasíláním obchodních sdělení a možnost odhlášení.

## Právní upozornění

Tyto texty jsou šablona pro běžné firemní weby. Nejsou individuální právní poradenství. Pro e-shop, zpracování citlivých údajů nebo specifické obory nechte dokumenty zkontrolovat advokátem.
