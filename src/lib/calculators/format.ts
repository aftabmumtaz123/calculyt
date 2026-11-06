export const money = (n: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);
export const number = (n: number, digits = 2) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(
    Number.isFinite(n) ? n : 0,
  );
export const val = (v: Record<string, string>, k: string) => Number(v[k] ?? 0);
export const pct = (n: number) => `${number(n, 2)}%`;
