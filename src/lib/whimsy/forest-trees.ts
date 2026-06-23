export type TreeSpec = {
  id: string;
  left: number;
  heightVh: number;
  flip?: boolean;
  opacity?: number;
  swayDelay?: number;
  zIndex?: number;
};

/** Trees under this height use a snappier, wider sway so small ones still feel alive. */
export const SMALL_TREE_MAX_VH = 36;

export const FOREST_TREES: TreeSpec[] = [
  { id: "t1", left: -4, heightVh: 58, opacity: 0.94, swayDelay: -1, zIndex: 2 },
  { id: "t2", left: 2, heightVh: 26, flip: true, opacity: 0.88, swayDelay: -0.5, zIndex: 7 },
  { id: "t3", left: 7, heightVh: 61, swayDelay: -3.2, zIndex: 3 },
  { id: "t4", left: 13, heightVh: 30, flip: true, opacity: 0.9, swayDelay: -1.8, zIndex: 8 },
  { id: "t5", left: 18, heightVh: 54, swayDelay: -2, zIndex: 4 },
  { id: "t6", left: 24, heightVh: 22, opacity: 0.85, swayDelay: -0.3, zIndex: 9 },
  { id: "t7", left: 29, heightVh: 48, flip: true, swayDelay: -4.1, zIndex: 5 },
  { id: "t8", left: 35, heightVh: 62, swayDelay: -4, zIndex: 2 },
  { id: "t9", left: 41, heightVh: 28, flip: true, opacity: 0.87, swayDelay: -2.2, zIndex: 8 },
  { id: "t10", left: 46, heightVh: 56, swayDelay: -1, zIndex: 4 },
  { id: "t11", left: 52, heightVh: 34, swayDelay: -3.5, zIndex: 6 },
  { id: "t12", left: 57, heightVh: 59, flip: true, swayDelay: -5.5, zIndex: 3 },
  { id: "t13", left: 63, heightVh: 24, flip: true, opacity: 0.86, swayDelay: -1.1, zIndex: 9 },
  { id: "t14", left: 68, heightVh: 51, swayDelay: -3, zIndex: 5 },
  { id: "t15", left: 74, heightVh: 38, flip: true, opacity: 0.92, swayDelay: -2.8, zIndex: 6 },
  { id: "t16", left: 79, heightVh: 60, swayDelay: -5, zIndex: 2 },
  { id: "t17", left: 85, heightVh: 27, opacity: 0.88, swayDelay: -0.8, zIndex: 8 },
  { id: "t18", left: 90, heightVh: 45, flip: true, swayDelay: -4.6, zIndex: 5 },
  { id: "t19", left: 95, heightVh: 32, flip: true, opacity: 0.9, swayDelay: -2.5, zIndex: 7 },
  { id: "t20", left: 101, heightVh: 57, swayDelay: -2.5, zIndex: 3 },
  { id: "t21", left: 106, heightVh: 20, opacity: 0.84, swayDelay: -0.2, zIndex: 10 },
];

export const TREE_SRC = "/assets/trees/heartopia-tree.png";
