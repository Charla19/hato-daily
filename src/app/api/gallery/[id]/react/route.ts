import { NextResponse } from "next/server";
import { reactToGif } from "@/lib/db/gallery";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import type { GifReactionType } from "@/lib/types";

type ReactBody = {
  voterId: string;
  reaction: GifReactionType;
};

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  try {
    const { id } = await context.params;
    const body = (await request.json()) as ReactBody;

    if (!body.voterId) {
      return NextResponse.json({ error: "voterId is required." }, { status: 400 });
    }

    if (body.reaction !== "haha" && body.reaction !== "heart") {
      return NextResponse.json({ error: "reaction must be haha or heart." }, { status: 400 });
    }

    const gif = await reactToGif(id, body.voterId, body.reaction);
    return NextResponse.json({ gif });
  } catch (error) {
    console.error("POST /api/gallery/[id]/react", error);
    const message = error instanceof Error ? error.message : "Failed to react.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
