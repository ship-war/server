export const ZeroVector: Vector<number> = { x: 0, y: 0 };

export interface Vector<T = number> {
  x: T;
  y: T;
}
