# Calculyt Release Notes — Health & Fitness + Math

## Health & Fitness
All 31 catalog entries are now registered:
- 4 existing calculators retained (BMI, BMR, Calorie, Ideal Weight)
- 27 new calculators added

New tools include body fat, macros, pregnancy and due-date estimates, pace, Army body-fat comparison, carbohydrate, lean body mass, healthy weight, calories burned, one-rep max, target heart rate, protein, fat intake, TDEE, ovulation, conception, period, eGFR, body type, body surface area, BAC, BMI safety screening, custom food-points estimate and overweight/BMI screening.

## Math
All 44 catalog entries are now registered:
- 2 existing calculators retained (Percentage, Random Number Generator)
- 42 new calculators added

New tools include scientific, fraction, triangle, volume, standard deviation, number sequence, percent error, exponent, binary, hexadecimal, half-life, quadratic, slope, logarithm, area, sample size, probability, statistics, mean/median/mode/range, permutations/combinations, z-score, confidence interval, ratio, distance, circle, surface area, Pythagorean theorem, right triangle, roots, LCM, GCF, factors, rounding, matrix, scientific notation, big-number integer arithmetic, prime factorization, common factors, basic arithmetic, long division, average and p-value tools.

## Content and quality
- Added calculator-specific formula explanations for the new Health & Fitness and Math pages.
- Added category-specific limitations and FAQs through the shared article renderer.
- Updated calculator inventory, category counts, README and tests.
- TypeScript strict check passed for the calculator engine modules.
- Runtime smoke check passed for default inputs across all 75 Financial, 31 Health & Fitness and 44 Math calculators.
- Full Next.js typecheck, Vitest suite and production build still need to be run after `npm install` in the deployment environment.

## Safety / accuracy notes
- Health tools are educational estimates, not diagnosis or individualized medical advice.
- BAC must never be used to decide whether driving is safe.
- The Army-titled body-fat page discloses that it uses a Navy-style circumference approximation, not an official Army assessment.
- The Weight Watcher Points page uses a transparent custom illustrative equation, not the proprietary WeightWatchers formula.
- eGFR uses the 2021 CKD-EPI creatinine equation without a race coefficient.
- Math statistical results state their approximations in the page guidance.
