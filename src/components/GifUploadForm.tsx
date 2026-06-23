"use client";

import { useRef, useState } from "react";
import { MAX_GIF_FILE_BYTES, MAX_GIFS_PER_USER_PER_DAY } from "@/lib/constants";

type GifUploadFormProps = {
  hasPseudo: boolean;
  uploadsRemaining: number;
  resetLabel: string;
  isLive: boolean;
  onUpload: (imageDataUrl: string) => Promise<void>;
};

export function GifUploadForm({
  hasPseudo,
  uploadsRemaining,
  resetLabel,
  isLive,
  onUpload,
}: GifUploadFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const canUpload = isLive && hasPseudo && uploadsRemaining > 0 && !uploading;

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setError(null);
    setSuccess(false);

    if (!file) {
      setPreview(null);
      return;
    }

    if (file.type !== "image/gif") {
      setError("Only GIF files are allowed.");
      setPreview(null);
      event.target.value = "";
      return;
    }

    if (file.size > MAX_GIF_FILE_BYTES) {
      setError("GIF must be 8 MB or smaller.");
      setPreview(null);
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!preview || !canUpload) return;

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      await onUpload(preview);
      setPreview(null);
      if (inputRef.current) inputRef.current.value = "";
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="gif-upload-form">
      <div className="mb-3 text-center">
        <h2 className="font-[family-name:var(--font-fredoka)] text-lg font-bold text-[#3d4a5c] sm:text-xl">
          🎬 Heartopia GIF Wall
        </h2>
        <p className="mt-1 text-xs text-[var(--ink-soft)] sm:text-sm">
          Heartopia moments only · 1 GIF at a time · {MAX_GIFS_PER_USER_PER_DAY} per player per day
        </p>
        <p className="mt-1 text-[11px] text-[var(--ink-soft)]">
          {uploadsRemaining}/{MAX_GIFS_PER_USER_PER_DAY} uploads left today · resets in {resetLabel}
        </p>
      </div>

      {!hasPseudo && (
        <p className="mb-3 rounded-xl bg-white/60 px-3 py-2 text-center text-xs font-semibold text-[#7a6b52]">
          Set your display name above before uploading.
        </p>
      )}

      {uploadsRemaining <= 0 && hasPseudo && isLive && (
        <p className="mb-3 rounded-xl bg-white/60 px-3 py-2 text-center text-xs font-semibold text-[#7a6b52]">
          Daily limit reached. Come back after reset ({resetLabel}).
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label
            htmlFor="gif-upload"
            className="mb-1 block text-xs font-bold text-[var(--plum-dark)]"
          >
            Pick your GIF
          </label>
          <input
            ref={inputRef}
            id="gif-upload"
            type="file"
            accept="image/gif"
            disabled={!canUpload}
            onChange={handleFileChange}
            className="form-input w-full px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#b8e4ff] file:px-3 file:py-1 file:text-xs file:font-bold file:text-[#3d4a5c] disabled:opacity-60"
          />
        </div>
        <button
          type="submit"
          disabled={!canUpload || !preview}
          className="btn-submit w-full rounded-xl px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60 sm:w-auto"
        >
          {uploading ? "Uploading…" : "Share GIF"}
        </button>
      </div>

      {preview && (
        <div className="mt-3 flex justify-center">
          <img
            src={preview}
            alt="GIF preview"
            className="max-h-28 rounded-xl border-2 border-[#b8e4ff] bg-white/70 object-contain p-1"
          />
        </div>
      )}

      {error && <p className="mt-2 text-center text-xs font-semibold text-[#e53e3e]">{error}</p>}
      {success && (
        <p className="mt-2 text-center text-xs font-semibold text-[#38a169]">
          GIF shared! It appears in the wall below.
        </p>
      )}
    </form>
  );
}
