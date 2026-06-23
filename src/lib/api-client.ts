import type { DailyInfo, OutfitEntry, OutfitSubmission, OutfitWinner } from "@/lib/types";

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
