import type { GifReactionType } from "@/lib/types";

export type GalleryReactionConfig = {
  id: GifReactionType;
  emoji: string;
  label: string;
  sound: GifReactionType;
};

export const GALLERY_REACTIONS: GalleryReactionConfig[] = [
  { id: "haha", emoji: "😂", label: "Haha", sound: "haha" },
  { id: "heart", emoji: "❤️", label: "Heart", sound: "heart" },
  { id: "cute", emoji: "😍", label: "Cute", sound: "cute" },
  { id: "bug", emoji: "🐛", label: "Bug", sound: "bug" },
  { id: "romance", emoji: "💫", label: "Delulu", sound: "romance" },
  { id: "brain", emoji: "🧠", label: "Galaxy", sound: "brain" },
];

export const GALLERY_REACTION_IDS = GALLERY_REACTIONS.map((reaction) => reaction.id);

export function isGifReactionType(value: string): value is GifReactionType {
  return (GALLERY_REACTION_IDS as string[]).includes(value);
}

export function emptyReactionVotes(): Record<GifReactionType, number> {
  return {
    haha: 0,
    heart: 0,
    cute: 0,
    bug: 0,
    romance: 0,
    brain: 0,
  };
}
