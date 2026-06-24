"use client";

import { MAX_OUTFIT_SLOTS } from "@/lib/constants";

type RunwayQuizCtaProps = {
  slotsRemaining: number;
  onClick: () => void;
};

export function RunwayQuizCta({ slotsRemaining, onClick }: RunwayQuizCtaProps) {
  return (
    <div className="runway-quiz-cta-wrap mb-3">
      <p className="runway-quiz-cta-label">✨ Today&apos;s runway quiz</p>

      <button type="button" onClick={onClick} className="btn-runway-cta runway-quiz-cta w-full">
        <span className="runway-quiz-cta-icon" aria-hidden="true">
          🎮
        </span>
        <span className="runway-quiz-cta-text">
          <span className="runway-quiz-cta-title">Pass the quiz, post your look</span>
          <span className="runway-quiz-cta-sub">
            3 Heartopia questions · all correct · {slotsRemaining}/{MAX_OUTFIT_SLOTS} slots left
          </span>
        </span>
        <span className="runway-quiz-cta-arrow" aria-hidden="true">
          →
        </span>
      </button>
    </div>
  );
}
