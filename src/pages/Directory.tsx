import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import WhatsAppCTA from "@/components/landing/WhatsAppCTA";
import SEO from "@/components/seo/SEO";
import StructuredData, { organizationSchema, breadcrumbSchema } from "@/components/seo/StructuredData";
import { keralaCities } from "@/data/cities";
import { businessCategories } from "@/data/categories";
import { CheckCircle2, MapPin, ArrowRight } from "lucide-react";

/** Curated browse-by-category shortlist (15). */
const FEATURED_CATEGORY_SLUGS = [
  "restaurants",
  "dentists",
  "ayurveda",
  "hospitals",
  "beauty-parlour",
  "gym",
  "electricians",
  "plumbers",
  "interior-designers",
  "car-service",
  "tuition-centre",
  "wedding-photographers",
  "textile-shops",
  "advocates",
  "ca-services",
];

/**
 * Replace with real, paid KDial listings as they go live.
 * Each entry renders as a featured business card.
 */
const featuredBusinesses: {
  name: string;
  category: string;
  city: string;
  citySlug: string;
  categorySlug: string;
}[] = [];

const sectionTitle = "text-2xl md:text-3xl font-extrabold text-foreground tracking-tight";
const kicker = "text-xs font-bold uppercase tracking-[0.22em] text-[#FF6B1A] mb-3";

const Directory = () => {
  const picked = FEATURED_CATEGORY_SLUGS.map((s) =>
    businessCategories.find((c) => c.slug === s)
  ).filter(Boolean) as typeof businessCategories;
  const categories = (picked.length >= 15 ? picked : businessCategories).slice(0, 15);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Kerala Business Directory — Verified Local Businesses | KDial"
        description="Browse verified Kerala businesses by category and district on KDial. Zero commission, no lead reselling — contact businesses directly on WhatsApp or phone."
        canonicalUrl="https://kdial.in/directory"
      />
      <StructuredData data={[organizationSchema, breadcrumbSchema]} />

      <Header />
      <main>
        {/* Intro */}
        <section className="py-14 md:py-20 border-b border-border">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <p className={kicker}>Kerala business directory</p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-foreground leading-tight tracking-tight mb-5">
              Find Verified Local Businesses Across Kerala
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4">
              Welcome to KDial — a directory built for Kerala. We cover all 14 districts, from
              Kasaragod to Thiruvananthapuram, listing only verified businesses that pay for
              their own profile.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              No commission on your work. No leads resold to five competitors. When a customer
              finds you on KDial, they call or WhatsApp you directly — the enquiry is yours.
            </p>
            <div className="mt-8">
              <WhatsAppCTA ariaLabel="List your business on WhatsApp">
                List your business — ₹501/year
              </WhatsAppCTA>
            </div>
          </div>
        </section>

        {/* Browse by Category */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <p className={kicker}>Browse by category</p>
            <h2 className={sectionTitle}>Popular business categories in Kerala</h2>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <a
                  key={cat.slug}
                  href={`/kochi/${cat.slug}`}
                  className="group rounded-xl border border-border bg-card px-4 py-4 hover:border-[#FF6B1A] transition-colors"
                >
                  <span className="block text-sm md:text-base font-bold text-foreground">
                    {cat.name}
                  </span>
                  <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    Browse listings
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Browse by District */}
        <section className="py-14 md:py-20 bg-muted/20 border-y border-border">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <p className={kicker}>Browse by district</p>
            <h2 className={sectionTitle}>All 14 districts of Kerala</h2>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {keralaCities.map((city) => (
                <a
                  key={city.slug}
                  href={`/${city.slug}`}
                  className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:border-[#1E6FFF] transition-colors"
                >
                  <MapPin className="h-4 w-4 text-[#1E6FFF] shrink-0" />
                  {city.name}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Businesses */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <p className={kicker}>Featured businesses</p>
            <h2 className={sectionTitle}>Verified KDial members</h2>
            {featuredBusinesses.length > 0 ? (
              <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredBusinesses.map((b) => (
                  <a
                    key={`${b.name}-${b.citySlug}`}
                    href={`/${b.citySlug}/${b.categorySlug}`}
                    className="rounded-2xl border border-border bg-card p-5 hover:border-[#FF6B1A] transition-colors"
                  >
                    <p className="text-base font-extrabold text-foreground">{b.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {b.category} · {b.city}
                    </p>
                  </a>
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
                <p className="text-base font-bold text-foreground">
                  Founder listings are being verified now
                </p>
                <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
                  The first verified Kerala businesses appear here at launch. Reserve your spot
                  during the founder period and be one of them.
                </p>
                <div className="mt-6">
                  <WhatsAppCTA ariaLabel="Reserve a founder listing on WhatsApp">
                    Reserve my founder listing
                  </WhatsAppCTA>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Why list on KDial */}
        <section className="py-14 md:py-20 bg-muted/20 border-y border-border">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <p className={kicker}>Why KDial</p>
            <h2 className={sectionTitle}>Why list on KDial?</h2>
            <ul className="mt-8 space-y-5">
              {[
                {
                  h: "Zero commission, ever",
                  p: "One flat yearly fee. We never take a cut of the work a customer brings you.",
                },
                {
                  h: "Your leads stay yours",
                  p: "Enquiries go straight to your phone and WhatsApp — never resold to competitors.",
                },
                {
                  h: "Verified-only directory",
                  p: "Every listing is checked before it goes live, so customers trust what they find.",
                },
                {
                  h: "Built to rank on Google",
                  p: "Each category and district page is search-optimised for Kerala buyers looking right now.",
                },
              ].map((b) => (
                <li key={b.h} className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#1E6FFF] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-foreground">{b.h}</p>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {b.p}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How it works */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <p className={kicker}>How it works</p>
            <h2 className={sectionTitle}>Three steps to get listed</h2>
            <ol className="mt-8 grid md:grid-cols-3 gap-4">
              {[
                { n: "01", h: "Message us on WhatsApp", p: "Tell us your business name, category and district." },
                { n: "02", h: "Get verified", p: "We confirm your details and prepare your profile." },
                { n: "03", h: "Go live", p: "Your listing publishes on your district and category pages." },
              ].map((s) => (
                <li key={s.n} className="rounded-2xl border border-border bg-card p-6">
                  <span className="text-sm font-extrabold text-[#FF6B1A]">{s.n}</span>
                  <p className="mt-2 text-base font-extrabold text-foreground">{s.h}</p>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{s.p}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 md:py-20 bg-muted/20 border-t border-border">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
            <h2 className={sectionTitle}>Be found by Kerala customers this year</h2>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              KDial is opening with a limited founder period at ₹501 for the year — a verified
              profile, your own district and category pages, and every enquiry sent straight to
              you. Message us and we'll get your business listed.
            </p>
            <div className="mt-8 flex justify-center">
              <WhatsAppCTA ariaLabel="Get listed on KDial via WhatsApp">
                Get listed on KDial
              </WhatsAppCTA>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default Directory;