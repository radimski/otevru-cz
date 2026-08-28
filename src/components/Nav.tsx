"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { otevruConfig } from "@/config/site";
import { OpenStatus } from "@/components/OpenStatus";

const links = [
  { href: "/#sluzby", label: "Služby" },
  { href: "/#jak", label: "Jak to funguje" },
  { href: "/#o-nas", label: "O nás" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 shadow-sm">
      <div className="otevru-section-lime">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-3">
          <Link href="/" className="flex shrink-0 items-center">
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
              className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 transition hover:text-[#acf53d]"
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
