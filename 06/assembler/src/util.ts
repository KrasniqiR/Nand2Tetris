export function floatToBinary(number: number) {
  return (number >>> 0).toString(2);
}

export function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && !isNaN(v) && v !== Infinity &&
    v !== -Infinity;
}