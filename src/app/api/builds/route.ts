import { NextResponse } from "next/server";
import { MAX_BUILD_CATEGORY_LENGTH, MAX_BUILD_DESCRIPTION_LENGTH, MAX_BUILD_SERVER_LENGTH, MAX_BUILD_TITLE_LENGTH } from "@/lib/constants";
import { normalizeBuildText, parseYoutubeVideoId } from "@/lib/builds";
import { fetchBuilds, insertBuild } from "@/lib/db/builds";
import { saveVisitorPseudo } from "@/lib/db/visitor";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { normalizePseudoInput } from "@/lib/pseudo";
import { getClientIp, hashIp } from "@/lib/visitor-ip";
import type { BuildKind } from "@/lib/types";

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  try {
    const voterKey = new URL(request.url).searchParams.get("voterId") ?? "";
    const ipHash = hashIp(getClientIp(request));
    return NextResponse.json(await fetchBuilds(voterKey, ipHash));
  } catch (error) {
    console.error("GET /api/builds", error);
    const message = error instanceof Error ? error.message : "Failed to load builds.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

type BuildBody = {
  voterId?: string;
  pseudo?: string;
  kind?: BuildKind;
  title?: string;
  description?: string;
  category?: string;
  server?: string;
  openToVisitors?: boolean;
  photoDataUrl?: string;
  youtubeUrl?: string;
};

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as BuildBody;
    const voterKey = normalizeBuildText(body.voterId, 100);
    if (!voterKey) return NextResponse.json({ error: "A visitor id is required." }, { status: 400 });

    const pseudo = normalizePseudoInput(body.pseudo ?? "");
    if (!pseudo) return NextResponse.json({ error: "Set your pseudo before posting." }, { status: 400 });

    if (body.kind !== "photo" && body.kind !== "video") {
      return NextResponse.json({ error: "Choose a photo or video tutorial." }, { status: 400 });
    }

    const title = normalizeBuildText(body.title, MAX_BUILD_TITLE_LENGTH);
    const description = normalizeBuildText(body.description, MAX_BUILD_DESCRIPTION_LENGTH);
    const category = normalizeBuildText(body.category, MAX_BUILD_CATEGORY_LENGTH) || null;
    const server = normalizeBuildText(body.server, MAX_BUILD_SERVER_LENGTH) || null;
    if (!title) return NextResponse.json({ error: "Add a title for your build." }, { status: 400 });
    if (!description) return NextResponse.json({ error: "Add a short description." }, { status: 400 });
    if (body.openToVisitors && !server) {
      return NextResponse.json({ error: "Add your server before opening your home to visitors." }, { status: 400 });
    }

    let youtubeVideoId: string | undefined;
    if (body.kind === "video") {
      youtubeVideoId = parseYoutubeVideoId(body.youtubeUrl ?? "") ?? undefined;
      if (!youtubeVideoId) {
        return NextResponse.json({ error: "Paste a valid YouTube video link." }, { status: 400 });
      }
    } else if (!body.photoDataUrl) {
      return NextResponse.json({ error: "Choose a photo of your build." }, { status: 400 });
    }

    const ipHash = hashIp(getClientIp(request));
    const savedPseudo = await saveVisitorPseudo(ipHash, pseudo);
    const build = await insertBuild({
      voterKey,
      kind: body.kind,
      title,
      description,
      category,
      author: `@${pseudo}`,
      server,
      openToVisitors: body.openToVisitors === true,
      photoDataUrl: body.kind === "photo" ? body.photoDataUrl : undefined,
      youtubeVideoId,
    });
    return NextResponse.json({ build, pseudo: savedPseudo });
  } catch (error) {
    console.error("POST /api/builds", error);
    const message = error instanceof Error ? error.message : "Could not publish this build.";
    const status = message.includes("per day") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
