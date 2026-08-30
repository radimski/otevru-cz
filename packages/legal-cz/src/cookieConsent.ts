export type CookieConsent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export const CONSENT_EVENT = "cookie-consent-changed";

/** Klíč v localStorage — pro každý web vlastní, aby se souhlasy nemíchaly. */
export function consentStorageKey(siteId: string) {
  return `cookie-consent:${siteId}`;
}

export function readConsent(siteId: string): CookieConsent | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(consentStorageKey(siteId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsent;
    return parsed.necessary === true ? parsed : null;
  } catch {
    return null;
  }
}

export function writeConsent(
  siteId: string,
  consent: { analytics: boolean; marketing: boolean },
): CookieConsent {
  const value: CookieConsent = {
    necessary: true,
    analytics: consent.analytics,
    marketing: consent.marketing,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(
    consentStorageKey(siteId),
    JSON.stringify(value),
  );
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
  return value;
}

export function clearConsent(siteId: string) {
  window.localStorage.removeItem(consentStorageKey(siteId));
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
}

export function hasConsentChoice(siteId: string) {
  return readConsent(siteId) !== null;
}

export function subscribeToConsent(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
