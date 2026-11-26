# Calculyt Search Modal Layout Fix

## Issue
The calculator search dialog was rendered inside the sticky site header. The header's stacking context and backdrop-filter could constrain the fixed overlay, allowing the homepage hero/content to paint over the search panel (as shown in the supplied screenshot).

## Changes
- Rendered the search dialog through React `createPortal` into `document.body`, outside the sticky header stacking context.
- Kept the dialog backdrop fixed to the viewport with a high stacking order.
- Added a viewport-bounded dialog (`max-height: 84vh`) and an independently scrollable results region.
- Added overscroll containment so scrolling long search results does not scroll the page behind the modal.
- Kept existing live name/description/category search, popular-tool suggestions, close button, Escape handling, focus trap, and result navigation.

## Files changed
- `src/components/SiteHeader.tsx`

## Verification
- ZIP archive integrity checked after packaging.
- A full Next.js typecheck/build should be run locally with `npm run typecheck` and `npm run build`.
- Browser verification should confirm the backdrop covers the entire viewport and that search results remain visible and scrollable at desktop and mobile widths.
