export function distance(
  xa: number, ya: number,
  xb: number, yb: number
): number {
  return Math.sqrt(
    Math.pow(xb - xa, 2) +
    Math.pow(yb - ya, 2)
  );
}
