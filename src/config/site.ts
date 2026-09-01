/**
 * Barvy převzaté z původního webu otevru.cz (assets/css/main.css)
 * a z polepu firemních vozů — limetková a šedá.
 */
export const otevruColors = {
  lime: "#acf53d",
  blue: "#004c93",
  orange: "#ff8800",
  dark: "#282b34",
  slate: "#2f333b",
  charcoal: "#484d55",
  muted: "#919499",
  light: "#f3f3f3",
} as const;

export const otevruConfig = {
  name: "Patrik Panenka",
  brand: "OTEVŘU",
  tagline: "Zámečnická pohotovost a specializované zámečnictví",
  shortDescription:
    "Nouzové otevírání, klíčová služba, bezpečnostní dveře a trezory ve Frýdku-Místku a okolí.",
  url: "https://www.otevru.cz/",
  colors: otevruColors,
  ico: "73290939",
  dic: "CZ7401244928",
  phone: "+420 606 262 118",
  phoneHref: "tel:+420606262118",
  email: "patrik@otevru.cz",
  address: "O. Kišové 88, 739 25 Sviadnov",
  hours: "Po–Ne 07:00–18:00",
  hoursNote:
    "Před návštěvou prosím zavolejte — technici jsou často v terénu na zakázkách.",
  openingSchedule: {
    timezone: "Europe/Prague",
    week: [
      { open: "07:00", close: "18:00" },
      { open: "07:00", close: "18:00" },
      { open: "07:00", close: "18:00" },
      { open: "07:00", close: "18:00" },
      { open: "07:00", close: "18:00" },
      { open: "07:00", close: "18:00" },
      { open: "07:00", close: "18:00" },
    ],
  },
  emergencyNote:
    "Ve standardní pracovní době vyjíždíme na nouzové otevírání v Moravskoslezském kraji. Mimo provozní dobu domluvíme postup telefonicky.",
  serviceArea:
    "Působíme ve Sviadnově, Frýdku-Místku, Ostravě a okolí — v nouzi dojedeme k vám.",
  trust: [
    { value: "Assa Abloy", label: "Autorizovaný partner" },
    { value: "Mul-T-Lock", label: "Certifikované systémy" },
    { value: "07:00–18:00", label: "Každý den včetně víkendů" },
    { value: "MS kraj", label: "Výjezdy v nouzi" },
  ] as const,
  panicSteps: [
    {
      title: "Zachovejte klid",
      text: "Nepokoušejte se zámek otevírat násilím — hrozí trvalé poškození.",
    },
    {
      title: "Kontaktujte nás",
      text: "Uveďte typ dveří, zámku nebo vozidla a přesnou adresu.",
    },
    {
      title: "Počkejte na technika",
      text: "Domluvíme čas příjezdu a připravíme vhodné vybavení.",
    },
  ] as const,
  serviceOptions: [
    "Nouzové otevírání",
    "Klíčová služba",
    "Bezpečnostní dveře",
    "Trezory & sejfy",
    "Opravy po vloupání",
    "Komplexní zabezpečení",
    "Jiné",
  ] as const,
  steps: [
    {
      num: "01",
      title: "Kontakt",
      text: "Popíšete situaci — zablokované dveře, výměnu zámku, trezor nebo montáž.",
    },
    {
      num: "02",
      title: "Příjezd",
      text: "Domluvíme termín a místo. U nouzového otevírání reagujeme prioritně.",
    },
    {
      num: "03",
      title: "Realizace",
      text: "Otevřeme, opravíme nebo namontujeme — s důrazem na šetrnost a kvalitu práce.",
    },
  ] as const,
  promo: {
    title: "Yale Linus — chytrý zámek bez klíče",
    text: "Montáž a poradenství k bezklíčovému systému. Zeptejte se telefonicky nebo přes formulář.",
  },
  partners: ["Assa Abloy", "Mul-T-Lock"],
  services: [
    {
      title: "Nouzové otevírání",
      description:
        "Byty, domy i automobily. Otevírání bez zbytečného poškození zámků.",
      icon: "unlock",
    },
    {
      title: "Klíčová služba",
      description:
        "Výroba klíčů, autoklíče, bezklíčové zámky Yale Linus a další.",
      icon: "key",
    },
    {
      title: "Bezpečnostní dveře",
      description:
        "Výběr, montáž a servis bezpečnostních i protipožárních dveří.",
      icon: "door",
    },
    {
      title: "Trezory & sejfy",
      description:
        "Montáž do zdi, servis, repas, stěhování a trezory na zbraně.",
      icon: "safe",
    },
    {
      title: "Opravy po vloupání",
      description:
        "Výměna zámků, vložek, kování a zárubní po poškození objektu.",
      icon: "repair",
    },
    {
      title: "Komplexní zabezpečení",
      description:
        "Mříže, závory, samozavírače, systém generálního klíče na míru.",
      icon: "home",
    },
  ],
} as const;
