import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ArrowRight, ArrowUpRight, Utensils, Wrench, MessageCircle, Store } from "lucide-react";
import Header from "@/components/landing/Header";
import SEO from "@/components/seo/SEO";
import StructuredData from "@/components/seo/StructuredData";
import { trackFounderEnquiry } from "@/lib/prelaunchAnalytics";
import { prelaunch } from "@/data/prelaunch";
import { WHATSAPP_URL } from "@/components/landing/WhatsAppCTA";
import { businessCategories } from "@/data/categories";

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
  return <div className="kd-site"><SEO/><StructuredData data={[
    {"@type":"Organization","@id":"https://kdial.in/#organization",name:"KDial",url:prelaunch.url,logo:"https://kdial.in/kdial-logo.png",description:"A live Kerala business directory, starting with Kochi, Ernakulam."},
    {"@type":"WebSite","@id":"https://kdial.in/#website",name:"KDial",url:prelaunch.url,inLanguage:"en-IN",publisher:{"@id":"https://kdial.in/#organization"},description:prelaunch.description},
    {"@type":"WebPage","@id":"https://kdial.in/#webpage",url:prelaunch.url,name:prelaunch.title,description:prelaunch.description,inLanguage:"en-IN",isPartOf:{"@id":"https://kdial.in/#website"},about:{"@id":"https://kdial.in/#organization"}}
  ]}/><Header/>
    <main id="main-content">
      <section className="kd-hero kd-hero--premium"><div className="kd-wrap kd-hero-inner">
        <div className="kd-hero-copy"><p className="kd-eyebrow"><span/> Kerala, together.</p><h1>Kerala business<br/>directory.<br/><em>Live now.</em></h1><p className="kd-intro">KDial brings Kerala&rsquo;s local businesses closer to their customers, starting with Kochi in Ernakulam district. Search the live directory to find shops, services and professionals near you.</p><div className="kd-prelaunch-actions"><a className="kd-button" href="/directory">Browse directory <ArrowRight size={18}/></a><a className="kd-text-link" href="#founders">₹501 Founder Package <ArrowRight size={16}/></a></div><DiscoverForm/></div>
        <div className="kd-art" aria-hidden="true"><div className="kd-art-grid"/><div className="kd-orbit orbit-one"/><div className="kd-orbit orbit-two"/><div className="kd-pin"><MapPin size={68} strokeWidth={1.6}/></div><div className="kd-art-label label-one"><Utensils size={21}/><span>Find your flavour</span></div><div className="kd-art-label label-two"><Wrench size={21}/><span>Meet your local expert</span></div><div className="kd-art-label label-three"><Store size={21}/><span>Made for local</span></div><span className="kd-art-caption">KOCHI FIRST. KERALA NEXT.</span></div>
      </div></section>
      <section className="kd-steps-section" id="about"><div className="kd-wrap kd-section"><p className="kd-eyebrow">How KDial works</p><h2>A Kerala business directory, starting with Kochi.</h2><div className="kd-steps">{[{n:"01",title:"Search by service",text:"Find Kerala's local shops, services and professionals by what you need, category or neighbourhood."},{n:"02",title:"Browse live listings",text:"Explore published businesses across Kochi and Kerala districts, with real contact details from the directory."},{n:"03",title:"List your business",text:"Run a business in Kerala? Enquire about the Founder Package and get your business into the local picture."}].map(s => <div key={s.n}><span>{s.n}</span><h3>{s.title}</h3><p>{s.text}</p></div>)}</div></div></section>
      <section className="kd-wrap kd-section" id="founders"><div className="kd-founder"><div className="kd-founder-copy"><p className="kd-eyebrow">For Kerala's business owners</p><h2>Your business belongs<br/>in the local picture.</h2><p>The KDial directory is live. Enquire about the Founder Package to join Kerala's local businesses in the directory.</p><div className="kd-founder-foot"><Store size={20}/><span>Starting with businesses in Kochi.</span></div></div><div className="kd-price-card"><span className="kd-price-label">FOUNDER PACKAGE</span><div className="kd-price">₹501<span>pre-booking</span></div><a href={WHATSAPP_URL} onClick={() => trackFounderEnquiry("founder_package")} target="_blank" rel="noopener noreferrer" className="kd-button">Ask about pre-booking <MessageCircle size={19}/></a><small>We'll share the package inclusions, duration and payment terms before you decide. This opens WhatsApp; it doesn't make a payment.</small></div></div></section>
      <section className="kd-wrap kd-faq" id="faq"><div><p className="kd-eyebrow">Good to know</p><h2>A little clarity <br/>before you begin.</h2></div><div>{[{q:"Is KDial live yet?",a:"Yes. The KDial public business directory is live now — browse published listings at /directory, starting with Kochi in Ernakulam district."},{q:"What does the ₹501 offer mean?",a:"It's the Founder Package pre-booking offer, not an immediately activated listing. Ask the KDial team to confirm the exact inclusions, duration and payment terms before paying."},{q:"Where will KDial start?",a:"Kochi is our initial focus, with listings across Kerala. Browse live listings now in the directory, and more businesses join as they are published."}].map(f => <details key={f.q}><summary>{f.q}<span>+</span></summary><p>{f.a}</p></details>)}</div></section>
    </main><SiteFooter/>
  </div>;
}
