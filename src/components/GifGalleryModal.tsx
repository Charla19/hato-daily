"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GalleryReactionPanel } from "@/components/GalleryReactionPanel";
import { GalleryScrollHint, useGalleryScrollHint } from "@/components/GalleryScrollHint";
import { useSound } from "@/components/SoundProvider";
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

  const showScrollHint = useGalleryScrollHint(open, gifs.length, scrollRef, itemRefs);
  const { playSound } = useSound();

  function handleReact(gifId: string, reaction: GifReactionType) {
    playSound(reaction);
    onReact(gifId, reaction);
  }

  if (!open || !mounted || gifs.length === 0) return null;

  return createPortal(
    <div className="gallery-overlay fixed inset-0 z-[100] bg-black/85" role="presentation">
      <div className="gallery-chrome pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-4">
        <p className="pointer-events-auto rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          Scroll up and down · {gifs.length} post{gifs.length === 1 ? "" : "s"}
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

      <GalleryScrollHint show={showScrollHint} />

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
            className="gallery-slide"
          >
            <div className="gallery-frame">
              <img
                src={gif.imageUrl}
                alt={`Post by ${gif.author}`}
                className="gallery-slide-img"
              />
            </div>

            <div className="gallery-slide-meta">
              <p className="text-lg font-bold">{gif.author}</p>
              {gif.caption ? (
                <p className="gallery-slide-caption" title={gif.caption}>
                  {gif.caption}
                </p>
              ) : null}
              <GalleryReactionPanel
                gif={gif}
                onReact={(reaction) => handleReact(gif.id, reaction)}
              />
            </div>
          </section>
        ))}
      </div>
    </div>,
    document.body,
  );
}
