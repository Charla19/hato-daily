import { NextResponse } from "next/server";
import { isBuildReactionType, normalizeBuildText } from "@/lib/builds";
import { reactToBuild } from "@/lib/db/builds";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import type { BuildReactionType } from "@/lib/types";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  try {
    const { id } = await context.params;
    if (!/^[0-9a-f-]{36}$/i.test(id)) {
      return NextResponse.json({ error: "Build not found." }, { status: 404 });
    }

    const body = (await request.json()) as { voterId?: string; reaction?: string };
    const voterKey = normalizeBuildText(body.voterId, 100);
    if (!voterKey) return NextResponse.json({ error: "A visitor id is required." }, { status: 400 });
    if (!body.reaction || !isBuildReactionType(body.reaction)) {
      return NextResponse.json({ error: "Choose a valid reaction." }, { status: 400 });
    }

    const build = await reactToBuild(id, voterKey, body.reaction as BuildReactionType);
    return NextResponse.json({ build });
  } catch (error) {
    console.error("POST /api/builds/[id]/react", error);
    const message = error instanceof Error ? error.message : "Could not save your reaction.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
