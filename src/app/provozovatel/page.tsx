import type { Metadata } from "next";
import { buildOperatorRows, buildOperatorSections } from "@websites/legal-cz";
import { LegalPage } from "@/components/LegalPage";
import { operator } from "@/config/operator";

export const metadata: Metadata = {
  title: "Provozovatel webu",
  description: "Identifikační údaje provozovatele podle § 435 občanského zákoníku.",
};

export default function Page() {
  const rows = buildOperatorRows(operator);

  return (
    <LegalPage
      title="Provozovatel webu"
      intro="Povinné identifikační údaje podle § 435 zákona č. 89/2012 Sb. a § 13a živnostenského zákona."
      sections={buildOperatorSections(operator)}
    >
      <dl className="otevru-card mt-8 divide-y divide-[#eee] rounded-lg p-6">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-1 py-3 sm:grid-cols-3">
            <dt className="text-sm font-semibold text-[#919499]">{row.label}</dt>
            <dd className="text-[#484d55] sm:col-span-2">{row.value}</dd>
          </div>
        ))}
      </dl>
    </LegalPage>
  );
}
