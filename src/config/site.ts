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
  tagline: "Zámečnická pohotovost & speciální zámečnictví",
  colors: otevruColors,
  ico: "73290939",
  dic: "CZ7401244928",
  phone: "+420 606 262 118",
  phoneHref: "tel:+420606262118",
  email: "patrik@otevru.cz",
  address: "O. Kišové 88, 739 25 Sviadnov",
  hours: "Po–Ne 07:00–18:00",
  hoursNote: "Před návštěvou zavolejte — často jsme na montážích.",
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
    "V pracovní době vyjíždíme na nouzové otevírání v MS kraji. Mimo dobu domluvíme telefonicky.",
  serviceArea:
    "Sviadnov, Frýdek-Místek, Ostrava a okolí — v nouzi dojedeme k vám.",
  trust: [
    { value: "Assa Abloy", label: "Autorizovaný partner" },
    { value: "Mul-T-Lock", label: "Certifikované systémy" },
    { value: "Po–Ne", label: "07:00–18:00" },
    { value: "73290939", label: "IČO provozovatele" },
  ] as const,
  panicSteps: [
    {
      title: "Zachovejte klid",
      text: "Nepokoušejte se násilně otevírat zámek — hrozí poškození.",
    },
    {
      title: "Zavolejte nám",
      text: "Popíšete typ dveří, zámku nebo auta a kde jste.",
    },
    {
      title: "Počkejte na technika",
      text: "Domluvíme čas příjezdu a připravíme potřebné nástroje.",
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
      title: "Zavoláte",
      text: "Popíšete situaci — zablokované dveře, zámek, trezor nebo montáž.",
    },
    {
      num: "02",
      title: "Dojedeme",
      text: "Domluvíme čas a místo. U nouzového otevírání reagujeme co nejdříve.",
    },
    {
      num: "03",
      title: "Vyřešíme",
      text: "Otevřeme, opravíme nebo namontujeme — s důrazem na šetrnost a kvalitu.",
    },
  ] as const,
  promo: {
    title: "Akce na bezklíčový chytrý zámek Yale Linus",
    text: "Více informací v sekci klíčová služba nebo na telefonu.",
  },
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
  partners: ["Assa Abloy", "Mul-T-Lock", "Prověřená společnost"],
} as const;
