import type { ReactNode } from "react";
import Link from "next/link";
import { GameDayLabel } from "@/components/GameDayLabel";
import { GalleryNavButton } from "@/components/GalleryNavButton";

type SiteHeaderProps = {
  backHref?: string;
  backLabel?: string;
  subtitle?: string;
  showGalleryLink?: boolean;
  className?: string;
  children?: ReactNode;
};

export function SiteHeader({
  backHref,
  backLabel = "Back home",
  subtitle = "Your cozy corner for Heartopia dailies",
  showGalleryLink = false,
  className = "",
  children,
}: SiteHeaderProps) {
  const titleBlock = (
    <>
      <h1 className="font-[family-name:var(--font-fredoka)] text-lg font-bold leading-tight text-[#3d4a5c] sm:text-2xl">
        Hato Daily
      </h1>
      <p className="mt-0.5 text-[11px] leading-snug text-[#5c6b7a] sm:mt-1 sm:text-sm">{subtitle}</p>
    </>
  );

  return (
    <div
      className={`site-header relative mb-4 rounded-[20px] border-[3px] border-[#ffe066] bg-[#fff6b8] p-3 shadow-[0_6px_0_#f0d060,0_10px_24px_rgba(61,74,92,0.1)] sm:mb-5 sm:p-5 ${className}`}
    >
      {backHref && (
        <Link
          href={backHref}
          className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-[#7a6b52] transition-colors hover:text-[#3d4a5c] sm:text-sm"
        >
          {backLabel}
        </Link>
      )}

      {/* Mobile: title left, date + gallery stacked right */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 gap-y-1.5 sm:hidden">
        <div className="col-start-1 row-start-1 min-w-0">{titleBlock}</div>

        <div className="col-start-2 row-start-1 flex justify-end">
          <GameDayLabel />
        </div>

        {showGalleryLink && (
          <div className="col-start-2 row-start-2 flex justify-end">
            <GalleryNavButton />
          </div>
        )}
      </div>

      {/* Desktop: gallery left, title centered, date right */}
      <div className="relative hidden sm:block">
        {showGalleryLink && (
          <div className="absolute left-0 top-0 z-10">
            <GalleryNavButton />
          </div>
        )}

        <div className="absolute right-0 top-0 z-10">
          <GameDayLabel />
        </div>

        <div className={`text-center ${showGalleryLink ? "px-24" : "px-16"}`}>{titleBlock}</div>
      </div>

      {children}
    </div>
  );
}
