"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchGallery,
  reactToGif,
  saveProfile,
  submitGif,
} from "@/lib/api-client";
import { MAX_GIFS_PER_USER_PER_DAY } from "@/lib/constants";
import { normalizePseudoInput } from "@/lib/pseudo";
import type { GifEntry, GifReactionType } from "@/lib/types";
import { getVoterId } from "@/lib/voter-id";

export function useGallery() {
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pseudo, setPseudo] = useState<string | null>(null);
  const [gifs, setGifs] = useState<GifEntry[]>([]);
  const [uploadsRemaining, setUploadsRemaining] = useState(MAX_GIFS_PER_USER_PER_DAY);
  const [resetLabel, setResetLabel] = useState("...");

  const voterId = useMemo(() => getVoterId(), []);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const data = await fetchGallery(voterId);
      setGifs(data.gifs);
      setPseudo(data.pseudo);
      setUploadsRemaining(data.uploadsRemaining);
      setResetLabel(data.resetLabel);
      setIsLive(true);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load gallery.";
      if (message.includes("not configured") || message.includes("503")) {
        setGifs([]);
        setPseudo(null);
        setUploadsRemaining(MAX_GIFS_PER_USER_PER_DAY);
        setResetLabel("12h 0m");
        setIsLive(false);
        setError(
          "Supabase not configured. Gallery uploads need a live database. Run migration 004_gif_gallery.sql.",
        );
      } else {
        setError(message);
        setIsLive(false);
      }
    } finally {
      setLoading(false);
    }
  }, [voterId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const savePseudo = useCallback(
    async (rawPseudo: string) => {
      const normalized = normalizePseudoInput(rawPseudo);
      if (!normalized) throw new Error("Pseudo is required.");

      if (!isLive) {
        setPseudo(`@${normalized}`);
        return;
      }

      const saved = await saveProfile(normalized);
      setPseudo(saved);
    },
    [isLive],
  );

  const uploadGif = useCallback(
    async (imageDataUrl: string) => {
      const rawPseudo = pseudo ? normalizePseudoInput(pseudo) : "";
      if (!rawPseudo) {
        throw new Error("Set your pseudo before uploading.");
      }

      if (!isLive) {
        throw new Error("Gallery uploads require Supabase.");
      }

      const { gif, pseudo: savedPseudo } = await submitGif(voterId, imageDataUrl, rawPseudo);
      setPseudo(savedPseudo);
      setGifs((current) => [gif, ...current]);
      setUploadsRemaining((value) => Math.max(0, value - 1));
    },
    [isLive, pseudo, voterId],
  );

  const reactGif = useCallback(
    async (gifId: string, reaction: GifReactionType) => {
      if (!isLive) return;

      const gif = await reactToGif(gifId, voterId, reaction);
      setGifs((current) => current.map((item) => (item.id === gifId ? gif : item)));
    },
    [isLive, voterId],
  );

  return {
    loading,
    isLive,
    error,
    pseudo,
    gifs,
    uploadsRemaining,
    resetLabel,
    savePseudo,
    uploadGif,
    reactGif,
    refresh,
  };
}
