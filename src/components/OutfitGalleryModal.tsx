"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { OutfitEntry } from "@/lib/types";

type OutfitGalleryModalProps = {
  outfits: OutfitEntry[];
  startIndex: number;
  open: boolean;
  onClose: () => void;
  onVote: (id: string) => void;
};

export function OutfitGalleryModal({
  outfits,
  startIndex,
  open,
  onClose,
  onVote,
}: OutfitGalleryModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    if (!open || !scrollRef.current) return;

    const target = itemRefs.current[startIndex];
    if (!target) return;

    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "auto", block: "start" });
    });
  }, [open, startIndex]);

  if (!open || !mounted || outfits.length === 0) return null;

  return createPortal(
    <div
      className="gallery-overlay fixed inset-0 z-[100] bg-black/85"
      role="presentation"
    >
      <div className="gallery-chrome pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-4">
        <p className="pointer-events-auto rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          Scroll up and down · {outfits.length} looks
        </p>
        <button
          type="button"
          onClick={onClose}
          className="pointer-events-auto rounded-full bg-white/15 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-sm hover:bg-white/25"
          aria-label="Close gallery"
        >
          ✕ Close
        </button>
      </div>

      <div
        ref={scrollRef}
        className="gallery-scroll h-full overflow-y-auto overscroll-y-contain scroll-smooth"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {outfits.map((outfit, index) => (
          <section
            key={outfit.id}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            className="gallery-slide flex min-h-full flex-col items-center justify-center px-4 py-16"
            style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
          >
            <div className="gallery-frame mb-4 flex h-[min(70vh,640px)] w-full max-w-lg items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3">
              {outfit.imageUrl ? (
                <img
                  src={outfit.imageUrl}
                  alt={`${outfit.username}'s outfit`}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-white/50">
                  No image available
                </div>
              )}
            </div>

            <div className="text-center text-white">
              <p className="text-lg font-bold">{outfit.username}</p>
              <p className="mt-1 text-sm text-white/70">
                {outfit.server}
                {outfit.playerId ? ` · ID ${outfit.playerId}` : ""}
              </p>
              <button
                type="button"
                onClick={() => onVote(outfit.id)}
                disabled={outfit.hasLiked}
                className={`gallery-vote-btn mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition-transform ${
                  outfit.hasLiked
                    ? "gallery-vote-btn-liked cursor-not-allowed"
                    : "hover:scale-105 active:scale-95"
                }`}
                aria-pressed={outfit.hasLiked}
              >
                {outfit.hasLiked ? `❤️ Liked · ${outfit.votes}` : `❤️ Like · ${outfit.votes}`}
              </button>
            </div>

            {index < outfits.length - 1 && (
              <p className="mt-8 animate-pulse text-xs text-white/40">
                ↓ scroll for next look
              </p>
            )}
          </section>
        ))}
      </div>
    </div>,
    document.body,
  );
}
