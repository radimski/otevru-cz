import Link from "next/link";
import { otevruConfig } from "@/config/site";

export default function NotFound() {
  return (
    <div className="otevru-section-light flex flex-1 items-center">
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="otevru-title text-[#004c93]">404</p>
        <h1 className="mt-4 text-3xl font-bold text-[#2f333b]">
          Stránka nenalezena
        </h1>
        <p className="mt-4 text-[#717479]">
          Odkaz je neplatný nebo stránka už neexistuje.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="otevru-btn-orange inline-flex rounded-md px-6 py-3 text-sm font-bold"
          >
            Domů
          </Link>
          <Link
            href="/kontakt"
            className="inline-flex rounded-md border border-[#2f333b]/15 px-6 py-3 text-sm font-semibold text-[#2f333b]"
          >
            Kontakt
          </Link>
          <a
            href={otevruConfig.phoneHref}
            className="text-sm font-semibold text-[#004c93] hover:underline"
          >
            Zavolat {otevruConfig.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
