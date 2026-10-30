"use client";

import { useState } from "react";
import { normalizePseudoInput } from "@/lib/pseudo";

type PseudoBarProps = {
  pseudo: string | null;
  onSave: (pseudo: string) => Promise<void>;
  isLive: boolean;
  className?: string;
  compact?: boolean;
};

export function PseudoBar({ pseudo, onSave, isLive, className = "", compact = false }: PseudoBarProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit() {
    setValue(pseudo ? normalizePseudoInput(pseudo) : "");
    setEditing(true);
    setError(null);
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    const raw = normalizePseudoInput(value);
    if (!raw) {
      setError("Pick a pseudo first.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave(raw);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save pseudo.");
    } finally {
      setSaving(false);
    }
  }

  if (!isLive) return null;

  return (
    <div className={`pseudo-bar relative z-10 mb-4 rounded-2xl border-[3px] border-[#9ee8be] bg-[#c8f5dc] px-3 py-3 shadow-[0_4px_0_rgba(61,74,92,0.06)] sm:px-4 ${className} ${compact && editing ? "is-editing" : ""}`}>
      {editing ? (
        <form
          id={compact ? "pseudo-edit-form" : undefined}
          onSubmit={(event) => void handleSave(event)}
          className="flex flex-col gap-2 sm:flex-row sm:items-end"
          aria-label={compact ? "Edit your pseudo" : undefined}
        >
          <div className="flex-1">
            <label htmlFor="pseudo-edit" className="mb-1 block text-xs font-bold text-[var(--plum-dark)]">
              Your pseudo
            </label>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-[var(--ink-soft)]">@</span>
              <input
                id="pseudo-edit"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="ChocoMallow"
                maxLength={31}
                className="form-input w-full px-3 py-2 text-sm"
                autoFocus
              />
            </div>
            <p className="mt-1 text-[11px] text-[var(--ink-soft)]">
              Saved for your connection. New IP means setting it again.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-submit rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-xl border-2 border-[#d8e2ec] bg-white px-4 py-2 text-sm font-semibold text-[var(--ink-soft)]"
            >
              Cancel
            </button>
          </div>
          {error && <p className="text-xs font-semibold text-[#e53e3e] sm:col-span-2">{error}</p>}
        </form>
      ) : pseudo ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--ink)]">
            {compact ? null : "Playing as "}<strong className="text-[var(--plum-dark)]">{pseudo}</strong>
          </p>
          <button
            type="button"
            onClick={startEdit}
            className="self-start rounded-xl border-2 border-[#d8e2ec] bg-white px-3 py-1.5 text-xs font-bold text-[var(--ink-soft)] hover:border-[#cbb8ff] sm:self-auto"
            aria-expanded={editing}
            aria-controls={editing && compact ? "pseudo-edit-form" : undefined}
          >
            {compact ? "Edit name" : "Change name"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--ink-soft)]">
            Set a pseudo so people know who posted.
          </p>
          <button
            type="button"
            onClick={startEdit}
            className="btn-submit self-start rounded-xl px-4 py-2 text-sm font-bold text-white sm:self-auto"
          >
            Choose pseudo
          </button>
        </div>
      )}
    </div>
  );
}
