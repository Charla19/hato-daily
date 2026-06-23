const DEFAULT_RESET_HOUR_UTC = 6;

export function getResetHourUtc(): number {
  const parsed = Number(process.env.SERVER_RESET_HOUR_UTC ?? DEFAULT_RESET_HOUR_UTC);
  return Number.isFinite(parsed) ? parsed : DEFAULT_RESET_HOUR_UTC;
}

/** Current Heartopia "game day" as YYYY-MM-DD (resets at SERVER_RESET_HOUR_UTC). */
export function getCurrentDayKey(now = new Date()): string {
  const adjusted = new Date(now);
  adjusted.setUTCHours(adjusted.getUTCHours() - getResetHourUtc());
  return adjusted.toISOString().slice(0, 10);
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
  const adjusted = new Date(now);
  adjusted.setUTCHours(adjusted.getUTCHours() - getResetHourUtc());
  adjusted.setUTCDate(adjusted.getUTCDate() - 1);
  return adjusted.toISOString().slice(0, 10);
}

export function getNextResetLabel(now = new Date()): string {
  const resetHour = getResetHourUtc();
  const nextReset = new Date(now);
  nextReset.setUTCHours(resetHour, 0, 0, 0);

  if (now >= nextReset) {
    nextReset.setUTCDate(nextReset.getUTCDate() + 1);
  }

  const diffMs = nextReset.getTime() - now.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
}
