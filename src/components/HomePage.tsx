"use client";

import { useHatoDaily } from "@/hooks/useHatoDaily";
import { AnnieNpc } from "@/components/AnnieNpc";
import { SiteChromeExtras } from "@/components/SiteChromeExtras";
import { SiteHeader } from "@/components/SiteHeader";
import { DailyInfoSection } from "@/components/DailyInfoSection";
import { FashionShowSection } from "@/components/FashionShowSection";
import { ForestEdge } from "@/components/ForestEdge";
import { InfoSubmissionForm } from "@/components/InfoSubmissionForm";
import { PseudoBar } from "@/components/PseudoBar";
import { WhimsyBackground } from "@/components/WhimsyBackground";
import { WinnerBanner } from "@/components/WinnerBanner";

export function HomePage() {
  const {
    loading,
    isLive,
    error,
    pseudo,
    dailyInfo,
    outfits,
    winner,
    hasSubmittedToday,
    slotsRemaining,
    lockedTypes,
    savePseudo,
    voteInfo,
    submitInfo,
    likeOutfit,
    submitRunwayOutfit,
  } = useHatoDaily();

  if (loading) {
    return (
      <div className="app-root relative isolate min-h-screen">
        <WhimsyBackground />
        <ForestEdge />
        <AnnieNpc />
        <div className="relative z-10 flex min-h-[50vh] items-center justify-center px-4 py-16 text-center text-[#5c6b7a]">
          <p className="text-lg font-semibold">Loading Hato Daily…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-root relative isolate min-h-screen">
      <WhimsyBackground />
      <ForestEdge />
      <AnnieNpc />

      <div className="app-shell relative z-10 mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 sm:py-7">
        {error && (
          <div
            className={`mb-4 rounded-2xl border-2 px-3 py-3 text-sm sm:px-4 ${
              isLive ? "border-[#ffb8b8] bg-[#fff0f0] text-[#c53030]" : "border-[#b8e4ff] bg-[#dff5ff] text-[#2b6cb0]"
            }`}
          >
            {error}
          </div>
        )}

        {winner ? (
          <WinnerBanner winner={winner} />
        ) : (
          <SiteHeader showGalleryLink />
        )}

        {!winner && (
          <div className="page-intro">
            <div>
              <p className="page-eyebrow">Your Heartopia, today</p>
              <h2 className="page-title">The village board</h2>
            </div>
            <p className="page-description">
              Find the latest discoveries, share a helpful sighting, and see who&apos;s dressing up today.
            </p>
          </div>
        )}

        <PseudoBar pseudo={pseudo} onSave={savePseudo} isLive={isLive} />

        <div className="home-dashboard">
          <DailyInfoSection items={dailyInfo} onVote={(id, vote) => void voteInfo(id, vote)} />
          <div className="home-dashboard-lower">
            <InfoSubmissionForm
              lockedTypes={lockedTypes}
              pseudo={pseudo}
              hasPseudo={Boolean(pseudo)}
              onSubmit={(payload) => submitInfo(payload)}
            />
            <FashionShowSection
              outfits={outfits}
              slotsRemaining={slotsRemaining}
              hasSubmittedToday={hasSubmittedToday}
              defaultUsername={pseudo ? pseudo.replace(/^@/, "") : ""}
              onVote={(id) => void likeOutfit(id)}
              onSubmitOutfit={submitRunwayOutfit}
            />
          </div>
        </div>

        <SiteChromeExtras />
      </div>
    </div>
  );
}
