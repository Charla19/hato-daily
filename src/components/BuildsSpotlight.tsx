"use client";

import Link from "next/link";
import { useBuilds } from "@/hooks/useBuilds";

export function BuildsSpotlight() {
  const { builds, loading } = useBuilds();
  const latest = builds[0];
  const thumbnail = latest?.kind === "photo"
    ? latest.photoUrl
    : latest?.youtubeVideoId
      ? `https://img.youtube.com/vi/${latest.youtubeVideoId}/hqdefault.jpg`
      : null;

  return (
    <section className="builds-home-spotlight" aria-labelledby="builds-home-title">
      <div className="builds-home-copy">
        <p className="page-eyebrow">The village workshop</p>
        <h2 id="builds-home-title">A new corner to explore</h2>
        <p>{latest ? "Get inspired by a Heartopia home, or learn how another villager built it." : "Share a home photo or a build tutorial, and give another villager an idea for their next project."}</p>
        <Link href="/builds" className="builds-home-cta">Explore builds <span aria-hidden="true">→</span></Link>
      </div>
      <Link href="/builds" className="builds-home-preview" aria-label={latest ? `Explore builds. Latest: ${latest.title}` : "Explore and share Heartopia builds"}>
        {thumbnail ? (
          <img src={thumbnail} alt="" loading="lazy" />
        ) : (
          <span className="builds-home-placeholder" aria-hidden="true">⌂</span>
        )}
        <span className="builds-home-preview-label">
          {loading ? "Opening the workshop…" : latest ? `${latest.kind === "video" ? "Tutorial" : "Latest build"} · ${latest.title}` : "Your build could be the first"}
        </span>
      </Link>
    </section>
  );
}
