"use client";

import { useGallery } from "@/hooks/useGallery";
import { AnnieNpc } from "@/components/AnnieNpc";
import { ForestEdge } from "@/components/ForestEdge";
import { GifGrid } from "@/components/GifGrid";
import { GifUploadForm } from "@/components/GifUploadForm";
import { SiteChromeExtras } from "@/components/SiteChromeExtras";
import { SiteHeader } from "@/components/SiteHeader";
import { WhimsyBackground } from "@/components/WhimsyBackground";

export function GalleryPage() {
  const {
    loading,
    isLive,
    error,
    pseudo,
    gifs,
    uploadsRemaining,
    savePseudo,
    uploadGif,
    reactGif,
  } = useGallery();

  if (loading) {
    return (
      <div className="app-root relative isolate min-h-screen">
        <WhimsyBackground />
        <ForestEdge />
        <AnnieNpc />
        <div className="relative z-10 flex min-h-[50vh] items-center justify-center px-4 py-16 text-center text-[#5c6b7a]">
          <p className="text-lg font-semibold">Loading gallery…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-root relative isolate min-h-screen">
      <WhimsyBackground />
      <ForestEdge />
      <AnnieNpc />

      <div className="app-shell gallery-shell relative z-10 mx-auto w-full max-w-7xl px-3 py-3 pb-8 sm:px-5 sm:py-5 sm:pb-10">
        {error && (
          <div
            className={`mb-4 rounded-2xl border-2 px-3 py-3 text-sm sm:px-4 ${
              isLive ? "border-[#ffb8b8] bg-[#fff0f0] text-[#c53030]" : "border-[#b8e4ff] bg-[#dff5ff] text-[#2b6cb0]"
            }`}
          >
            {error}
          </div>
        )}

        <SiteHeader
          backHref="/"
          currentPage="gallery"
          subtitle="GIFs and screenshots from Heartopia"
          player={{ pseudo, onSave: savePseudo, isLive }}
        />

        <div className="page-intro gallery-intro">
          <div>
            <p className="page-eyebrow">Heartopia community</p>
            <h2 className="page-title">The village album</h2>
          </div>
          <p className="page-description">GIFs and screenshots from Heartopia, shared by the community.</p>
        </div>

        <section className="gallery-workspace">
          <div className="gallery-feed-card">
            <div className="gallery-feed-heading"><div><p className="page-eyebrow">Community snapshots</p><h2>Village album</h2></div><span>{gifs.length} {gifs.length === 1 ? "memory" : "memories"}</span></div>
            <GifGrid gifs={gifs} onReact={reactGif} />
          </div>
          <aside className="gallery-upload-card">
            <div className="gallery-upload-heading">
              <span className="gallery-upload-glyph" aria-hidden="true">＋</span>
              <div><h2>Share a moment</h2><p>From your Heartopia camera roll</p></div>
            </div>
            <GifUploadForm
              hasPseudo={Boolean(pseudo)}
              uploadsRemaining={uploadsRemaining}
              isLive={isLive}
              onUpload={uploadGif}
            />
          </aside>
        </section>

        <SiteChromeExtras />
      </div>
    </div>
  );
}
