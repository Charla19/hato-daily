"use client";

import { MAX_OUTFIT_SLOTS } from "@/lib/constants";

type RunwayQuizCtaProps = {
  slotsRemaining: number;
  onClick: () => void;
};

export function RunwayQuizCta({ slotsRemaining, onClick }: RunwayQuizCtaProps) {
  return (
    <div className="runway-quiz-cta-wrap mb-3">
      <p className="runway-quiz-cta-label">Today&apos;s runway quiz</p>

      <button type="button" onClick={onClick} className="btn-runway-cta runway-quiz-cta w-full">
        <span className="runway-quiz-cta-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 8h10a4 4 0 0 1 3.9 3.2l.6 3a2.3 2.3 0 0 1-3.9 2l-2.1-2H8.5l-2.1 2a2.3 2.3 0 0 1-3.9-2l.6-3A4 4 0 0 1 7 8Z" />
            <path d="M7.5 10.5v3M6 12h3M16.5 11.5h.01M18.5 13.5h.01" />
          </svg>
        </span>
        <span className="runway-quiz-cta-text">
          <span className="runway-quiz-cta-title">Pass the quiz, post your look</span>
          <span className="runway-quiz-cta-sub">
            3 Heartopia questions · all correct · {slotsRemaining}/{MAX_OUTFIT_SLOTS} slots left
          </span>
        </span>
        <span className="runway-quiz-cta-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12h15M13 6l6 6-6 6" />
          </svg>
        </span>
      </button>
    </div>
  );
}
