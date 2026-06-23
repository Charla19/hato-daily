import Link from "next/link";
import { GameDayLabel } from "@/components/GameDayLabel";

type SiteHeaderProps = {
  backHref?: string;
  backLabel?: string;
  subtitle?: string;
};

export function SiteHeader({
  backHref,
  backLabel = "← Back home",
  subtitle = "Your cozy corner for Heartopia dailies",
}: SiteHeaderProps) {
  return (
    <div className="relative mb-4 rounded-[20px] border-[3px] border-[#ffe066] bg-[#fff6b8] p-3 shadow-[0_6px_0_#f0d060,0_10px_24px_rgba(61,74,92,0.1)] sm:mb-5 sm:p-5">
      {backHref && (
        <Link
          href={backHref}
          className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-[#7a6b52] transition-colors hover:text-[#3d4a5c] sm:text-sm"
        >
          {backLabel}
        </Link>
      )}
      <div className="flex items-start justify-between gap-2 sm:block sm:text-center">
        <div className="min-w-0 flex-1 sm:w-full">
          <h1 className="font-[family-name:var(--font-fredoka)] text-lg font-bold leading-tight text-[#3d4a5c] sm:text-2xl">
            🌸 Hato Daily 🌸
          </h1>
          <p className="mt-0.5 text-[11px] leading-snug text-[#5c6b7a] sm:mt-1 sm:text-sm">{subtitle}</p>
        </div>
        <GameDayLabel className="sm:absolute sm:right-4 sm:top-4" />
      </div>
    </div>
  );
}
