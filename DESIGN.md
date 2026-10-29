# Design – OTEVRU.cz (Patrik Panenka)

Návrhy podle `redeye/docs/navrhy.md`: 4 verze z kombinace šablon z ThemeForestu, `navrhy/v1` … `navrhy/v4`, rozcestník `navrhy/index.html` (šablona `_build_tools/navrhy/`), ukázka správy `ukazka-spravy/`. Bereme jen nápady, žádný kód, obrázky ani texty šablon.

**Pevné pro všechny verze:** barvy polepu dodávek a loga, stejné texty, stejný obraz (animovaný řez vložkou). Žádné mřížky dlaždic s ikonami. Pohyb krátký, žádné dlouhé zastavené sekce.

| Token | Hodnota | Kde |
|---|---|---|
| limetka | `#acf53d` | logo, polep, hlavní tlačítko Zavolat (text na ní grafitový) |
| grafit | `#282b34` | tmavé plochy, text |
| modrá | `#004c93` | polep, odkazy, plochy s bílým textem |
| bílá | `#ffffff` | světlé plochy |

**Řez vložkou je součástí plochy, ne vložený obrázek.** Kolo 27. 10. mělo řez jako světlý „papír“ s rámečkem na jiném pozadí a působil vystřiženě. Teď se řez kreslí v barvách sekce, ve které je (`navrhy/spolecne/rez.css`, proměnné `--rez-papir`, `--rez-cara`, `--rez-klic`): na bílé tmavé čáry, na grafitu limetkové a bílé, na modré bílé jako skutečný výkres, na limetce grafitové. Rámeček a mřížka papíru jsou pryč.

## Vybrané šablony (ThemeForest, 29. 10. 2026)

| Šablona | Demo | Co bereme |
|---|---|---|
| Towis (like-themes) | towis.like-themes.com | pruh s výstražnými pruhy nahoře, telefon v kapsli nad obřím verzálkovým nadpisem na střed, jeden velký předmět na čisté ploše, služby jako číslované řádky s kulatou šipkou vedle velkého obrazu |
| Doorix (raddito) | preview.raddito.net/doorix | tmavý úvod jako zaoblená karta s okrajem, druhý řádek nadpisu obrysem, limetkové tlačítko, řádek faktů dole v úvodu, sekce „Co se stalo?“ s problémy kolem obrazu |
| Shield (axiomthemes) | shield.axiomthemes.com | obří levostranný nadpis, kulaté otáčející se razítko kolem šipky |
| HotLock (axiomthemes) | hotlock.axiomthemes.com | blok „rychlá reakce + velké číslo“ v barvě značky |
| Lockey (jegtheme) | templatekit.jegtheme.com/lockey | pás s fakty přes spodní hranu úvodu |
| KeyMaster (moxcreative) | point.moxcreative.com/keymaster | časté otázky vedle nadpisu |

Prošli jsme a nebereme: Plumby, Coolen, Electrik, Smartkeiz, Blocks (mřížky karet s ikonami), Towy (zastaralé), vymyšlená čísla a recenze (Doorix, Lockey).

## Verze

### V1 – Výjezd (Towis + HotLock)
Bílá. Nahoře pruh polepu, telefon v kapsli nad obřím verzálkovým nadpisem na střed, pod ním velký řez vložkou přes šířku na bílé (tmavé čáry). Služby jako číslované řádky s limetkovou šipkou, vedle limetkový blok s telefonem. Barlow Condensed.

### V2 – Dílna (Doorix + Lockey)
Grafit. Úvod jako zaoblená tmavá karta s okrajem, druhý řádek nadpisu jen obrysem v limetce, řez kreslený limetkou a bílou na grafitu, dole v kartě řádek faktů. Sekce „Co se stalo?“ – čtyři situace a co dělat. Archivo.

### V3 – Výkres (Shield + KeyMaster)
Modrá. Obří levostranný nadpis, řez jako skutečný výkres bílými čarami na modré, otáčející se razítko. Světlé sekce s časté otázky vedle nadpisu. IBM Plex Sans + Mono.

### V4 – Polep (Towis + Lockey)
Limetka. Celý úvod limetkový jako dodávka, výstražné pruhy, řez grafitovými čarami na limetce, modrý pás s fakty přes spodní hranu. Manrope.

## Správa (ukázka)
`ukazka-spravy/` – klikací statická ukázka: poptávky z formuláře (nové / vyřízené, detail, zavolat), přepínač „dnes nejsem k zastižení“ (mění stav Otevřeno na webu), text akce (Yale Linus). Vzorová data bez skutečných osob, nic se neukládá, pruh „Ukázka správy, změny se neukládají“. Vzhled jako web (limetková lišta, grafit, Barlow).

## Kontroly
Výsledky kontrol každé verze: `redeye/klienti/otevru-cz/todo.md`.
