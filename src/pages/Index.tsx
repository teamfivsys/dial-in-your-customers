import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ArrowRight, ArrowUpRight, Utensils, Wrench, MessageCircle, Store } from "lucide-react";
import Header from "@/components/landing/Header";
import SEO from "@/components/seo/SEO";
import StructuredData from "@/components/seo/StructuredData";
import { trackFounderEnquiry } from "@/lib/prelaunchAnalytics";
import { prelaunch } from "@/data/prelaunch";
import { WHATSAPP_URL } from "@/components/landing/WhatsAppCTA";
import { keralaCities } from "@/data/cities";
import { businessCategories } from "@/data/categories";

export function DiscoverForm({ initialQuery = "", initialCity = "kochi" }: {initialQuery?: string; initialCity?: string}) {
  const [query, setQuery] = useState(initialQuery);
  const [city, setCity] = useState(initialCity);
  const navigate = useNavigate();
  return <form className="kd-search" role="search" onSubmit={e => {e.preventDefault(); navigate(`/directory?city=${encodeURIComponent(city)}&q=${encodeURIComponent(query.trim())}`);}}>
    <label className="kd-search-field"><Search size={21}/><span className="sr-only">Business or service</span><input name="q" value={query} onChange={e => setQuery(e.target.value)} placeholder="What are you looking for?" list="kd-services" autoComplete="off"/></label>
    <datalist id="kd-services">{businessCategories.map(c => <option key={c.slug} value={c.name}/>)}</datalist>
    <label className="kd-search-city"><MapPin size={20}/><span className="sr-only">City</span><select name="city" value={city} onChange={e => setCity(e.target.value)}><option value="">All Kerala</option>{keralaCities.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label>
    <button className="kd-button" type="submit">Explore <ArrowRight size={18}/></button>
  </form>;
}
export function SiteFooter() {
  return <footer className="kd-footer"><div className="kd-wrap"><div className="kd-footer-top"><a href="/" className="kd-wordmark">k<span>dial</span><i>.</i></a><p>Kerala's businesses. A little closer.</p><a href={WHATSAPP_URL} onClick={() => trackFounderEnquiry("footer")}  target="_blank" rel="noopener noreferrer">Talk to KDial <ArrowUpRight size={16}/></a></div><div className="kd-footer-bottom"><span>© {new Date().getFullYear()} KDial</span><span>Built for Kerala, starting with Kochi.</span><span>Pre-launch · 1 November 2026 planned</span></div></div></footer>;
}
export default function Index() {
  return <div className="kd-site"><SEO/><StructuredData data={[
    {"@type":"Organization","@id":"https://kdial.in/#organization",name:"KDial",url:prelaunch.url,logo:"https://kdial.in/kdial-logo.png",description:"A Kerala business directory in pre-launch, starting with Kochi, Ernakulam."},
    {"@type":"WebSite","@id":"https://kdial.in/#website",name:"KDial",url:prelaunch.url,inLanguage:"en-IN",publisher:{"@id":"https://kdial.in/#organization"},description:prelaunch.description},
    {"@type":"WebPage","@id":"https://kdial.in/#webpage",url:prelaunch.url,name:prelaunch.title,description:prelaunch.description,inLanguage:"en-IN",isPartOf:{"@id":"https://kdial.in/#website"},about:{"@id":"https://kdial.in/#organization"}}
  ]}/><Header/>
    <main id="main-content">
      <section className="kd-hero"><div className="kd-wrap kd-hero-inner"><div className="kd-hero-copy"><p className="kd-eyebrow"><span/> Kerala, coming together.</p><h1>Kerala business<br/>directory.<br/><em>Coming soon.</em></h1><p className="kd-intro">We’re building KDial to bring Kerala’s local businesses closer to their customers, starting with Kochi in Ernakulam district. Business owners can enquire before launch; the public directory is not open yet.</p><p className="kd-launch"><span className="kd-launch-dot"/> Launch planned · 1 November 2026</p><div className="kd-prelaunch-actions"><a className="kd-button" href="#founders">₹501 Founder Package <ArrowRight size={18}/></a><a className="kd-text-link" href="#about">What’s coming <ArrowRight size={16}/></a></div></div>
        <div className="kd-art" aria-hidden="true"><div className="kd-art-grid"/><div className="kd-orbit orbit-one"/><div className="kd-orbit orbit-two"/><div className="kd-pin"><MapPin size={68} strokeWidth={1.6}/></div><div className="kd-art-label label-one"><Utensils size={21}/><span>Find your flavour</span></div><div className="kd-art-label label-two"><Wrench size={21}/><span>Meet your local expert</span></div><div className="kd-art-label label-three"><Store size={21}/><span>Made for local</span></div><span className="kd-art-caption">KOCHI FIRST. KERALA NEXT.</span></div>
      </div></section>
      <section className="kd-steps-section" id="about"><div className="kd-wrap kd-section"><p className="kd-eyebrow">Before the first connection</p><h2>A Kerala business directory, starting with Kochi.</h2><div className="kd-steps">{[{n:"01",title:"Built around local businesses",text:"A business-directory platform for Kerala’s local shops, services and professionals, with Kochi, Ernakulam as our first focus."},{n:"02",title:"Preparing for November 1",text:"Launch is planned for November 1, 2026. We’re getting ready to welcome our first businesses and customers."},{n:"03",title:"Talk to us before launch",text:"Business owners can enquire about the Founder Package and confirm its terms before deciding."}].map(s => <div key={s.n}><span>{s.n}</span><h3>{s.title}</h3><p>{s.text}</p></div>)}</div></div></section>
      <section className="kd-wrap kd-section" id="founders"><div className="kd-founder"><div className="kd-founder-copy"><p className="kd-eyebrow">For Kerala's business owners</p><h2>Your business belongs<br/>in the local picture.</h2><p>Help shape KDial's first chapter. Enquire about the Founder Package pre-booking ahead of our planned November 1 launch.</p><div className="kd-founder-foot"><Store size={20}/><span>Starting with businesses in Kochi.</span></div></div><div className="kd-price-card"><span className="kd-price-label">FOUNDER PACKAGE</span><div className="kd-price">₹501<span>pre-booking</span></div><p>Launch planned for 1 November 2026.</p><a href={WHATSAPP_URL} onClick={() => trackFounderEnquiry("founder_package")} target="_blank" rel="noopener noreferrer" className="kd-button">Ask about pre-booking <MessageCircle size={19}/></a><small>We'll share the package inclusions, duration and payment terms before you decide. This opens WhatsApp; it doesn't make a payment.</small></div></div></section>
      <section className="kd-wrap kd-faq" id="faq"><div><p className="kd-eyebrow">Good to know</p><h2>A little clarity <br/>before you begin.</h2></div><div>{[{q:"Is KDial live yet?",a:"KDial is in pre-launch. The planned launch date is November 1, 2026. This page is for launch information and Founder Package enquiries; it is not a live business-directory service yet."},{q:"What does the ₹501 offer mean?",a:"It's the Founder Package pre-booking offer, not an immediately activated listing. Ask the KDial team to confirm the exact inclusions, duration and payment terms before paying."},{q:"Where will KDial start?",a:"Kochi is our initial focus, with expansion across Kerala planned. We’re preparing the platform; there are no live listings to browse on this pre-launch page."}].map(f => <details key={f.q}><summary>{f.q}<span>+</span></summary><p>{f.a}</p></details>)}</div></section>
    </main><SiteFooter/>
  </div>;
}
