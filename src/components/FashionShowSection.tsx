"use client";

import { useState } from "react";
import { OutfitGalleryModal } from "@/components/OutfitGalleryModal";
import { PanelCard } from "@/components/PanelCard";
import { QuizModal } from "@/components/QuizModal";
import { SeeAllButton } from "@/components/SeeAllButton";
import { MAX_OUTFIT_SLOTS, RUNWAY_PREVIEW_MAX_HEIGHT } from "@/lib/constants";
import type { OutfitEntry, OutfitSubmission } from "@/lib/types";

type FashionShowSectionProps = {
  outfits: OutfitEntry[];
  slotsRemaining: number;
  resetLabel: string;
  hasSubmittedToday: boolean;
  defaultUsername?: string;
  onVote: (id: string) => void;
  onSubmitOutfit: (submission: OutfitSubmission) => Promise<boolean>;
};

export function FashionShowSection({
  outfits,
  slotsRemaining,
  resetLabel,
  hasSubmittedToday,
  defaultUsername = "",
  onVote,
  onSubmitOutfit,
}: FashionShowSectionProps) {
  const [quizOpen, setQuizOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const slotsFull = slotsRemaining <= 0;

  function openGallery(index: number) {
    setGalleryStartIndex(index);
    setGalleryOpen(true);
  }

  return (
    <>
      <PanelCard tone="pink" title="Today's Runway" icon="👗" insect="butterfly-orange">
        <div className="alert-quiz mb-3 rounded-xl px-2 py-2 text-center text-xs">
          <strong>Quiz time!</strong>
          <br />
          {slotsRemaining}/{MAX_OUTFIT_SLOTS} upload slots left today.
        </div>

        {hasSubmittedToday ? (
          <div className="status-ok mb-3 rounded-xl px-3 py-3 text-center">
            <p className="text-sm font-bold">✅ You&apos;re on today&apos;s runway!</p>
            <p className="mt-1 text-xs text-[var(--ink-soft)]">
              Good luck with the votes. Come back tomorrow for another shot at Style Icon.
            </p>
          </div>
        ) : slotsFull ? (
          <div className="status-full mb-3 rounded-xl px-3 py-3 text-center">
            <p className="text-sm font-bold">🚪 Dressing room full</p>
            <p className="mt-1 text-xs text-[var(--ink-soft)]">
              All {MAX_OUTFIT_SLOTS} slots claimed. Reset in {resetLabel}.
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setQuizOpen(true)}
            className="btn-runway-cta mb-3 w-full rounded-xl py-3 text-sm font-bold text-white"
          >
            🎮 Beat the Quiz, Enter the Runway
          </button>
        )}

        <p className="mb-3 text-center text-[11px] text-[var(--ink-soft)]">
          3 questions, perfect score, first {MAX_OUTFIT_SLOTS} winners upload
        </p>

        {outfits.length === 0 ? (
          <p className="py-4 text-center text-sm text-[var(--ink-soft)]">
            No outfits yet. Be the first through the quiz!
          </p>
        ) : (
          <>
            <div
              className="panel-scroll-area panel-scroll-fade -mx-1 overflow-y-auto overscroll-y-contain px-1"
              style={{ maxHeight: RUNWAY_PREVIEW_MAX_HEIGHT }}
              data-tone="pink"
            >
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {outfits.map((outfit, index) => (
                  <div key={outfit.id} className="fashion-card p-2 text-center">
                    {outfit.imageUrl ? (
                      <button
                        type="button"
                        onClick={() => openGallery(index)}
                        className="runway-thumb group mb-1.5 block w-full overflow-hidden rounded-lg"
                        aria-label={`View ${outfit.username}'s outfit full screen`}
                      >
                        <img
                          src={outfit.imageUrl}
                          alt={`${outfit.username}'s outfit`}
                          className="runway-thumb-img mb-1.5 w-full rounded-lg object-cover transition-transform group-hover:scale-105"
                        />
                      </button>
                    ) : (
                      <div className="mb-1.5 flex h-[100px] items-center justify-center rounded-lg bg-[#e2e8f0] text-xs text-[var(--ink-soft)]">
                        ✨ Outfit
                      </div>
                    )}
                    <div className="mb-1 text-xs text-[var(--ink)]">
                      <strong>{outfit.username}</strong> ({outfit.server})
                    </div>
                    <button
                      type="button"
                      onClick={() => onVote(outfit.id)}
                      disabled={outfit.hasLiked}
                      className={`w-full rounded-lg py-1 text-xs font-bold text-white ${
                        outfit.hasLiked ? "btn-vote-liked" : "btn-vote"
                      }`}
                      aria-pressed={outfit.hasLiked}
                    >
                      {outfit.hasLiked ? `❤️ Liked · ${outfit.votes}` : `❤️ ${outfit.votes}`}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <SeeAllButton
              count={outfits.length}
              onClick={() => openGallery(0)}
              label="See all looks"
            />
          </>
        )}

        <p className="mt-2 text-center text-[11px] text-[var(--ink-soft)]">
          Tap a look for full size, or open the scroll gallery from look #1.
        </p>

        <p className="mt-1 text-center text-xs text-[var(--ink-soft)]">
          Votes and submissions reset in {resetLabel}.
        </p>
      </PanelCard>

      <QuizModal
        open={quizOpen}
        slotsRemaining={slotsRemaining}
        defaultUsername={defaultUsername}
        onClose={() => setQuizOpen(false)}
        onSubmitOutfit={onSubmitOutfit}
      />

      <OutfitGalleryModal
        outfits={outfits}
        startIndex={galleryStartIndex}
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        onVote={onVote}
      />
    </>
  );
}
