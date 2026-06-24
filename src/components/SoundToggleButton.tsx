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
        {muted ? "🔇" : "🔊"}
      </span>
    </button>,
    document.body,
  );
}
