import { useState } from "react";
import { useParams, Link, Navigate, useLocation } from "react-router-dom";
import { MapPin, Phone, Clock, BadgeCheck, MessageCircle, ArrowLeft, Globe, Star, Share2 } from "lucide-react";
import Header from "@/components/landing/Header";
import SEO from "@/components/seo/SEO";
import StructuredData from "@/components/seo/StructuredData";
import { SiteFooter } from "./Index";
import { useListings } from "@/hooks/use-listings";
import { DEMO_ENABLED, directoryPath, callHref, whatsappHref, verificationLabel, profilePath } from "@/lib/directory";
import { buildShortMap, canonicalBusinessUrl } from "@/lib/slugs";
import { getCityBySlug } from "@/data/cities";
import { useDirectoryTaxonomy } from "@/hooks/use-directory-taxonomy";
import DemoNotice from "@/components/directory/DemoNotice";
import NotFound from "./NotFound";
export default function BusinessPage({demo = false}: {demo?: boolean}) {
  const {slug} = useParams();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const {records, loading, error, retry} = useListings(demo);
  const {categories} = useDirectoryTaxonomy(demo);
  if (demo && !DEMO_ENABLED) return <NotFound/>;
  if (loading) return <div className="kd-site"><Header/><main className="kd-wrap kd-section" role="status">Loading business…</main></div>;
  if (error) return <div className="kd-site"><Header/><main className="kd-wrap kd-section" role="alert"><p>{error}</p><button className="kd-button" onClick={retry}>Try again</button></main></div>;
  // Live: resolve by short OR full slug. Demo: full slug only (legacy paths kept).
  let shortMap: Map<string, string> | undefined;
  let b = undefined;
  let shortSlug = slug;
  if (demo) {
    b = records.find(x => x.slug === slug);
  } else {
    shortMap = buildShortMap(records.map(r => r.slug));
    b = records.find(r => {
      const s = shortMap?.get(r.slug) ?? r.slug;
      return s === slug || r.slug === slug;
    });
  }
  if (!b) {
    // Preserve legacy /:city behaviour on the merged /:slug route.
    if (!demo && slug && getCityBySlug(slug)) {
      return <Navigate to={`/directory?city=${encodeURIComponent(slug)}`} replace/>;
    }
    return <NotFound/>;
  }
  if (!demo && shortMap) {
    shortSlug = shortMap.get(b.slug) ?? b.slug;
    const incoming = slug ?? "";
    const isLegacy = location.pathname.startsWith("/businesses/");
    if (isLegacy || incoming !== shortSlug) {
      return <Navigate to={`/${encodeURIComponent(shortSlug)}`} replace/>;
    }
  }
  const canonicalUrl = demo
    ? `https://kdial.in/demo/businesses/${b.slug}`
    : canonicalBusinessUrl(b.slug, shortMap);
  const initials = b.name.replace(/[^A-Za-z0-9 ]/g," ").split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase() || "KD";
  const heroPhoto = b.photos?.[0];
  const galleryPhotos = b.photos?.slice(1) ?? [];
  const placeLine = [b.locality, (b as {district?:string}).district].filter(Boolean).join(" · ") || `${b.locality}, Kochi`;
  const category = categories.find(c=>c.slug===b.categorySlug)?.label ?? b.categorySlug;
  const safeWebsite = b.website?.startsWith("https://") ? b.website : undefined;
  const isPremium = b.slug === "element-builders-ernakulam";
  const districtName = (b as {district?:string}).district;
  const related = records.filter(r => r.slug !== b.slug && r.status === "approved" && !r.demo)
    .sort((ra, rb) => {
      const score = (x: typeof ra) => (x.categorySlug === b.categorySlug ? 4 : 0) + (x.locality === b.locality ? 2 : 0) + (districtName && (x as {district?:string}).district === districtName ? 1 : 0);
      return score(rb) - score(ra);
    }).slice(0, 4);
  const schemaAddress = b.address ? { "@type": "PostalAddress", streetAddress: b.address, addressLocality: (b as {district?:string}).district || b.locality || "Kochi", addressRegion: "Kerala", postalCode: b.pincode, addressCountry: "IN" } : undefined;
  const localBusinessSchema: Record<string, unknown> = {
    "@type": (b.schemaType as string) || "LocalBusiness",
    "@id": `${canonicalUrl}#business`,
    name: b.name,
    url: canonicalUrl,
    description: b.description,
    ...(b.phone ? { telephone: b.phone } : {}),
    ...(schemaAddress ? { address: schemaAddress } : {}),
    ...(b.geo ? { geo: { "@type": "GeoCoordinates", latitude: b.geo.lat, longitude: b.geo.lng } } : {}),
    ...(b.website ? { sameAs: [b.website] } : {}),
  };

  const safeMaps = isPremium ? "https://share.google/IsLWPE44dciWHYVw4" : (b.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.address}, Kochi`)}` : undefined);
  const shareText = `${b.name} on KDial — ${canonicalUrl}`;
  const handleShare = async () => {
    const url = canonicalUrl;
    const text = shareText;
    const nav = typeof navigator !== "undefined" ? (navigator as Navigator & { share?: (data: { title: string; text: string; url: string }) => Promise<void> }) : undefined;
    if (nav?.share) {
      try {
        await nav.share({ title: `${b.name} on KDial`, text, url });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        // fall through to copy fallback on other failures
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return <div className="kd-site"><SEO title={`${b.name} · ${category} in Kochi | KDial`} description={b.description} canonicalUrl={canonicalUrl} noIndex={demo}/>{!demo && <StructuredData data={localBusinessSchema}/>}<Header/>{demo && <DemoNotice/>}<main id="main-content" className="kd-wrap kd-section kd-profile">
    <Link className="kd-text-link" to={directoryPath(demo)}><ArrowLeft size={16}/>Back to directory</Link><div className="kd-profile-hero"><div className="kd-profile-hero-media">{heroPhoto ? <img src={heroPhoto} alt={demo ? "Fictional demo illustration, not a real business" : b.name}/> : <span className="kd-card-initials kd-profile-initials" aria-hidden="true">{initials}</span>}</div><div className="kd-profile-hero-body"><p className="kd-eyebrow">{category} · {placeLine}</p><h1>{b.name}</h1>{!demo && <p className={b.verified ? "kd-verified" : "kd-verification-unknown"}><BadgeCheck size={17}/>{verificationLabel(b.verified, b.verifiedAt)}</p>}{!demo && isPremium && <p className="kd-profile-premium"><span className="kd-profile-premium-pill"><Star size={17}/>★ 5.0 Premium</span><small className="kd-profile-premium-note">Rating shown as 5.0 per owner request 28 Nov 2026, not from review data.</small></p>}<p className="kd-intro">{b.description}</p>{b.address && <p className="kd-profile-address"><MapPin size={16}/><span>{b.address}{b.pincode ? `, ${b.pincode}` : ""}</span></p>}{!demo && <div className="kd-profile-actions">{callHref(b.phone) && <a className="kd-button kd-profile-call" href={callHref(b.phone)}><Phone size={18}/>Call now</a>}{whatsappHref(b.whatsapp) && <a className="kd-button kd-button-secondary kd-profile-wa" href={whatsappHref(b.whatsapp)} target="_blank" rel="noopener noreferrer"><MessageCircle size={18}/>WhatsApp</a>}{safeWebsite && <a className="kd-button kd-button-secondary" href={safeWebsite} target="_blank" rel="noopener noreferrer"><Globe size={18}/>Website</a>}{safeMaps && <a className="kd-button kd-button-secondary" href={safeMaps} target="_blank" rel="noopener noreferrer"><MapPin size={18}/>Get directions</a>}<button type="button" className="kd-button kd-button-secondary kd-share-btn" onClick={handleShare} aria-label={`Share ${b.name}`}><Share2 size={18}/>Share</button>{copied && <span className="kd-share-copied" role="status">Link copied</span>}</div>}</div></div>
    {!!galleryPhotos.length && <div className="kd-profile-photos">{galleryPhotos.map((photo,i)=><img src={photo} key={photo} alt={demo ? "Fictional demo illustration, not a real business" : `${b.name} photo ${i+2}`}/>)}</div>}
    <div className="kd-profile-grid"><section className="kd-profile-panel"><h2><MapPin size={20}/>Location</h2><p>{b.address}{b.pincode ? `, ${b.pincode}` : ""}</p>{safeMaps && !demo && <a className="kd-text-link" href={safeMaps} target="_blank" rel="noopener noreferrer">Get directions</a>}</section>
    <section className="kd-profile-panel"><h2><Phone size={20}/>Contact</h2>{demo ? <p>Disabled in this fictional demo. No real contact details are used.</p> : <>{callHref(b.phone) && <a className="kd-button" href={callHref(b.phone)}>Call {b.phone}</a>}{whatsappHref(b.whatsapp) && <a className="kd-button kd-button-secondary" href={whatsappHref(b.whatsapp)} target="_blank" rel="noopener noreferrer"><MessageCircle size={18}/>WhatsApp</a>}{safeWebsite && <a className="kd-text-link" href={safeWebsite} target="_blank" rel="noopener noreferrer"><Globe size={18}/>Website</a>}</>}</section>
    {!!b.hours?.length && <section className="kd-profile-panel"><h2><Clock size={20}/>Hours</h2>{b.hours.map(h=><p key={h.days}>{h.days}: {h.opens}–{h.closes}</p>)}</section>}
    {!!b.services?.length && <section className="kd-profile-panel"><h2>Services</h2><ul>{b.services.map(s=><li key={s}>{s}</li>)}</ul></section>}</div>{demo && b.updatedAt && <p className="kd-profile-updated">Fixture date: {b.updatedAt}</p>}
    </main>{!demo && !!related.length && <section className="kd-wrap kd-related"><h2>Related businesses</h2><div className="kd-related-grid">{related.map(r => <Link key={r.slug} className="kd-related-card" to={profilePath(r.slug, demo, shortMap)}><strong>{r.name}</strong><span>{r.locality}{r.district ? ` · ${r.district}` : ""}</span></Link>)}</div></section>}<SiteFooter/></div>;
}
