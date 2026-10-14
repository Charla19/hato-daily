"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSound } from "@/components/SoundProvider";

export function SoundToggleButton() {
  const { muted, toggleMuted } = useSound();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <button
      type="button"
      onClick={toggleMuted}
      className="sound-toggle-btn"
      aria-label={muted ? "Turn sounds on" : "Turn sounds off"}
      title={muted ? "Sounds off" : "Sounds on"}
    >
      <span className="sound-toggle-btn-icon" aria-hidden="true">
        {muted ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5 6 9H3v6h3l5 4V5ZM17 9l4 6m0-6-4 6" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5 6 9H3v6h3l5 4V5ZM15.5 8.5a5 5 0 0 1 0 7m2.5-9.5a8.5 8.5 0 0 1 0 12" />
          </svg>
        )}
      </span>
    </button>,
    document.body,
  );
}
