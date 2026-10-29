"use client";

import { useRef, useState } from "react";
import { MAX_BUILD_DESCRIPTION_LENGTH, MAX_BUILD_PHOTO_BYTES, MAX_BUILD_TITLE_LENGTH } from "@/lib/constants";
import type { BuildSubmission } from "@/lib/api-client";

type BuildUploadFormProps = {
  hasPseudo: boolean;
  uploadsRemaining: number;
  isLive: boolean;
  onPublish: (submission: BuildSubmission) => Promise<void>;
};

function optimizePhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const source = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(source);
      const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d");
      if (!context) return reject(new Error("This photo could not be prepared."));
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const read = (quality: number, type = "image/webp") => {
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error("This photo could not be compressed."));
          if (blob.size > MAX_BUILD_PHOTO_BYTES && quality > 0.58) {
            read(quality - 0.12, type);
            return;
          }
          if (blob.size > MAX_BUILD_PHOTO_BYTES) {
            return reject(new Error("This image is still over 3 MB after compression. Try another screenshot."));
          }
          const reader = new FileReader();
          reader.onload = () => typeof reader.result === "string"
            ? resolve(reader.result)
            : reject(new Error("This photo could not be read."));
          reader.onerror = () => reject(new Error("This photo could not be read."));
          reader.readAsDataURL(blob);
        }, type, quality);
      };

      read(0.84);
    };
    image.onerror = () => {
      URL.revokeObjectURL(source);
      reject(new Error("Choose a JPG, PNG, or WebP screenshot."));
    };
    image.src = source;
  });
}

export function BuildUploadForm({ hasPseudo, uploadsRemaining, isLive, onPublish }: BuildUploadFormProps) {
  const photoInput = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState<"photo" | "video">("photo");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Cozy home");
  const [server, setServer] = useState("");
  const [openToVisitors, setOpenToVisitors] = useState(false);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const canPublish = isLive && hasPseudo && uploadsRemaining > 0 && !publishing;

  async function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setError(null);
    setSuccess(false);
    setPhotoDataUrl(null);
    if (!file) return;
    if (!new Set(["image/jpeg", "image/png", "image/webp"]).has(file.type)) {
      setError("Choose a JPG, PNG, or WebP screenshot.");
      event.target.value = "";
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setError("Choose an image smaller than 12 MB; it will be compressed before upload.");
      event.target.value = "";
      return;
    }
    try {
      setPhotoDataUrl(await optimizePhoto(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "This photo could not be prepared.");
      event.target.value = "";
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canPublish) return;
    setPublishing(true);
    setError(null);
    setSuccess(false);
    try {
      await onPublish({
        kind,
        title,
        description,
        category,
        server: openToVisitors ? server : undefined,
        openToVisitors,
        photoDataUrl: kind === "photo" ? photoDataUrl ?? undefined : undefined,
        youtubeUrl: kind === "video" ? youtubeUrl : undefined,
      });
      setTitle("");
      setDescription("");
      setServer("");
      setOpenToVisitors(false);
      setYoutubeUrl("");
      setPhotoDataUrl(null);
      if (photoInput.current) photoInput.current.value = "";
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not publish this build.");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <form className="build-upload-form" onSubmit={(event) => void handleSubmit(event)}>
      <div className="build-type-switch" role="group" aria-label="Choose a post type">
        <button type="button" aria-pressed={kind === "photo"} onClick={() => setKind("photo")}>
          <span aria-hidden="true">▧</span> Photo
        </button>
        <button type="button" aria-pressed={kind === "video"} onClick={() => setKind("video")}>
          <span aria-hidden="true">▷</span> YouTube tutorial
        </button>
      </div>

      {!hasPseudo && <p className="build-form-note">Set your village name above before posting.</p>}
      {uploadsRemaining <= 0 && <p className="build-form-note">Your 3 posts for today are used. Come back after the daily reset.</p>}

      {kind === "photo" ? (
        <div className="build-form-field">
          <label htmlFor="build-photo">House screenshot</label>
          <input
            ref={photoInput}
            id="build-photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={!canPublish}
            onChange={(event) => void handlePhotoChange(event)}
            className="form-input build-file-input"
          />
          <span className="build-field-hint">JPG, PNG or WebP · compressed to keep the village light</span>
          {photoDataUrl && <img src={photoDataUrl} alt="Build preview" className="build-photo-preview" />}
        </div>
      ) : (
        <div className="build-form-field">
          <label htmlFor="build-youtube">YouTube link</label>
          <input
            id="build-youtube"
            type="url"
            value={youtubeUrl}
            disabled={!canPublish}
            onChange={(event) => setYoutubeUrl(event.target.value)}
            placeholder="https://youtu.be/..."
            className="form-input"
            required
          />
          <span className="build-field-hint">The video will play here, inside Hato Daily.</span>
        </div>
      )}

      <div className="build-form-field">
        <label htmlFor="build-title">Build title</label>
        <input
          id="build-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={MAX_BUILD_TITLE_LENGTH}
          disabled={!canPublish}
          placeholder="A little cottage by the river"
          className="form-input"
          required
        />
      </div>

      <div className="build-form-field">
        <label htmlFor="build-description">Description</label>
        <textarea
          id="build-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={MAX_BUILD_DESCRIPTION_LENGTH}
          disabled={!canPublish}
          placeholder={kind === "video" ? "What will other villagers learn?" : "Tell us about the rooms, materials, or detail you love most."}
          className="form-input build-description-input"
          required
        />
        <span className="build-field-hint build-char-count">{description.length}/{MAX_BUILD_DESCRIPTION_LENGTH}</span>
      </div>

      <div className="build-form-field">
        <label htmlFor="build-category">Style</label>
        <select id="build-category" value={category} onChange={(event) => setCategory(event.target.value)} disabled={!canPublish} className="form-input">
          <option>Cozy home</option><option>Modern</option><option>Cottage</option><option>Fantasy</option>
          <option>Garden</option><option>Room design</option><option>Café or shop</option><option>Other</option>
        </select>
      </div>

      <label className="build-visit-option">
        <input type="checkbox" checked={openToVisitors} onChange={(event) => setOpenToVisitors(event.target.checked)} disabled={!canPublish} />
        <span>My home is open to visitors</span>
      </label>
      {openToVisitors && (
        <div className="build-form-field">
          <label htmlFor="build-server">Heartopia server</label>
          <input id="build-server" value={server} onChange={(event) => setServer(event.target.value)} disabled={!canPublish} placeholder="Your server" className="form-input" required />
        </div>
      )}

      <button type="submit" disabled={!canPublish || (kind === "photo" && !photoDataUrl)} className="btn-submit build-publish-button">
        {publishing ? "Sharing…" : kind === "photo" ? "Share this build" : "Share tutorial"}
      </button>
      <p className="build-quota">{uploadsRemaining} of 3 posts left today</p>
      {error && <p className="build-form-message build-form-error" role="alert">{error}</p>}
      {success && <p className="build-form-message build-form-success" role="status">Your build is in the village album!</p>}
    </form>
  );
}
