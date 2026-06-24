"use client";

import { useMemo, useState } from "react";
import {
  FLUORITE_LOCATIONS,
  formatLocationLabel,
  POSITION_OPTIONS,
  ROAMING_OAK_LOCATIONS,
  type LocationOption,
} from "@/lib/locations";
import { INFO_TYPES, VALIDATION_THRESHOLD, type InfoTypeId } from "@/lib/constants";
import { PanelCard } from "@/components/PanelCard";
import type { IntelSubmission } from "@/lib/api-client";

type InfoSubmissionFormProps = {
  lockedTypes: InfoTypeId[];
  pseudo: string | null;
  hasPseudo: boolean;
  onSubmit: (info: Omit<IntelSubmission, "pseudo">) => Promise<void>;
};

function LocationSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: LocationOption[];
  onChange: (value: string) => void;
}) {
  const grouped = useMemo(() => {
    const groups = new Map<string, LocationOption[]>();

    for (const option of options) {
      const group = option.group ?? "Locations";
      const existing = groups.get(group) ?? [];
      existing.push(option);
      groups.set(group, existing);
    }

    return groups;
  }, [options]);

  return (
    <div className="form-group mb-2.5">
      <label htmlFor={id} className="mb-1 block text-xs font-bold text-[var(--ink)]">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="form-input w-full px-2 py-1.5 text-sm"
        required
      >
        <option value="">Select a location...</option>
        {Array.from(grouped.entries()).map(([group, groupOptions]) => (
          <optgroup key={group} label={group}>
            {groupOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

export function InfoSubmissionForm({
  lockedTypes,
  pseudo,
  hasPseudo,
  onSubmit,
}: InfoSubmissionFormProps) {
  const [infoType, setInfoType] = useState<InfoTypeId>("weather");
  const [description, setDescription] = useState("");
  const [locationId, setLocationId] = useState("");
  const [positionId, setPositionId] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const config = INFO_TYPES[infoType];
  const locationOptions =
    infoType === "fluorite"
      ? FLUORITE_LOCATIONS
      : infoType === "roaming_oak"
        ? ROAMING_OAK_LOCATIONS
        : [];

  const isTypeLocked = lockedTypes.includes(infoType);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitError(null);

    if (isTypeLocked || !hasPseudo) return;

    try {
      if (config.requiresLocationSelect) {
        if (!locationId || !positionId) return;

        await onSubmit({
          type: infoType,
          description: formatLocationLabel(locationId, positionId, locationOptions),
          locationId,
          positionId,
        });
      } else {
        if (!description.trim()) return;

        await onSubmit({
          type: infoType,
          description: description.trim(),
        });
      }

      setDescription("");
      setLocationId("");
      setPositionId("");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not submit.");
    }
  }

  return (
    <PanelCard tone="lavender" title="Share Intel" icon="➕" insect="butterfly-green">
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-2.5">
          <label htmlFor="info-type" className="mb-1 block text-xs font-bold text-[var(--ink)]">
            Info type
          </label>
          <select
            id="info-type"
            value={infoType}
            onChange={(event) => {
              setInfoType(event.target.value as InfoTypeId);
              setLocationId("");
              setPositionId("");
              setDescription("");
            }}
            className="form-input w-full px-2 py-1.5 text-sm"
          >
            {(Object.keys(INFO_TYPES) as InfoTypeId[]).map((typeId) => {
              const typeConfig = INFO_TYPES[typeId];
              const locked = lockedTypes.includes(typeId);

              return (
                <option key={typeId} value={typeId} disabled={locked}>
                  {locked
                    ? `${typeConfig.emoji} ${typeConfig.label} (Already located today!)`
                    : `${typeConfig.emoji} ${typeConfig.label}`}
                </option>
              );
            })}
          </select>
        </div>

        {config.requiresLocationSelect ? (
          <>
            <p className="mb-2 text-xs text-[var(--ink-soft)]">
              Pick from the official spawn list. No free text for daily resources.
            </p>
            <LocationSelect
              id="location"
              label="Location"
              value={locationId}
              options={locationOptions}
              onChange={setLocationId}
            />
            <LocationSelect
              id="position"
              label="Position detail"
              value={positionId}
              options={POSITION_OPTIONS}
              onChange={setPositionId}
            />
            {config.lockOnValidation && (
              <p className="mb-2 text-xs text-[#2b6cb0]">
                {config.label} locks after {VALIDATION_THRESHOLD} ✅ votes and rises to the top.
                One confirmed spot per day.
              </p>
            )}
          </>
        ) : (
          <div className="form-group mb-2.5">
            <label htmlFor="info-desc" className="mb-1 block text-xs font-bold text-[var(--ink)]">
              Description
            </label>
            <textarea
              id="info-desc"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Snowstorm at 2 PM, new banner spotted..."
              className="form-input h-[50px] w-full resize-none px-2 py-1.5 text-sm"
              required
            />
          </div>
        )}

        {isTypeLocked && (
          <p className="status-ok mb-2 rounded-xl px-2 py-1.5 text-xs">
            This category is already confirmed for today. Vote on the pinned report instead!
          </p>
        )}

        {!hasPseudo && (
          <p className="mb-2 rounded-xl border-2 border-[#ffc0a0] bg-[var(--bg-peach)] px-2 py-1.5 text-xs text-[#9b4d1a]">
            Choose your pseudo above before posting.
          </p>
        )}

        {submitError && (
          <p className="status-full mb-2 rounded-xl px-2 py-1.5 text-xs font-semibold">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={isTypeLocked || !hasPseudo}
          className="btn-submit mt-1 w-full rounded-xl py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {hasPseudo ? `Post as ${pseudo}` : "Post intel"}
        </button>
      </form>
    </PanelCard>
  );
}
