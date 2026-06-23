import { NextResponse } from "next/server";
import { MAX_OUTFIT_SLOTS } from "@/lib/constants";
import { getNextResetLabel } from "@/lib/day-key";
import { fetchDashboard } from "@/lib/db/dashboard";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { getClientIp, hashIp } from "@/lib/visitor-ip";

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured. Add keys to .env.local." },
      { status: 503 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const voterKey = searchParams.get("voterId") ?? "";
    const ipHash = hashIp(getClientIp(request));

    const dashboard = await fetchDashboard(voterKey, MAX_OUTFIT_SLOTS, ipHash);

    return NextResponse.json({
      ...dashboard,
      resetLabel: getNextResetLabel(),
    });
  } catch (error) {
    console.error("GET /api/dashboard", error);
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error !== null && "message" in error
          ? String((error as { message: unknown }).message)
          : "Failed to load dashboard.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
