## Goal

Kill the current "AI-slop" hero and rebuild it as a crafted, mobile-first landing with a real headline A/B test whose results are stored in Lovable Cloud.

## 1. Fresh design directions (pick one)

Once you approve this plan, in build mode I'll:

1. Capture the live hero via headless browser (mobile viewport 360×640 + desktop 1280×900) as visual reference.
2. Call the directions tool with the current screenshot attached, locking Electric Midnight palette (#0A1730 / #1E6FFF / #FF6B1A / #F5F1E8) and Space Grotesk + DM Sans, and generate 3 rendered hero concepts that vary in composition/density/motion (e.g. editorial split, vertical tower, kinetic bento — no more generic tiled cards).
3. Present them via the prototype picker — you click the one to build.

Only the picked direction gets implemented. No merging.

## 2. Headline A/B test (under the logo, in Header)

- Two variants:
  - **A**: "Kerala's Best Business Directory. Stop buying leads."
  - **B**: "Get real customer calls. Not resold leads." *(you can edit both in one file)*
- On first visit, assign variant 50/50, persist in `localStorage` (`kdial_ab_variant`) so the same visitor always sees the same headline.
- Render a small variant chip under the logo in the header (dev-visible, styleable, can be hidden later) and swap the hero H1 accordingly.
- Every WhatsApp CTA click fires a conversion event tagged with the variant.

## 3. Lovable Cloud tracking

Enable Lovable Cloud, then:

- Table `ab_events` — columns: `id uuid pk`, `variant text check in ('A','B')`, `event text check in ('impression','whatsapp_click')`, `session_id text`, `path text`, `user_agent text`, `created_at timestamptz default now()`.
- Public-insert RLS: anon `INSERT` allowed, no `SELECT` for anon. `SELECT` only via authenticated admin role (`has_role`) — so results aren't leaked publicly.
- Grants: `GRANT INSERT ON public.ab_events TO anon, authenticated; GRANT ALL TO service_role;`
- Client helper `src/lib/ab.ts`: `getVariant()`, `logImpression()` (fires once per session), `logConversion()` (call from every WhatsApp `onClick`).
- Simple `/ab-results` page gated behind admin role showing counts + CTR per variant (nice-to-have; ship if time permits, otherwise query in the Cloud dashboard).

## 4. Mobile-first polish (applies to whichever direction wins)

- Header: reduce logo from `h-20/24/28` to `h-10/12` on mobile, collapse countdown into single-line compact pill, move theme toggle into a small icon-only button. Sticky header must not eat >64px on mobile.
- Hero: single-column stack on <768px with a strong H1 (clamp 32–40px), price tile promoted right below headline, sticky bottom WhatsApp CTA bar on mobile (thumb-reach zone).
- Typography scale rebuilt with `clamp()` so headings scale continuously rather than jumping at breakpoints.
- Tap targets ≥44px; remove hover-only affordances on touch.
- Preload Space Grotesk 700 + DM Sans 400 to kill FOUT.

## 5. Files touched

- `src/components/landing/HeroSection.tsx` — rewritten to picked direction
- `src/components/landing/Header.tsx` — smaller mobile logo, variant chip, sticky sizing
- `src/components/landing/StickyMobileCTA.tsx` — new
- `src/lib/ab.ts` — new (variant assignment + logging)
- `src/integrations/supabase/…` — auto-generated on Cloud enable
- Migration: `ab_events` table + RLS + grants
- `src/main.tsx` — preload font subset

## Out of scope

- Redesigning sections below the hero (Pricing, FAQ, Footer) — I'll only touch them if the picked direction's tokens require it for visual consistency.
- Full analytics dashboard UI beyond a minimal counts table.

Reply "go" (or pick a direction after I show them) to proceed.