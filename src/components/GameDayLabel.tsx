"use client";

import { formatGameDateLabel } from "@/lib/day-key";

type GameDayLabelProps = {
  className?: string;
  align?: "left" | "right";
};

const badgeBase =
  "game-day-label shrink-0 rounded-xl border-2 border-[#f0d060] bg-[#fffef2] shadow-[0_2px_0_#f0d060]";

export function GameDayLabel({
  className = "",
  align = "right",
}: GameDayLabelProps) {
  const { dayKey, weekday, shortDate } = formatGameDateLabel();
  const alignClass =
    align === "left" ? "items-start text-left" : "items-end text-right";
  const weekdayShort = weekday.slice(0, 3);

  return (
    <time dateTime={dayKey} className={className}>
      {/* Mobile: compact single-line badge */}
      <span
        className={`${badgeBase} inline-flex px-2 py-1 font-[family-name:var(--font-fredoka)] text-[11px] font-semibold leading-none text-[#3d4a5c] sm:hidden`}
      >
        {weekdayShort} · {shortDate}
      </span>

      {/* sm+: full stacked badge */}
      <span
        className={`${badgeBase} hidden flex-col px-3 py-1.5 sm:flex ${alignClass}`}
      >
        <span className="font-[family-name:var(--font-nunito)] text-[10px] font-bold uppercase tracking-[0.14em] text-[#9a8b6e]">
          Today
        </span>
        <span className="font-[family-name:var(--font-fredoka)] text-sm font-semibold leading-tight text-[#3d4a5c]">
          {weekday}
        </span>
        <span className="font-[family-name:var(--font-nunito)] text-xs font-semibold text-[#5c6b7a]">
          {shortDate}
        </span>
      </span>
    </time>
  );
}
