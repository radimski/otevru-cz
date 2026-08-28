export type DayHours = { open: string; close: string } | null;

/** Index 0 = Sunday … 6 = Saturday (matches `Date.getDay()` in Europe/Prague). */
export type WeekSchedule = readonly [
  DayHours,
  DayHours,
  DayHours,
  DayHours,
  DayHours,
  DayHours,
  DayHours,
];

export type OpeningSchedule = {
  timezone?: string;
  week: WeekSchedule;
};

export type OpenStatusResult = {
  isOpen: boolean;
  label: string;
  detail: string;
  ariaLabel: string;
};

const DAY_NAMES = [
  "neděli",
  "pondělí",
  "úterý",
  "středu",
  "čtvrtek",
  "pátek",
  "sobotu",
] as const;

const WEEKDAY_SHORT = ["ne", "po", "út", "st", "čt", "pá", "so"] as const;

function parseTime(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatTime(value: string): string {
  const [hours, minutes] = value.split(":").map(Number);
  return `${hours}:${String(minutes).padStart(2, "0")}`;
}

function getPragueClock(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return {
    day: dayMap[get("weekday")] ?? 0,
    minutes: parseTime(`${get("hour")}:${get("minute")}`),
  };
}

function findNextOpen(
  week: WeekSchedule,
  fromDay: number,
): { day: number; open: string } | null {
  for (let offset = 0; offset < 7; offset += 1) {
    const day = (fromDay + offset) % 7;
    const hours = week[day];
    if (hours) {
      return { day, open: hours.open };
    }
  }
  return null;
}

export function evaluateOpenStatus(
  schedule: OpeningSchedule,
  now = new Date(),
): OpenStatusResult {
  const timezone = schedule.timezone ?? "Europe/Prague";
  const { day, minutes } = getPragueClock(now, timezone);
  const today = schedule.week[day];

  if (today) {
    const openMinutes = parseTime(today.open);
    const closeMinutes = parseTime(today.close);

    if (minutes >= openMinutes && minutes < closeMinutes) {
      return {
        isOpen: true,
        label: "Otevřeno",
        detail: `Do ${formatTime(today.close)}`,
        ariaLabel: `Právě otevřeno, zavírá v ${formatTime(today.close)}`,
      };
    }

    if (minutes < openMinutes) {
      return {
        isOpen: false,
        label: "Zavřeno",
        detail: `Otevírá v ${formatTime(today.open)}`,
        ariaLabel: `Právě zavřeno, dnes otevírá v ${formatTime(today.open)}`,
      };
    }
  }

  const next = findNextOpen(schedule.week, (day + 1) % 7);
  if (next) {
    const tomorrow = (day + 1) % 7;
    const when =
      next.day === tomorrow
        ? "zítra"
        : `${DAY_NAMES[next.day]}`;
    return {
      isOpen: false,
      label: "Zavřeno",
      detail:
        next.day === tomorrow
          ? `Otevírá zítra ${formatTime(next.open)}`
          : `Otevírá v ${when} ${formatTime(next.open)}`,
      ariaLabel:
        next.day === tomorrow
          ? `Právě zavřeno, zítra otevírá v ${formatTime(next.open)}`
          : `Právě zavřeno, otevírá v ${when} v ${formatTime(next.open)}`,
    };
  }

  const openDays = WEEKDAY_SHORT.filter((_, index) => schedule.week[index]);
  return {
    isOpen: false,
    label: "Zavřeno",
    detail: openDays.length ? `Provoz ${openDays.join(", ")}` : "Mimo provoz",
    ariaLabel: "Právě zavřeno",
  };
}
