import { useParams, Navigate, Link } from "react-router-dom";
import { MapPin, Phone, Globe, Clock, BadgeCheck, MessageCircle, Navigation } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import SEO from "@/components/seo/SEO";
import StructuredData, { organizationSchema } from "@/components/seo/StructuredData";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { getBusinessBySlug, businessSeo } from "@/data/businesses";
import { getCityBySlug } from "@/data/cities";
import { getCategoryBySlug } from "@/data/categories";

const SITE = "https://kdial.in";

const BusinessPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const biz = getBusinessBySlug(slug);

  if (!biz) return <Navigate to="/404" replace />;

  const city = getCityBySlug(biz.citySlug);
  const cat = getCategoryBySlug(biz.categorySlug);
  const cityName = city?.name ?? biz.citySlug;
  const catName = cat?.name ?? biz.categorySlug;
  const seo = businessSeo(biz, cityName, catName);

  const localBusinessSchema = {
    "@type": biz.schemaType ?? "LocalBusiness",
    "@id": `${seo.canonical}#business`,
    name: biz.name,
    description: biz.description,
    url: seo.canonical,
    telephone: biz.phone,
    ...(biz.email ? { email: biz.email } : {}),
    ...(biz.website ? { sameAs: [biz.website] } : {}),
    ...(biz.priceRange ? { priceRange: biz.priceRange } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: biz.address,
      addressLocality: cityName,
      addressRegion: "Kerala",
      addressCountry: "IN",
      ...(biz.pincode ? { postalCode: biz.pincode } : {}),
    },
    ...(biz.geo
      ? { geo: { "@type": "GeoCoordinates", latitude: biz.geo.lat, longitude: biz.geo.lng } }
      : {}),
    ...(biz.hours?.length
      ? {
          openingHoursSpecification: biz.hours.map((h) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: h.days,
            opens: h.opens,
            closes: h.closes,
          })),
        }
      : {}),
    ...(biz.photos?.length ? { image: biz.photos } : {}),
    ...(biz.services?.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${biz.name} services`,
            itemListElement: biz.services.map((s, i) => ({
              "@type": "Offer",
              position: i + 1,
              itemOffered: { "@type": "Service", name: s },
            })),
          },
        }
      : {}),
  };

  const webPageSchema = {
    "@type": "WebPage",
    "@id": `${seo.canonical}#webpage`,
    url: seo.canonical,
    name: seo.title,
    description: seo.description,
    inLanguage: "en-IN",
    dateModified: biz.updatedAt,
    isPartOf: { "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE, name: "KDial" },
  };

  const whatsapp = biz.whatsapp
    ? `https://wa.me/${biz.whatsapp.replace(/[^0-9]/g, "")}`
    : null;

  return (
    <div className="min-h-screen bg-background">
      <SEO title={seo.title} description={seo.description} canonicalUrl={seo.canonical} />
      <StructuredData data={[organizationSchema, webPageSchema, localBusinessSchema]} />

      <Header />

      <main className="container mx-auto px-4 max-w-4xl py-10">
        <Breadcrumbs
          items={[
            { name: "Kerala Business Directory", path: "/business-directory-kerala" },
            { name: `${cityName} Business Directory`, path: `/${biz.citySlug}` },
            { name: `${catName} in ${cityName}`, path: `/${biz.citySlug}/${biz.categorySlug}` },
            { name: biz.name },
          ]}
        />

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          {biz.name}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {catName} in {biz.locality ? `${biz.locality}, ` : ""}
          {cityName}, Kerala
        </p>
        {biz.verified && (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#1E6FFF]/10 px-3 py-1 text-xs font-bold text-[#1E6FFF]">
            <BadgeCheck className="h-4 w-4" aria-hidden="true" /> Verified by KDial
          </p>
        )}

        <p className="mt-6 text-base text-muted-foreground leading-relaxed">{biz.description}</p>

        {biz.photos?.length ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {biz.photos.map((p) => (
              <img
                key={p}
                src={p}
                alt={`${biz.name} — ${catName} in ${cityName}`}
                loading="lazy"
                className="w-full rounded-2xl border border-border object-cover"
              />
            ))}
          </div>
        ) : null}

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#1E6FFF]" aria-hidden="true" /> Address
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {biz.address}
              {biz.pincode ? `, ${biz.pincode}` : ""}
            </p>
            {biz.mapsUrl && (
              <a
                href={biz.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#1E6FFF] hover:underline"
              >
                <Navigation className="h-4 w-4" aria-hidden="true" /> Get directions
              </a>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#1E6FFF]" aria-hidden="true" /> Contact
            </h2>
            <a href={`tel:${biz.phone}`} className="mt-2 block text-sm font-semibold text-foreground hover:text-[#1E6FFF]">
              {biz.phone}
            </a>
            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-[#FF6B1A] hover:underline"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
              </a>
            )}
            {biz.website && (
              <a
                href={biz.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-[#1E6FFF]"
              >
                <Globe className="h-4 w-4" aria-hidden="true" /> Website
              </a>
            )}
          </div>

          {biz.hours?.length ? (
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-bold text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#1E6FFF]" aria-hidden="true" /> Opening hours
              </h2>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {biz.hours.map((h) => (
                  <li key={`${h.days}-${h.opens}`}>
                    {h.days}: {h.opens}–{h.closes}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {biz.services?.length ? (
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-bold text-foreground">Services</h2>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {biz.services.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <p className="mt-6 text-xs text-muted-foreground">Last updated: {biz.updatedAt}</p>

        <nav className="mt-10 flex flex-wrap gap-3" aria-label="Related pages">
          <Link
            to={`/${biz.citySlug}/${biz.categorySlug}`}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:border-[#1E6FFF]"
          >
            More {catName.toLowerCase()} in {cityName}
          </Link>
          <Link
            to={`/categories/${biz.categorySlug}`}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:border-[#1E6FFF]"
          >
            {catName} in Kerala
          </Link>
          <Link
            to={`/${biz.citySlug}`}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:border-[#1E6FFF]"
          >
            {cityName} directory
          </Link>
        </nav>
      </main>

      <Footer />
    </div>
  );
};

export default BusinessPage;