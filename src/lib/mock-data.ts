import type { DailyInfo, OutfitEntry, OutfitWinner } from "./types";

export const MOCK_WINNER: OutfitWinner = {
  username: "@ChocoMallow",
  server: "Global-1",
  playerId: "84920411",
  votes: 342,
  imageUrl: "https://picsum.photos/seed/hato-chocomallow/480/640",
};

export const MOCK_DAILY_INFO: DailyInfo[] = [
  {
    id: "1",
    type: "roaming_oak",
    description: "Home Plot 7, left side, near road",
    locationId: "plot-house-7",
    positionId: "front-yard",
    trueVotes: 24,
    falseVotes: 1,
    validated: true,
  },
  {
    id: "2",
    type: "fluorite",
    description: "Home Plot 6, left side, near road",
    locationId: "plot-house-6",
    positionId: "front-yard",
    trueVotes: 21,
    falseVotes: 0,
    validated: true,
  },
  {
    id: "3",
    type: "other",
    author: "@LounaPlume",
    description:
      'The new "Cozy Autumn" furniture banner was just announced for tomorrow at 4:00 AM server time!',
    trueVotes: 12,
    falseVotes: 2,
    validated: false,
  },
];

export const MOCK_OUTFITS: OutfitEntry[] = [
  {
    id: "1",
    username: "@Yuki",
    server: "S2",
    votes: 45,
    imageUrl: "https://picsum.photos/seed/hato-yuki/400/520",
  },
  {
    id: "2",
    username: "@Maxou",
    server: "S1",
    votes: 32,
    imageUrl: "https://picsum.photos/seed/hato-maxou/520/400",
  },
  {
    id: "3",
    username: "@Fleur",
    server: "S1",
    votes: 19,
    imageUrl: "https://picsum.photos/seed/hato-fleur/360/640",
  },
  {
    id: "4",
    username: "@Kiki",
    server: "S3",
    votes: 8,
    imageUrl: "https://picsum.photos/seed/hato-kiki/640/360",
  },
];
