# Calculyt QA remediation report

Input: `Calculyt_Professional_QA_Bug_Report.docx` (15 findings, audit dated November 16, 2026).

## Changes applied

| Bug     | Remediation                                                                                                                                                                                   |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BUG-001 | Added site-wide Content-Security-Policy frame/object/base restrictions, X-Frame-Options, X-Content-Type-Options, Referrer-Policy and Permissions-Policy response headers in `next.config.ts`. |
| BUG-002 | Added mobile navigation with Explore, Categories, Popular tools and Browse all calculators links. Escape closes the mobile menu.                                                              |
| BUG-003 | Darkened the shared muted text token to `#6b6a7e`; darkened the green growth badge text for stronger contrast.                                                                                |
| BUG-004 | Added header calculator search and a searchable/filterable calculator directory with category chips.                                                                                          |
| BUG-005 | Added required/finite/min/max validation and health-measurement plausibility checks; errors are announced inline.                                                                             |
| BUG-006 | Wrapped calculator inputs in a real form; Enter now submits the calculation.                                                                                                                  |
| BUG-007 | Updated shared numeric and currency formatters to use scientific notation for magnitudes at or above 10^15.                                                                                   |
| BUG-008 | Added `aria-hidden` to decorative Lucide icons and accessible naming to result charts.                                                                                                        |
| BUG-009 | Added a keyboard-visible skip-to-content link targeting `#main`.                                                                                                                              |
| BUG-010 | Added a global `prefers-reduced-motion: reduce` rule.                                                                                                                                         |
| BUG-011 | Added homepage canonical metadata; category and calculator routes retain self-referencing canonical metadata.                                                                                 |
| BUG-012 | Renamed the Length Converter route to `/calculators/length-converter` and added a permanent redirect from `/calculators/unit-conversion`.                                                     |
| BUG-013 | Moved the full calculator directory into a client-loaded component that is imported only when the directory approaches the viewport.                                                          |
| BUG-014 | Removed the render-blocking Google Fonts CSS import; the site now uses a system font stack and makes no Google Fonts CSS request.                                                             |
| BUG-015 | Added min-width safeguards, responsive typography and stacked mobile hero actions; clipped horizontal overflow at the document boundary.                                                      |

## Verification notes

- The uploaded archive contained the source tree only; dependencies were not included.
- TypeScript and production build checks should be run after `npm install` in the deployment environment.
- Responsive behavior, actual response headers, contrast measurements, screen-reader behavior, and redirects should be confirmed against the deployed URL with browser/device QA.
- The audit's referenced `qa-screenshots/` evidence folder was not part of the uploaded archive, so the original screenshots could not be rechecked.
- This remediation report records code changes; it does not claim independent live-site verification.
