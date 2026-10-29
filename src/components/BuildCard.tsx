"use client";

import { useState } from "react";
import { BuildReactionBar } from "@/components/BuildReactionBar";
import type { BuildEntry, BuildReactionType } from "@/lib/types";

export function BuildCard({ build, onReact }: {
  build: BuildEntry;
  onReact: (id: string, reaction: BuildReactionType) => Promise<void>;
}) {
  const [playing, setPlaying] = useState(false);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const [reactionError, setReactionError] = useState<string | null>(null);
  const [reacting, setReacting] = useState(false);

  async function handleReact(reaction: BuildReactionType) {
    if (reacting) return;
    setReacting(true);
    setReactionError(null);
    try {
      await onReact(build.id, reaction);
    } catch (error) {
      setReactionError(error instanceof Error ? error.message : "Reaction could not be saved.");
    } finally {
      setReacting(false);
    }
  }

  const videoId = build.youtubeVideoId;

  return (
    <article className="build-card">
      {build.kind === "photo" && build.photoUrl ? (
        <img className="build-card-image" src={build.photoUrl} alt={`Heartopia build: ${build.title}`} loading="lazy" />
      ) : (
        <div className="build-card-video-shell">
          {playing && videoId ? (
            <div className="build-video-player-wrap">
              <iframe
                className="build-video-player"
                src={`https://www.youtube-nocookie.com/embed/${videoId}?playsinline=1&rel=0&hl=en`}
                title={`YouTube tutorial: ${build.title}`}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <div className="build-video-fallback">
                Video not playing? <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noreferrer">Open on YouTube</a>
                <button type="button" onClick={() => setPlaying(false)}>Close player</button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="build-video-poster"
              onClick={() => setPlaying(true)}
              aria-label={`Play YouTube tutorial: ${build.title}`}
            >
              {videoId && !thumbnailFailed ? (
                <img
                  src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                  alt=""
                  loading="lazy"
                  onError={() => setThumbnailFailed(true)}
                />
              ) : (
                <span className="build-video-placeholder">Heartopia build tutorial</span>
              )}
              <span className="build-video-play" aria-hidden="true">▶</span>
              <span className="build-video-badge">YouTube tutorial</span>
            </button>
          )}
        </div>
      )}

      <div className="build-card-content">
        <div className="build-card-meta">
          {build.category && <span className="build-category-chip">{build.category}</span>}
          {build.openToVisitors && <span className="build-open-chip">Open to visitors</span>}
        </div>
        <h3>{build.title}</h3>
        <p className="build-card-description">{build.description}</p>
        <div className="build-card-byline">
          <span>{build.author}</span>
          {build.openToVisitors && build.server && <span>· {build.server}</span>}
        </div>
        <BuildReactionBar build={build} onReact={(reaction) => handleReact(reaction)} />
        {reactionError && <p className="build-reaction-error" role="status">{reactionError}</p>}
      </div>
    </article>
  );
}
