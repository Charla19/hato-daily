"use client";

import { useEffect, useState, type RefObject } from "react";

type GalleryScrollHintProps = {
  show: boolean;
  label?: string;
};

export function GalleryScrollHint({ show, label = "Scroll to see more" }: GalleryScrollHintProps) {
  if (!show) return null;

  return (
    <div className="gallery-scroll-hint-fixed pointer-events-none absolute inset-x-0 z-10">
      <p className="gallery-scroll-hint-inner">
        <span className="gallery-scroll-hint-arrow" aria-hidden="true">
          ↓
        </span>
        {label}
      </p>
    </div>
  );
}

export function useGalleryScrollHint(
  open: boolean,
  itemCount: number,
  scrollRef: RefObject<HTMLDivElement | null>,
  itemRefs: RefObject<(HTMLElement | null)[]>,
): boolean {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!open || itemCount <= 1) {
      setShow(false);
      return;
    }

    let observer: IntersectionObserver | null = null;

    const attach = () => {
      const root = scrollRef.current;
      const lastEl = itemRefs.current?.[itemCount - 1];
      if (!root || !lastEl) {
        setShow(true);
        return;
      }

      setShow(true);
      observer = new IntersectionObserver(
        ([entry]) => setShow(!entry.isIntersecting),
        { root, threshold: 0.55 },
      );
      observer.observe(lastEl);
    };

    const frameId = requestAnimationFrame(attach);

    return () => {
      cancelAnimationFrame(frameId);
      observer?.disconnect();
    };
  }, [open, itemCount, scrollRef, itemRefs]);

  return show;
}
