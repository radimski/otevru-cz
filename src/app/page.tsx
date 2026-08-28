import Link from "next/link";
import { otevruConfig } from "@/config/site";
import { serviceIcons } from "@/components/icons";

export default function OtevruPage() {
  return (
    <div>
      <section className="otevru-section-blue">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <p className="otevru-title text-[#acf53d]">
              Sviadnov · Frýdek-Místek
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Zabouchli jste si dveře?{" "}
              <span className="text-[#acf53d]">Otevřeme.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
              {otevruConfig.tagline}. Nouzové otevírání, bezpečnostní dveře,
              trezory a komplexní zabezpečení majetku.
            </p>
            <p className="mt-4 text-sm text-white/60">
              {otevruConfig.serviceArea}
            </p>
            <p className="mt-2 text-sm font-medium text-[#acf53d]/90">
              {otevruConfig.emergencyNote}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={otevruConfig.phoneHref}
                className="otevru-btn-orange inline-flex items-center justify-center rounded-md px-6 py-3 font-bold"
              >
                Zavolat {otevruConfig.phone}
              </a>
              <Link
                href="/kontakt"
                className="otevru-btn-lime inline-flex items-center justify-center rounded-md px-6 py-3 font-bold"
              >
                Kontakt
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {otevruConfig.services.slice(0, 4).map((service) => (
              <div
                key={service.title}
                className="rounded-lg border border-white/15 bg-white/5 p-5"
              >
                <span className="otevru-icon-wrap text-[#acf53d]">
                  {serviceIcons[service.icon]}
                </span>
                <h2 className="mt-3 font-bold text-white">{service.title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="otevru-section-light border-b border-[#484d55]/10">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="otevru-title text-[#004c93]">Zabouchnuté dveře?</p>
          <h2 className="mt-3 text-2xl font-bold text-[#2f333b]">
            Co dělat hned teď
          </h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {otevruConfig.panicSteps.map((step, index) => (
              <li key={step.title} className="otevru-card rounded-lg p-5">
                <span className="text-sm font-bold text-[#ff8800]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-bold text-[#484d55]">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#919499]">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="otevru-section-dark" aria-label="Důvěryhodnost">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {otevruConfig.trust.map((item) => (
            <div key={item.label} className="text-center sm:text-left">
              <p className="text-lg font-bold text-[#acf53d]">{item.value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.15em] text-white/55">
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
            <p className="mt-1 text-sm text-[#484d55]">
              {otevruConfig.promo.text}
            </p>
          </div>
          <a
            href={otevruConfig.phoneHref}
            className="otevru-btn-slate inline-flex shrink-0 items-center justify-center rounded-md px-6 py-3 font-bold"
          >
            Zjistit více
          </a>
        </div>
      </section>

      <section id="jak" className="otevru-section-light">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="otevru-title text-[#004c93]">Jak to funguje</p>
          <h2 className="mt-3 text-3xl font-bold text-[#2f333b]">
            Tři kroky k řešení
          </h2>
          <p className="mt-3 max-w-2xl text-[#717479]">
            U nouzového otevírání voláte přímo — u montáží a poptávek se
            domluvíme telefonicky nebo přes formulář.
          </p>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {otevruConfig.steps.map((step) => (
              <li key={step.num} className="otevru-card rounded-lg p-6">
                <span className="text-sm font-bold tracking-[0.2em] text-[#ff8800]">
                  {step.num}
                </span>
                <h3 className="mt-4 text-xl font-bold text-[#484d55]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#919499]">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="sluzby" className="otevru-section-light border-t border-[#484d55]/10">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="otevru-title text-[#004c93]">Naše nabídka</p>
          <h2 className="mt-3 text-3xl font-bold text-[#2f333b]">Naše služby</h2>
          <p className="mt-3 max-w-2xl text-[#717479]">
            Od nouzového otevření po montáž bezpečnostních systémů na míru.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {otevruConfig.services.map((service) => (
              <article
                key={service.title}
                className="otevru-card rounded-lg p-6"
              >
                <span className="otevru-icon-wrap text-[#004c93]">
                  {serviceIcons[service.icon]}
                </span>
                <h3 className="mt-4 text-lg font-bold text-[#484d55]">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#919499]">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="o-nas" className="otevru-section-blue">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-2">
          <div>
            <p className="otevru-title text-[#acf53d]">O nás</p>
            <h2 className="mt-3 text-3xl font-bold text-white">
              Specialisté na vaši bezpečnost
            </h2>
            <p className="mt-4 leading-7 text-white/80">
              Naší snahou je provádět nouzové otevírání bez zbytečného poškození
              zámků. Poradíme s technickou stránkou zabezpečení a připravíme
              nabídku na míru.
            </p>
            <p className="mt-4 text-sm text-white/60">{otevruConfig.hoursNote}</p>
            <a
              href={otevruConfig.phoneHref}
              className="otevru-btn-orange mt-8 inline-flex items-center justify-center rounded-md px-6 py-3 font-bold"
            >
              Zavolat {otevruConfig.phone}
            </a>
          </div>
          <div className="rounded-lg border border-white/15 bg-white/5 p-8">
            <p className="otevru-title text-[#acf53d]">Certifikáty</p>
            <ul className="mt-6 space-y-3">
              {otevruConfig.partners.map((partner) => (
                <li
                  key={partner}
                  className="flex items-center gap-3 text-lg font-semibold text-white"
                >
                  <span className="h-2 w-2 rounded-full bg-[#ff8800]" />
                  {partner}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-white/70">
              Provoz: {otevruConfig.hours}
            </p>
            <p className="mt-2 text-sm text-white/55">{otevruConfig.address}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
