import type { OutfitWinner } from "@/lib/types";
import { GameDayLabel } from "@/components/GameDayLabel";

type WinnerBannerProps = {
  winner: OutfitWinner;
};

export function WinnerBanner({ winner }: WinnerBannerProps) {
  return (
    <div className="winner-banner relative mb-5 rounded-[20px] border-[3px] border-[#ffe066] bg-[#fff6b8] p-3 shadow-[0_6px_0_#f0d060] sm:p-5">
      <GameDayLabel align="left" className="absolute left-3 top-3 z-10 sm:left-4 sm:top-4" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/insects/butterfly-orange-transparent.png"
        alt=""
        width={56}
        height={56}
        className="absolute -right-2 -top-3 z-10 h-14 w-14 rotate-12 object-contain drop-shadow-md"
        aria-hidden="true"
      />
      <h1 className="site-title mb-3 px-[4.25rem] text-center text-lg font-bold leading-tight sm:mb-4 sm:px-20 sm:text-2xl">
        🌸 Hato Daily 🌸
      </h1>
      <div className="winner-inner winner-card p-3 sm:p-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 w-full flex-1 text-center sm:text-left">
            <span className="winner-badge mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase">
              👑 Yesterday&apos;s Style Icon
            </span>
            <div className="winner-name text-lg font-bold sm:text-xl">{winner.username} ✨</div>
            <div className="winner-meta mt-1 space-y-0.5 text-sm">
              <div>
                <strong>Server:</strong> {winner.server}
              </div>
              <div>
                <strong>Player ID:</strong> {winner.playerId}
              </div>
              <div>
                <strong>Score:</strong> {winner.votes} votes ❤️
              </div>
            </div>
          </div>

          <div className="winner-img-frame shrink-0">
            {winner.imageUrl ? (
              <img
                src={winner.imageUrl}
                alt={`${winner.username}'s winning outfit`}
                className="winner-img-content"
              />
            ) : (
              <div className="winner-img-placeholder">Featured Outfit</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
