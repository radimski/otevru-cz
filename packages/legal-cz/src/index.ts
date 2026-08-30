export type {
  Block,
  LabelledValue,
  Operator,
  Section,
} from "./types";

export {
  CONSUMER_AUTHORITY,
  SUPERVISORY_AUTHORITY,
  buildOperatorRows,
  formatAddress,
  formatCompanyName,
  formatRegistryEntry,
} from "./operator";

export {
  buildCookieSections,
  buildOperatorSections,
  buildPrivacySections,
} from "./content";

export type { CookieConsent } from "./cookieConsent";
export {
  CONSENT_EVENT,
  clearConsent,
  consentStorageKey,
  hasConsentChoice,
  readConsent,
  subscribeToConsent,
  writeConsent,
} from "./cookieConsent";

export type {
  DayHours,
  OpenStatusResult,
  OpeningSchedule,
  WeekSchedule,
} from "./openHours";
export { evaluateOpenStatus } from "./openHours";
