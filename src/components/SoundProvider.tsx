"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { SOUND_FILES, type SoundId } from "@/lib/sounds";

const STORAGE_KEY = "hato-daily-sound-muted";

type SoundContextValue = {
  muted: boolean;
  toggleMuted: () => void;
  playSound: (sound: SoundId) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(false);
  const cacheRef = useRef(new Map<string, HTMLAudioElement>());

  useEffect(() => {
    try {
      setMuted(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      setMuted(false);
    } finally {
      setReady(true);
    }
  }, []);

  const toggleMuted = useCallback(() => {
    setMuted((current) => {
      const next = !current;
      if (next) {
        for (const audio of cacheRef.current.values()) {
          audio.pause();
          audio.currentTime = 0;
        }
      }
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  const playSound = useCallback(
    (sound: SoundId) => {
      if (!ready || muted) return;

      for (const audio of cacheRef.current.values()) {
        audio.pause();
        audio.currentTime = 0;
      }

      const src = SOUND_FILES[sound];
      let audio = cacheRef.current.get(src);
      if (!audio) {
        audio = new Audio(src);
        audio.preload = "auto";
        cacheRef.current.set(src, audio);
      }

      audio.currentTime = 0;
      void audio.play().catch(() => {
        // Browsers may block autoplay until a user gesture; clicks are fine.
      });
    },
    [muted, ready],
  );

  const value = useMemo(
    () => ({
      muted,
      toggleMuted,
      playSound,
    }),
    [muted, toggleMuted, playSound],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within SoundProvider");
  }
  return context;
}
