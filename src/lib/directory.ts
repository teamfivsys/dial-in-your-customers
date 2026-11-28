import type { Business } from "../data/businesses";
export interface Listing extends Business { demo?: boolean }
function normalizeSearch(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase();
}
export function filterListings(records: Listing[], filters: {q?: string; category?: string; locality?: string; district?: string; city?: string; categoryLabels?: Record<string, string>}) {
  const q = normalizeSearch(filters.q ?? "");
  return records.filter(b => {
    const searchable = normalizeSearch([
      b.name, b.description, b.locality, b.district, b.address, b.categorySlug,
      filters.categoryLabels?.[b.categorySlug], ...(b.services ?? []),
    ].filter(Boolean).join(" "));
    return b.status === "approved" && b.citySlug === "kochi" &&
      (!filters.city || b.citySlug === filters.city) &&
      (!filters.category || b.categorySlug === filters.category) &&
      (!filters.district || normalizeSearch((b as {district?:string}).district ?? "") === normalizeSearch(filters.district)) &&
      (!filters.locality || normalizeSearch(b.locality ?? "") === normalizeSearch(filters.locality)) &&
      (!q || searchable.includes(q));
  });
}
/** Return safe contact URLs only for an actual Indian mobile number. */
export function contactPhone(value?: string) {
  const digits = (value ?? "").replace(/\D/g, "");
  const normalized = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  return /^[6-9]\d{9}$/.test(normalized) ? `+91${normalized}` : undefined;
}
export function verificationLabel(verified: boolean, verifiedAt?: string) {
  if (!verified) return "Business details have not been verified";
  const date = verifiedAt?.slice(0, 10);
  return date ? `Business details verified · last checked ${date}` : "Business details verified";
}
export function callHref(value?: string) {
  const phone = contactPhone(value);
  return phone ? `tel:${phone}` : undefined;
}
export function whatsappHref(value?: string) {
  const phone = contactPhone(value);
  return phone ? `https://wa.me/${phone.slice(1)}` : undefined;
}
export const DEMO_ENABLED = import.meta.env?.DEV || import.meta.env?.VITE_DIRECTORY_DEMO === "true";
export function directoryPath(demo: boolean) { return demo ? "/demo/directory" : "/directory"; }
export function profilePath(slug: string, demo: boolean) { return `${demo ? "/demo" : ""}/businesses/${encodeURIComponent(slug)}`; }
