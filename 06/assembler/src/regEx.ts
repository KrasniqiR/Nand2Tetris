export const src = (expr: RegExp | string): string =>
  expr instanceof RegExp ? expr.source : expr;

export const or = (...args: RegExp[]) => [...args].map((r) => src(r)).join("|");

export const named = (expr: RegExp | string, key: string) =>
  rExp`(?<${key}>${expr})`;

export function rExp(
  strings: TemplateStringsArray,
  ...args: Array<RegExp | string>
): RegExp {
  const srcs = [...args].map((s) => src(s));
  const longestLength = Math.max(strings.length, args.length);

  const merged = [];
  for (let i = 0; i < longestLength; i++) {
    if (strings[i]) merged.push(strings[i]);
    if (srcs[i]) merged.push(srcs[i]);
  }

  return new RegExp(merged.join(""));
}
