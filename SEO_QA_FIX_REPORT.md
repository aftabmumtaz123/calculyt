# Calculyt SEO QA Fixes — BUG-020 and BUG-022

## BUG-020: Meta title and description lengths

- Added `src/lib/seo.ts` with shared length-limited metadata helpers.
- Calculator metadata now uses a branded title capped at 60 characters and a description capped at 160 characters.
- Titles use Next.js `absolute` metadata so the root layout's `%s | Calculyt` template is not appended a second time.
- Category metadata uses the same limits.
- Added explicit homepage metadata with a concise title and description.
- Calculator aliases continue to resolve through the canonical calculator definition; canonical URLs remain tied to the canonical slug.

## BUG-022: Relative URLs in JSON-LD

- Added `absoluteSiteUrl()` using `NEXT_PUBLIC_SITE_URL`, falling back to `https://calculyt.vercel.app`.
- `SoftwareApplication.mainEntityOfPage` and `url` now emit absolute URLs, e.g. `https://calculyt.vercel.app/calculators/mortgage`.

## Validation

- ZIP integrity checked.
- Source inspection confirms the relative `mainEntityOfPage` literal has been removed.
- Length helper tested against calculator/category-style metadata examples.
- A full `npm test`, `npm run typecheck`, and `npm run build` was not run here because dependencies are not installed in this environment. Run those commands after extracting the ZIP.
