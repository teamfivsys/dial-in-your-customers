## Problem

You see a fully blank white screen on your phone. When I load the same preview URL headless at 390 px, the hero, navy card, price, and CTA all render. So the build is not broken — something on your device/session is crashing or blocking first paint.

## Most likely causes (in order)

1. **Stale service worker / cached blank HTML** from a previous broken deploy. Very common after multiple redesign iterations. A hard-refresh usually fixes it instantly.
2. **A runtime error only triggered on your device** (older mobile browser, extension, or a specific viewport path). Nothing shows in my headless run, so I need your live console.
3. **Supabase client init failure** — `src/lib/ab.ts` imports the supabase client at module load. If the env vars are missing in your session, it can throw before React mounts. I want to make this non-fatal regardless.

## Plan

### Step 1 — Have you try the zero-code fixes first
Before I touch code, try in this order and tell me which one works:
- Hard refresh the preview (pull-to-refresh, or open the preview URL in a fresh tab).
- Open the preview URL directly in Chrome/Safari (not inside the Lovable mobile chat wrapper).
- If it's still blank, open DevTools / remote-inspect and copy the first red console error to me.

### Step 2 — Make the app resilient so it can never render blank
Regardless of the diagnosis, harden the code so a bad env var, a Supabase failure, or a component crash shows something instead of a white screen:

- **Wrap `<App />` in an ErrorBoundary** (new `src/components/ErrorBoundary.tsx`) that renders a minimal fallback (logo + "Register on WhatsApp" CTA + error text) so the CTA is always reachable even if the hero crashes.
- **Guard the Supabase client** in `src/integrations/supabase/client.ts`: if `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` are missing, export a no-op stub whose `.from().insert()` resolves silently. A/B logging must never break the page.
- **Defer `getVariant()` / `logImpression()`** in `HeroSection.tsx` and `Header.tsx` so any storage/crypto exception is swallowed and defaults to variant A.
- **Remove the FOUT risk**: keep font imports, but add `font-display: swap` fallbacks in `src/index.css` so text is visible immediately in system fonts while `@fontsource` files download over slow 5G.

### Step 3 — Verify
- Rebuild and re-run the headless Playwright load at 390 px to confirm the page still renders.
- Load the preview with `VITE_SUPABASE_*` intentionally blanked to confirm the stub + error boundary keep the hero visible.
- Ask you to hard-refresh and confirm content appears.

## Out of scope
- No visual redesign in this pass. The Vertical Manifesto direction stays exactly as it is.
- No changes to sections below the hero.
- No changes to the A/B test schema — only its client wiring is hardened.

## Files touched
- `src/components/ErrorBoundary.tsx` (new)
- `src/App.tsx` (wrap in boundary)
- `src/integrations/supabase/client.ts` (env-safe stub) — note this is normally auto-generated; I'll add a thin wrapper module instead if we must not edit it
- `src/lib/ab.ts` (try/catch around storage + insert)
- `src/components/landing/HeroSection.tsx` and `Header.tsx` (defensive `getVariant`)
- `src/index.css` (font-display swap fallback stack)

Reply **go** to implement, or tell me which of the Step 1 checks (hard refresh, direct URL, console error) you tried first.