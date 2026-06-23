"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchDashboard,
  saveProfile,
  submitIntel,
  submitOutfit,
  voteIntel,
  voteOutfit,
  type IntelSubmission,
} from "@/lib/api-client";
import { INFO_TYPES, type InfoTypeId } from "@/lib/constants";
import { normalizePseudoInput } from "@/lib/pseudo";
import { MOCK_DAILY_INFO, MOCK_OUTFITS, MOCK_WINNER } from "@/lib/mock-data";
import type { DailyInfo, OutfitEntry, OutfitSubmission, OutfitWinner } from "@/lib/types";
import { getVoterId } from "@/lib/voter-id";

export function useHatoDaily() {
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pseudo, setPseudo] = useState<string | null>(null);
  const [dailyInfo, setDailyInfo] = useState<DailyInfo[]>([]);
  const [outfits, setOutfits] = useState<OutfitEntry[]>([]);
  const [winner, setWinner] = useState<OutfitWinner | null>(null);
  const [hasSubmittedToday, setHasSubmittedToday] = useState(false);
  const [slotsRemaining, setSlotsRemaining] = useState(50);
  const [resetLabel, setResetLabel] = useState("—");

  const voterId = useMemo(() => getVoterId(), []);

  const loadMockData = useCallback(() => {
    setDailyInfo(MOCK_DAILY_INFO);
    setOutfits(MOCK_OUTFITS);
    setWinner(MOCK_WINNER);
    setPseudo(null);
    setHasSubmittedToday(false);
    setSlotsRemaining(50 - MOCK_OUTFITS.length);
    setResetLabel("12h 0m");
    setIsLive(false);
    setError(
      "Supabase not configured — showing demo data. Copy .env.local.example to .env.local and run the SQL migration.",
    );
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const data = await fetchDashboard(voterId);
      setDailyInfo(data.dailyInfo);
      setOutfits(data.outfits);
      setWinner(data.winner);
      setPseudo(data.pseudo);
      setHasSubmittedToday(data.hasSubmittedToday);
      setSlotsRemaining(data.slotsRemaining);
      setResetLabel(data.resetLabel);
      setIsLive(true);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load data.";
      if (message.includes("not configured") || message.includes("503")) {
        loadMockData();
      } else {
        setError(message);
        setIsLive(false);
      }
    } finally {
      setLoading(false);
    }
  }, [loadMockData, voterId]);

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

  const lockedTypes = useMemo(() => {
    const locked = new Set<InfoTypeId>();
    for (const info of dailyInfo) {
      const config = INFO_TYPES[info.type];
      if (config.lockOnValidation && info.validated) {
        locked.add(info.type);
      }
    }
    return Array.from(locked);
  }, [dailyInfo]);

  const voteInfo = useCallback(
    async (id: string, vote: "true" | "false") => {
      if (!isLive) {
        setDailyInfo((current) =>
          current.map((info) => {
            if (info.id !== id || info.validated || info.userVote) return info;
            const updated: DailyInfo =
              vote === "true"
                ? { ...info, trueVotes: info.trueVotes + 1, userVote: "true" }
                : { ...info, falseVotes: info.falseVotes + 1, userVote: "false" };
            if (INFO_TYPES[info.type].lockOnValidation && updated.trueVotes >= 20) {
              return { ...updated, validated: true };
            }
            return updated;
          }),
        );
        return;
      }

      const report = await voteIntel(id, voterId, vote);
      setDailyInfo((current) =>
        current.map((info) => (info.id === id ? report : info)),
      );
    },
    [isLive, voterId],
  );

  const submitInfo = useCallback(
    async (payload: Omit<IntelSubmission, "pseudo">) => {
      const rawPseudo = pseudo ? normalizePseudoInput(pseudo) : "";
      if (!rawPseudo) {
        throw new Error("Set your display name before posting.");
      }

      if (!isLive) {
        setDailyInfo((current) => [
          {
            ...payload,
            id: crypto.randomUUID(),
            author: `@${rawPseudo}`,
            trueVotes: 0,
            falseVotes: 0,
            validated: false,
          },
          ...current,
        ]);
        return;
      }

      const { report, pseudo: savedPseudo } = await submitIntel({
        ...payload,
        pseudo: rawPseudo,
      });
      setPseudo(savedPseudo);
      setDailyInfo((current) => [report, ...current]);
    },
    [isLive, pseudo],
  );

  const likeOutfit = useCallback(
    async (id: string) => {
      if (!isLive) {
        setOutfits((current) =>
          current.map((outfit) =>
            outfit.id === id && !outfit.hasLiked
              ? { ...outfit, votes: outfit.votes + 1, hasLiked: true }
              : outfit,
          ),
        );
        return;
      }

      const outfit = await voteOutfit(id, voterId);
      setOutfits((current) =>
        current.map((item) => (item.id === id ? outfit : item)),
      );
    },
    [isLive, voterId],
  );

  const submitRunwayOutfit = useCallback(
    async (submission: OutfitSubmission): Promise<boolean> => {
      if (!isLive) {
        if (hasSubmittedToday || slotsRemaining <= 0) return false;
        setOutfits((current) => [
          {
            id: crypto.randomUUID(),
            username: submission.username,
            server: submission.server,
            playerId: submission.playerId,
            imageUrl: submission.imageUrl,
            votes: 0,
          },
          ...current,
        ]);
        setHasSubmittedToday(true);
        setSlotsRemaining((value) => value - 1);
        return true;
      }

      try {
        const outfit = await submitOutfit(voterId, submission);
        setOutfits((current) => [outfit, ...current]);
        setHasSubmittedToday(true);
        setSlotsRemaining((value) => Math.max(0, value - 1));
        if (submission.username) {
          setPseudo(
            submission.username.startsWith("@")
              ? submission.username
              : `@${submission.username}`,
          );
        }
        return true;
      } catch {
        return false;
      }
    },
    [hasSubmittedToday, isLive, slotsRemaining, voterId],
  );

  return {
    loading,
    isLive,
    error,
    pseudo,
    dailyInfo,
    outfits,
    winner,
    hasSubmittedToday,
    slotsRemaining,
    resetLabel,
    lockedTypes,
    savePseudo,
    refresh,
    voteInfo,
    submitInfo,
    likeOutfit,
    submitRunwayOutfit,
  };
}
