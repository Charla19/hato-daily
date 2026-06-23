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
