import { useParams, Navigate, Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import SEO from "@/components/seo/SEO";
import StructuredData, { organizationSchema } from "@/components/seo/StructuredData";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { getCategoryBySlug, businessCategories } from "@/data/categories";
import { keralaCities } from "@/data/cities";
import { getBusinessesByCategory } from "@/data/businesses";

const SITE = "https://kdial.in";
const kicker = "text-xs font-bold uppercase tracking-[0.22em] text-[#FF6B1A] mb-3";
const sectionTitle = "text-2xl md:text-3xl font-extrabold text-foreground tracking-tight";

/** Statewide category hub: /categories/{slug} — semantic topic is "Category + Kerala". */
const CategoryHub = () => {
  const { category } = useParams<{ category: string }>();
  const cat = getCategoryBySlug(category);

  if (!cat) return <Navigate to="/404" replace />;

  const url = `${SITE}/categories/${cat.slug}`;
  const lower = cat.name.toLowerCase();
  const listings = getBusinessesByCategory(cat.slug);
  const related = businessCategories
    .filter((c) => c.sector === cat.sector && c.slug !== cat.slug)
    .slice(0, 8);

  const webPageSchema = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: `${cat.name} in Kerala`,
    description: cat.description,
    inLanguage: "en-IN",
    isPartOf: { "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE, name: "KDial" },
  };

  const itemListSchema = {
    "@type": "ItemList",
    name: `${cat.name} by city in Kerala`,
    itemListElement: keralaCities.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${cat.name} in ${c.name}`,
      url: `${SITE}/${c.slug}/${cat.slug}`,
    })),
  };

  const faqs = [
    {
      q: `How do I find a verified ${lower.replace(/s$/, "")} in Kerala on KDial?`,
      a: `Pick your city below and open the ${lower} page for that city. Every listing shows the owner's own phone number and WhatsApp link, so your enquiry reaches the business directly.`,
    },
    {
      q: `What does a ${lower.replace(/s$/, "")} listing include?`,
      a: `Business name, category, area, address, phone, WhatsApp, opening hours, services offered and a description — plus a verification badge and the date the details were last confirmed.`,
    },
    {
      q: `Which ${lower} services are covered?`,
      a: `${cat.subcategories.slice(0, 6).join(", ")} and related services.`,
    },
    {
      q: `I run a ${lower.replace(/s$/, "")} business in Kerala — how do I get listed?`,
      a: `Message the KDial team on WhatsApp with your business name, city and category. Listings are verified before publishing, which is why the directory has no dead numbers.`,
    },
  ];

  const faqSchema = {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${cat.name} in Kerala — Verified Listings | KDial`}
        description={`Find verified ${lower} across Kerala on KDial. Browse by city, see services and opening hours, and contact the business directly by phone or WhatsApp.`}
        keywords={cat.keywords.join(", ")}
        canonicalUrl={url}
      />
      <StructuredData data={[organizationSchema, webPageSchema, itemListSchema, faqSchema]} />

      <Header />

      <main>
        <section className="pt-10 pb-10 md:pt-14 border-b border-border/60">
          <div className="container mx-auto px-4 max-w-4xl">
            <Breadcrumbs
              items={[{ name: "Categories", path: "/categories" }, { name: cat.name }]}
            />
            <p className={kicker}>{cat.sector}</p>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
              {cat.name} in Kerala
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{cat.malayalam}</p>
            <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
              {cat.description}
            </p>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              KDial lists {lower} across Kerala district by district. Choose your city to see local
              listings, or read what each service typically covers before you get in touch.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className={kicker}>Services covered</p>
            <h2 className={sectionTitle}>What {lower} on KDial offer</h2>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {cat.subcategories.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1E6FFF]" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className={kicker}>Browse by city</p>
            <h2 className={sectionTitle}>{cat.name} by district</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {keralaCities.map((c) => (
                <Link
                  key={c.slug}
                  to={`/${c.slug}/${cat.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 hover:border-[#1E6FFF] transition-colors"
                >
                  <span className="text-sm font-semibold text-foreground">
                    {cat.name} in {c.name}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[#1E6FFF]" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {listings.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4 max-w-5xl">
              <p className={kicker}>Verified listings</p>
              <h2 className={sectionTitle}>{cat.name} listed on KDial</h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {listings.map((b) => (
                  <li key={b.slug} className="rounded-2xl border border-border bg-card p-5">
                    <Link to={`/businesses/${b.slug}`} className="font-bold text-foreground hover:text-[#1E6FFF]">
                      {b.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">{b.locality ?? b.citySlug}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <p className={kicker}>FAQ</p>
            <h2 className={sectionTitle}>{cat.name} in Kerala — questions</h2>
            <dl className="mt-6 space-y-5">
              {faqs.map((f) => (
                <div key={f.q} className="rounded-2xl border border-border bg-card p-5">
                  <dt className="font-bold text-foreground">{f.q}</dt>
                  <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className={sectionTitle}>Related categories</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {related.map((c) => (
                <Link
                  key={c.slug}
                  to={`/categories/${c.slug}`}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:border-[#1E6FFF] transition-colors"
                >
                  {c.name} in Kerala
                </Link>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/business-directory-kerala" className="text-sm font-bold text-[#1E6FFF] hover:underline">
                Kerala Business Directory
              </Link>
              <Link to="/categories" className="text-sm font-bold text-[#1E6FFF] hover:underline">
                All categories
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default CategoryHub;