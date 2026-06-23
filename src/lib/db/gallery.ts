import { MAX_GIFS_PER_USER_PER_DAY } from "@/lib/constants";
import { getCurrentDayKey } from "@/lib/day-key";
import { getVisitorPseudo } from "@/lib/db/visitor";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { GifEntry, GifReactionType } from "@/lib/types";

type GifRow = {
  id: string;
  author: string;
  image_url: string;
  haha_votes: number;
  heart_votes: number;
};

export type GalleryData = {
  dayKey: string;
  gifs: GifEntry[];
  uploadsToday: number;
  uploadsRemaining: number;
  maxUploadsPerDay: number;
  pseudo: string | null;
};

function mapGifRow(row: GifRow, userReaction?: GifReactionType): GifEntry {
  return {
    id: row.id,
    author: row.author,
    imageUrl: row.image_url,
    hahaVotes: row.haha_votes,
    heartVotes: row.heart_votes,
    userReaction,
  };
}

export async function fetchGallery(voterKey: string, ipHash?: string): Promise<GalleryData> {
  const supabase = getSupabaseAdmin();
  const dayKey = getCurrentDayKey();

  const [gifsResult, uploadCountResult] = await Promise.all([
    supabase
      .from("gif_submissions")
      .select("id, author, image_url, haha_votes, heart_votes")
      .eq("day_key", dayKey)
      .order("created_at", { ascending: false }),
    voterKey
      ? supabase
          .from("gif_submissions")
          .select("id", { count: "exact", head: true })
          .eq("day_key", dayKey)
          .eq("submitter_key", voterKey)
      : Promise.resolve({ count: 0, error: null }),
  ]);

  if (gifsResult.error) throw gifsResult.error;
  if (uploadCountResult.error) throw uploadCountResult.error;

  const gifIds = (gifsResult.data ?? []).map((row) => row.id);
  const reactionsResult =
    gifIds.length > 0 && voterKey
      ? await supabase
          .from("gif_reactions")
          .select("gif_id, reaction_type")
          .eq("voter_key", voterKey)
          .in("gif_id", gifIds)
      : { data: [], error: null };

  if (reactionsResult.error) throw reactionsResult.error;

  const reactionMap = new Map(
    (reactionsResult.data ?? []).map((row) => [
      row.gif_id,
      row.reaction_type as GifReactionType,
    ]),
  );

  const uploadsToday = uploadCountResult.count ?? 0;
  const pseudo = ipHash ? await getVisitorPseudo(ipHash) : null;

  return {
    dayKey,
    gifs: (gifsResult.data ?? []).map((row) =>
      mapGifRow(row, reactionMap.get(row.id)),
    ),
    uploadsToday,
    uploadsRemaining: Math.max(0, MAX_GIFS_PER_USER_PER_DAY - uploadsToday),
    maxUploadsPerDay: MAX_GIFS_PER_USER_PER_DAY,
    pseudo,
  };
}

export async function uploadGifImage(dayKey: string, dataUrl: string) {
  const supabase = getSupabaseAdmin();
  const match = dataUrl.match(/^data:(image\/gif);base64,(.+)$/);

  if (!match) {
    throw new Error("Only GIF files are allowed.");
  }

  const buffer = Buffer.from(match[2], "base64");
  const path = `${dayKey}/${crypto.randomUUID()}.gif`;

  const { error: uploadError } = await supabase.storage
    .from("gif-gallery")
    .upload(path, buffer, { contentType: "image/gif", upsert: false });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("gif-gallery").getPublicUrl(path);
  return { publicUrl: data.publicUrl, path };
}

export async function insertGifSubmission(input: {
  voterKey: string;
  author: string;
  imageDataUrl: string;
}) {
  const supabase = getSupabaseAdmin();
  const dayKey = getCurrentDayKey();

  const { count, error: countError } = await supabase
    .from("gif_submissions")
    .select("id", { count: "exact", head: true })
    .eq("day_key", dayKey)
    .eq("submitter_key", input.voterKey);

  if (countError) throw countError;
  if ((count ?? 0) >= MAX_GIFS_PER_USER_PER_DAY) {
    throw new Error(`You can only upload ${MAX_GIFS_PER_USER_PER_DAY} GIFs per day.`);
  }

  const { publicUrl, path } = await uploadGifImage(dayKey, input.imageDataUrl);

  const { data, error } = await supabase
    .from("gif_submissions")
    .insert({
      day_key: dayKey,
      author: input.author,
      image_url: publicUrl,
      image_path: path,
      submitter_key: input.voterKey,
    })
    .select("id, author, image_url, haha_votes, heart_votes")
    .single();

  if (error) throw error;
  return mapGifRow(data);
}

export async function reactToGif(
  gifId: string,
  voterKey: string,
  reaction: GifReactionType,
) {
  const supabase = getSupabaseAdmin();

  const { data: existing, error: existingError } = await supabase
    .from("gif_reactions")
    .select("id, reaction_type")
    .eq("gif_id", gifId)
    .eq("voter_key", voterKey)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing) {
    if (existing.reaction_type === reaction) {
      const { data, error } = await supabase
        .from("gif_submissions")
        .select("id, author, image_url, haha_votes, heart_votes")
        .eq("id", gifId)
        .single();

      if (error) throw error;
      return mapGifRow(data, reaction);
    }

    const { error: updateError } = await supabase
      .from("gif_reactions")
      .update({ reaction_type: reaction })
      .eq("id", existing.id);

    if (updateError) throw updateError;
  } else {
    const { error: insertError } = await supabase.from("gif_reactions").insert({
      gif_id: gifId,
      voter_key: voterKey,
      reaction_type: reaction,
    });

    if (insertError) throw insertError;
  }

  const { data, error } = await supabase
    .from("gif_submissions")
    .select("id, author, image_url, haha_votes, heart_votes")
    .eq("id", gifId)
    .single();

  if (error) throw error;
  return mapGifRow(data, reaction);
}
