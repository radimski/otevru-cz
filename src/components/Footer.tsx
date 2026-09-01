import Link from "next/link";
import { otevruConfig } from "@/config/site";
import { CookieSettingsButton } from "@/components/CookieBanner";
import { EmailLink } from "@/components/EmailLink";

const legalLinks = [
  { href: "/provozovatel", label: "Provozovatel" },
  { href: "/ochrana-osobnich-udaju", label: "Ochrana osobních údajů" },
  { href: "/cookies", label: "Cookies" },
] as const;

export function Footer() {
  return (
    <footer className="otevru-section-dark">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-bold tracking-tight text-white">
            {otevruConfig.brand}
          </p>
          <p className="mt-2 text-sm leading-6">{otevruConfig.tagline}</p>
          <p className="mt-4 font-semibold text-white">{otevruConfig.name}</p>
          <p className="mt-1 text-sm">IČO {otevruConfig.ico}</p>
          <p className="text-sm">DIČ {otevruConfig.dic}</p>
        </div>
        <div>
          <p className="otevru-title text-[#acf53d]">Provozovna</p>
          <p className="mt-3 text-sm leading-6">{otevruConfig.address}</p>
          <p className="mt-2 text-sm">{otevruConfig.hours}</p>
          <p className="mt-2 text-sm leading-6 text-white/55">
            {otevruConfig.hoursNote}
          </p>
        </div>
        <div>
          <p className="otevru-title text-[#acf53d]">Kontakt</p>
          <a
            href={otevruConfig.phoneHref}
            className="mt-3 block font-semibold text-white hover:text-[#acf53d]"
          >
            {otevruConfig.phone}
          </a>
          <EmailLink
            email={otevruConfig.email}
            className="mt-1 block text-sm hover:text-[#acf53d]"
          />
          <a
            href={otevruConfig.phoneHref}
            className="otevru-btn-orange mt-5 inline-flex rounded-md px-4 py-2.5 text-sm font-bold"
          >
            Zavolat teď
          </a>
        </div>
        <nav aria-label="Právní informace">
          <p className="otevru-title text-[#acf53d]">Informace</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-[#acf53d]">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <CookieSettingsButton />
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
