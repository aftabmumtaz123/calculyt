# Calculyt — Calculator Platform

A modern Next.js App Router + TypeScript calculator platform with a responsive UI, client-side calculation engines, educational guides and SEO-friendly calculator pages.

## Included

- Next.js 15, React 19, TypeScript strict mode and Tailwind CSS.
- Responsive homepage, category directories and calculator detail pages.
- Central calculator registry powering navigation, category groups, static params and sitemap.
- Typed input schemas, validation, reset and copy-result actions.
- Recharts visualizations for suitable calculators.
- Educational guide sections with methodology, formulas, examples, usage guidance, assumptions and FAQs.
- Dynamic metadata, structured data, sitemap.xml, HTML sitemap and robots.txt.
- Vitest calculation tests.
- No required external calculation API or database.

## Implemented calculator inventory

| Category | Implemented | Catalog total |
|---|---:|---:|
| Financial | 75 | 75 |
| Health & Fitness | 31 | 31 |
| Math | 44 | 44 |
| Other | 4 directory-linked (+ 2 legacy tools) | 54 |
| **Total** | **156 registered (154 directory-linked)** | **204** |

The project catalog contains 44 Math entries. An earlier research inventory document had listed 45; the inventory has now been reconciled to the actual catalog. The remaining 50 Other directory entries are still planned. Two existing legacy tools (Date Difference and Length Converter) remain accessible under their current slugs but do not yet match the catalog's Date Calculator and Conversion Calculator labels.

## Health calculator safety

Health outputs are educational estimates, not diagnoses or individualized medical advice. Pregnancy, ovulation, period, body-composition, kidney-function and BAC estimates include explicit limitations. BAC must never be used to decide whether it is safe to drive. The Weight Watcher Points page uses a transparent custom illustrative calculation and does not reproduce the proprietary WeightWatchers formula.

## Requirements

- Node.js 20.9+
- npm

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Quality checks

```bash
npm run typecheck
npm test
npm run build
```

## Deploy

Deploy as a standard Next.js application on Vercel or another Node-compatible host. Set `NEXT_PUBLIC_SITE_URL` to the canonical production origin so generated sitemap URLs are correct.

## Architecture

```text
src/
  app/
    calculators/[slug]/page.tsx
    categories/[category]/page.tsx
    sitemap.ts
    sitemap.html/page.tsx
    robots.ts
  components/
    CalculatorClient.tsx
    CalculatorArticle.tsx
    ResultChart.tsx
    SiteHeader.tsx
  lib/
    calculators/
      definitions.ts
      financial-extras.ts
      health-extras.ts
      math-extras.ts
      articles.ts
      format.ts
      types.ts
```

Calculation functions are kept in typed category modules and registered through `definitions.ts`. Each definition owns its metadata, input schema and calculation function.
