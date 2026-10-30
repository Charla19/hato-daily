"use client";

import { useRef, useState } from "react";
import { MAX_GALLERY_CAPTION_LENGTH, MAX_GIFS_PER_USER_PER_DAY } from "@/lib/constants";
import { GALLERY_IMAGE_ACCEPT, validateGalleryFile } from "@/lib/gallery-upload";
import { ResetCountdown } from "@/components/ResetCountdown";

type GifUploadFormProps = {
  hasPseudo: boolean;
  uploadsRemaining: number;
  isLive: boolean;
  onUpload: (imageDataUrl: string, caption?: string) => Promise<void>;
};

export function GifUploadForm({
  hasPseudo,
  uploadsRemaining,
  isLive,
  onUpload,
}: GifUploadFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
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

    const validationError = validateGalleryFile(file);
    if (validationError) {
      setError(validationError);
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
      await onUpload(preview, caption);
      setPreview(null);
      setCaption("");
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
      <div className="gallery-reset-line"><span>Daily uploads reset in</span><ResetCountdown /></div>
      <p className="gallery-quota">{uploadsRemaining} of {MAX_GIFS_PER_USER_PER_DAY} uploads available today</p>

      {!hasPseudo && (
        <p className="mb-3 rounded-xl bg-white/60 px-3 py-2 text-center text-xs font-semibold text-[#7a6b52]">
          Set your pseudo above before uploading.
        </p>
      )}

      {uploadsRemaining <= 0 && hasPseudo && isLive && (
        <p className="mb-3 rounded-xl bg-white/60 px-3 py-2 text-center text-xs font-semibold text-[#7a6b52]">
          Daily limit reached. Come back after reset (<ResetCountdown />).
        </p>
      )}

      <div className="gallery-file-field">
        <div className="flex-1">
          <label
            htmlFor="gallery-upload"
            className="mb-1 block text-xs font-bold text-[var(--plum-dark)]"
          >
            Pick a GIF or screenshot
          </label>
          <input
            ref={inputRef}
            id="gallery-upload"
            type="file"
            accept={GALLERY_IMAGE_ACCEPT}
            disabled={!canUpload}
            onChange={handleFileChange}
            className="form-input w-full px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#b8e4ff] file:px-3 file:py-1 file:text-xs file:font-bold file:text-[#3d4a5c] disabled:opacity-60"
          />
        </div>
      </div>

      {preview && (
        <div className="mt-3 flex justify-center">
          <img
            src={preview}
            alt="Upload preview"
            className="max-h-28 rounded-xl border-2 border-[#b8e4ff] bg-white/70 object-contain p-1"
          />
        </div>
      )}

      <div className="mt-3">
        <label
          htmlFor="gallery-caption"
          className="mb-1 flex items-center justify-between gap-2 text-xs font-bold text-[var(--plum-dark)]"
        >
          <span>Caption (optional)</span>
          <span className="font-semibold text-[var(--ink-soft)]">
            {caption.length}/{MAX_GALLERY_CAPTION_LENGTH}
          </span>
        </label>
        <input
          id="gallery-caption"
          type="text"
          value={caption}
          maxLength={MAX_GALLERY_CAPTION_LENGTH}
          disabled={!canUpload}
          placeholder="One line, like in-game chat"
          onChange={(event) => setCaption(event.target.value)}
          className="form-input w-full px-3 py-2 text-sm disabled:opacity-60"
        />
      </div>

      <button
        type="submit"
        disabled={!canUpload || !preview}
        className="btn-submit mt-3 w-full rounded-xl px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
      >
        {uploading ? "Uploading…" : "Post to gallery"}
      </button>

      {error && <p className="mt-2 text-center text-xs font-semibold text-[#e53e3e]">{error}</p>}
      {success && (
        <p className="mt-2 text-center text-xs font-semibold text-[#38a169]">
          Posted! It shows up in the wall below.
        </p>
      )}
    </form>
  );
}
