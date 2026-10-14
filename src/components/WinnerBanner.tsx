import type { OutfitWinner } from "@/lib/types";
import { SiteHeader } from "@/components/SiteHeader";

type WinnerBannerProps = {
  winner: OutfitWinner;
};

export function WinnerBanner({ winner }: WinnerBannerProps) {
  return (
    <SiteHeader showGalleryLink className="winner-banner mb-5">
      <div className="winner-inner winner-card relative mt-3 p-3 sm:mt-4 sm:p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/insects/butterfly-orange-transparent.png"
          alt=""
          width={56}
          height={56}
          className="absolute -right-2 -top-3 z-10 h-14 w-14 rotate-12 object-contain drop-shadow-md"
          aria-hidden="true"
        />

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 w-full flex-1 text-center sm:text-left">
            <span className="winner-badge mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase">
              Yesterday&apos;s Style Icon
            </span>
            <div className="winner-name text-lg font-bold sm:text-xl">{winner.username}</div>
            <div className="winner-meta mt-1 space-y-0.5 text-sm">
              <div>
                <strong>Server:</strong> {winner.server}
              </div>
              <div>
                <strong>Player ID:</strong> {winner.playerId}
              </div>
              <div>
                <strong>Score:</strong> {winner.votes} votes
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
    </SiteHeader>
  );
}
