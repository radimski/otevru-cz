"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import {
  clearConsent,
  hasConsentChoice,
  subscribeToConsent,
  writeConsent,
} from "@websites/legal-cz";
import { SITE_ID } from "@/config/operator";

function shouldShow() {
  return !hasConsentChoice(SITE_ID);
}

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => clearConsent(SITE_ID)}
      className="text-left underline-offset-2 hover:text-[#acf53d] hover:underline"
    >
      Nastavení cookies
    </button>
  );
}

export function CookieBanner() {
  const visible = useSyncExternalStore(
    subscribeToConsent,
    shouldShow,
    () => false,
  );
  const [detail, setDetail] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  if (!visible) return null;

  function save(a: boolean, m: boolean) {
    writeConsent(SITE_ID, { analytics: a, marketing: m });
    setDetail(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Souhlas s cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t-4 border-[#acf53d] bg-white shadow-[0_-8px_30px_rgba(40,43,52,0.18)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-5">
        {!detail ? (
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-3xl text-sm leading-6 text-[#484d55]">
              Nezbytné cookies používáme pro provoz webu. Analytické a
              marketingové jen s vaším souhlasem podle GDPR a zákona č. 127/2005
              Sb. Více v{" "}
              <Link href="/cookies" className="font-semibold text-[#004c93] underline">
                zásadách cookies
              </Link>
              .
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => save(false, false)}
                className="rounded-md border border-[#c9c9c9] px-4 py-2.5 text-sm font-bold text-[#484d55] hover:bg-[#f3f3f3]"
              >
                Odmítnout vše
              </button>
              <button
                type="button"
                onClick={() => setDetail(true)}
                className="rounded-md border border-[#c9c9c9] px-4 py-2.5 text-sm font-bold text-[#484d55] hover:bg-[#f3f3f3]"
              >
                Nastavení
              </button>
              <button
                type="button"
                onClick={() => save(true, true)}
                className="otevru-btn-orange rounded-md px-4 py-2.5 text-sm font-bold"
              >
                Přijmout vše
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="font-bold text-[#2f333b]">Nastavení cookies</p>
            <div className="mt-4 space-y-3">
              <label className="flex items-start justify-between gap-4 rounded-md border border-[#ddd] p-4">
                <span className="text-sm text-[#484d55]">
                  <strong className="block text-[#2f333b]">Nezbytné</strong>
                  Základní funkce webu. Nelze vypnout.
                </span>
                <input type="checkbox" checked disabled className="mt-1" />
              </label>
              <label className="flex items-start justify-between gap-4 rounded-md border border-[#ddd] p-4">
                <span className="text-sm text-[#484d55]">
                  <strong className="block text-[#2f333b]">Analytické</strong>
                  Měření návštěvnosti webu.
                </span>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1"
                />
              </label>
              <label className="flex items-start justify-between gap-4 rounded-md border border-[#ddd] p-4">
                <span className="text-sm text-[#484d55]">
                  <strong className="block text-[#2f333b]">Marketingové</strong>
                  Personalizace reklamy a měření kampaní.
                </span>
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="mt-1"
                />
              </label>
            </div>
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setDetail(false)}
                className="rounded-md border border-[#c9c9c9] px-4 py-2.5 text-sm font-bold text-[#484d55] hover:bg-[#f3f3f3]"
              >
                Zpět
              </button>
              <button
                type="button"
                onClick={() => save(analytics, marketing)}
                className="otevru-btn-orange rounded-md px-4 py-2.5 text-sm font-bold"
              >
                Uložit volbu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
