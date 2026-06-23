import { NextResponse } from "next/server";
import { MAX_OUTFIT_SLOTS } from "@/lib/constants";
import { createOutfitSubmission } from "@/lib/db/dashboard";
import { saveVisitorPseudo } from "@/lib/db/visitor";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { normalizePseudoInput } from "@/lib/pseudo";
import { getClientIp, hashIp } from "@/lib/visitor-ip";

type OutfitBody = {
  voterId: string;
  username: string;
  server: string;
  playerId: string;
  imageDataUrl: string;
  pseudo?: string;
};

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as OutfitBody;

    if (!body.voterId) {
      return NextResponse.json({ error: "voterId is required." }, { status: 400 });
    }

    if (!body.username?.trim() || !body.server?.trim() || !body.playerId?.trim()) {
      return NextResponse.json(
        { error: "Username, server, and player ID are required." },
        { status: 400 },
      );
    }

    if (!body.imageDataUrl) {
      return NextResponse.json({ error: "imageDataUrl is required." }, { status: 400 });
    }

    const outfit = await createOutfitSubmission({
      voterKey: body.voterId,
      username: body.username.trim(),
      server: body.server.trim(),
      playerId: body.playerId.trim(),
      imageDataUrl: body.imageDataUrl,
      maxSlots: MAX_OUTFIT_SLOTS,
    });

    const ipHash = hashIp(getClientIp(request));
    const pseudoSource = normalizePseudoInput(body.pseudo ?? body.username);
    const pseudo = await saveVisitorPseudo(ipHash, pseudoSource);

    return NextResponse.json({ outfit, pseudo });
  } catch (error) {
    console.error("POST /api/outfits", error);
    const message = error instanceof Error ? error.message : "Failed to submit outfit.";
    const status =
      message.includes("full") || message.includes("already submitted") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
