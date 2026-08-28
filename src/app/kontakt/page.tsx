import { OtevruContactForm } from "@/components/ContactForm";
import { otevruConfig } from "@/config/site";

export default function OtevruKontaktPage() {
  return (
    <div className="otevru-section-light">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <p className="otevru-title text-[#004c93]">Rychlý kontakt</p>
        <h1 className="mt-3 text-4xl font-bold text-[#2f333b]">Kontakt</h1>
        <p className="mt-4 max-w-2xl text-lg text-[#717479]">
          Nejrychlejší je telefon — u nouzového otevírání voláme zpět obratem.
          Nespěchá-li to, napište nám přes formulář.
        </p>

        <a
          href={otevruConfig.phoneHref}
          className="otevru-btn-orange mt-8 inline-flex items-center justify-center rounded-md px-6 py-4 text-lg font-bold"
        >
          Zavolat {otevruConfig.phone}
        </a>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="otevru-card rounded-lg p-8">
            <h2 className="text-xl font-bold text-[#2f333b]">
              Poptávkový formulář
            </h2>
            <p className="mt-2 text-sm text-[#919499]">
              Popište, co potřebujete, a ozveme se s návrhem řešení a cenou.
            </p>
            <div className="mt-6">
              <OtevruContactForm privacyHref="/ochrana-osobnich-udaju" />
            </div>
          </section>

          <dl className="otevru-card h-fit space-y-6 rounded-lg p-8">
            <div>
              <dt className="text-sm text-[#919499]">E-mail</dt>
              <dd className="mt-1 text-lg">
                <a
                  href={`mailto:${otevruConfig.email}`}
                  className="font-semibold text-[#004c93] hover:underline"
                >
                  {otevruConfig.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-[#919499]">Adresa</dt>
              <dd className="mt-1 text-lg text-[#484d55]">
                {otevruConfig.address}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-[#919499]">Provozní doba</dt>
              <dd className="mt-1 text-lg text-[#484d55]">
                {otevruConfig.hours}
              </dd>
              <dd className="mt-1 text-sm text-[#919499]">
                {otevruConfig.hoursNote}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-[#919499]">Firma</dt>
              <dd className="mt-1 text-[#484d55]">
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
