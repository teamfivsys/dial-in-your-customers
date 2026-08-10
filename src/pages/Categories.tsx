import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import SEO from "@/components/seo/SEO";
import StructuredData, { organizationSchema } from "@/components/seo/StructuredData";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { businessCategories } from "@/data/categories";

const SITE = "https://kdial.in";
const kicker = "text-xs font-bold uppercase tracking-[0.22em] text-[#FF6B1A] mb-3";

const Categories = () => {
  const url = `${SITE}/categories`;
  const sectors = Array.from(new Set(businessCategories.map((c) => c.sector)));

  const webPageSchema = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: "Business Categories in Kerala",
    description:
      "Every business category covered by the KDial Kerala business directory, grouped by sector.",
    inLanguage: "en-IN",
    isPartOf: { "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE, name: "KDial" },
  };

  const itemListSchema = {
    "@type": "ItemList",
    name: "KDial business categories",
    numberOfItems: businessCategories.length,
    itemListElement: businessCategories.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${c.name} in Kerala`,
      url: `${SITE}/categories/${c.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Business Categories in Kerala — Directory Index | KDial"
        description="Browse every business category in the KDial Kerala directory, from healthcare and home services to weddings, food, education and professional services."
        canonicalUrl={url}
      />
      <StructuredData data={[organizationSchema, webPageSchema, itemListSchema]} />

      <Header />

      <main>
        <section className="pt-10 pb-10 md:pt-14 border-b border-border/60">
          <div className="container mx-auto px-4 max-w-4xl">
            <Breadcrumbs items={[{ name: "Categories" }]} />
            <p className={kicker}>Category index</p>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Business Categories in Kerala
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
              KDial organises Kerala businesses into {businessCategories.length} categories across{" "}
              {sectors.length} sectors. Each category page covers the service statewide and links
              through to city-level listings, so you can move from "what I need" to "who near me
              does it" in two clicks.
            </p>
          </div>
        </section>

        {sectors.map((sector) => (
          <section key={sector} className="py-10 border-b border-border/40">
            <div className="container mx-auto px-4 max-w-5xl">
              <h2 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
                {sector}
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {businessCategories
                  .filter((c) => c.sector === sector)
                  .map((c) => (
                    <Link
                      key={c.slug}
                      to={`/categories/${c.slug}`}
                      className="group flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 hover:border-[#1E6FFF] transition-colors"
                    >
                      <span className="text-sm font-semibold text-foreground">{c.name}</span>
                      <ArrowRight
                        className="h-4 w-4 text-muted-foreground group-hover:text-[#1E6FFF]"
                        aria-hidden="true"
                      />
                    </Link>
                  ))}
              </div>
            </div>
          </section>
        ))}

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
              Browse by place instead
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                ["Kerala", "/business-directory-kerala"],
                ["Kochi", "/business-directory-kochi"],
                ["Ernakulam", "/business-directory-ernakulam"],
                ["Thiruvananthapuram", "/business-directory-thiruvananthapuram"],
                ["Kozhikode", "/business-directory-kozhikode"],
                ["Thrissur", "/business-directory-thrissur"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  to={href}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:border-[#1E6FFF] transition-colors"
                >
                  {label} Business Directory
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default Categories;