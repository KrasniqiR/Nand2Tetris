export const source = (expr: RegExp | string): string => expr instanceof RegExp ?  expr.source : expr;

export const or = (...args: RegExp[]) =>
  [...args].map((r) => source(r)).join("|");

export function rExp(
  strings: TemplateStringsArray,
  ...args: Array<RegExp | string>
): RegExp {
  const sources = [...args].map((s) => source(s));
  const longestLength = Math.max(strings.length, args.length);

  const merged = [];
  for (let i = 0; i < longestLength; i++) {
    if (strings[i]) merged.push(strings[i]);
    if (sources[i]) merged.push(sources[i]);
  }

  return new RegExp(merged.join(""));
}
