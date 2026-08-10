import { useParams, Navigate, Link } from "react-router-dom";
import { MapPin, CheckCircle2, ArrowRight, Building2 } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import SEO from "@/components/seo/SEO";
import StructuredData, { organizationSchema } from "@/components/seo/StructuredData";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { getDirectoryLocation, getDirectoryLocation as findLoc, directoryLocations } from "@/data/directoryLocations";
import { businessCategories, getCategoryBySlug } from "@/data/categories";
import { keralaCities } from "@/data/cities";
import { getBusinessesByCity } from "@/data/businesses";

const SITE = "https://kdial.in";
const sectionTitle = "text-2xl md:text-3xl font-extrabold text-foreground tracking-tight";
const kicker = "text-xs font-bold uppercase tracking-[0.22em] text-[#FF6B1A] mb-3";

const BusinessDirectoryLocation = () => {
  const { location } = useParams<{ location: string }>();
  const loc = getDirectoryLocation(location);

  if (!loc) return <Navigate to="/404" replace />;

  const url = `${SITE}/business-directory-${loc.slug}`;
  const listings = loc.citySlug ? getBusinessesByCity(loc.citySlug) : [];
  const topCategories = loc.topCategorySlugs
    .map((s) => getCategoryBySlug(s))
    .filter(Boolean) as typeof businessCategories;
  const nearby = loc.nearby.map((s) => findLoc(s)).filter(Boolean) as typeof directoryLocations;

  const webPageSchema = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: loc.h1,
    description: loc.description,
    inLanguage: "en-IN",
    isPartOf: { "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE, name: "KDial" },
    about: {
      "@type": "Place",
      name: loc.name,
      address: {
        "@type": "PostalAddress",
        addressRegion: "Kerala",
        addressCountry: "IN",
        ...(loc.scope !== "state" ? { addressLocality: loc.name } : {}),
      },
    },
  };

  const itemListSchema = {
    "@type": "ItemList",
    name: `Business categories in ${loc.name}`,
    itemListElement: topCategories.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${c.name} in ${loc.name}`,
      url: loc.citySlug ? `${SITE}/${loc.citySlug}/${c.slug}` : `${SITE}/categories/${c.slug}`,
    })),
  };

  const faqSchema = {
    "@type": "FAQPage",
    mainEntity: loc.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const districtLinks = keralaCities.slice(0, 14);

  return (
    <div className="min-h-screen bg-background">
      <SEO title={loc.title} description={loc.description} canonicalUrl={url} />
      <StructuredData data={[organizationSchema, webPageSchema, itemListSchema, faqSchema]} />

      <Header />

      <main>
        <section className="pt-10 pb-12 md:pt-14 md:pb-16 border-b border-border/60">
          <div className="container mx-auto px-4 max-w-4xl">
            <Breadcrumbs
              items={
                loc.slug === "kerala"
                  ? [{ name: "Kerala Business Directory" }]
                  : [
                      { name: "Kerala Business Directory", path: "/business-directory-kerala" },
                      { name: `${loc.name} Business Directory` },
                    ]
              }
            />
            <p className={kicker}>
              {loc.scope === "state" ? "Statewide directory" : loc.scope === "district" ? "District directory" : "City directory"}
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
              {loc.h1}
            </h1>
            <div className="mt-5 space-y-4">
              {loc.intro.map((p, i) => (
                <p key={i} className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Local context */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className={kicker}>Local context</p>
            <h2 className={sectionTitle}>What business activity in {loc.name} looks like</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {loc.localContext.map((item) => (
                <div key={item.label} className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#1E6FFF]" aria-hidden="true" />
                    {item.label}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Category discovery */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className={kicker}>Browse by category</p>
            <h2 className={sectionTitle}>Most searched categories in {loc.name}</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {topCategories.map((c) => (
                <Link
                  key={c.slug}
                  to={loc.citySlug ? `/${loc.citySlug}/${c.slug}` : `/categories/${c.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 hover:border-[#1E6FFF] transition-colors"
                >
                  <span className="font-semibold text-foreground text-sm">
                    {c.name} {loc.scope === "state" ? "in Kerala" : `in ${loc.name}`}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[#1E6FFF]" aria-hidden="true" />
                </Link>
              ))}
            </div>
            <Link
              to="/categories"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1E6FFF] hover:underline"
            >
              View all {businessCategories.length} business categories
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* Verified listings (only real data) */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className={kicker}>Verified listings</p>
            <h2 className={sectionTitle}>Businesses listed in {loc.name}</h2>
            {listings.length > 0 ? (
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {listings.map((b) => (
                  <li key={b.slug} className="rounded-2xl border border-border bg-card p-5">
                    <Link to={`/businesses/${b.slug}`} className="font-bold text-foreground hover:text-[#1E6FFF]">
                      {b.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">{b.locality ?? loc.name}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-6">
                <p className="flex items-center gap-2 font-semibold text-foreground">
                  <Building2 className="h-4 w-4 text-[#FF6B1A]" aria-hidden="true" />
                  Verification in progress
                </p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  KDial publishes a listing only after the business and its contact details are verified, so
                  this section stays empty rather than showing placeholder results. Founder listings for{" "}
                  {loc.name} are being verified now.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Nearby / related */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className={kicker}>Nearby directories</p>
            <h2 className={sectionTitle}>Related business directories</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {nearby.map((n) => (
                <Link
                  key={n.slug}
                  to={`/business-directory-${n.slug}`}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:border-[#1E6FFF] transition-colors"
                >
                  {n.name} Business Directory
                </Link>
              ))}
            </div>
            {loc.scope === "state" && (
              <div className="mt-8">
                <h3 className="font-bold text-foreground mb-3">All 14 districts</h3>
                <div className="flex flex-wrap gap-2">
                  {districtLinks.map((c) => (
                    <Link
                      key={c.slug}
                      to={`/${c.slug}`}
                      className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-[#1E6FFF] hover:border-[#1E6FFF] transition-colors"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <p className={kicker}>FAQ</p>
            <h2 className={sectionTitle}>{loc.name} business directory questions</h2>
            <dl className="mt-6 space-y-5">
              {loc.faqs.map((f) => (
                <div key={f.q} className="rounded-2xl border border-border bg-card p-5">
                  <dt className="font-bold text-foreground flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1E6FFF]" aria-hidden="true" />
                    {f.q}
                  </dt>
                  <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default BusinessDirectoryLocation;