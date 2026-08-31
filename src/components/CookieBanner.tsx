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
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
      <section
        role="region"
        aria-label="Souhlas s cookies"
        className="pointer-events-auto mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-[#ddd] bg-white shadow-[0_8px_40px_rgba(40,43,52,0.22)]"
      >
        {!detail ? (
          <div className="px-4 py-4 sm:px-5 sm:py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <p className="text-sm leading-6 text-[#484d55]">
                Nezbytné cookies pro provoz webu. Analytické a marketingové jen
                se souhlasem.{" "}
                <Link
                  href="/cookies"
                  className="font-semibold text-[#004c93] underline"
                >
                  Zásady cookies
                </Link>
                .
              </p>
              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => save(false, false)}
                  className="rounded-md border border-[#c9c9c9] px-3 py-2 text-sm font-bold text-[#484d55] hover:bg-[#f3f3f3]"
                >
                  Odmítnout
                </button>
                <button
                  type="button"
                  onClick={() => setDetail(true)}
                  className="rounded-md border border-[#c9c9c9] px-3 py-2 text-sm font-bold text-[#484d55] hover:bg-[#f3f3f3]"
                >
                  Nastavení
                </button>
                <button
                  type="button"
                  onClick={() => save(true, true)}
                  className="otevru-btn-orange rounded-md px-3 py-2 text-sm font-bold"
                >
                  Přijmout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-h-[min(70vh,28rem)] overflow-y-auto px-4 py-4 sm:px-5">
            <p className="font-bold text-[#2f333b]">Nastavení cookies</p>
            <p className="mt-1 text-xs text-[#484d55]">
              Volba se uloží lokálně v prohlížeči.
            </p>
            <div className="mt-3 space-y-2">
              <label className="flex items-start justify-between gap-4 rounded-md border border-[#ddd] p-3">
                <span className="text-sm text-[#484d55]">
                  <strong className="block text-[#2f333b]">Nezbytné</strong>
                  Základní funkce webu. Nelze vypnout.
                </span>
                <input type="checkbox" checked disabled className="mt-1" />
              </label>
              <label className="flex items-start justify-between gap-4 rounded-md border border-[#ddd] p-3">
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
              <label className="flex items-start justify-between gap-4 rounded-md border border-[#ddd] p-3">
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
            <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-[#eee] pt-3">
              <button
                type="button"
                onClick={() => setDetail(false)}
                className="rounded-md border border-[#c9c9c9] px-3 py-2 text-sm font-bold text-[#484d55] hover:bg-[#f3f3f3]"
              >
                Zpět
              </button>
              <button
                type="button"
                onClick={() => save(analytics, marketing)}
                className="otevru-btn-orange rounded-md px-3 py-2 text-sm font-bold"
              >
                Uložit volbu
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
