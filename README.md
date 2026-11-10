# Calculyt — Calculator Platform

A modern Next.js App Router + TypeScript calculator platform foundation with a premium, responsive UI and client-side calculation engines.

## Included

- Next.js 15, React 19, TypeScript strict mode, Tailwind CSS.
- Premium responsive homepage and calculator detail pages.
- Calculator registry powering navigation, category groups, static params and sitemap.
- Input-driven calculations with validation and reset.
- Recharts visualizations for suitable calculators.
- Copy-result action.
- Dynamic page metadata, sitemap.xml and robots.txt.
- Vitest calculation tests.
- No required external calculation API or database.

## Implemented calculators

**Financial:** 75 calculators registered with interactive calculation forms, calculation engines, and educational guide sections.

**Health & Fitness:** BMI, BMR, Calorie, Ideal Weight.

**Math:** Percentage, Random Number Generator.

**Other:** Age, Date Difference, GPA (three-course weighted model), Tip, Fuel Cost, Length Converter.

Total implemented in this release: **87** (75 Financial + 4 Health + 2 Math + 6 Other).

The full reference inventory is included as `COMPLETE_CALCULATOR_INVENTORY.md`. The 204 entries in that research inventory are discovered tools, not implemented calculators. The remaining tools are intentionally not represented as working pages or fake calculations.

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
    globals.css
    layout.tsx
    page.tsx
    robots.ts
    sitemap.ts
  components/
    CalculatorClient.tsx
    ResultChart.tsx
    SiteHeader.tsx
  lib/
    calculators/
      definitions.ts
      format.ts
      types.ts
```

Calculation functions are kept in `src/lib/calculators/definitions.ts`, outside React components. Each definition owns its typed metadata, input schema and calculation function. For a larger production rollout, split definitions into category modules and add a dedicated formula documentation/test file per calculator.

## Accuracy and limitations

- Mortgage and loan calculations assume fixed rates and regular monthly payments; taxes, insurance, lender fees and other charges are excluded.
- Compound interest and savings use a constant rate and periodic deposits.
- BMI/BMR/calorie/ideal-weight results are estimates and are not medical advice.
- GPA currently supports three courses with a common grade-point scale.
- The random generator uses `Math.random()` and is not cryptographically secure.
- Fuel and unit conversions depend on the units shown in the form.
- Date calculations use calendar dates in the browser's local timezone.
- This is a foundation release, not completion of all 205 Calculator.net tools. Do not claim full parity until every inventory item has its own researched formula, implementation, tests, explanation and verification.

## Next implementation milestones

1. Research formula and input specifications for every remaining inventory item.
2. Split calculator definitions by category.
3. Expand GPA to a dynamic course list and add richer date/time utilities.
4. Add remaining financial tools and amortization schedules.
5. Add remaining health, math and other tools with domain-reviewed formulas.
6. Add Playwright flows, accessibility audits, performance budgets and full mobile QA.
7. Add user features only if product requirements justify persistence/authentication.

## SEO articles, calculator directory and sitemaps

- All 16 currently implemented calculator detail pages include long-form guides: overview, method, formula, worked example, usage steps, interpretation tips, assumptions, limitations and FAQs.
- Category directories are available at `/categories/financial`, `/categories/health-fitness`, `/categories/math`, and `/categories/other`.
- The complete researched inventory is maintained in `src/lib/calculators/catalog.json` and displayed in the category directories and `/sitemap.html`.
- Only working calculator pages are linked as available. Other inventory entries are clearly marked **Planned** rather than presented as working calculators.
- Next.js generates the XML sitemap at `/sitemap.xml`; `robots.txt` references it. Set `NEXT_PUBLIC_SITE_URL` to the production origin before deployment.
- The current inventory contains 204 entries based on the names present in the reference sitemap list (75 Financial, 31 Fitness & Health, 44 Math, 54 Other). The previous research summary incorrectly stated 45 Math / 205 total; this has been corrected to match the actual listed names.
