"use client";

import { useEffect, useMemo } from "react";
import { InfoCard } from "@/components/InfoCard";
import { INTEL_MODAL_MAX_HEIGHT } from "@/lib/constants";
import type { DailyInfo } from "@/lib/types";

type IntelFeedModalProps = {
  items: DailyInfo[];
  open: boolean;
  onClose: () => void;
  onVote?: (id: string, vote: "true" | "false") => void;
};

export function IntelFeedModal({ items, open, onClose, onVote }: IntelFeedModalProps) {
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (a.validated && !b.validated) return -1;
      if (!a.validated && b.validated) return 1;
      if (a.validated && b.validated) return b.trueVotes - a.trueVotes;
      return b.trueVotes - a.trueVotes;
    });
  }, [items]);

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
      className="quiz-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="intel-modal flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border-[3px] border-[#b8e4ff] bg-[#dff5ff] shadow-xl"
        style={{ maxHeight: INTEL_MODAL_MAX_HEIGHT }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="intel-modal-title"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b-[3px] border-dashed border-[rgba(61,74,92,0.12)] px-4 py-4 sm:px-5">
          <div>
            <h3
              id="intel-modal-title"
              className="font-[family-name:var(--font-fredoka)] text-lg font-bold text-[#3d4a5c]"
            >
              📍 Today&apos;s Intel
            </h3>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">
              {sortedItems.length} community report{sortedItems.length === 1 ? "" : "s"} today
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border-2 border-[#b8e4ff] bg-white/70 px-2.5 py-1 text-sm font-bold text-[#3d4a5c] hover:bg-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div
          className="panel-scroll-area min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-3 sm:px-5"
          data-tone="sky"
        >
          {sortedItems.length === 0 ? (
            <p className="py-6 text-center text-sm text-[var(--ink-soft)]">
              Nothing posted yet. Be the first!
            </p>
          ) : (
            sortedItems.map((info) => (
              <InfoCard key={info.id} info={info} onVote={onVote} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
