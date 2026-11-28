import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ArrowRight, ArrowUpRight, Store } from "lucide-react";
import Header from "@/components/landing/Header";
import SEO from "@/components/seo/SEO";
import StructuredData from "@/components/seo/StructuredData";
import { trackFounderEnquiry } from "@/lib/prelaunchAnalytics";
import { prelaunch } from "@/data/prelaunch";
import { WHATSAPP_URL } from "@/components/landing/WhatsAppCTA";
const KDISCONNECTED = "https://wa.me/917356137106?text=" + encodeURIComponent("Hi KDial team, I want to register my business on KDial (kdial.in). Please share the next steps.");
function FloatingWhatsApp() {
  return (
    <a href={KDISCONNECTED} target="_blank" rel="noopener noreferrer" className="kd-wa-float" aria-label="WhatsApp KDial to register or enquire">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.4A10 10 0 1 0 12 2Zm5.4 14.1c-.2.6-1.2 1.1-1.7 1.2-.5 0-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6c-.2.2-.3.4-.1.7.1.3.7 1.2 1.6 1.9 1.1 1 2 1.2 2.3 1.4.3.1.4.1.6-.1l.9-1c.2-.2.4-.2.7-.1l2 1c.3.1.5.2.6.4 0 .1 0 .7-.3 1.2Z"/></svg>
      <span className="kd-wa-label">Chat with us</span>
    </a>
  );
}
import { businessCategories } from "@/data/categories";
import { useListings } from "@/hooks/use-listings";

export function DiscoverForm({ initialQuery = "" }: {initialQuery?: string; initialCity?: string}) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();
  return <form className="kd-search" role="search" onSubmit={e => {e.preventDefault(); navigate(`/directory?city=kochi&q=${encodeURIComponent(query.trim())}`);}}>
    <label className="kd-search-field"><Search size={21}/><span className="sr-only">Business or service</span><input name="q" value={query} onChange={e => setQuery(e.target.value)} placeholder="What are you looking for?" list="kd-services" autoComplete="off"/></label>
    <datalist id="kd-services">{businessCategories.map(c => <option key={c.slug} value={c.name}/>)}</datalist>
    <label className="kd-search-city"><MapPin size={20}/><span className="sr-only">City</span><select name="city" value="kochi" onChange={()=>{}}><option value="kochi">Kochi</option></select></label>
    <button className="kd-button" type="submit">Explore <ArrowRight size={18}/></button>
  </form>;
}
export function SiteFooter() {
  return <footer className="kd-footer"><div className="kd-wrap"><div className="kd-footer-top"><a href="/" className="kd-wordmark">k<span>dial</span><i>.</i></a><p>Kerala's businesses. A little closer.</p><a href={WHATSAPP_URL} onClick={() => trackFounderEnquiry("footer")}  target="_blank" rel="noopener noreferrer">Talk to KDial <ArrowUpRight size={16}/></a></div><div className="kd-footer-bottom"><span>© {new Date().getFullYear()} KDial</span><span>Built for Kerala, starting with Kochi.</span><span>Live directory · Kochi first, Kerala next</span></div></div></footer>;
}
export default function Index() {
  const { records } = useListings(false);
  const listingCount = records.length || 129; // 129 at 28 Nov 2026; dynamic once loaded
  return <div className="kd-site"><SEO/><StructuredData data={[
    {"@type":"Organization","@id":"https://kdial.in/#organization",name:"KDial",url:prelaunch.url,logo:"https://kdial.in/kdial-logo.png",description:"A live Kerala business directory, starting with Kochi, Ernakulam."},
    {"@type":"WebSite","@id":"https://kdial.in/#website",name:"KDial",url:prelaunch.url,inLanguage:"en-IN",publisher:{"@id":"https://kdial.in/#organization"},description:prelaunch.description},
    {"@type":"WebPage","@id":"https://kdial.in/#webpage",url:prelaunch.url,name:prelaunch.title,description:prelaunch.description,inLanguage:"en-IN",isPartOf:{"@id":"https://kdial.in/#website"},about:{"@id":"https://kdial.in/#organization"}}
  ]}/><Header/>
    <main id="main-content">
      <section className="kd-hero kd-hero--premium"><div className="kd-wrap kd-hero-inner">
        <div className="kd-hero-copy"><div className="kd-hero-badges"><span className="kd-badge kd-badge-live"><span className="kd-live-dot"/>Live now &middot; {listingCount} published listings</span></div><h1>Kerala business<br/>directory.<br/><em>Live now.</em></h1><p className="kd-intro">Find shops, services and professionals near you &mdash; starting with Kochi.</p><div className="kd-prelaunch-actions"><a className="kd-button" href="/directory">Browse directory <ArrowRight size={18}/></a><a className="kd-button kd-button-orange" href="/submit-business">List Your Business <ArrowRight size={18}/></a></div><DiscoverForm/></div>
        </div></section>
      <section className="kd-steps-section kd-energy-steps" id="about"><div className="kd-wrap kd-section"><p className="kd-eyebrow">How KDial works</p><h2>A Kerala business directory, starting with Kochi.</h2><div className="kd-steps">{[{n:"01",title:"Search by service",text:"Find Kerala's local shops, services and professionals by what you need, category or neighbourhood."},{n:"02",title:"Browse live listings",text:"Explore published businesses across Kochi and Kerala districts, with real contact details from the directory."},{n:"03",title:"List your business",text:"Run a business in Kerala? List it on kdial.in and get into the local picture."}].map(s => <div key={s.n}><span>{s.n}</span><h3>{s.title}</h3><p>{s.text}</p></div>)}</div></div></section>
      <section className="kd-wrap kd-section kd-energy-founder" id="list-business"><div className="kd-founder kd-founder-energy"><div className="kd-founder-copy"><p className="kd-eyebrow">For Kerala's business owners</p><h2>Your business belongs<br/>in the local picture.</h2><p>The KDial directory is live. List your business on kdial.in to join Kerala's local businesses in the directory.</p><div className="kd-founder-foot"><Store size={20}/><span>Starting with businesses in Kochi.</span></div></div><div className="kd-price-card"><span className="kd-price-label">LIST YOUR BUSINESS</span><div className="kd-price">Get listed<span>on kdial.in</span></div><a href="/submit-business" className="kd-button">List Your Business <ArrowRight size={19}/></a><small>Tell Kochi what you do — name, category, locality and contact. We review your details before anything goes public on kdial.in.</small></div></div></section>
      <StructuredData data={{"@type":"FAQPage", mainEntity:[
    {"@type":"Question",name:"Is KDial live yet?",acceptedAnswer:{"@type":"Answer",text:"Yes. The KDial public business directory is live now — browse published listings at /directory, starting with Kochi in Ernakulam district."}},
    {"@type":"Question",name:"How do I list my business?",acceptedAnswer:{"@type":"Answer",text:"Click List Your Business and submit your details on kdial.in/submit-business. We review your details before anything goes public."}},
    {"@type":"Question",name:"Where will KDial start?",acceptedAnswer:{"@type":"Answer",text:"Kochi is our initial focus, with listings across Kerala. Browse live listings now in the directory, and more businesses join as they are published."}}
  ]}}/>
  <section className="kd-wrap kd-faq" id="faq"><div><p className="kd-eyebrow">Good to know</p><h2>A little clarity <br/>before you begin.</h2></div><div>{[{q:"Is KDial live yet?",a:"Yes. The KDial public business directory is live now — browse published listings at /directory, starting with Kochi in Ernakulam district."},{q:"How do I list my business?",a:"Click List Your Business and submit your details on kdial.in/submit-business. We review your details before anything goes public — this is not an immediately activated listing."},{q:"Where will KDial start?",a:"Kochi is our initial focus, with listings across Kerala. Browse live listings now in the directory, and more businesses join as they are published."}].map(f => <details key={f.q}><summary>{f.q}<span>+</span></summary><p>{f.a}</p></details>)}</div></section>
    </main><SiteFooter/><FloatingWhatsApp/>
  </div>;
}
