export type TimePeriod = { open: string; close: string };

export type DayHours = TimePeriod | { periods: readonly TimePeriod[] } | null;

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

function dayPeriods(hours: DayHours): readonly TimePeriod[] {
  if (!hours) return [];
  if ("periods" in hours) return hours.periods;
  return [hours];
}

function findNextOpen(
  week: WeekSchedule,
  fromDay: number,
): { day: number; open: string } | null {
  for (let offset = 0; offset < 7; offset += 1) {
    const day = (fromDay + offset) % 7;
    const periods = dayPeriods(week[day]);
    if (periods.length > 0) {
      return { day, open: periods[0].open };
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
  const periods = dayPeriods(schedule.week[day]);

  if (periods.length > 0) {
    for (const period of periods) {
      const openMinutes = parseTime(period.open);
      const closeMinutes = parseTime(period.close);

      if (minutes >= openMinutes && minutes < closeMinutes) {
        return {
          isOpen: true,
          label: "Otevřeno",
          detail: `Do ${formatTime(period.close)}`,
          ariaLabel: `Právě otevřeno, zavírá v ${formatTime(period.close)}`,
        };
      }
    }

    const nextPeriodToday = periods.find(
      (period) => minutes < parseTime(period.open),
    );
    if (nextPeriodToday) {
      return {
        isOpen: false,
        label: "Zavřeno",
        detail: `Otevírá v ${formatTime(nextPeriodToday.open)}`,
        ariaLabel: `Právě zavřeno, dnes otevírá v ${formatTime(nextPeriodToday.open)}`,
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
