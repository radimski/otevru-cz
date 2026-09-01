import Link from "next/link";
import type { Metadata } from "next";
import { otevruConfig } from "@/config/site";
import { serviceIcons } from "@/components/icons";
import { OpenStatus } from "@/components/OpenStatus";
import { withCanonical } from "@/lib/page-metadata";

export const metadata: Metadata = withCanonical("/", {
  title: `${otevruConfig.brand} | Zámečnická pohotovost Frýdek-Místek`,
  description: otevruConfig.tagline,
});

export default function OtevruPage() {
  return (
    <div>
      <section className="otevru-section-blue otevru-hero">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-20">
          <div>
            <p className="otevru-title text-[#acf53d]">
              Sviadnov · Frýdek-Místek · Ostrava
            </p>
            <span className="otevru-keyhole-rule" aria-hidden />
            <h1 className="mt-5 text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
              Zabouchli jste si dveře?{" "}
              <span className="text-[#acf53d]">Otevřeme.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/85">
              {otevruConfig.tagline}. Nouzové otevírání, klíče, bezpečnostní
              dveře a trezory — šetrně a na místě.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/65">
              {otevruConfig.serviceArea}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={otevruConfig.phoneHref}
                className="otevru-btn-orange inline-flex min-h-12 items-center justify-center rounded-md px-6 py-3 font-bold"
              >
                Zavolat {otevruConfig.phone}
              </a>
              <Link
                href="/kontakt"
                className="otevru-btn-outline-lime inline-flex min-h-12 items-center justify-center rounded-md px-6 py-3 font-bold"
              >
                Napsat poptávku
              </Link>
            </div>
          </div>

          <aside className="otevru-hero-panel">
            <p className="otevru-title text-[#acf53d]">Pohotovost</p>
            <a
              href={otevruConfig.phoneHref}
              className="mt-4 block text-2xl font-bold tracking-tight text-white hover:text-[#acf53d]"
            >
              {otevruConfig.phone}
            </a>
            <OpenStatus
              schedule={otevruConfig.openingSchedule}
              className="open-status open-status-nav mt-3"
            />
            <p className="mt-3 text-sm text-white/70">{otevruConfig.hours}</p>
            <p className="mt-4 border-t border-white/15 pt-4 text-sm leading-6 text-white/70">
              {otevruConfig.emergencyNote}
            </p>
            <p className="mt-3 text-sm text-white/55">{otevruConfig.hoursNote}</p>
          </aside>
        </div>
      </section>

      <section className="otevru-panic">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="otevru-title text-[#ff8800]">Nouzové otevírání</p>
          <h2 className="mt-3 text-2xl font-bold text-[#2f333b]">
            Co dělat hned teď
          </h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {otevruConfig.panicSteps.map((step, index) => (
              <li key={step.title} className="otevru-card otevru-card-step rounded-lg p-5">
                <span className="otevru-step-num" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-bold text-[#2f333b]">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5c6169]">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="otevru-section-dark" aria-label="Důvěryhodnost">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {otevruConfig.trust.map((item) => (
            <div key={item.label} className="text-center sm:text-left">
              <p className="text-lg font-bold text-[#acf53d]">{item.value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.15em] text-white/60">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="otevru-section-lime">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-bold text-[#2f333b]">
              {otevruConfig.promo.title}
            </p>
            <p className="mt-1 max-w-xl text-sm leading-6 text-[#3d424a]">
              {otevruConfig.promo.text}
            </p>
          </div>
          <Link
            href="/kontakt"
            className="otevru-btn-blue inline-flex min-h-12 shrink-0 items-center justify-center rounded-md px-6 py-3 font-bold"
          >
            Poptat zámek
          </Link>
        </div>
      </section>

      <section id="jak" className="otevru-section-light">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <p className="otevru-title text-[#004c93]">Jak to funguje</p>
          <span
            className="otevru-keyhole-rule bg-[linear-gradient(90deg,#004c93_0%,#004c93_55%,transparent_55%)]"
            aria-hidden
          />
          <h2 className="mt-3 text-3xl font-bold text-[#2f333b]">
            Od hovoru k vyřešení
          </h2>
          <p className="mt-3 max-w-2xl text-[#5c6169]">
            U nouzového otevírání volejte přímo. U montáží a poptávek se
            domluvíme telefonicky nebo přes formulář.
          </p>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {otevruConfig.steps.map((step) => (
              <li key={step.num} className="otevru-card otevru-card-step rounded-lg p-6">
                <span className="otevru-step-num" aria-hidden>
                  {step.num}
                </span>
                <h3 className="mt-4 text-xl font-bold text-[#2f333b]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#5c6169]">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="sluzby"
        className="otevru-section-light border-t border-[#484d55]/10"
      >
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <p className="otevru-title text-[#004c93]">Služby</p>
          <span
            className="otevru-keyhole-rule bg-[linear-gradient(90deg,#004c93_0%,#004c93_55%,transparent_55%)]"
            aria-hidden
          />
          <h2 className="mt-3 text-3xl font-bold text-[#2f333b]">
            Co pro vás uděláme
          </h2>
          <p className="mt-3 max-w-2xl text-[#5c6169]">
            Od nouzového otevření po montáž bezpečnostních systémů na míru.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {otevruConfig.services.map((service) => (
              <article key={service.title} className="otevru-card rounded-lg p-6">
                <span className="otevru-icon-badge">{serviceIcons[service.icon]}</span>
                <h3 className="mt-4 text-lg font-bold text-[#2f333b]">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5c6169]">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="o-nas" className="otevru-section-blue">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="otevru-title text-[#acf53d]">O nás</p>
            <h2 className="mt-3 text-3xl font-bold text-white">
              Specialisté na vaši bezpečnost
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-white/85">
              Zaměřujeme se na nouzové otevírání bez zbytečného poškození zámků
              a konstrukcí. Poradíme s technickým řešením zabezpečení a
              připravíme nabídku podle vašich požadavků.
            </p>
            <p className="mt-4 text-sm leading-6 text-white/65">
              {otevruConfig.hoursNote}
            </p>
            <a
              href={otevruConfig.phoneHref}
              className="otevru-btn-orange mt-8 inline-flex min-h-12 items-center justify-center rounded-md px-6 py-3 font-bold"
            >
              Zavolat {otevruConfig.phone}
            </a>
          </div>
          <div className="otevru-hero-panel">
            <p className="otevru-title text-[#acf53d]">Certifikace a zázemí</p>
            <ul className="mt-6 space-y-3">
              {otevruConfig.partners.map((partner) => (
                <li
                  key={partner}
                  className="flex items-center gap-3 text-lg font-semibold text-white"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#ff8800]" />
                  {partner}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm leading-6 text-white/75">
              {otevruConfig.serviceArea}
            </p>
            <p className="mt-3 text-sm text-white/70">
              Provoz: {otevruConfig.hours}
            </p>
            <p className="mt-1 text-sm text-white/55">{otevruConfig.address}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
