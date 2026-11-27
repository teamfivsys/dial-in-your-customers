/**
 * Legacy type helpers. Persistent public listings now come from the server-enforced
 * kdial_public_listings RPC; this empty legacy array must never be populated with
 * fictional data. Old discovery routes redirect to the persistent directory.
 */

export interface BusinessHours {
  /** e.g. "Mo-Sa" or "Su" */
  days: string;
  /** e.g. "09:00" */
  opens: string;
  /** e.g. "20:00" */
  closes: string;
}

export interface Business {
  /** URL slug -> /businesses/{slug} */
  slug: string;
  name: string;
  /** category slug from src/data/categories.ts */
  categorySlug: string;
  /** city slug from src/data/cities.ts */
  citySlug: string;
  /** Human readable locality, e.g. "Panampilly Nagar" */
  locality?: string;
  district?: string;
  address: string;
  pincode?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  mapsUrl?: string;
  geo?: { lat: number; lng: number };
  hours?: BusinessHours[];
  services?: string[];
  photos?: string[];
  description: string;
  /** Most specific schema.org LocalBusiness subtype, e.g. "Dentist", "Restaurant" */
  schemaType?: string;
  priceRange?: string;
  verified: boolean;
  /** Only `approved` listings are rendered and indexed. */
  status: "approved" | "pending" | "expired";
  /** ISO date (YYYY-MM-DD) of the last verified content change, when supplied. */
  updatedAt?: string;
  /** ISO timestamp/date when an admin last verified this listing. */
  verifiedAt?: string;
  /** Optional SEO overrides — editable per listing. */
  seoTitle?: string;
  seoDescription?: string;
  canonicalOverride?: string;
}

/** Minimum approved listings before a city+category page becomes indexable. */
export const MIN_LISTINGS_FOR_INDEX = 1;

export const businesses: Business[] = [];

export const approvedBusinesses = (): Business[] =>
  businesses.filter((b) => b.status === "approved");

export const getBusinessBySlug = (slug?: string): Business | undefined =>
  slug
    ? approvedBusinesses().find((b) => b.slug === slug.toLowerCase())
    : undefined;

export const getBusinessesByCityCategory = (
  citySlug: string,
  categorySlug: string
): Business[] =>
  approvedBusinesses().filter(
    (b) => b.citySlug === citySlug && b.categorySlug === categorySlug
  );

export const getBusinessesByCity = (citySlug: string): Business[] =>
  approvedBusinesses().filter((b) => b.citySlug === citySlug);

export const getBusinessesByCategory = (categorySlug: string): Business[] =>
  approvedBusinesses().filter((b) => b.categorySlug === categorySlug);

/** True when a city+category page has enough real content to be indexed. */
export const isCityCategoryIndexable = (
  citySlug: string,
  categorySlug: string
): boolean =>
  getBusinessesByCityCategory(citySlug, categorySlug).length >=
  MIN_LISTINGS_FOR_INDEX;

/** SEO defaults derived from listing data (overridable per listing). */
export const businessSeo = (b: Business, cityName: string, categoryName: string) => ({
  title: b.seoTitle ?? `${b.name} — ${categoryName} in ${cityName}, Kerala | KDial`,
  description:
    b.seoDescription ??
    `${b.name} is a verified ${categoryName.toLowerCase()} in ${cityName}, Kerala. Address, phone, WhatsApp, opening hours and services on KDial.`,
  canonical: b.canonicalOverride ?? `https://kdial.in/businesses/${b.slug}`,
});