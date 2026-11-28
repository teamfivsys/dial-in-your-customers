/**
 * Short root slug helpers for KDial business profiles.
 * Short = full slug with a trailing district token removed, but only when
 * that candidate is unique across all published slugs and is not a reserved
 * single-segment route. Otherwise the full slug is kept at the root.
 * Server (server/directory-http.mjs) duplicates this logic exactly.
 */
export const DISTRICT_SUFFIXES = new Set([
  "ernakulam",
  "kozhikode",
  "thrissur",
  "kochi",
  "alappuzha",
  "thiruvananthapuram",
  "cochin",
  "kerala",
  "kannur",
  "kollam",
  "malappuram",
  "palakkad",
  "kottayam",
  "pathanamthitta",
  "idukki",
  "wayanad",
  "kasaragod",
]);

export const RESERVED_SLUGS = new Set([
  "directory",
  "submit-business",
  "businesses",
  "blog",
  "admin",
  "categories",
  "business-directory-kochi",
  "demo",
  "pay",
  "404",
  "api",
  "favicon.ico",
  "robots.txt",
  "sitemap",
  "sitemap.xml",
  "about",
  "login",
  "privacy",
  "terms",
]);

/** Single city slugs keep their legacy /:city handling; never use as business short. */
export const CITY_SLUGS = new Set([
  "kochi",
  "calicut",
  "trivandrum",
  "thrissur",
  "malappuram",
  "palakkad",
  "kannur",
  "kollam",
  "alappuzha",
  "kottayam",
  "idukki",
  "wayanad",
  "pathanamthitta",
  "kasaragod",
]);

export function shortCandidate(fullSlug: string): string {
  const parts = fullSlug.split("-");
  if (parts.length >= 2 && DISTRICT_SUFFIXES.has(parts[parts.length - 1])) {
    const candidate = parts.slice(0, -1).join("-");
    return candidate || fullSlug;
  }
  return fullSlug;
}

export function isReservedShort(short: string): boolean {
  if (RESERVED_SLUGS.has(short) || CITY_SLUGS.has(short)) return true;
  if (short.startsWith("business-directory-")) return true;
  return false;
}

/**
 * Build full -> short map with collision / reserved fallback.
 * If a stripped candidate collides with another candidate, equals another
 * full slug, or is reserved, fall back to the full slug at the root.
 */
export function buildShortMap(fullSlugs: string[]): Map<string, string> {
  const normalized = [...new Set(fullSlugs)].filter(Boolean);
  const fullSet = new Set(normalized);
  const candidates = new Map<string, string>();
  for (const full of normalized) candidates.set(full, shortCandidate(full));

  const candidateCounts = new Map<string, number>();
  for (const candidate of candidates.values()) {
    candidateCounts.set(candidate, (candidateCounts.get(candidate) ?? 0) + 1);
  }

  const map = new Map<string, string>();
  for (const [full, candidate] of candidates) {
    if (candidate === full) {
      map.set(full, full);
      continue;
    }
    const collides =
      (candidateCounts.get(candidate) ?? 0) > 1 ||
      (fullSet.has(candidate) && candidate !== full) ||
      isReservedShort(candidate);
    map.set(full, collides ? full : candidate);
  }
  return map;
}

export function shortSlugFor(fullSlug: string, shortMap?: Map<string, string>): string {
  return shortMap?.get(fullSlug) ?? shortCandidate(fullSlug);
}

export function canonicalBusinessUrl(fullSlug: string, shortMap?: Map<string, string>): string {
  return `https://kdial.in/${shortSlugFor(fullSlug, shortMap)}`;
}

export function businessPath(fullSlug: string, demo: boolean, shortMap?: Map<string, string>): string {
  if (demo) return `/demo/businesses/${encodeURIComponent(fullSlug)}`;
  return `/${encodeURIComponent(shortSlugFor(fullSlug, shortMap))}`;
}
