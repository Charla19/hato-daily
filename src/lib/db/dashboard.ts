import { VALIDATION_THRESHOLD, type InfoTypeId } from "@/lib/constants";
import { getCurrentDayKey, getPreviousDayKey } from "@/lib/day-key";
import { getVisitorPseudo } from "@/lib/db/visitor";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { DailyInfo, OutfitEntry, OutfitWinner } from "@/lib/types";

type InfoReportRow = {
  id: string;
  day_key: string;
  type: InfoTypeId;
  description: string;
  location_id: string | null;
  position_id: string | null;
  author: string | null;
  true_votes: number;
  false_votes: number;
  validated: boolean;
};

type OutfitRow = {
  id: string;
  username: string;
  server: string;
  player_id: string;
  image_url: string;
  votes: number;
};

export type DashboardData = {
  dayKey: string;
  dailyInfo: DailyInfo[];
  outfits: OutfitEntry[];
  winner: OutfitWinner | null;
  hasSubmittedToday: boolean;
  slotsRemaining: number;
  maxSlots: number;
  pseudo: string | null;
};

function mapInfoRow(row: InfoReportRow, userVote?: "true" | "false"): DailyInfo {
  return {
    id: row.id,
    type: row.type,
    author: row.author ?? undefined,
    description: row.description,
    locationId: row.location_id ?? undefined,
    positionId: row.position_id ?? undefined,
    trueVotes: row.true_votes,
    falseVotes: row.false_votes,
    validated: row.validated,
    userVote,
  };
}

function mapOutfitRow(row: OutfitRow, hasLiked?: boolean): OutfitEntry {
  return {
    id: row.id,
    username: row.username,
    server: row.server,
    playerId: row.player_id,
    imageUrl: row.image_url,
    votes: row.votes,
    hasLiked,
  };
}

export async function fetchDashboard(
  voterKey: string,
  maxSlots: number,
  ipHash?: string,
): Promise<DashboardData> {
  const supabase = getSupabaseAdmin();
  const dayKey = getCurrentDayKey();
  const previousDayKey = getPreviousDayKey();

  const [reportsResult, outfitsResult, previousOutfitsResult, submissionCheck] =
    await Promise.all([
      supabase
        .from("info_reports")
        .select("*")
        .eq("day_key", dayKey)
        .order("validated", { ascending: false })
        .order("true_votes", { ascending: false }),
      supabase
        .from("outfit_submissions")
        .select("id, username, server, player_id, image_url, votes")
        .eq("day_key", dayKey)
        .order("votes", { ascending: false }),
      supabase
        .from("outfit_submissions")
        .select("username, server, player_id, image_url, votes")
        .eq("day_key", previousDayKey)
        .order("votes", { ascending: false })
        .limit(1)
        .maybeSingle(),
      voterKey
        ? supabase
            .from("outfit_submissions")
            .select("id")
            .eq("day_key", dayKey)
            .eq("submitter_key", voterKey)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    ]);

  if (reportsResult.error) throw reportsResult.error;
  if (outfitsResult.error) throw outfitsResult.error;
  if (previousOutfitsResult.error) throw previousOutfitsResult.error;
  if (submissionCheck.error) throw submissionCheck.error;

  const reportIds = (reportsResult.data ?? []).map((row) => row.id);
  const outfitIds = (outfitsResult.data ?? []).map((row) => row.id);

  const [intelVotesResult, outfitVotesResult] = await Promise.all([
    reportIds.length > 0 && voterKey
      ? supabase
          .from("info_votes")
          .select("report_id, vote_type")
          .eq("voter_key", voterKey)
          .in("report_id", reportIds)
      : Promise.resolve({ data: [], error: null }),
    outfitIds.length > 0 && voterKey
      ? supabase
          .from("outfit_votes")
          .select("outfit_id")
          .eq("voter_key", voterKey)
          .in("outfit_id", outfitIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (intelVotesResult.error) throw intelVotesResult.error;
  if (outfitVotesResult.error) throw outfitVotesResult.error;

  const intelVoteMap = new Map(
    (intelVotesResult.data ?? []).map((vote) => [
      vote.report_id,
      vote.vote_type as "true" | "false",
    ]),
  );
  const likedOutfitIds = new Set(
    (outfitVotesResult.data ?? []).map((vote) => vote.outfit_id),
  );

  const outfits = (outfitsResult.data ?? []).map((row) =>
    mapOutfitRow(row, likedOutfitIds.has(row.id)),
  );

  const winnerRow = previousOutfitsResult.data;
  const winner: OutfitWinner | null = winnerRow
    ? {
        username: winnerRow.username,
        server: winnerRow.server,
        playerId: winnerRow.player_id,
        votes: winnerRow.votes,
        imageUrl: winnerRow.image_url,
      }
    : null;

  const pseudo = ipHash ? await getVisitorPseudo(ipHash) : null;

  return {
    dayKey,
    dailyInfo: (reportsResult.data ?? []).map((row) =>
      mapInfoRow(row, intelVoteMap.get(row.id)),
    ),
    outfits,
    winner,
    hasSubmittedToday: Boolean(submissionCheck.data),
    slotsRemaining: Math.max(0, maxSlots - outfits.length),
    maxSlots,
    pseudo,
  };
}

export async function createInfoReport(input: {
  type: InfoTypeId;
  description: string;
  locationId?: string;
  positionId?: string;
  author?: string;
}) {
  const supabase = getSupabaseAdmin();
  const dayKey = getCurrentDayKey();

  if (input.type === "roaming_oak") {
    const { data: existing } = await supabase
      .from("info_reports")
      .select("id")
      .eq("day_key", dayKey)
      .eq("type", "roaming_oak")
      .eq("validated", true)
      .maybeSingle();

    if (existing) {
      throw new Error("Roaming Oak is already confirmed for today.");
    }
  }

  const { data, error } = await supabase
    .from("info_reports")
    .insert({
      day_key: dayKey,
      type: input.type,
      description: input.description,
      location_id: input.locationId ?? null,
      position_id: input.positionId ?? null,
      author: input.author ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapInfoRow(data);
}

export async function voteInfoReport(
  reportId: string,
  voterKey: string,
  vote: "true" | "false",
) {
  const supabase = getSupabaseAdmin();

  const { error: insertError } = await supabase.from("info_votes").insert({
    report_id: reportId,
    voter_key: voterKey,
    vote_type: vote,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      throw new Error("You already voted on this report.");
    }
    throw insertError;
  }

  const { data, error } = await supabase
    .from("info_reports")
    .select("*")
    .eq("id", reportId)
    .single();

  if (error) throw error;

  if (
    data.type === "roaming_oak" &&
    data.true_votes >= VALIDATION_THRESHOLD &&
    !data.validated
  ) {
    await supabase
      .from("info_reports")
      .update({ validated: true })
      .eq("id", reportId);

    data.validated = true;
  }

  return mapInfoRow(data, vote);
}

export async function uploadOutfitImage(dayKey: string, dataUrl: string) {
  const supabase = getSupabaseAdmin();
  const match = dataUrl.match(/^data:(image\/[\w+.-]+);base64,(.+)$/);

  if (!match) {
    throw new Error("Invalid image data.");
  }

  const mimeType = match[1];
  const buffer = Buffer.from(match[2], "base64");
  const extension =
    mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg";
  const path = `${dayKey}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("outfit-images")
    .upload(path, buffer, { contentType: mimeType, upsert: false });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("outfit-images").getPublicUrl(path);
  return { publicUrl: data.publicUrl, path };
}

export async function createOutfitSubmission(input: {
  voterKey: string;
  username: string;
  server: string;
  playerId: string;
  imageDataUrl: string;
  maxSlots: number;
}) {
  const supabase = getSupabaseAdmin();
  const dayKey = getCurrentDayKey();

  const { count, error: countError } = await supabase
    .from("outfit_submissions")
    .select("id", { count: "exact", head: true })
    .eq("day_key", dayKey);

  if (countError) throw countError;
  if ((count ?? 0) >= input.maxSlots) {
    throw new Error("All runway slots are full for today.");
  }

  const { publicUrl, path } = await uploadOutfitImage(dayKey, input.imageDataUrl);

  const { data, error } = await supabase
    .from("outfit_submissions")
    .insert({
      day_key: dayKey,
      username: input.username,
      server: input.server,
      player_id: input.playerId,
      image_url: publicUrl,
      image_path: path,
      submitter_key: input.voterKey,
    })
    .select("id, username, server, player_id, image_url, votes")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("You already submitted an outfit today.");
    }
    throw error;
  }

  return mapOutfitRow(data);
}

export async function voteOutfit(outfitId: string, voterKey: string) {
  const supabase = getSupabaseAdmin();

  const { error: insertError } = await supabase.from("outfit_votes").insert({
    outfit_id: outfitId,
    voter_key: voterKey,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      throw new Error("You already liked this outfit.");
    }
    throw insertError;
  }

  const { data, error } = await supabase
    .from("outfit_submissions")
    .select("id, username, server, player_id, image_url, votes")
    .eq("id", outfitId)
    .single();

  if (error) throw error;
  return mapOutfitRow(data, true);
}
