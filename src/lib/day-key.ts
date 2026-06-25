/**
 * Heartopia Global server resets at 6:00 AM America/New_York.
 * That is 5:00 UTC during EST (winter) and 10:00 UTC during EDT (summer).
 *
 * Default: 5 UTC — matches 8:00 AM in Madagascar (EAT, UTC+3) during US standard time,
 * which is when many Global players see the daily flip. Override with SERVER_RESET_HOUR_UTC.
 */
const DEFAULT_RESET_HOUR_UTC = 5;

function getResetHourUtc(): number {
  const raw = process.env.SERVER_RESET_HOUR_UTC;
  if (raw) {
    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed >= 0 && parsed < 24) {
      return Math.floor(parsed);
    }
  }
  return DEFAULT_RESET_HOUR_UTC;
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function getUtcDateParts(now: Date): { year: number; month: number; day: number; hour: number } {
  return {
    year: now.getUTCFullYear(),
    month: now.getUTCMonth() + 1,
    day: now.getUTCDate(),
    hour: now.getUTCHours(),
  };
}

function formatDayKey(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

/** Current Heartopia game day (YYYY-MM-DD, UTC calendar after reset hour). */
export function getCurrentDayKey(now = new Date()): string {
  const resetHour = getResetHourUtc();
  const { year, month, day, hour } = getUtcDateParts(now);

  if (hour < resetHour) {
    const previous = new Date(Date.UTC(year, month - 1, day));
    previous.setUTCDate(previous.getUTCDate() - 1);
    return formatDayKey(previous.getUTCFullYear(), previous.getUTCMonth() + 1, previous.getUTCDate());
  }

  return formatDayKey(year, month, day);
}

export function formatGameDateLabel(now = new Date()): {
  dayKey: string;
  weekday: string;
  shortDate: string;
} {
  const dayKey = getCurrentDayKey(now);
  const [year, month, day] = dayKey.split("-").map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day));

  const weekday = utcDate.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "UTC",
  });
  const shortDate = utcDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

  return { dayKey, weekday, shortDate };
}

export function getPreviousDayKey(now = new Date()): string {
  const dayKey = getCurrentDayKey(now);
  const [year, month, day] = dayKey.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day));
  utc.setUTCDate(utc.getUTCDate() - 1);
  return formatDayKey(utc.getUTCFullYear(), utc.getUTCMonth() + 1, utc.getUTCDate());
}

export function getNextResetUtc(now = new Date()): Date {
  const resetHour = getResetHourUtc();
  const { year, month, day, hour } = getUtcDateParts(now);

  const next = new Date(Date.UTC(year, month - 1, day, resetHour, 0, 0, 0));
  if (hour >= resetHour) {
    next.setUTCDate(next.getUTCDate() + 1);
  }

  return next;
}

export function getNextResetLabel(now = new Date()): string {
  const { hours, minutes, seconds } = getResetCountdown(now);
  return `${hours}h ${pad2(minutes)}m ${pad2(seconds)}s`;
}

export type ResetCountdownParts = {
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
};

export function getResetCountdown(now = new Date()): ResetCountdownParts {
  const nextReset = getNextResetUtc(now);
  const totalMs = Math.max(0, nextReset.getTime() - now.getTime());
  const hours = Math.floor(totalMs / (1000 * 60 * 60));
  const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, totalMs };
}
