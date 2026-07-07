## Status of A/B tracking (already live — no code changes needed)

Verified in the current build:

- **Persistent assignment** — `src/lib/ab.ts` writes the variant to `localStorage['kdial_ab_variant']` on the first visit and reads the same value on every reload, so a returning visitor always sees the same hero headline (A or B).
- **Impression tracking** — `logImpression(variant)` fires once per browser into the `ab_events` table with `event = 'impression'`, `session_id`, `path`, and `user_agent`.
- **WhatsApp conversion tracking** — `logConversion(variant)` fires with `event = 'whatsapp_click'` from both the hero button (`HeroSection.tsx`) and the sticky mobile CTA (`StickyMobileCTA.tsx`).

I'll surface this properly and add nothing redundant.

## Fix: header logo shows a white rectangle on the cream header

Root cause: `src/assets/kdial-logo.png` is exported with a solid white background, so on the cream (`#F5F1E8`) header it reads as a floating white tile — that's the "white" you're seeing.

### Approach

Replace the raster logo in the header with an inline SVG wordmark that matches the "k.dial" mark already used inside the hero card. Same type family (Space Grotesk), same blue "k" + orange dot + navy "dial", no background box — it sits directly on the cream and stays crisp at any size.

- **`Header.tsx`**: swap `<img src={kdialLogo} …>` for an inline SVG wordmark component. Keep the A/B variant chip and countdown/theme controls exactly as they are.
- **`Footer.tsx`**: apply the same wordmark (larger size) so the footer stops rendering a big white box on cream too.
- **New file** `src/components/brand/KdialWordmark.tsx`: a small, reusable inline SVG wordmark (accepts `className` and `size` props, colors are hard-locked to the brand tokens: `#1E6FFF`, `#FF6B1A`, `#0A1730`).
- Keep the PNG file in the repo — still referenced by SEO/OG image metadata elsewhere.

### Verification

- Headless Playwright at 360×642 (your device) — screenshot header and confirm no white rectangle, logo sits flush on cream.
- Screenshot footer — same check.
- Confirm A/B chip (`exp · A` / `exp · B`) still shows next to the wordmark on ≥sm viewports.
- Send a WhatsApp click in the browser and check the network tab shows an insert into `ab_events`.

## Files touched

- `src/components/brand/KdialWordmark.tsx` (new)
- `src/components/landing/Header.tsx` (swap img → wordmark)
- `src/components/landing/Footer.tsx` (swap img → wordmark)

## Out of scope

- Hero content, pricing, sticky CTA, and A/B logic — untouched.
- No changes to the PNG file or SEO metadata.
- No changes to the `ab_events` schema.

Reply **go** to implement.