export const VALIDATION_THRESHOLD = 20;
export const MAX_OUTFIT_SLOTS = 50;
export const QUIZ_QUESTION_COUNT = 3;
export const INTEL_PREVIEW_MAX_HEIGHT = "42vh";
export const INTEL_MODAL_MAX_HEIGHT = "90vh";
export const RUNWAY_PREVIEW_MAX_HEIGHT = "44vh";
export const GALLERY_GRID_MAX_HEIGHT = "52vh";
export const MAX_GIFS_PER_USER_PER_DAY = 5;
/** Heartopia in-game chat line length (approx.). */
export const MAX_GALLERY_CAPTION_LENGTH = 80;
export const MAX_GALLERY_FILE_BYTES = 8 * 1024 * 1024;
export const MAX_BUILDS_PER_USER_PER_DAY = 3;
export const MAX_BUILD_PHOTO_BYTES = 3 * 1024 * 1024;
export const MAX_BUILD_TITLE_LENGTH = 80;
export const MAX_BUILD_DESCRIPTION_LENGTH = 500;
export const MAX_BUILD_CATEGORY_LENGTH = 28;
export const MAX_BUILD_SERVER_LENGTH = 40;
/** @deprecated Use MAX_GALLERY_FILE_BYTES */
export const MAX_GIF_FILE_BYTES = MAX_GALLERY_FILE_BYTES;

export const INFO_TYPES = {
  fluorite: {
    id: "fluorite",
    label: "Flawless Fluorite",
    emoji: "💎",
    tagClass: "tag-fluorite",
    requiresLocationSelect: true,
    lockOnValidation: true,
  },
  roaming_oak: {
    id: "roaming_oak",
    label: "Roaming Oak (Oak-Oak)",
    emoji: "🌳",
    tagClass: "tag-oak",
    requiresLocationSelect: true,
    lockOnValidation: true,
  },
  weather: {
    id: "weather",
    label: "Weather & Events",
    emoji: "☀️",
    tagClass: "tag-weather",
    requiresLocationSelect: false,
    lockOnValidation: false,
  },
  other: {
    id: "other",
    label: "Other (Banner, News, Tip...)",
    emoji: "📣",
    tagClass: "tag-other",
    requiresLocationSelect: false,
    lockOnValidation: false,
  },
} as const;

export type InfoTypeId = keyof typeof INFO_TYPES;
