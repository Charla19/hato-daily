"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnnieNpc } from "@/components/AnnieNpc";
import { BuildCard } from "@/components/BuildCard";
import { BuildUploadForm } from "@/components/BuildUploadForm";
import { ForestEdge } from "@/components/ForestEdge";
import { PseudoBar } from "@/components/PseudoBar";
import { SiteChromeExtras } from "@/components/SiteChromeExtras";
import { SiteHeader } from "@/components/SiteHeader";
import { WhimsyBackground } from "@/components/WhimsyBackground";
import { useBuilds } from "@/hooks/useBuilds";
import type { BuildKind } from "@/lib/types";

export function BuildsPage() {
  const [activeFeed, setActiveFeed] = useState<BuildKind>("photo");
  const {
    loading,
    isLive,
    error,
    pseudo,
    builds,
    uploadsRemaining,
    savePseudo,
    publishBuild,
    react,
  } = useBuilds();

  const visibleBuilds = useMemo(
    () => builds.filter((build) => build.kind === activeFeed),
    [activeFeed, builds],
  );

  if (loading) {
    return (
      <div className="app-root relative isolate min-h-screen">
        <WhimsyBackground /><ForestEdge /><AnnieNpc />
        <div className="build-loading" role="status">Opening the village workshop…</div>
      </div>
    );
  }

  return (
    <div className="app-root relative isolate min-h-screen">
      <WhimsyBackground /><ForestEdge /><AnnieNpc />
      <div className="app-shell builds-shell relative z-10 mx-auto w-full max-w-7xl px-3 py-3 pb-8 sm:px-5 sm:py-5 sm:pb-10">
        <SiteHeader backHref="/" currentPage="builds" subtitle="Homes, little details, and build ideas from Heartopia" />
        <PseudoBar pseudo={pseudo} onSave={savePseudo} isLive={isLive} />

        <section className="builds-intro" aria-labelledby="builds-title">
          <div>
            <p className="page-eyebrow">The village workshop</p>
            <h2 className="page-title" id="builds-title">Homes &amp; builds</h2>
            <p className="page-description">Tour a home, save a build idea, or show the village how you made yours.</p>
          </div>
          <div className="builds-intro-actions">
            <span className="builds-community-count">{builds.length} {builds.length === 1 ? "build" : "builds"} shared</span>
            <Link href="#build-share" className="builds-share-link">Share a build <span aria-hidden="true">↓</span></Link>
          </div>
        </section>

        <section className="builds-workspace" aria-label="Share and discover Heartopia builds">
          <section className="build-feed-card" aria-label="Community builds">
            <div className="build-feed-header">
              <div>
                <p className="page-eyebrow">Made by villagers</p>
                <h2>Find your next idea</h2>
              </div>
              <span className="build-feed-total">{visibleBuilds.length} {visibleBuilds.length === 1 ? "post" : "posts"}</span>
            </div>

            <div className="build-feed-tabs" role="group" aria-label="Build post type">
              <button
                type="button"
                aria-pressed={activeFeed === "photo"}
                className={activeFeed === "photo" ? "is-active" : ""}
                onClick={() => setActiveFeed("photo")}
              >
                <span aria-hidden="true">▧</span> Photo builds <span className="build-tab-count">{builds.filter((build) => build.kind === "photo").length}</span>
              </button>
              <button
                type="button"
                aria-pressed={activeFeed === "video"}
                className={activeFeed === "video" ? "is-active" : ""}
                onClick={() => setActiveFeed("video")}
              >
                <span aria-hidden="true">▷</span> Video tutorials <span className="build-tab-count">{builds.filter((build) => build.kind === "video").length}</span>
              </button>
            </div>

            {error && (
              <div className="builds-status" role="status">
                <strong>The workshop is getting ready.</strong>
                <span>{error}</span>
              </div>
            )}

            {visibleBuilds.length > 0 ? (
              <div className="build-feed-grid">
                {visibleBuilds.map((build) => <BuildCard key={build.id} build={build} onReact={react} />)}
              </div>
            ) : !error ? (
              <div className="builds-empty-state">
                <span className="build-empty-art" aria-hidden="true">⌂</span>
                <h3>{activeFeed === "photo" ? "A place for your favorite little details" : "Your next build tutorial starts here"}</h3>
                <p>{activeFeed === "photo"
                  ? "Share a house, garden, room, or cozy corner. Add a description so everyone knows what makes it special."
                  : "Got a YouTube walkthrough? Share the link and a few words about what other villagers will learn."}</p>
                <button type="button" onClick={() => document.getElementById("build-title")?.focus()} className="build-empty-cta">
                  Share the first one
                </button>
              </div>
            ) : null}
          </section>

          <aside className="build-upload-card" id="build-share">
            <div className="build-section-heading">
              <span className="build-heading-mark" aria-hidden="true">✦</span>
              <div><h2>Share your build</h2><p>A photo or a YouTube tutorial</p></div>
            </div>
            <BuildUploadForm
              hasPseudo={Boolean(pseudo)}
              uploadsRemaining={uploadsRemaining}
              isLive={isLive}
              onPublish={publishBuild}
            />
          </aside>
        </section>

        <SiteChromeExtras />
      </div>
    </div>
  );
}
