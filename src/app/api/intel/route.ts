import { NextResponse } from "next/server";
import { type InfoTypeId } from "@/lib/constants";
import { createInfoReport } from "@/lib/db/dashboard";
import { saveVisitorPseudo } from "@/lib/db/visitor";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { normalizePseudoInput } from "@/lib/pseudo";
import { getClientIp, hashIp } from "@/lib/visitor-ip";

type IntelBody = {
  type: InfoTypeId;
  description: string;
  locationId?: string;
  positionId?: string;
  pseudo?: string;
};

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as IntelBody;
    const rawPseudo = normalizePseudoInput(body.pseudo ?? "");

    if (!body.type || !body.description?.trim()) {
      return NextResponse.json({ error: "Type and description are required." }, { status: 400 });
    }

    if (!rawPseudo) {
      return NextResponse.json({ error: "Pseudo is required." }, { status: 400 });
    }

    const ipHash = hashIp(getClientIp(request));
    const author = await saveVisitorPseudo(ipHash, rawPseudo);

    const report = await createInfoReport({
      type: body.type,
      description: body.description.trim(),
      locationId: body.locationId,
      positionId: body.positionId,
      author,
    });

    return NextResponse.json({ report, pseudo: author });
  } catch (error) {
    console.error("POST /api/intel", error);
    const message = error instanceof Error ? error.message : "Failed to submit intel.";
    const status = message.includes("already confirmed") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
