import { useParams, Link } from "react-router-dom";
import { MapPin, Phone, Clock, BadgeCheck, MessageCircle, ArrowLeft, Globe, Star } from "lucide-react";
import Header from "@/components/landing/Header";
import SEO from "@/components/seo/SEO";
import { SiteFooter } from "./Index";
import { useListings } from "@/hooks/use-listings";
import { DEMO_ENABLED, directoryPath, callHref, whatsappHref, verificationLabel } from "@/lib/directory";
import { useDirectoryTaxonomy } from "@/hooks/use-directory-taxonomy";
import DemoNotice from "@/components/directory/DemoNotice";
import NotFound from "./NotFound";
export default function BusinessPage({demo = false}: {demo?: boolean}) {
  const {slug} = useParams();
  const {records, loading, error, retry} = useListings(demo);
  const {categories} = useDirectoryTaxonomy(demo);
  const b = records.find(b => b.slug === slug);
  if (demo && !DEMO_ENABLED) return <NotFound/>;
  if (loading) return <div className="kd-site"><Header/><main className="kd-wrap kd-section" role="status">Loading business…</main></div>;
  if (error) return <div className="kd-site"><Header/><main className="kd-wrap kd-section" role="alert"><p>{error}</p><button className="kd-button" onClick={retry}>Try again</button></main></div>;
  if (!b) return <NotFound/>;
  const initials = b.name.replace(/[^A-Za-z0-9 ]/g," ").split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase() || "KD";
  const heroPhoto = b.photos?.[0];
  const galleryPhotos = b.photos?.slice(1) ?? [];
  const placeLine = [b.locality, (b as {district?:string}).district].filter(Boolean).join(" · ") || `${b.locality}, Kochi`;
  const category = categories.find(c=>c.slug===b.categorySlug)?.label ?? b.categorySlug;
  const safeWebsite = b.website?.startsWith("https://") ? b.website : undefined;
  const isPremium = b.slug === "element-builders-ernakulam";
  const safeMaps = isPremium ? "https://share.google/IsLWPE44dciWHYVw4" : (b.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.address}, Kochi`)}` : undefined);
  return <div className="kd-site"><SEO title={`${b.name} · ${category} in Kochi | KDial`} description={b.description} canonicalUrl={`https://kdial.in/businesses/${b.slug}`} noIndex={demo}/><Header/>{demo && <DemoNotice/>}<main id="main-content" className="kd-wrap kd-section kd-profile">
    <Link className="kd-text-link" to={directoryPath(demo)}><ArrowLeft size={16}/>Back to directory</Link><div className="kd-profile-hero"><div className="kd-profile-hero-media">{heroPhoto ? <img src={heroPhoto} alt={demo ? "Fictional demo illustration, not a real business" : b.name}/> : <span className="kd-card-initials kd-profile-initials" aria-hidden="true">{initials}</span>}</div><div className="kd-profile-hero-body"><p className="kd-eyebrow">{category} · {placeLine}</p><h1>{b.name}</h1>{!demo && <p className={b.verified ? "kd-verified" : "kd-verification-unknown"}><BadgeCheck size={17}/>{verificationLabel(b.verified, b.verifiedAt)}</p>}{!demo && isPremium && <p className="kd-profile-premium"><span className="kd-profile-premium-pill"><Star size={17}/>★ 5.0 Premium</span><small className="kd-profile-premium-note">Rating shown as 5.0 per owner request 28 Nov 2026, not from review data.</small></p>}<p className="kd-intro">{b.description}</p>{b.address && <p className="kd-profile-address"><MapPin size={16}/><span>{b.address}{b.pincode ? `, ${b.pincode}` : ""}</span></p>}{!demo && <div className="kd-profile-actions">{callHref(b.phone) && <a className="kd-button kd-profile-call" href={callHref(b.phone)}><Phone size={18}/>Call now</a>}{whatsappHref(b.whatsapp) && <a className="kd-button kd-button-secondary kd-profile-wa" href={whatsappHref(b.whatsapp)} target="_blank" rel="noopener noreferrer"><MessageCircle size={18}/>WhatsApp</a>}{safeWebsite && <a className="kd-button kd-button-secondary" href={safeWebsite} target="_blank" rel="noopener noreferrer"><Globe size={18}/>Website</a>}{safeMaps && <a className="kd-button kd-button-secondary" href={safeMaps} target="_blank" rel="noopener noreferrer"><MapPin size={18}/>Get directions</a>}</div>}</div></div>
    {!!galleryPhotos.length && <div className="kd-profile-photos">{galleryPhotos.map((photo,i)=><img src={photo} key={photo} alt={demo ? "Fictional demo illustration, not a real business" : `${b.name} photo ${i+2}`}/>)}</div>}
    <div className="kd-profile-grid"><section className="kd-profile-panel"><h2><MapPin size={20}/>Location</h2><p>{b.address}{b.pincode ? `, ${b.pincode}` : ""}</p>{safeMaps && !demo && <a className="kd-text-link" href={safeMaps} target="_blank" rel="noopener noreferrer">Get directions</a>}</section>
    <section className="kd-profile-panel"><h2><Phone size={20}/>Contact</h2>{demo ? <p>Disabled in this fictional demo. No real contact details are used.</p> : <>{callHref(b.phone) && <a className="kd-button" href={callHref(b.phone)}>Call {b.phone}</a>}{whatsappHref(b.whatsapp) && <a className="kd-button kd-button-secondary" href={whatsappHref(b.whatsapp)} target="_blank" rel="noopener noreferrer"><MessageCircle size={18}/>WhatsApp</a>}{safeWebsite && <a className="kd-text-link" href={safeWebsite} target="_blank" rel="noopener noreferrer"><Globe size={18}/>Website</a>}</>}</section>
    {!!b.hours?.length && <section className="kd-profile-panel"><h2><Clock size={20}/>Hours</h2>{b.hours.map(h=><p key={h.days}>{h.days}: {h.opens}–{h.closes}</p>)}</section>}
    {!!b.services?.length && <section className="kd-profile-panel"><h2>Services</h2><ul>{b.services.map(s=><li key={s}>{s}</li>)}</ul></section>}</div>{demo && b.updatedAt && <p className="kd-profile-updated">Fixture date: {b.updatedAt}</p>}
  </main><SiteFooter/></div>;
}
