export type LocationOption = {
  id: string;
  label: string;
  group?: string;
};

/** Village plot houses 1–12 (Fluorite + Roaming Oak). */
export const PLOT_HOUSES: LocationOption[] = Array.from({ length: 12 }, (_, i) => ({
  id: `plot-house-${i + 1}`,
  label: `Plot House ${i + 1}`,
  group: "The 12 Plot Houses",
}));

/** @deprecated Use PLOT_HOUSES — kept for any legacy locationId values in old posts. */
export const HOME_PLOTS: LocationOption[] = Array.from({ length: 12 }, (_, i) => ({
  id: `home-plot-${i + 1}`,
  label: `Plot House ${i + 1}`,
  group: "The 12 Plot Houses",
}));

export const POSITION_OPTIONS: LocationOption[] = [
  { id: "property-edge", label: "Property edge / roadside" },
  { id: "front-yard", label: "Front yard (road side)" },
  { id: "plot-entrance", label: "At plot entrance" },
  { id: "plot-center", label: "Center of plot" },
  { id: "behind-house", label: "Behind the house" },
  { id: "other-position", label: "Other position" },
];

export const FLUORITE_LOCATIONS: LocationOption[] = [
  ...PLOT_HOUSES,
  {
    id: "onsen-fluorite-mine",
    label: "Onsen Mountain, Fluorite Mine (Stonehenge)",
    group: "Onsen Mountain",
  },
  {
    id: "onsen-other",
    label: "Onsen Mountain, other area",
    group: "Onsen Mountain",
  },
];

/** Official Roaming Oak spawn list only (plot houses + 3 wild spawns). */
export const ROAMING_OAK_LOCATIONS: LocationOption[] = [
  ...PLOT_HOUSES,
  {
    id: "spirit-oak-pine-forest",
    label: "Spirit Oak Pine Forest",
    group: "Original Spawns",
  },
  {
    id: "onsen-mountain-ruins",
    label: "Onsen Mountain Ruins",
    group: "Original Spawns",
  },
  {
    id: "northern-windmill-area",
    label: "The Northern Windmill Area",
    group: "Original Spawns",
  },
];

const LEGACY_PLOT_LABELS: Record<string, string> = Object.fromEntries(
  Array.from({ length: 12 }, (_, i) => [`home-plot-${i + 1}`, `Plot House ${i + 1}`]),
);

const LEGACY_POSITION_LABELS: Record<string, string> = {
  "left-near-road": "Property edge / roadside",
  "right-near-road": "Property edge / roadside",
};

const LEGACY_OAK_LOCATIONS: Record<string, string> = {
  "spiritual-oak-forest": "Spirit Oak Pine Forest",
  "suburbs-forest": "Suburbs Forest",
  "central-park": "Central Park",
  "onsen-mountain": "Onsen Mountain",
  "farm-surroundings": "Farm Surroundings",
  "beachside-forest": "Beachside Forest",
  "river-garden": "River Garden",
  "mountain-peak": "Mountain Peak",
  "hidden-grove": "Hidden Grove",
};

export function formatLocationLabel(
  locationId: string,
  positionId: string | null,
  locations: LocationOption[],
): string {
  const location = locations.find((item) => item.id === locationId);
  const position = positionId
    ? (POSITION_OPTIONS.find((item) => item.id === positionId) ??
      (positionId in LEGACY_POSITION_LABELS
        ? { id: positionId, label: LEGACY_POSITION_LABELS[positionId]! }
        : undefined))
    : null;

  const legacyPlot = LEGACY_PLOT_LABELS[locationId];
  const legacyOak = LEGACY_OAK_LOCATIONS[locationId];

  let locationLabel: string;
  if (location) {
    locationLabel = location.label;
  } else if (legacyPlot) {
    locationLabel = legacyPlot;
  } else if (legacyOak) {
    locationLabel = legacyOak;
  } else {
    return "Unknown location";
  }

  if (!position) return locationLabel;

  return `${locationLabel}, ${position.label}`;
}
