import type { LabelledValue, Operator } from "./types";

export const SUPERVISORY_AUTHORITY = {
  name: "Úřad pro ochranu osobních údajů",
  address: "Pplk. Sochora 27, 170 00 Praha 7",
  website: "https://www.uoou.cz",
} as const;

export const CONSUMER_AUTHORITY = {
  name: "Česká obchodní inspekce",
  website: "https://www.coi.cz",
} as const;

export function formatCompanyName(operator: Operator) {
  return operator.legalForm
    ? `${operator.name} ${operator.legalForm}`
    : operator.name;
}

export function formatAddress(operator: Operator) {
  const { street, zip, city, country } = operator.address;
  return [street, `${zip} ${city}`, country].filter(Boolean).join(", ");
}

export function formatRegistryEntry(operator: Operator) {
  const { registry } = operator;
  if (registry.type === "zivnostensky") {
    return registry.authority
      ? `Zapsán v živnostenském rejstříku — ${registry.authority}`
      : "Zapsán v živnostenském rejstříku";
  }
  return `Zapsán v obchodním rejstříku vedeném ${registry.court}, oddíl ${registry.section}, vložka ${registry.insert}`;
}

/**
 * Povinné identifikační údaje podle § 435 zákona č. 89/2012 Sb.,
 * občanský zákoník, a § 13a zákona č. 455/1991 Sb., živnostenský zákon.
 */
export function buildOperatorRows(operator: Operator): LabelledValue[] {
  const rows: LabelledValue[] = [
    { label: "Provozovatel", value: formatCompanyName(operator) },
    { label: "Sídlo", value: formatAddress(operator) },
    { label: "IČO", value: operator.ico },
  ];

  if (operator.dic) {
    rows.push({ label: "DIČ", value: operator.dic });
  }

  rows.push({ label: "Zápis v rejstříku", value: formatRegistryEntry(operator) });
  rows.push({ label: "E-mail", value: operator.contact.email });

  if (operator.contact.phone) {
    rows.push({ label: "Telefon", value: operator.contact.phone });
  }

  return rows;
}
