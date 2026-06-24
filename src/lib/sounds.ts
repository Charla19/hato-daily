export const SOUND_FILES = {
  haha: "/sounds/fahhh.mp3",
  heart: "/sounds/nice.mp3",
  cute: "/sounds/cute.mp3",
  bug: "/sounds/bug.mp3",
  romance: "/sounds/romance.mp3",
  brain: "/sounds/brain.mp3",
  runwayHeart: "/sounds/runway-heart.mp3",
  intelTrue: "/sounds/intel-true.mp3",
  intelFalse: "/sounds/error.mp3",
} as const;

export type SoundId = keyof typeof SOUND_FILES;
