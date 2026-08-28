import type { Metadata } from "next";
import { buildCookieSections } from "@websites/legal-cz";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Cookies",
  description:
    "Informace o používání cookies podle GDPR a zákona č. 127/2005 Sb.",
};

export default function Page() {
  return (
    <LegalPage
      title="Zásady používání cookies"
      intro="Jak na tomto webu používáme cookies a jak můžete spravovat svůj souhlas."
      sections={buildCookieSections()}
    />
  );
}
