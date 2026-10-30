"use client";

import { useEffect } from "react";
import { MAX_GIFS_PER_USER_PER_DAY, MAX_GALLERY_CAPTION_LENGTH, MAX_OUTFIT_SLOTS, QUIZ_QUESTION_COUNT, VALIDATION_THRESHOLD } from "@/lib/constants";

type AppInfoModalProps = {
  open: boolean;
  onClose: () => void;
};

type InfoSection = {
  title: string;
  items: string[];
};

const INFO_SECTIONS: InfoSection[] = [
  {
    title: "What is Hato Daily?",
    items: [
      "Daily board for Heartopia: fluorite/oak spots, outfit votes, gallery.",
      "You can read everything without signing up. Set a pseudo before you post.",
    ],
  },
  {
    title: "Daily reset",
    items: [
      "All timers and daily flips use Heartopia Global Server time (6:00 AM Eastern).",
      "America, Asia, and SEA servers reset at different hours. If you play on another server, your in-game day may not match ours.",
      "Intel and runway refresh when the timer hits zero. Gallery posts stay up.",
      "Upload limits reset daily too.",
    ],
  },
  {
    title: "Your pseudo",
    items: [
      "Pick a name once so people know it's you.",
      "Tied to your connection. New network = set it again.",
    ],
  },
  {
    title: "Today's Intel",
    items: [
      "Post fluorite spots, roaming oak, weather, whatever helps today.",
      "Vote true or false on a report. One vote per report.",
      `Flawless Fluorite and Roaming Oak lock after ${VALIDATION_THRESHOLD}+ true votes and rise to the top.`,
      "One confirmed fluorite and one confirmed oak per day.",
    ],
  },
  {
    title: "Today's Runway",
    items: [
      "Hit the pink quiz button on the Runway panel.",
      `Answer ${QUIZ_QUESTION_COUNT} Heartopia question to unlock an upload.`,
      `First ${MAX_OUTFIT_SLOTS} players per day get a slot. Everyone else can vote.`,
      "Yesterday's top look shows up as today's Style Icon.",
    ],
  },
  {
    title: "Gallery",
    items: [
      "Use the Gallery button in the header.",
      `Post Heartopia GIFs or screenshots with an optional caption (${MAX_GALLERY_CAPTION_LENGTH} chars max).`,
      `Posts stay in the gallery until removed from the database. ${MAX_GIFS_PER_USER_PER_DAY} uploads per player per day.`,
      "React with the emotion panel, or tap a post for fullscreen scroll.",
    ],
  },
  {
    title: "Homes and build guides",
    items: [
      "Share a Heartopia home photo or a YouTube walkthrough with a description.",
      "Browse photo builds and video tutorials, then react to ideas you want to try.",
      "Open a photo to see it larger with its details and reactions.",
    ],
  },
  {
    title: "Keep Hato Daily on your phone",
    items: [
      "Add the app to your home screen to open the village board with one tap.",
      "On Android, use Install Hato Daily when it appears. On iPhone, open Share, then Add to Home Screen.",
      "Your pseudo follows your connection, not an Hato Daily account. A new network or device may ask you to choose it again.",
    ],
  },
  {
    title: "Keep it honest",
    items: [
      "Real in-game info only. No spam or off-topic stuff.",
      "It's a fan site. Be decent to each other.",
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
              How Hato Daily works
            </h2>
            <p className="mt-1 text-xs text-[var(--ink-soft)] sm:text-sm">
              Stuff to know before you post
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
                {section.title}
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
