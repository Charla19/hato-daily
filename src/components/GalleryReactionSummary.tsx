import { GALLERY_REACTIONS } from "@/lib/gallery-reactions";
import type { GifEntry } from "@/lib/types";

type GalleryReactionSummaryProps = {
  gif: GifEntry;
  className?: string;
};

export function GalleryReactionSummary({ gif, className = "" }: GalleryReactionSummaryProps) {
  return (
    <p className={`gallery-reaction-summary ${className}`.trim()}>
      {GALLERY_REACTIONS.map((reaction) => (
        <span key={reaction.id} className="gallery-reaction-summary-item">
          {reaction.emoji} {gif.reactionVotes[reaction.id]}
        </span>
      ))}
    </p>
  );
}
