import type { BuildEntry, BuildKind, BuildReactionType, DailyInfo, GifEntry, GifReactionType, OutfitEntry, OutfitSubmission, OutfitWinner } from "@/lib/types";

export type DashboardResponse = {
  dayKey: string;
  resetLabel: string;
  dailyInfo: DailyInfo[];
  outfits: OutfitEntry[];
  winner: OutfitWinner | null;
  hasSubmittedToday: boolean;
  slotsRemaining: number;
  maxSlots: number;
  pseudo: string | null;
};

export type GalleryResponse = {
  dayKey: string;
  resetLabel: string;
  gifs: GifEntry[];
  uploadsToday: number;
  uploadsRemaining: number;
  maxUploadsPerDay: number;
  pseudo: string | null;
};

export type BuildsResponse = {
  builds: BuildEntry[];
  uploadsRemaining: number;
  maxUploadsPerDay: number;
  pseudo: string | null;
};

export type BuildSubmission = {
  kind: BuildKind;
  title: string;
  description: string;
  category?: string;
  server?: string;
  openToVisitors?: boolean;
  photoDataUrl?: string;
  youtubeUrl?: string;
};

export type IntelSubmission = {
  type: DailyInfo["type"];
  description: string;
  locationId?: string;
  positionId?: string;
  pseudo: string;
};

async function parseError(response: Response): Promise<string> {
  try {
    const body = await response.json();
    return body.error ?? "Request failed.";
  } catch {
    return "Request failed.";
  }
}

export async function fetchDashboard(voterId: string): Promise<DashboardResponse> {
  const response = await fetch(`/api/dashboard?voterId=${encodeURIComponent(voterId)}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function fetchGallery(voterId: string): Promise<GalleryResponse> {
  const response = await fetch(`/api/gallery?voterId=${encodeURIComponent(voterId)}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function fetchBuilds(voterId: string): Promise<BuildsResponse> {
  const response = await fetch(`/api/builds?voterId=${encodeURIComponent(voterId)}`, {
    cache: "no-store",
  });

  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function submitBuild(
  voterId: string,
  pseudo: string,
  submission: BuildSubmission,
): Promise<{ build: BuildEntry; pseudo: string }> {
  const response = await fetch("/api/builds", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ voterId, pseudo, ...submission }),
  });

  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function reactToBuild(
  buildId: string,
  voterId: string,
  reaction: BuildReactionType,
): Promise<BuildEntry> {
  const response = await fetch(`/api/builds/${buildId}/react`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ voterId, reaction }),
  });

  if (!response.ok) throw new Error(await parseError(response));
  const body = await response.json();
  return body.build;
}

export async function saveProfile(pseudo: string): Promise<string> {
  const response = await fetch("/api/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pseudo }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const body = await response.json();
  return body.pseudo as string;
}

export async function submitIntel(payload: IntelSubmission): Promise<{
  report: DailyInfo;
  pseudo: string;
}> {
  const response = await fetch("/api/intel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function voteIntel(
  reportId: string,
  voterId: string,
  vote: "true" | "false",
): Promise<DailyInfo> {
  const response = await fetch(`/api/intel/${reportId}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ voterId, vote }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const body = await response.json();
  return body.report;
}

export async function submitOutfit(
  voterId: string,
  submission: OutfitSubmission,
): Promise<OutfitEntry> {
  const response = await fetch("/api/outfits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      voterId,
      username: submission.username,
      server: submission.server,
      playerId: submission.playerId,
      imageDataUrl: submission.imageUrl,
      pseudo: submission.username,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const body = await response.json();
  return body.outfit;
}

export async function voteOutfit(
  outfitId: string,
  voterId: string,
): Promise<OutfitEntry> {
  const response = await fetch(`/api/outfits/${outfitId}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ voterId }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const body = await response.json();
  return body.outfit;
}

export async function submitGif(
  voterId: string,
  imageDataUrl: string,
  pseudo: string,
  caption?: string,
): Promise<{ gif: GifEntry; pseudo: string }> {
  const response = await fetch("/api/gallery", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ voterId, imageDataUrl, pseudo, caption }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function reactToGif(
  gifId: string,
  voterId: string,
  reaction: GifReactionType,
): Promise<GifEntry> {
  const response = await fetch(`/api/gallery/${gifId}/react`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ voterId, reaction }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const body = await response.json();
  return body.gif;
}
