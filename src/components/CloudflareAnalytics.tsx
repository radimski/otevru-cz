"use client";

import { useEffect } from "react";
import { readConsent, subscribeToConsent } from "@websites/legal-cz";
import { SITE_ID } from "@/config/operator";

const BEACON_TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN?.trim();

function injectBeacon() {
  if (!BEACON_TOKEN) return;
  const consent = readConsent(SITE_ID);
  if (!consent?.analytics) return;
  if (document.getElementById("cf-beacon")) return;

  const script = document.createElement("script");
  script.id = "cf-beacon";
  script.defer = true;
  script.src = "https://static.cloudflareinsights.com/beacon.min.js";
  script.setAttribute(
    "data-cf-beacon",
    JSON.stringify({ token: BEACON_TOKEN }),
  );
  document.body.appendChild(script);
}

function removeBeacon() {
  document.getElementById("cf-beacon")?.remove();
}

/** Cloudflare Web Analytics — loads only after analytics cookie consent. */
export function CloudflareAnalytics() {
  useEffect(() => {
    if (!BEACON_TOKEN) return;

    function sync() {
      const consent = readConsent(SITE_ID);
      if (consent?.analytics) injectBeacon();
      else removeBeacon();
    }

    sync();
    return subscribeToConsent(sync);
  }, []);

  return null;
}
