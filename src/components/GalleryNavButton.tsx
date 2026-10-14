import Link from "next/link";

type GalleryNavButtonProps = {
  className?: string;
};

export function GalleryNavButton({ className = "" }: GalleryNavButtonProps) {
  return (
    <Link href="/gallery" className={`gallery-nav-btn group inline-flex ${className}`}>
      <span className="gallery-nav-btn-inner">Gallery</span>
    </Link>
  );
}
