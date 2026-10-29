"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchBuilds, reactToBuild, saveProfile, submitBuild, type BuildSubmission } from "@/lib/api-client";
import { MAX_BUILDS_PER_USER_PER_DAY } from "@/lib/constants";
import { normalizePseudoInput } from "@/lib/pseudo";
import { getVoterId } from "@/lib/voter-id";
import type { BuildEntry, BuildReactionType } from "@/lib/types";

export function useBuilds() {
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pseudo, setPseudo] = useState<string | null>(null);
  const [builds, setBuilds] = useState<BuildEntry[]>([]);
  const [uploadsRemaining, setUploadsRemaining] = useState(MAX_BUILDS_PER_USER_PER_DAY);
  const voterId = useMemo(() => getVoterId(), []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchBuilds(voterId);
      setBuilds(data.builds);
      setPseudo(data.pseudo);
      setUploadsRemaining(data.uploadsRemaining);
      setIsLive(true);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load builds.";
      setBuilds([]);
      setPseudo(null);
      setUploadsRemaining(MAX_BUILDS_PER_USER_PER_DAY);
      setIsLive(false);
      const migrationMissing = /not configured|503|build_posts|build_reactions|build-gallery|schema cache|relation .* does not exist/i.test(message);
      setError(migrationMissing
        ? "Apply the 008_builds.sql Supabase migration to open the village workshop."
        : message);
    } finally {
      setLoading(false);
    }
  }, [voterId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const savePseudoValue = useCallback(async (rawPseudo: string) => {
    const normalized = normalizePseudoInput(rawPseudo);
    if (!normalized) throw new Error("Pseudo is required.");
    if (!isLive) {
      setPseudo(`@${normalized}`);
      return;
    }
    setPseudo(await saveProfile(normalized));
  }, [isLive]);

  const publishBuild = useCallback(async (submission: BuildSubmission) => {
    const rawPseudo = pseudo ? normalizePseudoInput(pseudo) : "";
    if (!rawPseudo) throw new Error("Set your pseudo above before posting.");
    if (!isLive) throw new Error("Builds are not connected to the live database yet.");
    const result = await submitBuild(voterId, rawPseudo, submission);
    setPseudo(result.pseudo);
    setBuilds((current) => [result.build, ...current]);
    setUploadsRemaining((remaining) => Math.max(0, remaining - 1));
  }, [isLive, pseudo, voterId]);

  const react = useCallback(async (buildId: string, reaction: BuildReactionType) => {
    if (!isLive) return;
    const updated = await reactToBuild(buildId, voterId, reaction);
    setBuilds((current) => current.map((build) => build.id === buildId ? updated : build));
  }, [isLive, voterId]);

  return {
    loading,
    isLive,
    error,
    pseudo,
    builds,
    uploadsRemaining,
    savePseudo: savePseudoValue,
    publishBuild,
    react,
    refresh,
  };
}
