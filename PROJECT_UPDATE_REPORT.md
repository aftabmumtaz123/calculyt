# Calculyt Health & Fitness and Math Expansion

## Delivered
- Registered all 31 Health & Fitness calculator entries: 27 new tools plus the 4 existing BMI, BMR, Calorie and Ideal Weight calculators.
- Registered all 44 Math calculator entries: 42 new tools plus the 2 existing Percentage and Random Number tools.
- Added calculation engines, configurable inputs, result metrics and charts where useful.
- Added safety and limitation notes for health-sensitive estimates including pregnancy, eGFR, BAC, body composition and weight-related tools.
- The Weight Watcher Points page uses a clearly disclosed custom illustrative points estimate, not a proprietary WeightWatchers formula.
- The directory links available tools to their calculation pages through the central registry.
- Updated the implementation inventory and project documentation.

## Category totals
- Financial: 75 / 75
- Health & Fitness: 31 / 31
- Math: 44 / 44 (the catalog contains 44 Math entries; the earlier inventory count of 45 was corrected)
- Other: 4 of 54 catalog entries currently match an existing tool by name; two additional legacy tools (Date Difference and Length Converter) remain accessible under their existing slugs. 50 catalog entries remain planned.

## Important limitations
Health outputs are educational estimates and are not diagnoses or individualized medical advice. Pregnancy, ovulation, period, body-composition, kidney-function and BAC estimates have explicit limitations. BAC must never be used to decide whether it is safe to drive. The Weight Watcher Points tool does not reproduce the proprietary branded formula.

Math models include standard approximations where stated (for example, z-based confidence intervals and p-values). Some tools intentionally use bounded input ranges to avoid excessive computation.

## Verification
The package contains source code and test updates. Run `npm install`, `npm run typecheck`, `npm test`, and `npm run build` in the target environment before deployment. A full Next.js production build was not run during packaging.


## Directory matching note
The Other category contains 54 catalog entries. Four existing tools match those entries by display name. The legacy Date Difference and Length Converter tools are still registered, but their display names differ from the catalog's Date Calculator and Conversion Calculator labels; they are therefore not counted as directory-linked entries in this release.
