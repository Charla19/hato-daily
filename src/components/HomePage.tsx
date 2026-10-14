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
    <div className="app-root home-page-root relative isolate min-h-screen">
      <WhimsyBackground />
      <ForestEdge />

      <div className="app-shell home-app-shell relative z-10 mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 sm:py-7">
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

        <section className="home-welcome" aria-labelledby="home-welcome-title">
          <div className="home-welcome-copy">
            <p className="home-welcome-kicker">Your Heartopia, today</p>
            <h2 id="home-welcome-title">The village is waiting.</h2>
            <p>Catch up on today&apos;s finds, share something you spotted, and cheer on a villager&apos;s look.</p>
            <div className="home-welcome-actions">
              <a href="#share-intel" className="welcome-action welcome-action-primary">Share a discovery <span aria-hidden="true">→</span></a>
              <a href="#runway" className="welcome-action welcome-action-secondary">Visit the runway</a>
            </div>
          </div>
          <div className="home-welcome-player">
            <PseudoBar pseudo={pseudo} onSave={savePseudo} isLive={isLive} className="home-pseudo-bar" />
          </div>
          <AnnieNpc placement="welcome" />
          <span className="home-welcome-location" aria-hidden="true">HEARTOPIA · VILLAGE LIFE</span>
        </section>

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
