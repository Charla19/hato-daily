"use client";

import { useSound } from "@/components/SoundProvider";
import { INFO_TYPES } from "@/lib/constants";
import type { DailyInfo } from "@/lib/types";

type InfoCardProps = {
  info: DailyInfo;
  onVote?: (id: string, vote: "true" | "false") => void;
};

export function InfoCard({ info, onVote }: InfoCardProps) {
  const { playSound } = useSound();
  const config = INFO_TYPES[info.type];
  const isLocked = info.validated;
  const hasVoted = Boolean(info.userVote);
  const votedTrue = info.userVote === "true";
  const votedFalse = info.userVote === "false";

  function trueButtonClass() {
    if (votedTrue) return "btn-react btn-react-true-selected";
    if (isLocked || hasVoted) return "btn-react btn-react-muted";
    return "btn-react btn-react-true";
  }

  function falseButtonClass() {
    if (votedFalse) return "btn-react btn-react-false-selected";
    if (isLocked || hasVoted) return "btn-react btn-react-muted";
    return "btn-react btn-react-false";
  }

  function handleVote(vote: "true" | "false") {
    if (isLocked || hasVoted) return;
    if (vote === "true") {
      playSound("intelTrue");
    } else {
      playSound("intelFalse");
    }
    onVote?.(info.id, vote);
  }

  return (
    <div className={`info-item ${info.validated ? "validated" : ""}`}>
      {info.validated && (
        <span className="validation-badge mb-2 block w-fit rounded-full bg-[#38a169] px-1.5 py-0.5 text-[10px] font-bold text-white sm:float-right sm:mb-0">
          Located · {info.trueVotes}+ confirmed
        </span>
      )}
      <div className="info-header mb-1 text-sm font-bold">
        <span className={`tag ${config.tagClass} mr-1.5 rounded px-1.5 py-0.5 text-[10px] text-white`}>
          {config.label}
        </span>
        <span className="break-words">
          {info.validated
            ? "Confirmed Location"
            : info.author
              ? `By ${info.author}`
              : "Anonymous"}
        </span>
      </div>
      <div className="info-text mb-2 text-sm text-[#4a5568]">{info.description}</div>
      <div className="reactions-bar clear-both text-sm">
        <button
          type="button"
          disabled={isLocked || hasVoted}
          onClick={() => handleVote("true")}
          className={`${trueButtonClass()} mr-1.5 inline-block rounded-md border px-2.5 py-1 font-bold`}
          aria-pressed={votedTrue}
          aria-label={`Mark as true, ${info.trueVotes} votes`}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4.5 10.2 3.5 3.5 7.5-7.5" /></svg>
          <span>True</span><span className="vote-count">{info.trueVotes}</span>
        </button>
        <button
          type="button"
          disabled={isLocked || hasVoted}
          onClick={() => handleVote("false")}
          className={`${falseButtonClass()} inline-block rounded-md border px-2.5 py-1 font-bold`}
          aria-pressed={votedFalse}
          aria-label={`Mark as false, ${info.falseVotes} votes`}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 6 8 8m0-8-8 8" /></svg>
          <span>False</span><span className="vote-count">{info.falseVotes}</span>
        </button>
      </div>
    </div>
  );
}
