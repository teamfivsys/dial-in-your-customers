import { useSearchParams, Link } from "react-router-dom";
import { MapPin, ArrowUpRight, SearchX, Search, X } from "lucide-react";
import Header from "@/components/landing/Header";
import SEO from "@/components/seo/SEO";
import { DiscoverForm, SiteFooter } from "./Index";
import { businesses } from "@/data/businesses";
import { businessCategories } from "@/data/categories";
import { keralaCities } from "@/data/cities";
import { WHATSAPP_URL } from "@/components/landing/WhatsAppCTA";

export default function Directory() {
  const [params, setParams] = useSearchParams();
  const city = params.get("city") ?? "";
  const category = params.get("category") ?? "";
  const q = params.get("q") ?? "";
  const cityName = keralaCities.find(c => c.slug === city)?.name;
  const categoryName = businessCategories.find(c => c.slug === category)?.name;
  const results = businesses.filter(b => b.status === "approved" && (!city || b.citySlug === city) && (!category || b.categorySlug === category) && (!q || [b.name,b.description,b.locality,...(b.services ?? []),businessCategories.find(c => c.slug === b.categorySlug)?.name].filter(Boolean).join(" ").toLowerCase().includes(q.toLowerCase())));
  function changeCategory(value: string) { const next = new URLSearchParams(params); if(value) next.set("category", value); else next.delete("category"); setParams(next); }
  return <div className="kd-site"><SEO title="Explore local businesses in Kerala | KDial" description="Browse published KDial business listings by city, category and service. KDial is in pre-launch, with launch planned for November 1, 2026." canonicalUrl="https://kdial.in/directory" noIndex={results.length === 0 || !!(city || category || q)}/><Header/><main id="main-content">
    <section className="kd-directory-head"><div className="kd-wrap"><a className="kd-back" href="/">Home / Directory</a><p className="kd-eyebrow">Explore your local</p><h1>Find your kind of business.</h1><p className="kd-intro">Choose a place. Find a service. See what's been published.</p><DiscoverForm key={`${city}:${q}`} initialCity={city} initialQuery={q}/></div></section>
    <section className="kd-wrap kd-section kd-directory-body"><aside className="kd-filters"><label htmlFor="category-select">Browse by category</label><select id="category-select" value={category} onChange={e=>changeCategory(e.target.value)}><option value="">All categories</option>{businessCategories.map(c=><option key={c.slug} value={c.slug}>{c.name}</option>)}</select><p>PRE-LAUNCH</p><h3>A directory taking shape.</h3><span>Launch planned for November 1, 2026. Only approved, published businesses appear here.</span><a href="/#founders">Own a business? <ArrowUpRight size={16}/></a></aside>
      <div className="kd-results"><div className="kd-result-heading"><h2>{categoryName ?? "All businesses"}{cityName ? ` in ${cityName}` : ""}</h2><span>{results.length} published {results.length === 1 ? "listing" : "listings"}</span></div>{(q || category || city) && <div className="kd-active-filters">{[q, categoryName, cityName].filter(Boolean).map((v,i)=><span key={`${v}-${i}`}>{v}</span>)}<button onClick={()=>setParams({})}>Clear filters <X size={14}/></button></div>}
      {results.length ? <div className="kd-business-grid">{results.map(b=><Link className="kd-business" to={`/businesses/${b.slug}`} key={b.slug}><span><MapPin size={16}/>{b.locality ?? keralaCities.find(c=>c.slug===b.citySlug)?.name}</span><h3>{b.name}</h3><p>{b.description}</p><strong>View business <ArrowUpRight size={16}/></strong></Link>)}</div> : <div className="kd-empty"><span className="kd-empty-icon"><SearchX size={32}/></span><p className="kd-eyebrow">No published matches yet</p><h3>{businesses.some(b=>b.status==="approved") ? "Try a wider search." : "The first local connections start here."}</h3><p>{businesses.some(b=>b.status==="approved") ? "Try another city, choose a different category, or clear the filters." : "We're preparing for launch. There aren't any published businesses in this selection yet. Check back as real listings are added."}</p><button className="kd-button kd-button-secondary" onClick={()=>setParams({})}><Search size={17}/> Browse all businesses</button><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="kd-text-link">Ask about listing your business <ArrowUpRight size={17}/></a></div>}
      </div>
    </section></main><SiteFooter/></div>;
}
