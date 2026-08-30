import Link from "next/link";
import type { Section } from "@websites/legal-cz";

export function LegalPage({
  title,
  intro,
  sections,
  children,
}: {
  title: string;
  intro: string;
  sections: Section[];
  children?: React.ReactNode;
}) {
  return (
    <div className="otevru-section-light">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="text-sm font-semibold text-[#004c93] hover:underline"
        >
          ← Zpět na úvod
        </Link>
        <h1 className="mt-6 text-4xl font-bold text-[#2f333b]">{title}</h1>
        <p className="mt-4 text-[#717479]">{intro}</p>

        {children}

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-bold text-[#484d55]">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3">
                {section.blocks.map((block, index) =>
                  block.kind === "p" ? (
                    <p key={index} className="leading-7 text-[#717479]">
                      {block.text}
                    </p>
                  ) : (
                    <ul
                      key={index}
                      className="list-disc space-y-2 pl-5 leading-7 text-[#717479]"
                    >
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ),
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
