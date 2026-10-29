import type { ReactNode } from "react";
import Link from "next/link";
import { GameDayLabel } from "@/components/GameDayLabel";

type SiteHeaderProps = {
  backHref?: string;
  backLabel?: string;
  subtitle?: string;
  showGalleryLink?: boolean;
  currentPage?: "gallery" | "builds";
  className?: string;
  children?: ReactNode;
};

export function SiteHeader({
  backHref,
  backLabel = "Back home",
  subtitle = "Your cozy corner for Heartopia dailies",
  showGalleryLink = false,
  currentPage,
  className = "",
  children,
}: SiteHeaderProps) {
  return (
    <header className={`site-header mb-5 sm:mb-7 ${className}`}>
      <div className="site-header-row">
        <Link href="/" className="site-brand" aria-label="Hato Daily home">
          <img className="site-brand-mark" src="/favicon.ico" alt="" aria-hidden="true" />
          <span className="site-brand-copy">
            <h1 className="site-brand-name">Hato Daily</h1>
            <span className="site-brand-subtitle">Heartopia community journal</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          {backHref && <Link href={backHref} className="site-nav-link">{backLabel}</Link>}
          {!backHref && <span className="site-nav-current" aria-current="page">Daily board</span>}
          {currentPage === "gallery" ? (
            <span className="site-nav-current" aria-current="page">Gallery</span>
          ) : (
            (backHref || showGalleryLink) && <Link href="/gallery" className="site-nav-link">Gallery</Link>
          )}
          {currentPage === "builds" ? (
            <span className="site-nav-current" aria-current="page">Builds</span>
          ) : (
            (backHref || showGalleryLink) && <Link href="/builds" className="site-nav-link">Builds</Link>
          )}
        </nav>

        <GameDayLabel className="site-date" />
      </div>

      <p className="site-header-caption">{subtitle}</p>
      {children}
    </header>
  );
}
