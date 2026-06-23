"use client";

import { useHatoDaily } from "@/hooks/useHatoDaily";
import { AnnieNpc } from "@/components/AnnieNpc";
import { GalleryNavButton } from "@/components/GalleryNavButton";
import { GameDayLabel } from "@/components/GameDayLabel";
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
    resetLabel,
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
      <GalleryNavButton />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 sm:py-6">
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
          <div className="relative mb-4 rounded-[20px] border-[3px] border-[#ffe066] bg-[#fff6b8] p-3 shadow-[0_6px_0_#f0d060,0_10px_24px_rgba(61,74,92,0.1)] sm:mb-5 sm:p-5">
            <div className="flex items-start justify-between gap-2 sm:block sm:text-center">
              <div className="min-w-0 flex-1 sm:w-full">
                <h1 className="font-[family-name:var(--font-fredoka)] text-lg font-bold leading-tight text-[#3d4a5c] sm:text-2xl">
                  🌸 Hato Daily 🌸
                </h1>
                <p className="mt-0.5 text-[11px] leading-snug text-[#5c6b7a] sm:mt-1 sm:text-sm">
                  Your cozy corner for Heartopia dailies
                </p>
              </div>
              <GameDayLabel className="sm:absolute sm:right-4 sm:top-4" />
            </div>
          </div>
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
              resetLabel={resetLabel}
              hasSubmittedToday={hasSubmittedToday}
              defaultUsername={pseudo ? pseudo.replace(/^@/, "") : ""}
              onVote={(id) => void likeOutfit(id)}
              onSubmitOutfit={submitRunwayOutfit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
