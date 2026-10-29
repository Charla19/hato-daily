"use client";

import type { BuildEntry, BuildReactionType } from "@/lib/types";

const REACTIONS: { id: BuildReactionType; label: string; icon: string }[] = [
  { id: "love", label: "Love it", icon: "♡" },
  { id: "inspiring", label: "Inspiring", icon: "✦" },
  { id: "try_it", label: "Try this", icon: "↗" },
];

export function BuildReactionBar({ build, onReact }: {
  build: BuildEntry;
  onReact: (reaction: BuildReactionType) => void | Promise<void>;
}) {
  return (
    <div className="build-reactions" aria-label="React to this build">
      {REACTIONS.map((reaction) => {
        const active = build.userReaction === reaction.id;
        return (
          <button
            key={reaction.id}
            type="button"
            className={`build-reaction ${active ? "is-active" : ""}`}
            aria-pressed={active}
            onClick={() => void onReact(reaction.id)}
          >
            <span className="build-reaction-icon" aria-hidden="true">{reaction.icon}</span>
            <span>{reaction.label}</span>
            <span className="build-reaction-count">{build.reactionVotes[reaction.id]}</span>
          </button>
        );
      })}
    </div>
  );
}
