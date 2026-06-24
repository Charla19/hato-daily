export const SOUND_FILES = {
  haha: "/sounds/fahhh.mp3",
  heart: "/sounds/nice.mp3",
  intelFalse: "/sounds/error.mp3",
} as const;

export type SoundId = keyof typeof SOUND_FILES;
