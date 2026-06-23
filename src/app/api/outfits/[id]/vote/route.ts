import { NextResponse } from "next/server";
import { voteOutfit } from "@/lib/db/dashboard";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

type VoteBody = {
  voterId: string;
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
    const body = (await request.json()) as VoteBody;

    if (!body.voterId) {
      return NextResponse.json({ error: "voterId is required." }, { status: 400 });
    }

    const outfit = await voteOutfit(id, body.voterId);
    return NextResponse.json({ outfit });
  } catch (error) {
    console.error("POST /api/outfits/[id]/vote", error);
    const message = error instanceof Error ? error.message : "Failed to like outfit.";
    const status = message.includes("already liked") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
