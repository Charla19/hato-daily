"use client";

import { useHatoDaily } from "@/hooks/useHatoDaily";
import { AnnieNpc } from "@/components/AnnieNpc";
import { SiteChromeExtras } from "@/components/SiteChromeExtras";
import { SiteHeader } from "@/components/SiteHeader";
import { DailyInfoSection } from "@/components/DailyInfoSection";
import { FashionShowSection } from "@/components/FashionShowSection";
import { ForestEdge } from "@/components/ForestEdge";
import { FloatingCritters } from "@/components/FloatingCritters";
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
      <FloatingCritters />
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

        <PseudoBar pseudo={pseudo} onSave={savePseudo} isLive={isLive} />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1 lg:w-[65%]">
            <DailyInfoSection items={dailyInfo} onVote={(id, vote) => void voteInfo(id, vote)} />
            <InfoSubmissionForm
              lockedTypes={lockedTypes}
              pseudo={pseudo}
              hasPseudo={Boolean(pseudo)}
              onSubmit={(payload) => submitInfo(payload)}
            />
          </div>

          <div className="min-w-0 lg:w-[35%] lg:max-w-md lg:shrink-0">
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
