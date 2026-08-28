import type { Operator } from "@websites/legal-cz";

/** Povinné údaje podle § 435 OZ a § 13a živnostenského zákona. */
export const operator: Operator = {
  name: "Patrik Panenka",
  address: {
    street: "O. Kišové 88",
    zip: "739 25",
    city: "Sviadnov",
    country: "Česká republika",
  },
  ico: "73290939",
  dic: "CZ7401244928",
  registry: {
    type: "zivnostensky",
    authority: "Magistrát města Frýdku-Místku",
  },
  contact: {
    email: "patrik@otevru.cz",
    phone: "+420 606 262 118",
  },
};

export const SITE_ID = "otevru";
