import Link from "next/link";

export function GalleryNavButton() {
  return (
    <Link href="/gallery" className="gallery-nav-btn group fixed left-3 top-3 z-30 sm:left-4 sm:top-4">
      <span className="gallery-nav-btn-inner inline-flex items-center gap-1.5 rounded-2xl border-[3px] border-[#ffb8d4] bg-[#ffd6e8] px-3 py-2 font-[family-name:var(--font-fredoka)] text-xs font-bold text-[#3d4a5c] shadow-[0_4px_0_#e8a8c4,0_8px_20px_rgba(61,74,92,0.15)] transition-transform sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm">
        <span className="text-base sm:text-lg" aria-hidden="true">
          🎬
        </span>
        GIF Gallery
        <span className="gallery-nav-sparkle text-sm" aria-hidden="true">
          ✨
        </span>
      </span>
    </Link>
  );
}
