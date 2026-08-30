import {
  CONSUMER_AUTHORITY,
  SUPERVISORY_AUTHORITY,
  formatAddress,
  formatCompanyName,
} from "./operator";
import type { Operator, Section } from "./types";

/**
 * Zásady zpracování osobních údajů podle nařízení (EU) 2016/679 (GDPR)
 * a zákona č. 110/2019 Sb., o zpracování osobních údajů.
 */
export function buildPrivacySections(operator: Operator): Section[] {
  const controllerContact = operator.dpo?.email ?? operator.contact.email;

  return [
    {
      title: "1. Správce osobních údajů",
      blocks: [
        {
          kind: "p",
          text: `Správcem osobních údajů je ${formatCompanyName(operator)}, se sídlem ${formatAddress(
            operator,
          )}, IČO ${operator.ico}${operator.dic ? `, DIČ ${operator.dic}` : ""}.`,
        },
        {
          kind: "p",
          text: `Ve věcech ochrany osobních údajů nás kontaktujte na ${controllerContact}${
            operator.dpo?.name ? ` (${operator.dpo.name})` : ""
          }.`,
        },
      ],
    },
    {
      title: "2. Jaké údaje zpracováváme",
      blocks: [
        {
          kind: "ul",
          items: [
            "identifikační a kontaktní údaje (jméno, e-mail, telefon), které nám sdělíte ve formuláři nebo při poptávce,",
            "obsah vaší zprávy a údaje potřebné k vyřízení požadavku,",
            "technické údaje o návštěvě webu (IP adresa, typ prohlížeče, cookies),",
            "údaj o udělení či odvolání souhlasu s cookies.",
          ],
        },
      ],
    },
    {
      title: "3. Účely a právní základy zpracování",
      blocks: [
        {
          kind: "ul",
          items: [
            "Provoz a zabezpečení webu — oprávněný zájem správce, čl. 6 odst. 1 písm. f) GDPR.",
            "Vyřízení dotazu nebo poptávky — plnění smlouvy či kroky před jejím uzavřením, čl. 6 odst. 1 písm. b) GDPR.",
            "Analytika a marketing — výhradně na základě vašeho souhlasu, čl. 6 odst. 1 písm. a) GDPR.",
            "Účetnictví a archivace — plnění právní povinnosti, čl. 6 odst. 1 písm. c) GDPR.",
          ],
        },
      ],
    },
    {
      title: "4. Doba uchovávání",
      blocks: [
        {
          kind: "p",
          text: "Osobní údaje uchováváme pouze po dobu nezbytnou k naplnění účelu zpracování. Údaje z formulářů zpravidla po dobu vyřízení požadavku a následně po dobu stanovenou právními předpisy. Souhlas s cookies uchováváme po dobu jeho platnosti a dále po dobu potřebnou k prokázání jeho udělení.",
        },
      ],
    },
    {
      title: "5. Příjemci údajů",
      blocks: [
        {
          kind: "p",
          text: "Údaje mohou být zpřístupněny zpracovatelům, kteří pro nás zajišťují hosting, e-mailovou komunikaci, ochranu formulářů (Cloudflare Turnstile) nebo analytiku, a to na základě smlouvy o zpracování osobních údajů. Pokud má poskytovatel sídlo mimo EU, zajišťujeme odpovídající záruky podle kapitoly V GDPR.",
        },
      ],
    },
    {
      title: "6. Vaše práva",
      blocks: [
        { kind: "p", text: "Ve vztahu ke svým osobním údajům máte právo:" },
        {
          kind: "ul",
          items: [
            "na přístup ke svým osobním údajům,",
            "na opravu nepřesných nebo neúplných údajů,",
            "na výmaz údajů, není-li dán jiný právní důvod pro jejich zpracování,",
            "na omezení zpracování,",
            "vznést námitku proti zpracování,",
            "na přenositelnost údajů,",
            "kdykoli odvolat souhlas, aniž je dotčena zákonnost zpracování před odvoláním,",
            `podat stížnost u dozorového úřadu: ${SUPERVISORY_AUTHORITY.name}, ${SUPERVISORY_AUTHORITY.address}, ${SUPERVISORY_AUTHORITY.website}.`,
          ],
        },
      ],
    },
    {
      title: "7. Formuláře na tomto webu",
      blocks: [
        {
          kind: "p",
          text: `Odesláním kontaktního formuláře nám sdělujete údaje potřebné k odpovědi. Před odesláním probíhá automatická kontrola proti spamu (Cloudflare Turnstile), která může zpracovat IP adresu a technické údaje prohlížeče. Zpráva se uloží u provozovatele webu a dorazí na ${operator.contact.email}.`,
        },
      ],
    },
  ];
}

/**
 * Zásady používání cookies podle GDPR a zákona č. 127/2005 Sb.,
 * o elektronických komunikacích.
 */
export function buildCookieSections(): Section[] {
  return [
    {
      title: "1. Co jsou cookies",
      blocks: [
        {
          kind: "p",
          text: "Cookies jsou malé textové soubory ukládané do vašeho zařízení při návštěvě webu. Některé jsou nezbytné pro fungování webu, ostatní vyžadují váš předchozí souhlas podle nařízení GDPR a zákona č. 127/2005 Sb., o elektronických komunikacích.",
        },
      ],
    },
    {
      title: "2. Kategorie cookies",
      blocks: [
        {
          kind: "ul",
          items: [
            "Nezbytné — zajišťují základní funkce webu včetně uložení vaší volby ohledně cookies a ochrany kontaktních formulářů (Cloudflare Turnstile). Nelze je vypnout.",
            "Analytické — pomáhají měřit návštěvnost a chování na webu. Spouští se až po vašem souhlasu.",
            "Marketingové — slouží k personalizaci reklamy a měření kampaní. Spouští se až po vašem souhlasu.",
          ],
        },
      ],
    },
    {
      title: "3. Jak spravovat souhlas",
      blocks: [
        {
          kind: "p",
          text: "Při první návštěvě se zobrazí lišta, kde můžete odmítnout vše, přijmout vše nebo zvolit jednotlivé kategorie. Volbu lze kdykoli změnit tlačítkem „Nastavení cookies“ v patičce webu.",
        },
        {
          kind: "p",
          text: "Analytické a marketingové nástroje se neaktivují dříve, než udělíte souhlas. Při nasazení Google Analytics nebo Google Ads je nutné nastavit také Consent Mode v2.",
        },
      ],
    },
    {
      title: "4. Doba platnosti",
      blocks: [
        {
          kind: "p",
          text: "Nezbytné cookies uchováváme po dobu relace nebo po dobu potřebnou pro funkčnost webu. Souhlas s ostatními kategoriemi uchováváme po dobu jeho platnosti, nejdéle však po dobu uvedenou u jednotlivých nástrojů třetích stran.",
        },
      ],
    },
  ];
}

/** Právní rámec pro stránku provozovatele. */
export function buildOperatorSections(operator: Operator): Section[] {
  return [
    {
      title: "Právní rámec",
      blocks: [
        {
          kind: "p",
          text: "V České republice je podnikatel povinen uvádět na webu své identifikační údaje podle § 435 zákona č. 89/2012 Sb., občanský zákoník, a u živnostníků také podle § 13a zákona č. 455/1991 Sb., živnostenský zákon. Informace musí být pro návštěvníky snadno dohledatelné.",
        },
        {
          kind: "p",
          text: `Nabízíme-li prostřednictvím webu zboží nebo služby spotřebitelům, platí dále informační povinnosti podle § 1811 a násl. občanského zákoníku a možnost mimosoudního řešení sporů u ${CONSUMER_AUTHORITY.name} (${CONSUMER_AUTHORITY.website}).`,
        },
      ],
    },
  ];
}
