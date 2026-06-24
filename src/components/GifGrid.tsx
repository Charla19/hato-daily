"use client";

import { useState } from "react";
import { GifGalleryModal } from "@/components/GifGalleryModal";
import { GalleryReactionSummary } from "@/components/GalleryReactionSummary";
import { SeeAllButton } from "@/components/SeeAllButton";
import { GALLERY_GRID_MAX_HEIGHT } from "@/lib/constants";
import type { GifEntry, GifReactionType } from "@/lib/types";

type GifGridProps = {
  gifs: GifEntry[];
  onReact: (id: string, reaction: GifReactionType) => void;
};

export function GifGrid({ gifs, onReact }: GifGridProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  function openModal(index: number) {
    setStartIndex(index);
    setModalOpen(true);
  }

  if (gifs.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-[var(--ink-soft)]">
        No posts yet. Upload a GIF or screenshot.
      </p>
    );
  }

  return (
    <>
      <div
        className="panel-scroll-area panel-scroll-fade -mx-1 overflow-y-auto overscroll-y-contain px-1"
        style={{ maxHeight: GALLERY_GRID_MAX_HEIGHT }}
        data-tone="sky"
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          {gifs.map((gif, index) => (
            <button
              key={gif.id}
              type="button"
              onClick={() => openModal(index)}
              className="gif-card group overflow-hidden rounded-xl border-2 border-[#b8e4ff] bg-white/70 p-1.5 text-left shadow-[0_3px_0_rgba(61,74,92,0.08)] transition-transform hover:-translate-y-0.5"
              aria-label={`Open post by ${gif.author}`}
            >
              <div className="mb-1.5 overflow-hidden rounded-lg bg-[#f5fbff]">
                <img
                  src={gif.imageUrl}
                  alt={`Post by ${gif.author}`}
                  className="gif-card-img h-28 w-full object-cover transition-transform group-hover:scale-105 sm:h-32"
                />
              </div>
              <p className="truncate px-0.5 text-xs font-bold text-[#3d4a5c]">{gif.author}</p>
              <GalleryReactionSummary
                gif={gif}
                className="px-0.5 text-[10px] text-[var(--ink-soft)]"
              />
            </button>
          ))}
        </div>
      </div>

      <SeeAllButton count={gifs.length} onClick={() => openModal(0)} label="See all" />

      <GifGalleryModal
        gifs={gifs}
        startIndex={startIndex}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onReact={(id, reaction) => void onReact(id, reaction)}
      />
    </>
  );
}
