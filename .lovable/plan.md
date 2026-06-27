# Update Logo, Rebrand Colors, Change Price to ₹501

## 1. New Logo Asset

- Upload the new logo image as a Lovable Asset from `/mnt/user-uploads/file_0000000083a47207bfd198093b397f9c.png` → `src/assets/kdial-logo-new.png.asset.json`
- Replace the old logo imports in:
  - `src/components/landing/Header.tsx` (currently uses `WhatsApp_Image_2026-02-23...png`)
  - `src/components/landing/Footer.tsx` (currently uses `kdial-logo.png`)

## 2. Recolor UI to Match New Logo

The new logo defines this palette:

| Token | New Value | Was |
|---|---|---|
| `--primary` (Blue) | `218 100% 56%` (#1E6FFF electric blue) | Red |
| `--accent` (Orange) | `20 100% 55%` (#FF6B1A vibrant orange) | Orange (kept) |
| `--secondary` (Deep Navy) | `220 70% 12%` (#0A1730 dark navy from wordmark) | Mid blue |
| `--foreground` | `220 70% 10%` deep navy text | Dark gray |
| `--background` | `0 0% 100%` white (unchanged) | White |
| `--whatsapp` | `142 70% 49%` green (unchanged for CTA) | Same |

### Gradient updates in `src/index.css`:
- `--gradient-brand`: `linear-gradient(135deg, #1E6FFF 0%, #FF6B1A 100%)` (blue → orange, matches logo "k" + dot)
- `--gradient-hero`: subtle blue-tinted white wash
- Body background radial gradients: blue + orange tints instead of red

### Dark mode:
- Keep palette consistent — primary blue stays vivid, accent orange stays warm, background goes deep navy `220 30% 8%`

### Files that reference hardcoded colors (need verification, no class changes needed since they use tokens):
- `HeroSection.tsx`, `PricingSection.tsx`, `ComparisonSection.tsx`, `BenefitsSection.tsx`, `ProcessSection.tsx`, `FAQSection.tsx`, `FinalCTASection.tsx` — all use semantic tokens, so they auto-recolor.
- A few hardcoded `rgba(234, 88, 12, ...)` (orange) shadow values stay (still match new orange).

## 3. Change Offer Price ₹999 → ₹501

Replace across the codebase:

| Where | Change |
|---|---|
| `HeroSection.tsx` | "₹999" → "₹501", WhatsApp message text, button label "Lock My Price @ ₹501" |
| `PricingSection.tsx` | "₹999" → "₹501", "Save ₹2,000" → "Save ₹2,498" |
| `FinalCTASection.tsx` | "₹999" → "₹501", button "Secure My ₹501 Listing" |
| `ProcessSection.tsx` | Any ₹999 mentions → ₹501 |
| `FAQSection.tsx`, `AEOContent.tsx`, `FAQSchema.tsx` | Q&A text mentioning ₹999 → ₹501 |
| `Blog posts` (`src/data/blogPosts.ts`) | ₹999 → ₹501 inside post content |
| `SEO.tsx` default description | ₹999 → ₹501 if present |
| `StructuredData.tsx` | `productSchema.offers.price` "999" → "501"; `prelaunchOfferSchema.price` "999" → "501" |
| `index.html` meta description | Update if it mentions ₹999 |
| Sitemap / robots — no change |

## 4. What stays exactly the same

- Layout, spacing, animations, typography (Poppins), component structure
- Routing, SEO structure, FAQ schema shape, all city/category pages
- WhatsApp number `917356137106`, CTA copy structure
- All non-color tokens

## Files to Modify

1. `src/assets/kdial-logo-new.png.asset.json` (new)
2. `src/index.css` (color tokens + gradients)
3. `src/components/landing/Header.tsx` (logo import)
4. `src/components/landing/Footer.tsx` (logo import)
5. `src/components/landing/HeroSection.tsx` (price + WhatsApp msg)
6. `src/components/landing/PricingSection.tsx` (price + savings)
7. `src/components/landing/FinalCTASection.tsx` (price)
8. `src/components/landing/ProcessSection.tsx` (if price referenced)
9. `src/components/landing/FAQSection.tsx` (price in answers)
10. `src/components/landing/AEOContent.tsx` (price)
11. `src/components/seo/FAQSchema.tsx` (price in aeoFaqs)
12. `src/components/seo/StructuredData.tsx` (offer price)
13. `src/components/seo/SEO.tsx` (description if it has price)
14. `src/data/blogPosts.ts` (price mentions in post content)
15. `index.html` (meta description if it mentions price)
