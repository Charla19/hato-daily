import { NextResponse } from "next/server";
import { voteInfoReport } from "@/lib/db/dashboard";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

type VoteBody = {
  voterId: string;
  vote: "true" | "false";
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

    if (body.vote !== "true" && body.vote !== "false") {
      return NextResponse.json({ error: "vote must be 'true' or 'false'." }, { status: 400 });
    }

    const report = await voteInfoReport(id, body.voterId, body.vote);
    return NextResponse.json({ report });
  } catch (error) {
    console.error("POST /api/intel/[id]/vote", error);
    const message = error instanceof Error ? error.message : "Failed to vote.";
    const status = message.includes("already voted") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
