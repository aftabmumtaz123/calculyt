# Calculyt Financial QA Remediation

## Scope

This update addresses the reported financial-calculator findings BUG-001 through BUG-009 and BUG-013 using the latest Calculyt source archive available in this conversation.

## Changes

- **BUG-001 — APR:** Replaced the prior ad-hoc fee adjustment with a numerical monthly-rate solution. The scheduled loan payment is discounted to the net proceeds (principal less upfront fees); the solved periodic rate is annualized. The UI copy clarifies that statutory APR may include additional fee/timing rules.
- **BUG-002 — Credit card payoff:** Uses month-by-month interest accrual and balance reduction, including a smaller final payment. The Credit Cards Payoff calculator now has a dedicated APR field.
- **BUG-003 — Debt payoff:** Uses the same monthly amortization loop and reports total interest, total paid, payoff duration and final payment. Extra payments are applied to the generic payoff calculator.
- **BUG-004 — Rental NOI:** Annualizes monthly rental-property expenses (monthly expenses × 12). The separate Real Estate calculator continues to treat its expense input as annual.
- **BUG-005 — House affordability:** Existing monthly debt is included in a simplified back-end DTI limit. Housing payment is capped at the lower of 28% gross monthly income or 36% gross income less other monthly debt.
- **BUG-006 — Rent vs Buy:** Separates the comparison horizon from the mortgage amortization term. Adds a mortgage term input and models principal repaid/equity over the comparison horizon.
- **BUG-007 — Pension, Social Security & Annuity:** Pension and Social Security now use an explicit monthly benefit stream, expected duration, COLA and discount-rate inputs. The generic Annuity calculator now models a principal plus monthly contributions; Annuity Payout remains a level-payment drawdown.
- **BUG-008 — Generic loan aliases:** Added canonical aliases for generic loan calculator URLs and generated static routes for those aliases. Alias pages canonicalize to the underlying calculator URL.
- **BUG-009 — IRR:** Added a distinct IRR calculation that solves for the annual discount rate making NPV zero, using initial investment, annual net cash flow, terminal proceeds, costs and holding period. Simple ROI remains a separate calculation.
- **BUG-013 — Default values:** Added a regression test that executes every Financial calculator using its shipped default inputs.

## Verification performed

- Strict TypeScript check of calculator engine modules: **passed**.
- Transpilation of calculator engine modules to JavaScript: **passed**.
- Runtime regression checks for APR, credit-card payoff, debt payoff, rental NOI, house affordability, rent-vs-buy, pension/Social Security, IRR and loan aliases: **passed**.
- Default-input smoke test across all **75 Financial calculators**: **75/75 passed**.
- ZIP archive integrity: verified after packaging.

## Assumptions and limitations

- APR is an estimated fee-adjusted annualized periodic rate for equal monthly payments. Actual legal APR disclosure rules may require additional fees, payment timing and jurisdiction-specific treatment.
- House affordability uses illustrative 28% front-end and 36% total-debt ratios, not lender underwriting.
- Rent-vs-buy is a simplified net-cost comparison that subtracts principal repaid as equity; it excludes property appreciation, taxes, insurance, maintenance, transaction costs, rent increases and investment returns.
- Pension/Social Security present value uses user-entered benefit, duration, COLA and discount rate. It is not an official benefit forecast.
- IRR assumes equal annual cash flows at year-end and a single terminal proceeds amount. Irregular or multiple-sign-change cash flows may have multiple/no IRRs; the tool reports an error when it cannot bracket a solution.
- Full Next.js production build and Vitest suite were not run in this environment because project dependencies were not installed. Run `npm install`, `npm test`, `npm run typecheck` and `npm run build` before deployment.
