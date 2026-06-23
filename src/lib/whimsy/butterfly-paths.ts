export type FlightPoint = {
  x: number;
  y: number;
  rotate: number;
  scaleX: 1 | -1;
};

export type ButterflySpec = {
  id: string;
  src: string;
  size: number;
  duration: number;
  delay: number;
  points: FlightPoint[];
};

const BUTTERFLY_IMAGES = [
  "/assets/insects/butterfly-green-transparent.png",
  "/assets/insects/butterfly-orange-transparent.png",
];

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type PathKind =
  | "left-right"
  | "right-left"
  | "top-bottom"
  | "bottom-top"
  | "diagonal-down"
  | "diagonal-up"
  | "arc-high"
  | "arc-low";

function pathEndpoints(kind: PathKind, rand: () => number): { start: FlightPoint; end: FlightPoint } {
  const margin = 8 + rand() * 10;
  const yBand = 12 + rand() * 58;
  const xBand = 10 + rand() * 70;

  switch (kind) {
    case "left-right":
      return {
        start: { x: -margin, y: yBand, rotate: 6, scaleX: 1 },
        end: { x: 100 + margin, y: yBand + (rand() - 0.5) * 28, rotate: -4, scaleX: -1 },
      };
    case "right-left":
      return {
        start: { x: 100 + margin, y: yBand + rand() * 20, rotate: -6, scaleX: -1 },
        end: { x: -margin, y: yBand, rotate: 5, scaleX: 1 },
      };
    case "top-bottom":
      return {
        start: { x: xBand, y: -margin, rotate: 8, scaleX: rand() > 0.5 ? 1 : -1 },
        end: { x: xBand + (rand() - 0.5) * 24, y: 100 + margin, rotate: -8, scaleX: rand() > 0.5 ? 1 : -1 },
      };
    case "bottom-top":
      return {
        start: { x: xBand, y: 100 + margin, rotate: -7, scaleX: rand() > 0.5 ? 1 : -1 },
        end: { x: xBand + (rand() - 0.5) * 30, y: -margin, rotate: 7, scaleX: rand() > 0.5 ? 1 : -1 },
      };
    case "diagonal-down":
      return {
        start: { x: -margin, y: -margin * 0.4, rotate: 10, scaleX: 1 },
        end: { x: 100 + margin, y: 72 + rand() * 22, rotate: -6, scaleX: -1 },
      };
    case "diagonal-up":
      return {
        start: { x: -margin, y: 78 + rand() * 12, rotate: 4, scaleX: 1 },
        end: { x: 100 + margin, y: 8 + rand() * 18, rotate: -9, scaleX: -1 },
      };
    case "arc-high":
      return {
        start: { x: -margin, y: 55 + rand() * 18, rotate: 5, scaleX: 1 },
        end: { x: 100 + margin, y: 50 + rand() * 16, rotate: -5, scaleX: -1 },
      };
    case "arc-low":
      return {
        start: { x: 100 + margin, y: 38 + rand() * 20, rotate: -4, scaleX: -1 },
        end: { x: -margin, y: 42 + rand() * 18, rotate: 4, scaleX: 1 },
      };
  }
}

function buildPath(kind: PathKind, rand: () => number, steps: number): FlightPoint[] {
  const { start, end } = pathEndpoints(kind, rand);
  const points: FlightPoint[] = [start];

  for (let i = 1; i < steps - 1; i += 1) {
    const t = i / (steps - 1);
    const wave =
      kind === "arc-high"
        ? -Math.sin(t * Math.PI) * (14 + rand() * 10)
        : kind === "arc-low"
          ? Math.sin(t * Math.PI) * (10 + rand() * 8)
          : (rand() - 0.5) * 22;

    const drift = (rand() - 0.5) * 18;

    points.push({
      x: lerp(start.x, end.x, t) + drift * (1 - Math.abs(t - 0.5) * 1.4),
      y: lerp(start.y, end.y, t) + wave,
      rotate: lerp(start.rotate, end.rotate, t) + (rand() - 0.5) * 14,
      scaleX: t < 0.5 ? start.scaleX : end.scaleX,
    });
  }

  points.push(end);
  return points;
}

function pointsToKeyframes(name: string, points: FlightPoint[]): string {
  const stops = points
    .map((point, index) => {
      const pct = (index / (points.length - 1)) * 100;
      return `${pct.toFixed(1)}%{transform:translate(${point.x.toFixed(2)}vw,${point.y.toFixed(2)}vh) rotate(${point.rotate.toFixed(1)}deg) scaleX(${point.scaleX});}`;
    })
    .join("");

  return `@keyframes ${name}{${stops}}`;
}

const PATH_KINDS: PathKind[] = [
  "left-right",
  "right-left",
  "top-bottom",
  "bottom-top",
  "diagonal-down",
  "diagonal-up",
  "arc-high",
  "arc-low",
];

export function buildButterflySpecs(count = 7, seed = 20260623): ButterflySpec[] {
  const rand = mulberry32(seed);

  return Array.from({ length: count }, (_, index) => {
    const kind = PATH_KINDS[Math.floor(rand() * PATH_KINDS.length)]!;
    const steps = 7 + Math.floor(rand() * 4);
    const id = `butterfly-${index}`;
    const size = Math.round(28 + rand() * 44);
    const duration = Math.round(24 + rand() * 38);
    const delay = -Math.round(rand() * duration);

    return {
      id,
      src: BUTTERFLY_IMAGES[Math.floor(rand() * BUTTERFLY_IMAGES.length)]!,
      size,
      duration,
      delay,
      points: buildPath(kind, rand, steps),
    };
  });
}

export function buildButterflyStyles(specs: ButterflySpec[]): string {
  const keyframes = specs
    .map((spec) => pointsToKeyframes(`fly-${spec.id}`, spec.points))
    .join("");

  const flutter = `@keyframes butterfly-flutter{0%,100%{transform:scaleY(1) rotate(0deg);}50%{transform:scaleY(0.9) rotate(2deg);}}`;

  return `${keyframes}${flutter}`;
}
