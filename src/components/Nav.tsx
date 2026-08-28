import Image from "next/image";
import Link from "next/link";
import { otevruConfig } from "@/config/site";

const links = [
  { href: "/#sluzby", label: "Služby" },
  { href: "/#jak", label: "Jak to funguje" },
  { href: "/#o-nas", label: "O nás" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export function Nav() {
  return (
    <header className="sticky top-0 z-40 shadow-sm">
      <div className="otevru-section-lime">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.gif"
              alt={`${otevruConfig.name} — zámečnická pohotovost`}
              width={295}
              height={60}
              className="h-9 w-auto"
              priority
              unoptimized
            />
          </Link>
          <a
            href={otevruConfig.phoneHref}
            className="otevru-btn-orange rounded-md px-4 py-2 text-sm font-bold"
          >
            {otevruConfig.phone}
          </a>
        </div>
      </div>
      <div className="otevru-section-dark">
        <nav className="mx-auto hidden max-w-6xl items-center gap-8 px-6 py-3 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 transition hover:text-[#acf53d]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
