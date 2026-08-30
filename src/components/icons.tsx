import type { ReactElement } from "react";

/** Obrysové ikony služeb — barvu řídí CSS (stroke: currentColor). */
export const serviceIcons: Record<string, ReactElement> = {
  unlock: (
    <svg className="otevru-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="1.5" strokeWidth="1.6" />
      <path d="M8 11V8a4 4 0 0 1 7.5-2" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  key: (
    <svg className="otevru-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="4" strokeWidth="1.6" />
      <path
        d="M11 11L20 20M20 20V16M20 20H16"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  door: (
    <svg className="otevru-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="6" y="3" width="12" height="18" rx="1" strokeWidth="1.6" />
      <circle cx="14.5" cy="12" r="1.1" />
    </svg>
  ),
  safe: (
    <svg className="otevru-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="1.5" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3" strokeWidth="1.6" />
      <path
        d="M12 9V7M12 17v-2M9 12H7M17 12h-2"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  repair: (
    <svg className="otevru-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-3.3-3.3 2.1-2.1z"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  home: (
    <svg className="otevru-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export function PhoneIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8c1.4 2.8 3.4 4.8 6.2 6.2l2.1-2.1c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.3 0 .7-.2 1L6.6 10.8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
