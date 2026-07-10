# KDial Pre-Launch Premium Overhaul

Goal: turn the current landing page into a premium, SEO-first, conversion-focused pre-launch site — **without** changing the brand identity (logo, palette, typography) already established (Navy #0A1730, Blue #1E6FFF, Orange #FF6B1A, Cream #F5F1E8; Space Grotesk + DM Sans; Instrument Serif accents).

Nothing fabricated: no fake businesses, reviews, testimonials, counts, awards, or partners. Every number on the page will be a truthful pre-launch fact (₹501 founder price, 100 founder slots, 14 districts, launch window).

---

## 1. Content architecture (new section order on `/`)

Rebuild `src/pages/Index.tsx` to compose these sections in order. Each is its own file under `src/components/landing/`:

1. `Header` — existing (kept)
2. `HeroSection` — existing bento hero (kept; copy tightened, adds secondary CTA anchor)
3. `TrustStrip` *(new)* — 4 factual pills: *Kerala-only · Paid-only listings · Verified businesses · Privacy-first*
4. `WhyKDial` *(new)* — 3-card grid: what KDial is, who it's for, why register now
5. `ProblemsSolved` *(new)* — 4 problems Kerala businesses face + how KDial addresses each
6. `WhyVisibility` *(new)* — short editorial block on why local businesses need online visibility
7. `BenefitsSection` — existing (kept), retitled to "Benefits of registering early"
8. `WhoCanJoin` *(new)* — sector list (shops, clinics, services, professionals, restaurants, wedding, travel, trades) — clarifies eligibility, no fake logos
9. `HowItWorks` *(existing `ProcessSection`, kept)*
10. `FutureFeatures` *(new)* — grid of upcoming modules (search, filters, reviews, maps, dashboard, mobile app) labelled clearly as *coming soon*
11. `LaunchRoadmap` *(new)* — vertical timeline with ✅ / 🔄 / 🔜 states as specified
12. `PricingSection` — existing (kept)
13. `ComparisonSection` — existing (kept)
14. `MissionVision` *(new)* — founder message + Mission + Vision (first-person, honest, no puffery)
15. `PrivacyCommitment` *(new)* — plain-language promise: no lead reselling, no spam, data minimisation
16. `FAQSection` — existing (kept, extended with 3 pre-launch questions)
17. `FinalCTASection` — existing (kept)
18. `Footer` — upgraded (see §5)
19. `StickyMobileCTA` — existing (kept)
20. `ExitIntentModal` *(new, desktop only, once per session via `sessionStorage`)*

All new sections use existing design tokens (`bg-background`, `text-foreground`, brand hex where the hero already inlines them) — no new palette.

---

## 2. SEO & structured data

### Per-route head
- Extend `src/components/seo/SEO.tsx` to accept `title`, `description`, `canonical`, `ogImage`, `noindex` props (already partially there — audit + fill gaps).
- Set canonical + `og:url` to `https://dial-in-your-customers.lovable.app` (project's live domain) with self-referential canonicals on each route.
- Home `<title>`: *"KDial — Kerala Business Directory | List Your Business Before Launch"* (<60 chars).
- Home meta description: pre-launch value prop + founder offer (<160 chars).
- Add Twitter card tags (`summary_large_image`).

### JSON-LD (extend `src/components/seo/StructuredData.tsx`)
Already ships Organization, WebSite, Product, LocalBusiness, FAQPage, HowTo, Offer, Service, BreadcrumbList. Audit each and:
- Remove any `aggregateRating`, `review`, or `ratingValue` fields (would be fake pre-launch).
- Remove any hard-coded `numberOfEmployees`, `foundingDate` unless truthful.
- Add `WebPage` schema per route with `speakable` selectors for AEO.
- Ensure `BreadcrumbList` renders on `/blog`, `/blog/:slug`, `/:city`, `/:city/:category`.

### Crawl surface
- `public/robots.txt` — keep permissive, keep AI-bot allow list, ensure `Sitemap:` line points at the live domain.
- `public/sitemap.xml` — verify current 1,400-URL sitemap exists; if truncated from earlier turn, regenerate via `scripts/generate-sitemap.ts` (predev/prebuild) so it stays in sync automatically going forward. Add `<lastmod>` as today.
- `public/site.webmanifest` *(new)* — name, short_name, icons (reuse existing logo PNG), theme_color `#0A1730`, background_color `#F5F1E8`, display `standalone`.
- Link the manifest + apple-touch-icon in `index.html`.

### Semantics
- Enforce single `<h1>` per route (hero owns it). Audit all sections and demote stray `h1`s to `h2`.
- Wrap page content in one `<main>` inside `Index.tsx` (already present — verify).
- Every `<img>` gets a descriptive `alt`; decorative SVGs get `aria-hidden="true"`.

---

## 3. Conversion

- **Multiple CTAs**: hero, pricing, roadmap, mission, final CTA, sticky mobile bar, footer — all deep-link to the same WhatsApp URL, all fire `logConversion(variant)` via the existing A/B helper (single wrapper `WhatsAppCTA` component to avoid drift).
- **Exit-intent modal** (`ExitIntentModal.tsx`): desktop only (`matchMedia("(hover: hover)")`), triggers on `mouseleave` toward the top of the viewport, guarded by `sessionStorage["kdial_exit_seen"]`. Copy: *"Before you go — lock the ₹501 founder rate"* + WhatsApp CTA + dismiss. Fully keyboard-dismissable (ESC, focus trap via Radix Dialog).
- **Focus states**: audit every CTA — add `focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2` where missing.
- **Sticky CTA**: keep existing behaviour; ensure it doesn't cover the last section (bottom padding already handled in hero — extend to `FinalCTASection`).

---

## 4. Accessibility

- Colour contrast pass on cream/navy combos (both already ≥ AA — verify with the trust strip additions).
- Add `aria-label` to every icon-only button (audit `Header`, `StickyMobileCTA`, `ExitIntentModal`).
- Roadmap timeline uses `<ol>` with `aria-label="Launch roadmap"`; status conveyed with text + icon, not colour alone.
- FAQ uses existing shadcn Accordion (Radix) — already accessible.
- `<html lang="en">` — verify in `index.html`.
- Replace `h-screen` with `h-dvh` anywhere it appears in the landing components.

---

## 5. Footer upgrade

Rewrite `src/components/landing/Footer.tsx`:

- 4-column grid on desktop, stacked on mobile.
- Columns: **KDial** (wordmark + one-line tagline), **Explore** (Home, Blog, Cities, Categories), **Company** (About/Mission anchor, Privacy anchor, Contact), **Get in touch** (WhatsApp link, mailto, social icons — only include socials the user has confirmed; otherwise omit rather than fabricate).
- Copyright + "Made in Kerala with ❤️" line.
- Uses `KdialWordmark` component (already exists) so no white-box logo issue.

---

## 6. Performance

- Add `loading="lazy"` + `decoding="async"` on non-hero images.
- Add `fetchpriority="high"` preload for the hero background/logo in `index.html` (only the wordmark is inline SVG — nothing raster in the hero, so this is mostly a no-op; verify).
- Font loading: `@fontsource/space-grotesk` and `@fontsource/dm-sans` are already imported; add `@fontsource/instrument-serif` (used by hero italic accents) if missing, with `font-display: swap` (default).
- Route-level `React.lazy` + `<Suspense>` for `Blog`, `BlogPost`, `CityPage`, `CategoryPage` in `App.tsx` — home route stays eager for fast FCP.
- Confirm no `import * as` barrels pulling framer-motion into every route.

---

## 7. Files touched

**New**
- `src/components/landing/TrustStrip.tsx`
- `src/components/landing/WhyKDial.tsx`
- `src/components/landing/ProblemsSolved.tsx`
- `src/components/landing/WhyVisibility.tsx`
- `src/components/landing/WhoCanJoin.tsx`
- `src/components/landing/FutureFeatures.tsx`
- `src/components/landing/LaunchRoadmap.tsx`
- `src/components/landing/MissionVision.tsx`
- `src/components/landing/PrivacyCommitment.tsx`
- `src/components/landing/ExitIntentModal.tsx`
- `src/components/landing/WhatsAppCTA.tsx` (shared CTA wrapper)
- `public/site.webmanifest`

**Modified**
- `src/pages/Index.tsx` (new section composition)
- `src/components/landing/Footer.tsx` (4-column upgrade)
- `src/components/landing/FAQSection.tsx` (3 pre-launch FAQs appended)
- `src/components/seo/SEO.tsx` (Twitter card + prop audit)
- `src/components/seo/StructuredData.tsx` (drop fake-signal fields, add WebPage+speakable)
- `src/App.tsx` (lazy routes)
- `index.html` (manifest link, apple-touch-icon, `lang`)
- `public/robots.txt` (verify Sitemap directive)
- `public/sitemap.xml` (regenerate with lastmod=today)

**Untouched**
- `HeroSection.tsx`, `Header.tsx`, `PricingSection.tsx`, `ComparisonSection.tsx`, `BenefitsSection.tsx`, `ProcessSection.tsx`, `AEOContent.tsx`, `FinalCTASection.tsx`, `StickyMobileCTA.tsx`, `src/index.css`, `tailwind.config.ts`, all `KdialWordmark` styling, all A/B logic in `src/lib/ab.ts`.

---

## 8. Verification

- `tsgo` clean.
- Playwright at 360×642 (mobile) and 1280×1800 (desktop): screenshot the full page, confirm all 20 sections render, hero unchanged, footer 4-column on desktop, sticky CTA visible, no overlap.
- View-source check: exactly one `<h1>`, canonical present, all JSON-LD blocks valid JSON.
- Click WhatsApp CTA in headless run — confirm `ab_events` insert fires.

## Out of scope (won't do)
- No new colours, fonts, or logo variants.
- No fabricated testimonials, business counts, star ratings, or partner logos.
- No SSR migration (staying on Vite SPA).
- No changes to city/category page templates beyond schema hygiene.

Reply **go** to implement.
