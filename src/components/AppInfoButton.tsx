"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AppInfoModal } from "@/components/AppInfoModal";

export function AppInfoButton() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="app-info-fab"
        aria-label="How Hato Daily works"
        title="How Hato Daily works"
      >
        <span className="app-info-fab-ring" aria-hidden="true" />
        <span className="app-info-fab-icon">i</span>
        <span className="app-info-fab-tip" aria-hidden="true">New: homes and build guides</span>
      </button>

      <AppInfoModal open={open} onClose={() => setOpen(false)} />
    </>,
    document.body,
  );
}
