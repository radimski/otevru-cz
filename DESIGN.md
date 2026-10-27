# Design – OTEVRU.cz (Patrik Panenka)

Návrhy podle `redeye/docs/navrhy.md`: 4 verze z kombinace šablon z ThemeForestu, `navrhy/v1` … `navrhy/v4`. Bereme jen nápady, žádný kód, obrázky ani texty šablon.

**Pevné pro všechny verze:** barvy polepu dodávek a loga (klient je má na autech), stejné texty a stejný obraz. Verze se liší písmem, rozvržením první obrazovky a tím, která barva převládá. Žádné mřížky stejných dlaždic s ikonami.

| Token | Hodnota | Kde |
|---|---|---|
| limetka | `#acf53d` | logo, polep, hlavní tlačítko Zavolat (text na ní grafitový) |
| grafit | `#282b34` | tmavé plochy, text |
| modrá | `#004c93` | polep, odkazy, plochy s bílým textem |
| bílá | `#ffffff` | světlé plochy |

Obraz: zatím jen animovaný technický řez vložkou (žádné fotky od klienta). `TODO(klient)`: fotky Patrika, auta s polepem a práce.

## Vybrané šablony (ThemeForest)

| Šablona | Demo | Co bereme |
|---|---|---|
| HotLock (axiomthemes) | hotlock.axiomthemes.com | blok „rychlá reakce + velké telefonní číslo“ v barvě značky; pás služeb hned pod úvodem |
| Lockey / Keyman (jegtheme) | templatekit.jegtheme.com/lockey, fse.jegtheme.com/keyman | dělený úvod (tmavý text vlevo, obraz vpravo), barevný pás s fakty přes spodní hranu úvodu, pás „pohotovost“ s telefonem |
| KeyMaster (moxcreative) | point.moxcreative.com/keymaster | časté otázky jako rozbalovací seznam vedle nadpisu |
| Shield (axiomthemes) | shield.axiomthemes.com | obří levostranný nadpis, kulaté otáčející se razítko s textem kolem šipky, velká úvodní věta |
| Smartkeiz (moxcreative) | newkit.moxcreative.com/smartkeiz | dvě krátká fakta přímo v úvodu vedle tlačítka |
| Blocks (Rometheme) | kfkit.rometheme.pro/blocks | sytá modrá plocha úvodu a hlavičky |
| Locksmith (webdevia) | themes.webdevia.com/locksmith-… | prostrkaný verzálkový nápis značky |

Neberem: mřížky karet s ikonami (Blocks, Smartkeiz, KeyMaster), vymyšlená čísla a recenze (Lockey, HotLock), slider.

## Verze

### V1 – Pohotovostní linka (HotLock + Lockey)
Tmavý grafit převládá, limetka jen na volání. Dělený úvod: vlevo nadpis a obří číslo, vpravo řez vložkou. Pod úvodem textový pás služeb oddělený lomítky (ne dlaždice). Limetkový blok „K nouzi jedeme přednostně“ s telefonem vedle kroků co dělat. Písmo Barlow Condensed + Barlow.

### V2 – Noviny (Shield + KeyMaster)
Bílá převládá, grafitový text, modré odkazy, limetka jako zvýrazňovač pod slovy. Obří levostranný nadpis přes celou šířku, otáčející se razítko „Zavolejte · Přijedeme · Otevřeme“ kolem šipky dolů. Služby jako číslovaný seznam, časté otázky vedle nadpisu. Písmo Manrope.

### V3 – Polep (Lockey + Locksmith webdevia)
Limetka převládá jako na autě: limetkový úvod s grafitovým písmem, šikmé pruhy polepu jako dělicí prvek, modrý pás s fakty přes spodní hranu úvodu (Po–Ne 7–18 · Sviadnov, Frýdek-Místek, Ostrava · byty, domy i auta). Písmo Archivo (tučné, široké jako nápis na dodávce).

### V4 – Modrý výkres (Blocks + Smartkeiz)
Modrá převládá: modrý úvod s velkým řezem vložkou uprostřed, dvě fakta vedle tlačítka. Technické popisky v neproporcionálním písmu, bílé sekce se světle šedými linkami. Písmo IBM Plex Sans + IBM Plex Mono.

## Pohyb (všechny verze)
Krátký: odkrytí nadpisu po řádcích, řádky služeb jednou najedou, animace vložky běží sama (main.js). Žádné dlouhé zastavené sekce (nejvýš jedna výška obrazovky). `prefers-reduced-motion` vypne vše, bez JS je vše vidět.

## Kontroly
Výsledky kontrol každé verze: `redeye/klienti/otevru-cz/todo.md`.
