"use client";

import { useMemo, useState } from "react";
import { InfoCard } from "@/components/InfoCard";
import { IntelFeedModal } from "@/components/IntelFeedModal";
import { PanelCard } from "@/components/PanelCard";
import { SeeAllButton } from "@/components/SeeAllButton";
import { INTEL_PREVIEW_MAX_HEIGHT } from "@/lib/constants";
import type { DailyInfo } from "@/lib/types";

type DailyInfoSectionProps = {
  items: DailyInfo[];
  onVote?: (id: string, vote: "true" | "false") => void;
};

export function DailyInfoSection({ items, onVote }: DailyInfoSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (a.validated && !b.validated) return -1;
      if (!a.validated && b.validated) return 1;
      if (a.validated && b.validated) return b.trueVotes - a.trueVotes;
      return b.trueVotes - a.trueVotes;
    });
  }, [items]);

  return (
    <>
      <PanelCard tone="sky" title="Today's Intel">
        {sortedItems.length === 0 ? (
          <p className="text-sm text-[var(--ink-soft)]">Nothing yet. Drop a pin if you spotted something.</p>
        ) : (
          <>
            <div
              className="panel-scroll-area panel-scroll-fade -mx-1 overflow-y-auto overscroll-y-contain px-1"
              style={{ maxHeight: INTEL_PREVIEW_MAX_HEIGHT }}
              data-tone="sky"
            >
              {sortedItems.map((info) => (
                <InfoCard key={info.id} info={info} onVote={onVote} />
              ))}
            </div>
            <SeeAllButton count={sortedItems.length} onClick={() => setModalOpen(true)} />
          </>
        )}
      </PanelCard>

      <IntelFeedModal
        items={items}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onVote={onVote}
      />
    </>
  );
}
