import type { BuildReactionType } from "@/lib/types";

const VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;
const BUILD_REACTIONS: BuildReactionType[] = ["love", "inspiring", "try_it"];

export function parseYoutubeVideoId(value: string): string | null {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:") return null;

    const host = url.hostname.toLowerCase();
    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0] ?? "";
      return VIDEO_ID_PATTERN.test(id) ? id : null;
    }

    if (!["youtube.com", "www.youtube.com", "m.youtube.com"].includes(host)) {
      return null;
    }

    const parts = url.pathname.split("/").filter(Boolean);
    const id = url.pathname === "/watch"
      ? url.searchParams.get("v") ?? ""
      : ["embed", "shorts", "live"].includes(parts[0] ?? "")
        ? parts[1] ?? ""
        : "";

    return VIDEO_ID_PATTERN.test(id) ? id : null;
  } catch {
    return null;
  }
}

export function isBuildReactionType(value: string): value is BuildReactionType {
  return BUILD_REACTIONS.includes(value as BuildReactionType);
}

export function normalizeBuildText(value: unknown, maxLength: number): string {
  return typeof value === "string"
    ? value.replace(/\s+/g, " ").trim().slice(0, maxLength)
    : "";
}
