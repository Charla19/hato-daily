"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { GifEntry, GifReactionType } from "@/lib/types";

type GifGalleryModalProps = {
  gifs: GifEntry[];
  startIndex: number;
  open: boolean;
  onClose: () => void;
  onReact: (id: string, reaction: GifReactionType) => void;
};

export function GifGalleryModal({
  gifs,
  startIndex,
  open,
  onClose,
  onReact,
}: GifGalleryModalProps) {
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

  if (!open || !mounted || gifs.length === 0) return null;

  return createPortal(
    <div className="gallery-overlay fixed inset-0 z-[100] bg-black/85" role="presentation">
      <div className="gallery-chrome pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-4">
        <p className="pointer-events-auto rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          Scroll up and down · {gifs.length} GIF{gifs.length === 1 ? "" : "s"}
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
        {gifs.map((gif, index) => (
          <section
            key={gif.id}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            className="gallery-slide box-border flex h-dvh max-h-dvh min-h-dvh flex-col items-center px-4 pb-8 pt-[4.5rem]"
            style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
          >
            <div className="gallery-frame mb-3 flex min-h-0 w-full max-w-lg flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3">
              <img
                src={gif.imageUrl}
                alt={`GIF by ${gif.author}`}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="shrink-0 text-center text-white">
              <p className="text-lg font-bold">{gif.author}</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => onReact(gif.id, "haha")}
                  className={`gallery-react-btn inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-transform ${
                    gif.userReaction === "haha"
                      ? "gallery-react-btn-active"
                      : "hover:scale-105 active:scale-95"
                  }`}
                  aria-pressed={gif.userReaction === "haha"}
                >
                  😂 Haha · {gif.hahaVotes}
                </button>
                <button
                  type="button"
                  onClick={() => onReact(gif.id, "heart")}
                  className={`gallery-react-btn gallery-react-btn-heart inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-transform ${
                    gif.userReaction === "heart"
                      ? "gallery-react-btn-active"
                      : "hover:scale-105 active:scale-95"
                  }`}
                  aria-pressed={gif.userReaction === "heart"}
                >
                  ❤️ Heart · {gif.heartVotes}
                </button>
              </div>
            </div>

            {index < gifs.length - 1 && (
              <p className="gallery-scroll-hint mt-4 shrink-0 text-sm font-semibold sm:mt-5 sm:text-base">
                ↓ scroll for next GIF
              </p>
            )}
          </section>
        ))}
      </div>
    </div>,
    document.body,
  );
}
