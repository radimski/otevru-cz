import type { Metadata } from "next";
import { OtevruContactForm } from "@/components/ContactForm";
import { EmailLink } from "@/components/EmailLink";
import { OpenStatus } from "@/components/OpenStatus";
import { otevruConfig } from "@/config/site";
import { withCanonical } from "@/lib/page-metadata";

export const metadata: Metadata = withCanonical("/kontakt", {
  title: `Kontakt | ${otevruConfig.brand}`,
  description:
    "Zavolejte nebo napište — zámečnická pohotovost ve Frýdku-Místku a okolí.",
});

export default function OtevruKontaktPage() {
  const mapHref = `https://maps.google.com/?q=${encodeURIComponent(otevruConfig.address)}`;

  return (
    <div className="otevru-section-light">
      <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
        <p className="otevru-title text-[#004c93]">Rychlý kontakt</p>
        <span
          className="otevru-keyhole-rule bg-[linear-gradient(90deg,#004c93_0%,#004c93_55%,transparent_55%)]"
          aria-hidden
        />
        <h1 className="mt-3 text-4xl font-bold text-[#2f333b]">Kontakt</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[#5c6169]">
          Nejrychlejší je telefon — u nouzového otevírání reagujeme prioritně.
          U ostatních poptávek využijte formulář.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={otevruConfig.phoneHref}
            className="otevru-btn-orange inline-flex min-h-12 items-center justify-center rounded-md px-6 py-3 text-lg font-bold"
          >
            Zavolat {otevruConfig.phone}
          </a>
          <OpenStatus
            schedule={otevruConfig.openingSchedule}
            className="open-status open-status-header px-1"
          />
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="otevru-card otevru-form-card rounded-lg p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[#2f333b]">
              Poptávkový formulář
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#5c6169]">
              Popište, co potřebujete, a ozveme se s návrhem řešení a cenou.
            </p>
            <div className="mt-6">
              <OtevruContactForm privacyHref="/ochrana-osobnich-udaju" />
            </div>
          </section>

          <dl className="otevru-card h-fit space-y-6 rounded-lg p-6 sm:p-8">
            <div>
              <dt className="text-sm font-semibold text-[#5c6169]">E-mail</dt>
              <dd className="mt-1 text-lg">
                <EmailLink
                  email={otevruConfig.email}
                  plain
                  className="font-semibold text-[#004c93] hover:underline"
                />
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-[#5c6169]">Adresa</dt>
              <dd className="mt-1 text-lg text-[#2f333b]">
                {otevruConfig.address}
              </dd>
              <dd className="mt-2">
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#004c93] hover:underline"
                >
                  Navigovat
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-[#5c6169]">
                Provozní doba
              </dt>
              <dd className="mt-1 text-lg text-[#2f333b]">
                {otevruConfig.hours}
              </dd>
              <dd className="mt-1 text-sm leading-6 text-[#5c6169]">
                {otevruConfig.hoursNote}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-[#5c6169]">Firma</dt>
              <dd className="mt-1 leading-7 text-[#2f333b]">
                {otevruConfig.name}
                <br />
                IČO {otevruConfig.ico} · DIČ {otevruConfig.dic}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
