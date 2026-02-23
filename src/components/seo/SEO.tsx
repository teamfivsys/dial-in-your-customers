import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
  noIndex?: boolean;
}

const SEO = ({
  title = "KDIAL - Kerala's Best Business Directory | Find Verified Local Businesses in Kochi, Calicut, Trivandrum",
  description = "KDial is Kerala's first premium business directory where customers contact YOU directly. Find and list verified businesses across all 14 Kerala districts - Kochi, Ernakulam, Trivandrum, Calicut, Thrissur, Kannur, Kollam, Palakkad. No commission, no middlemen, no spam calls. Register your Kerala business for ₹999/year.",
  keywords = "Kerala business directory, business listing Kerala, Kochi business directory, Ernakulam business listing, Trivandrum business search, Calicut local businesses, Thrissur business directory, Kerala business registration, verified businesses Kerala, local business directory Kerala, Kerala Justdial alternative, business directory Kochi, Kozhikode business listing, Kannur business directory, Kollam business search, Palakkad local businesses, Alappuzha business directory, Kottayam business listing, Malappuram business search, Kerala online business directory, register business Kerala, business listing near me Kerala, best business directory Kerala, Kerala local search, premium business listing Kerala",
  canonicalUrl = "https://kdial.in",
  ogType = "website",
  ogImage = "https://kdial.in/og-image.png",
  noIndex = false,
}: SEOProps) => {
  const fullTitle = title.includes("KDIAL") ? title : `${title} | KDIAL`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="KDIAL" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:locale:alternate" content="ml_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Geo-targeting for Kerala */}
      <meta name="geo.region" content="IN-KL" />
      <meta name="geo.placename" content="Kerala" />
      <meta name="geo.position" content="10.8505;76.2711" />
      <meta name="ICBM" content="10.8505, 76.2711" />

      {/* Additional Location Meta */}
      <meta name="coverage" content="Kerala, India" />
      <meta name="distribution" content="Kerala" />
      <meta name="target" content="all" />
      <meta name="audience" content="Kerala businesses, Kerala customers" />

      {/* Language and Regional */}
      <meta name="language" content="English" />
      <meta name="content-language" content="en-IN" />
      <meta httpEquiv="content-language" content="en-IN" />

      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* Author and Publisher */}
      <meta name="author" content="KDIAL" />
      <meta name="publisher" content="KDIAL - Kerala Business Directory" />
      <meta name="copyright" content="KDIAL" />

      {/* Business Schema Hints */}
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="7 days" />

      {/* Alternative Search Engines */}
      <meta name="msvalidate.01" content="" />
      <meta name="yandex-verification" content="" />
    </Helmet>
  );
};

export default SEO;
