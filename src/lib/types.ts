import type { InfoTypeId } from "./constants";

export type DailyInfo = {
  id: string;
  type: InfoTypeId;
  author?: string;
  description: string;
  locationId?: string;
  positionId?: string;
  trueVotes: number;
  falseVotes: number;
  validated: boolean;
  userVote?: "true" | "false";
};

export type OutfitWinner = {
  username: string;
  server: string;
  playerId: string;
  votes: number;
  imageUrl?: string;
};

export type OutfitEntry = {
  id: string;
  username: string;
  server: string;
  playerId?: string;
  votes: number;
  imageUrl?: string;
  hasLiked?: boolean;
};

export type OutfitSubmission = {
  username: string;
  server: string;
  playerId: string;
  imageUrl: string;
};

export type GifReactionType = "haha" | "heart" | "cute" | "bug" | "romance" | "brain";

export type GifEntry = {
  id: string;
  author: string;
  imageUrl: string;
  caption?: string | null;
  reactionVotes: Record<GifReactionType, number>;
  userReaction?: GifReactionType;
};

export type BuildKind = "photo" | "video";
export type BuildReactionType = "love" | "inspiring" | "try_it";

export type BuildEntry = {
  id: string;
  kind: BuildKind;
  title: string;
  description: string;
  category?: string | null;
  author: string;
  server?: string | null;
  openToVisitors: boolean;
  photoUrl?: string | null;
  youtubeVideoId?: string | null;
  createdAt: string;
  reactionVotes: Record<BuildReactionType, number>;
  userReaction?: BuildReactionType;
};
