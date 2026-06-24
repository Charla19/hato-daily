"use client";

import { GALLERY_REACTIONS } from "@/lib/gallery-reactions";
import type { GifEntry, GifReactionType } from "@/lib/types";

type GalleryReactionPanelProps = {
  gif: GifEntry;
  onReact: (reaction: GifReactionType) => void;
};

export function GalleryReactionPanel({ gif, onReact }: GalleryReactionPanelProps) {
  return (
    <div className="gallery-reaction-panel">
      <p className="gallery-reaction-panel-label">Pick a vibe</p>
      <div className="gallery-reaction-grid">
        {GALLERY_REACTIONS.map((reaction) => {
          const active = gif.userReaction === reaction.id;

          return (
            <button
              key={reaction.id}
              type="button"
              onClick={() => onReact(reaction.id)}
              className={`gallery-reaction-btn ${active ? "gallery-reaction-btn-active" : ""} ${
                reaction.id === "heart" ? "gallery-reaction-btn-heart" : ""
              }`}
              aria-pressed={active}
              title={reaction.label}
            >
              <span className="gallery-reaction-emoji" aria-hidden="true">
                {reaction.emoji}
              </span>
              <span className="gallery-reaction-name">{reaction.label}</span>
              <span className="gallery-reaction-count">{gif.reactionVotes[reaction.id]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
