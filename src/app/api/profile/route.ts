import { NextResponse } from "next/server";
import { saveVisitorPseudo } from "@/lib/db/visitor";
import { formatPseudo, normalizePseudoInput } from "@/lib/pseudo";
import { getClientIp, hashIp } from "@/lib/visitor-ip";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

type ProfileBody = {
  pseudo: string;
};

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as ProfileBody;
    const raw = normalizePseudoInput(body.pseudo ?? "");

    if (!raw) {
      return NextResponse.json({ error: "Pseudo is required." }, { status: 400 });
    }

    const ipHash = hashIp(getClientIp(request));
    const pseudo = await saveVisitorPseudo(ipHash, raw);

    return NextResponse.json({ pseudo });
  } catch (error) {
    console.error("POST /api/profile", error);
    const message = error instanceof Error ? error.message : "Failed to save pseudo.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ pseudo: null });
  }

  try {
    const { getVisitorPseudo } = await import("@/lib/db/visitor");
    const ipHash = hashIp(getClientIp(request));
    const pseudo = await getVisitorPseudo(ipHash);

    return NextResponse.json({ pseudo: pseudo ? formatPseudo(pseudo) : null });
  } catch (error) {
    console.error("GET /api/profile", error);
    return NextResponse.json({ pseudo: null });
  }
}
