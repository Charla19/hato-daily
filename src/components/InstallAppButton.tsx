"use client";

import { useEffect, useRef, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function InstallAppButton() {
  const promptRef = useRef<InstallPromptEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const isAppleMobile = /iPhone|iPad|iPod/.test(userAgent)
      || (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);

    setIos(isAppleMobile);
    setInstalled(isStandalone);

    function handleBeforeInstall(event: Event) {
      event.preventDefault();
      promptRef.current = event as InstallPromptEvent;
    }

    function handleInstalled() {
      promptRef.current = null;
      setInstalled(true);
      setHelpOpen(false);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  useEffect(() => {
    if (!helpOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setHelpOpen(false);
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [helpOpen]);

  async function handleInstall() {
    const prompt = promptRef.current;
    if (!prompt) {
      setHelpOpen((open) => !open);
      return;
    }

    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
    } catch {
      setHelpOpen(true);
    } finally {
      promptRef.current = null;
    }
  }

  if (installed) return null;

  return (
    <div className="pwa-install-wrap">
      <button
        type="button"
        className="pwa-install-button"
        onClick={() => void handleInstall()}
        aria-expanded={helpOpen}
        aria-controls={helpOpen ? "pwa-install-help" : undefined}
        aria-describedby={helpOpen ? "pwa-install-description" : undefined}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          <path d="M10 2.5v9m0 0 3.4-3.4M10 11.5 6.6 8.1M3.5 13.2v2.4c0 .8.6 1.4 1.4 1.4h10.2c.8 0 1.4-.6 1.4-1.4v-2.4" />
        </svg>
        <span>Install Hato Daily</span>
      </button>
      {helpOpen && (
        <div className="pwa-install-help" id="pwa-install-help" role="dialog" aria-label="Add Hato Daily to your home screen">
          <button type="button" className="pwa-install-help-close" onClick={() => setHelpOpen(false)} aria-label="Close instructions">×</button>
          <strong>Keep Hato Daily one tap away</strong>
          {ios ? (
            <p id="pwa-install-description">Tap Share in your browser, choose Add to Home Screen, then tap Add.</p>
          ) : (
            <p id="pwa-install-description">Open your browser menu and choose Install app or Add to Home screen.</p>
          )}
        </div>
      )}
    </div>
  );
}
