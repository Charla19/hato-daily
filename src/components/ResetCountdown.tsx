"use client";

import { useEffect, useState } from "react";
import { getResetCountdown, type ResetCountdownParts } from "@/lib/day-key";

export function useResetCountdown(): ResetCountdownParts {
  const [countdown, setCountdown] = useState(() => getResetCountdown());

  useEffect(() => {
    const tick = () => setCountdown(getResetCountdown());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return countdown;
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

type ResetCountdownTone = "pink" | "sky";

type ResetCountdownPanelProps = {
  tone?: ResetCountdownTone;
  className?: string;
};

export function ResetCountdownPanel({ tone = "pink", className = "" }: ResetCountdownPanelProps) {
  const { hours, minutes, seconds } = useResetCountdown();

  return (
    <div
      className={`reset-countdown-panel reset-countdown-panel-${tone} ${className}`}
      role="timer"
      aria-live="polite"
      aria-label={`Next daily reset in ${hours} hours ${minutes} minutes ${seconds} seconds`}
    >
      <p className="reset-countdown-label">⏳ Next Heartopia reset</p>
      <p className="reset-countdown-digits">
        <span className="reset-countdown-part">{hours}h</span>
        <span className="reset-countdown-sep">:</span>
        <span className="reset-countdown-part">{pad2(minutes)}m</span>
        <span className="reset-countdown-sep">:</span>
        <span className="reset-countdown-part reset-countdown-seconds">{pad2(seconds)}s</span>
      </p>
      <p className="reset-countdown-hint">Intel, runway and GIFs refresh when this hits zero</p>
    </div>
  );
}

type ResetCountdownProps = {
  className?: string;
};

export function ResetCountdown({ className = "" }: ResetCountdownProps) {
  const { hours, minutes, seconds } = useResetCountdown();

  return (
    <span className={`reset-countdown font-semibold tabular-nums ${className}`}>
      {hours}h {pad2(minutes)}m {pad2(seconds)}s
    </span>
  );
}
