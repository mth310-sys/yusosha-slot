/** Shared constants for the cabinet mockup. Tweak sizes here. */
export const CABINET = {
  width: 390,
  height: 600,
} as const;

export type LedMode = "normal" | "open";
export type LowerMode = "normal" | "rainbow";

export function buildDotMatrix(size = 11): boolean[] {
  const cells: boolean[] = [];
  const c = (size - 1) / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - c;
      const dy = y - c;
      const r = Math.sqrt(dx * dx + dy * dy);
      const spoke = Math.abs(dx) === Math.abs(dy) || dx === 0 || dy === 0;
      cells.push(r <= 1.5 || (spoke && r <= 4.5));
    }
  }
  return cells;
}

export function ringPositions(count = 24) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2;
    return {
      left: `${50 + Math.cos(a) * 50}%`,
      top: `${50 + Math.sin(a) * 50}%`,
      delay: `${(i / count) * 2.2}s`,
    };
  });
}

export const TOP_LED_COLORS = [
  { c1: "#ff5a5a", c2: "#8c0b2a" },
  { c1: "#ff9f1c", c2: "#8a3c00" },
  { c1: "#ffe14d", c2: "#8a6b00" },
] as const;

export const MID_LED_COLORS = [
  { c1: "#4be3a0", c2: "#046b52" },
  { c1: "#4f9bff", c2: "#0b2f8a" },
  { c1: "#8fb4ff", c2: "#3b1f9c" },
] as const;