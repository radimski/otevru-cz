"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { otevruConfig } from "@/config/site";
import { OpenStatus } from "@/components/OpenStatus";

const links = [
  { href: "/#sluzby", label: "Služby", match: "/" },
  { href: "/#jak", label: "Jak to funguje", match: "/" },
  { href: "/#o-nas", label: "O nás", match: "/" },
  { href: "/kontakt", label: "Kontakt", match: "/kontakt" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="otevru-header sticky top-0 z-40">
      <div className="otevru-section-lime">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-3">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/logo.png"
              alt={`${otevruConfig.name} — zámečnická pohotovost`}
              width={295}
              height={60}
              className="h-9 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <OpenStatus
              schedule={otevruConfig.openingSchedule}
              className="open-status open-status-header hidden min-[480px]:flex"
              showDetail={false}
            />
            <a
              href={otevruConfig.phoneHref}
              className="otevru-btn-orange rounded-md px-3 py-2 text-xs font-bold sm:px-4 sm:text-sm"
            >
              {otevruConfig.phone}
            </a>
            <button
              type="button"
              className="rounded-md border border-[#2f333b]/20 bg-white/90 px-3 py-2 text-xs font-bold text-[#2f333b] md:hidden"
              aria-expanded={open}
              aria-controls="otevru-mobile-nav"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? "Zavřít" : "Menu"}
            </button>
          </div>
        </div>
      </div>
      <div className="otevru-section-dark hidden md:block">
        <nav className="mx-auto flex max-w-6xl items-center gap-8 px-6 py-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="otevru-nav-link"
              aria-current={
                pathname === link.match && link.match !== "/"
                  ? "page"
                  : undefined
              }
            >
              {link.label}
            </Link>
          ))}
          <OpenStatus
            schedule={otevruConfig.openingSchedule}
            className="open-status open-status-nav ml-auto"
          />
        </nav>
      </div>
      <div
        id="otevru-mobile-nav"
        className={`otevru-section-dark md:hidden ${open ? "block" : "hidden"}`}
        hidden={!open}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-white/85 transition hover:bg-white/5"
              aria-current={pathname === link.match ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <OpenStatus
            schedule={otevruConfig.openingSchedule}
            className="open-status open-status-nav mt-2 px-3"
          />
        </nav>
      </div>
    </header>
  );
}
