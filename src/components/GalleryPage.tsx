"use client";

import { useGallery } from "@/hooks/useGallery";
import { AnnieNpc } from "@/components/AnnieNpc";
import { FloatingCritters } from "@/components/FloatingCritters";
import { ForestEdge } from "@/components/ForestEdge";
import { GifGrid } from "@/components/GifGrid";
import { GifUploadForm } from "@/components/GifUploadForm";
import { PseudoBar } from "@/components/PseudoBar";
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
    resetLabel,
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
          <p className="text-lg font-semibold">Loading GIF gallery…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-root relative isolate min-h-screen">
      <WhimsyBackground />
      <ForestEdge />
      <FloatingCritters />
      <AnnieNpc />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-3 py-4 pb-8 sm:px-4 sm:py-6 sm:pb-10">
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
          subtitle="Share your funniest Heartopia GIF moments"
        />

        <PseudoBar pseudo={pseudo} onSave={savePseudo} isLive={isLive} />

        <section className="gallery-page-card rounded-[20px] border-[3px] border-[#b8e4ff] bg-[#dff5ff] p-4 shadow-[0_5px_0_rgba(61,74,92,0.08),0_8px_20px_rgba(61,74,92,0.07)] sm:p-5">
          <GifUploadForm
            hasPseudo={Boolean(pseudo)}
            uploadsRemaining={uploadsRemaining}
            resetLabel={resetLabel}
            isLive={isLive}
            onUpload={uploadGif}
          />

          <div className="my-4 border-t-[3px] border-dashed border-[rgba(61,74,92,0.12)]" />

          <GifGrid gifs={gifs} onReact={reactGif} />
        </section>
      </div>
    </div>
  );
}
