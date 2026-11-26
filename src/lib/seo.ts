const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://calculyt.vercel.app"
).replace(/\/$/, "");

function trimToLimit(value: string, limit: number): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= limit) return normalized;
  const clipped = normalized.slice(0, limit + 1);
  const boundary = clipped.lastIndexOf(" ");
  return (
    boundary > Math.floor(limit * 0.65)
      ? clipped.slice(0, boundary)
      : clipped.slice(0, limit)
  )
    .replace(/[,:;|–—-]+$/, "")
    .trim();
}

export function calculatorSeo(name: string, description: string) {
  const brand = " | Calculyt";
  const title = trimToLimit(`${name}${brand}`, 60);
  const metaDescription = trimToLimit(
    `${description} Free online calculator with clear results, formulas and practical guidance.`,
    160,
  );
  return { title, description: metaDescription };
}

export function absoluteSiteUrl(path: string): string {
  return new URL(
    path.startsWith("/") ? path : `/${path}`,
    `${SITE_URL}/`,
  ).toString();
}

export { SITE_URL };
