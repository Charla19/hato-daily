import { NextResponse } from "next/server";
import { getNextResetLabel } from "@/lib/day-key";
import { fetchGallery, insertGifSubmission } from "@/lib/db/gallery";
import { saveVisitorPseudo } from "@/lib/db/visitor";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { normalizePseudoInput } from "@/lib/pseudo";
import { getClientIp, hashIp } from "@/lib/visitor-ip";

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const voterKey = searchParams.get("voterId") ?? "";
    const ipHash = hashIp(getClientIp(request));
    const gallery = await fetchGallery(voterKey, ipHash);

    return NextResponse.json({
      ...gallery,
      resetLabel: getNextResetLabel(),
    });
  } catch (error) {
    console.error("GET /api/gallery", error);
    const message = error instanceof Error ? error.message : "Failed to load gallery.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

type GifBody = {
  voterId: string;
  imageDataUrl: string;
  pseudo?: string;
};

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as GifBody;

    if (!body.voterId) {
      return NextResponse.json({ error: "voterId is required." }, { status: 400 });
    }

    if (!body.imageDataUrl) {
      return NextResponse.json({ error: "imageDataUrl is required." }, { status: 400 });
    }

    const pseudoSource = normalizePseudoInput(body.pseudo ?? "");
    if (!pseudoSource) {
      return NextResponse.json({ error: "Set your display name before uploading." }, { status: 400 });
    }

    const gif = await insertGifSubmission({
      voterKey: body.voterId,
      author: `@${pseudoSource}`,
      imageDataUrl: body.imageDataUrl,
    });

    const ipHash = hashIp(getClientIp(request));
    const pseudo = await saveVisitorPseudo(ipHash, pseudoSource);

    return NextResponse.json({ gif, pseudo });
  } catch (error) {
    console.error("POST /api/gallery", error);
    const message = error instanceof Error ? error.message : "Failed to upload GIF.";
    const status =
      message.includes("only upload") || message.includes("GIF") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
