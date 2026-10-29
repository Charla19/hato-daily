import { MAX_BUILD_PHOTO_BYTES, MAX_BUILDS_PER_USER_PER_DAY } from "@/lib/constants";
import { getCurrentDayKey } from "@/lib/day-key";
import { getVisitorPseudo } from "@/lib/db/visitor";
import { parseGalleryDataUrl } from "@/lib/gallery-upload";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { BuildEntry, BuildKind, BuildReactionType } from "@/lib/types";

const BUILD_SELECT =
  "id, day_key, kind, title, description, category, author, server, open_to_visitors, photo_url, photo_path, youtube_video_id, submitter_key, love_votes, inspiring_votes, try_it_votes, created_at";

type BuildRow = {
  id: string;
  kind: BuildKind;
  title: string;
  description: string;
  category: string | null;
  author: string;
  server: string | null;
  open_to_visitors: boolean;
  photo_url: string | null;
  youtube_video_id: string | null;
  love_votes: number;
  inspiring_votes: number;
  try_it_votes: number;
  created_at: string;
};

function mapBuild(row: BuildRow, userReaction?: BuildReactionType): BuildEntry {
  return {
    id: row.id,
    kind: row.kind,
    title: row.title,
    description: row.description,
    category: row.category,
    author: row.author,
    server: row.server,
    openToVisitors: row.open_to_visitors,
    photoUrl: row.photo_url,
    youtubeVideoId: row.youtube_video_id,
    createdAt: row.created_at,
    reactionVotes: {
      love: row.love_votes,
      inspiring: row.inspiring_votes,
      try_it: row.try_it_votes,
    },
    userReaction,
  };
}

export async function fetchBuilds(voterKey: string, ipHash?: string) {
  const supabase = getSupabaseAdmin();
  const dayKey = getCurrentDayKey();

  const [buildsResult, countResult] = await Promise.all([
    supabase.from("build_posts").select(BUILD_SELECT).order("created_at", { ascending: false }).limit(60),
    voterKey
      ? supabase
          .from("build_posts")
          .select("id", { count: "exact", head: true })
          .eq("day_key", dayKey)
          .eq("submitter_key", voterKey)
      : Promise.resolve({ count: 0, error: null }),
  ]);

  if (buildsResult.error) throw buildsResult.error;
  if (countResult.error) throw countResult.error;

  const rows = (buildsResult.data ?? []) as BuildRow[];
  const ids = rows.map((row) => row.id);
  const reactionsResult = ids.length > 0 && voterKey
    ? await supabase
        .from("build_reactions")
        .select("build_id, reaction_type")
        .eq("voter_key", voterKey)
        .in("build_id", ids)
    : { data: [], error: null };

  if (reactionsResult.error) throw reactionsResult.error;

  const reactionMap = new Map(
    (reactionsResult.data ?? []).map((row) => [row.build_id, row.reaction_type as BuildReactionType]),
  );
  const pseudo = ipHash ? await getVisitorPseudo(ipHash) : null;
  const uploadsToday = countResult.count ?? 0;

  return {
    builds: rows.map((row) => mapBuild(row, reactionMap.get(row.id))),
    uploadsRemaining: Math.max(0, MAX_BUILDS_PER_USER_PER_DAY - uploadsToday),
    maxUploadsPerDay: MAX_BUILDS_PER_USER_PER_DAY,
    pseudo,
  };
}

async function uploadBuildPhoto(dataUrl: string) {
  const parsed = parseGalleryDataUrl(dataUrl);
  if (!parsed || !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(parsed.mime)) {
    throw new Error("Choose a JPG, PNG, or WebP screenshot.");
  }
  if (parsed.buffer.byteLength > MAX_BUILD_PHOTO_BYTES) {
    throw new Error("The optimized photo must be 3 MB or smaller.");
  }

  const supabase = getSupabaseAdmin();
  const path = `builds/${crypto.randomUUID()}.${parsed.extension}`;
  const { error } = await supabase.storage
    .from("build-gallery")
    .upload(path, parsed.buffer, { contentType: parsed.mime, upsert: false });
  if (error) throw error;

  const { data } = supabase.storage.from("build-gallery").getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export async function insertBuild(input: {
  voterKey: string;
  kind: BuildKind;
  title: string;
  description: string;
  category: string | null;
  author: string;
  server: string | null;
  openToVisitors: boolean;
  photoDataUrl?: string;
  youtubeVideoId?: string;
}) {
  const supabase = getSupabaseAdmin();
  const dayKey = getCurrentDayKey();
  const { count, error: countError } = await supabase
    .from("build_posts")
    .select("id", { count: "exact", head: true })
    .eq("day_key", dayKey)
    .eq("submitter_key", input.voterKey);

  if (countError) throw countError;
  if ((count ?? 0) >= MAX_BUILDS_PER_USER_PER_DAY) {
    throw new Error(`You can share ${MAX_BUILDS_PER_USER_PER_DAY} builds per day.`);
  }

  let media: { path: string; url: string } | null = null;
  if (input.kind === "photo") {
    if (!input.photoDataUrl) throw new Error("Choose a build photo first.");
    media = await uploadBuildPhoto(input.photoDataUrl);
  }

  const { data, error } = await supabase
    .from("build_posts")
    .insert({
      day_key: dayKey,
      kind: input.kind,
      title: input.title,
      description: input.description,
      category: input.category,
      author: input.author,
      server: input.server,
      open_to_visitors: input.openToVisitors,
      photo_url: media?.url ?? null,
      photo_path: media?.path ?? null,
      youtube_video_id: input.youtubeVideoId ?? null,
      submitter_key: input.voterKey,
    })
    .select(BUILD_SELECT)
    .single();

  if (error) {
    if (media) await supabase.storage.from("build-gallery").remove([media.path]);
    throw error;
  }

  return mapBuild(data as BuildRow);
}

export async function reactToBuild(
  buildId: string,
  voterKey: string,
  reaction: BuildReactionType,
) {
  const supabase = getSupabaseAdmin();
  const { data: existing, error: findError } = await supabase
    .from("build_reactions")
    .select("id, reaction_type")
    .eq("build_id", buildId)
    .eq("voter_key", voterKey)
    .maybeSingle();

  if (findError) throw findError;

  if (existing?.reaction_type === reaction) {
    const { error } = await supabase.from("build_reactions").delete().eq("id", existing.id);
    if (error) throw error;
  } else if (existing) {
    const { error } = await supabase
      .from("build_reactions")
      .update({ reaction_type: reaction })
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("build_reactions").insert({
      build_id: buildId,
      voter_key: voterKey,
      reaction_type: reaction,
    });
    if (error) throw error;
  }

  const { data, error } = await supabase
    .from("build_posts")
    .select(BUILD_SELECT)
    .eq("id", buildId)
    .single();
  if (error) throw error;

  const { data: currentReaction, error: reactionError } = await supabase
    .from("build_reactions")
    .select("reaction_type")
    .eq("build_id", buildId)
    .eq("voter_key", voterKey)
    .maybeSingle();
  if (reactionError) throw reactionError;

  return mapBuild(data as BuildRow, currentReaction?.reaction_type as BuildReactionType | undefined);
}
