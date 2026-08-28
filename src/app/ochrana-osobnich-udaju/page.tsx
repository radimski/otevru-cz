import type { Metadata } from "next";
import { buildPrivacySections } from "@websites/legal-cz";
import { LegalPage } from "@/components/LegalPage";
import { operator } from "@/config/operator";

export const metadata: Metadata = {
  title: "Ochrana osobních údajů",
  description:
    "Zásady zpracování osobních údajů podle GDPR a zákona č. 110/2019 Sb.",
};

export default function Page() {
  return (
    <LegalPage
      title="Zásady ochrany osobních údajů"
      intro="Informace o zpracování osobních údajů podle nařízení (EU) 2016/679 (GDPR) a zákona č. 110/2019 Sb."
      sections={buildPrivacySections(operator)}
    />
  );
}
