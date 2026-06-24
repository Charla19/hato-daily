"use client";

import { useEffect } from "react";
import { MAX_GIFS_PER_USER_PER_DAY, MAX_OUTFIT_SLOTS, VALIDATION_THRESHOLD } from "@/lib/constants";

type AppInfoModalProps = {
  open: boolean;
  onClose: () => void;
};

type InfoSection = {
  emoji: string;
  title: string;
  items: string[];
};

const INFO_SECTIONS: InfoSection[] = [
  {
    emoji: "🌸",
    title: "What is Hato Daily?",
    items: [
      "A community board for Heartopia dailies: intel spots, outfit votes, and GIF laughs.",
      "Everyone can read posts. You need a display name before sharing anything.",
    ],
  },
  {
    emoji: "⏳",
    title: "Daily reset",
    items: [
      "A new Heartopia day starts at 6:00 AM UTC (same rhythm as in-game dailies).",
      "Intel, runway uploads, GIF uploads, and votes refresh when the countdown hits zero.",
    ],
  },
  {
    emoji: "👤",
    title: "Your display name",
    items: [
      "Pick a pseudo once so others know who posted.",
      "It is saved for your connection. A new network may ask you to set it again.",
    ],
  },
  {
    emoji: "📍",
    title: "Today's Intel",
    items: [
      "Share Flawless Fluorite spots, Roaming Oak sightings, weather, or other tips.",
      "Vote ✅ if it looks right, ❌ if not. One vote per report.",
      `Roaming Oak locks at ${VALIDATION_THRESHOLD}+ ✅ votes — only one confirmed oak per day.`,
    ],
  },
  {
    emoji: "👗",
    title: "Today's Runway",
    items: [
      "Tap the pink quiz button at the top of the Runway panel.",
      "Answer 3 Heartopia questions with a perfect score to earn an upload slot.",
      `First ${MAX_OUTFIT_SLOTS} players per day can post a look. Others can ❤️ vote.`,
      "Yesterday's most liked look becomes today's Style Icon in the header.",
    ],
  },
  {
    emoji: "🎬",
    title: "GIF Gallery",
    items: [
      "Open GIF Gallery from the header button on the home page.",
      `Upload Heartopia GIFs only — ${MAX_GIFS_PER_USER_PER_DAY} per player per day.`,
      "React with 😂 Haha or ❤️ Heart. Tap a GIF for full-screen scroll view.",
    ],
  },
  {
    emoji: "🤝",
    title: "Play fair",
    items: [
      "Post real in-game info. No spam, hate, or off-topic uploads.",
      "Be kind — this is a fan space made by players, for players.",
    ],
  },
];

export function AppInfoModal({ open, onClose }: AppInfoModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="quiz-overlay fixed inset-0 z-[110] flex items-end justify-center bg-black/40 p-3 sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="app-info-modal flex max-h-[min(90dvh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border-[3px] border-[#cbb8ff] bg-[#e4d9ff] shadow-xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-info-title"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b-[3px] border-dashed border-[rgba(61,74,92,0.12)] px-4 py-4 sm:px-5">
          <div>
            <h2
              id="app-info-title"
              className="font-[family-name:var(--font-fredoka)] text-lg font-bold text-[#3d4a5c] sm:text-xl"
            >
              ℹ️ How Hato Daily works
            </h2>
            <p className="mt-1 text-xs text-[var(--ink-soft)] sm:text-sm">
              Quick guide for new and returning players
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border-2 border-[#cbb8ff] bg-white/70 px-2.5 py-1 text-sm font-bold text-[#3d4a5c] hover:bg-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="app-info-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-3 sm:px-5 sm:py-4">
          {INFO_SECTIONS.map((section) => (
            <section key={section.title} className="app-info-section mb-3 last:mb-0">
              <h3 className="app-info-section-title">
                <span aria-hidden="true">{section.emoji}</span> {section.title}
              </h3>
              <ul className="app-info-list">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
