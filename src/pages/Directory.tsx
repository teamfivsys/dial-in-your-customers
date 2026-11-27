import { useSearchParams, Link } from "react-router-dom";
import { MapPin, ArrowUpRight, SearchX, Search, X } from "lucide-react";
import Header from "@/components/landing/Header";
import SEO from "@/components/seo/SEO";
import { SiteFooter } from "./Index";
import { useDirectoryTaxonomy } from "@/hooks/use-directory-taxonomy";
import { filterListings, profilePath, DEMO_ENABLED, callHref, whatsappHref, verificationLabel } from "@/lib/directory";
import { useListings } from "@/hooks/use-listings";
import DemoNotice from "@/components/directory/DemoNotice";
import NotFound from "./NotFound";

export default function Directory({demo = false}: {demo?: boolean}) {
  const [params, setParams] = useSearchParams();
  const {records, loading, error, retry} = useListings(demo);
  const category = params.get("category") ?? "";
  const q = params.get("q") ?? "";
  const locality = params.get("locality") ?? "";
  const district = params.get("district") ?? "";
  const city = params.get("city") ?? "";
  const {categories: allCategories,localities: allLocalities} = useDirectoryTaxonomy(demo);
  const categoryName = allCategories.find(c => c.slug === category)?.label;
  const results = filterListings(records, {q, category, locality, district, city, categoryLabels: Object.fromEntries(allCategories.map(c => [c.slug, c.label]))});
  const districts = [...new Set([...allLocalities.map(l=>l.district).filter(Boolean) as string[],...records.map(b => (b as {district?:string}).district).filter(Boolean) as string[]])].sort();
  const localities = [...new Set([...allLocalities.map(l=>l.label),...records.map(b => b.locality).filter(Boolean)])].sort();
  const categories = allCategories;
  function change(name: string, value: string) { const next = new URLSearchParams(params); if(value) next.set(name, value); else next.delete(name); setParams(next); }
  if (demo && !DEMO_ENABLED) return <NotFound/>;
  return <div className="kd-site kd-directory-page"><SEO title={demo ? "Fictional directory demo | KDial" : "Kochi business directory | KDial"} description="Search KDial’s published Kochi business listings by service, category and locality. Directory in preparation." canonicalUrl="https://kdial.in/directory" noIndex={demo || !results.length || !!params.size}/><Header/>{demo && <DemoNotice/>}<main id="main-content">
    <section className="kd-directory-head"><div className="kd-wrap"><Link className="kd-back" to="/">Home / Directory</Link><p className="kd-eyebrow">Kochi / Business directory</p><h1>Find a business in Kochi.</h1><p className="kd-intro">Search by service. Narrow it down to your neighbourhood.</p>
    <form className="kd-search" role="search" onSubmit={e => {e.preventDefault(); const value = new FormData(e.currentTarget).get("q"); change("q", String(value ?? "").trim());}}>
      <label className="kd-search-field"><Search size={21}/><span className="sr-only">Business or service</span><input key={q} name="q" defaultValue={q} placeholder="Business or service"/></label>
      <span className="kd-location-fixed"><MapPin size={18}/>Kochi</span><button className="kd-button" type="submit">Search</button>
    </form><div className="kd-area-index"><span>Browse by neighbourhood</span>{allLocalities.slice(0,6).map(l=><button key={l.slug} onClick={()=>change("locality",l.label)} aria-pressed={locality===l.label}>{l.label}</button>)}</div></div></section>
    <section className="kd-wrap kd-section kd-directory-body"><aside className="kd-filters"><label htmlFor="category-select">Category</label><select id="category-select" value={category} onChange={e=>change("category",e.target.value)}><option value="">All categories</option>{categories.map(c=><option key={c.slug} value={c.slug}>{c.label}</option>)}</select>
      <label htmlFor="district-select" className="kd-filter-space">District</label><select id="district-select" value={district} onChange={e=>change("district",e.target.value)}><option value="">All districts</option>{districts.map(d=><option key={d} value={d}>{d}</option>)}{district && !districts.includes(district) && <option value={district}>{district}</option>}</select>
      <label htmlFor="locality-select" className="kd-filter-space">Neighbourhood</label><select id="locality-select" value={locality} onChange={e=>change("locality",e.target.value)}><option value="">All neighbourhoods</option>{localities.map(l=><option key={l} value={l}>{l}</option>)}{locality && !localities.includes(locality) && <option value={locality}>{locality}</option>}</select>
      <p>{demo ? "DEVELOPMENT PREVIEW" : "PRE-LAUNCH"}</p><h3>Before you visit</h3><span>{demo ? "All records are fictional. No verification or payment has taken place." : "Check each business profile for its address, contact details and supplied hours. Only approved listings appear here."}</span><Link className="kd-text-link" to="/submit-business">List your business <ArrowUpRight size={15}/></Link></aside>
      <div className="kd-results" aria-live="polite"><div className="kd-result-heading"><h2>{categoryName ?? "All businesses"} in Kochi</h2><span>{loading ? "Loading…" : `${results.length} ${demo ? "demo" : "published"} ${results.length === 1 ? "listing" : "listings"}`}</span></div>
      {!!params.size && <div className="kd-active-filters">{[q,categoryName,district,locality,city && city !== "kochi" ? city : ""].filter(Boolean).map((v,i)=><span key={i}>{v}</span>)}<button onClick={()=>setParams({})}>Clear filters <X size={14}/></button></div>}
      {loading ? <p role="status" className="kd-empty">Loading business listings…</p> : error ? <div role="alert" className="kd-empty"><h3>We couldn’t load the directory.</h3><p>{error}</p><button className="kd-button" onClick={retry}>Try again</button></div> : results.length ? <div className="kd-business-grid">{results.map(b=><article className="kd-business" key={b.slug}>{b.photos?.[0] && <img className="kd-card-image" src={b.photos[0]} alt={b.demo ? "Fictional illustration" : b.name}/>}<span><MapPin size={16}/>{b.locality ?? "Kochi"}</span>{!demo && <small className="kd-card-verified">{verificationLabel(b.verified, b.verifiedAt).replace("Business details ", "")}</small>}<h3>{b.name}</h3><span className="kd-card-category">{allCategories.find(c=>c.slug===b.categorySlug)?.label ?? b.categorySlug}</span><p>{b.description}</p><small className="kd-card-address">{b.address}</small><div className="kd-card-actions"><Link to={profilePath(b.slug,demo)}>View business <ArrowUpRight size={16}/></Link>{!demo && callHref(b.phone) && <a href={callHref(b.phone)} aria-label={`Call ${b.name}`}>Call</a>}{!demo && whatsappHref(b.whatsapp) && <a href={whatsappHref(b.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${b.name}`}>WhatsApp</a>}</div></article>)}</div> : <div className="kd-empty"><span className="kd-empty-icon"><SearchX size={32}/></span><p className="kd-eyebrow">{records.length ? "No matches" : "No published listings yet"}</p><h3>{records.length ? "Try a wider search." : "No businesses published yet."}</h3><p>{records.length ? "Try another service or neighbourhood, or clear your filters." : "We’re preparing the Kochi directory. Business submissions stay private until they’ve been reviewed and approved."}</p>{records.length || params.size ? <button className="kd-button kd-button-secondary" onClick={()=>setParams({})}>Clear filters</button> : <Link className="kd-text-link" to="/submit-business">Submit your business for review <ArrowUpRight size={16}/></Link>}</div>}
      </div></section></main><SiteFooter/></div>;
}
