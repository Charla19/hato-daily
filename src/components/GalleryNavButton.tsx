import Link from "next/link";

type GalleryNavButtonProps = {
  className?: string;
};

export function GalleryNavButton({ className = "" }: GalleryNavButtonProps) {
  return (
    <Link href="/gallery" className={`gallery-nav-btn group inline-block ${className}`}>
      <span className="gallery-nav-btn-inner inline-flex items-center gap-1 rounded-xl border-[3px] border-[#ffb8d4] bg-[#ffd6e8] px-2 py-1 font-[family-name:var(--font-fredoka)] text-[10px] font-bold text-[#3d4a5c] shadow-[0_3px_0_#e8a8c4] sm:hidden">
        <span className="text-sm" aria-hidden="true">
          🎬
        </span>
        GIF Gallery
      </span>

      <span className="gallery-nav-btn-inner hidden items-center gap-1.5 rounded-2xl border-[3px] border-[#ffb8d4] bg-[#ffd6e8] px-4 py-2 font-[family-name:var(--font-fredoka)] text-sm font-bold text-[#3d4a5c] shadow-[0_4px_0_#e8a8c4,0_8px_20px_rgba(61,74,92,0.15)] sm:inline-flex">
        <span className="text-lg" aria-hidden="true">
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
