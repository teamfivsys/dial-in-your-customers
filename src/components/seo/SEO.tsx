import { Helmet } from "react-helmet-async";

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
  title = "KDial – Kerala Business Directory | List Your Business Before Launch",
  description = "KDial is Kerala's verified business directory. List your business for ₹501 during the founder offer and connect directly with customers across Kerala.",
  keywords = "Kerala business directory, business listing Kerala, Kochi business directory, Ernakulam business listing, Trivandrum business directory, Kozhikode business directory, Thrissur business directory, verified businesses Kerala, Kerala local businesses, KDial",
  canonicalUrl = "https://kdial.in",
  ogType = "website",
  ogImage = "https://kdial.in/og-image.png",
  noIndex = false,
}: SEOProps) => {
  const fullTitle = /kdial/i.test(title) ? title : `${title} | KDial`;

  return (
    <Helmet>
      {/* Primary SEO */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      <meta
        name="robots"
        content={
          noIndex
            ? "noindex,nofollow"
            : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
        }
      />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="KDial Kerala Business Directory" />
      <meta property="og:site_name" content="KDial" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:locale:alternate" content="ml_IN" />
      <meta
        property="article:publisher"
        content="https://www.facebook.com/kdial.in"
      />

      {/* Geo */}
      <meta name="geo.region" content="IN-KL" />
      <meta name="geo.placename" content="Kerala" />
      <meta name="geo.position" content="10.8505;76.2711" />
      <meta name="ICBM" content="10.8505,76.2711" />

      {/* Language */}
      <meta name="language" content="English" />
      <meta httpEquiv="content-language" content="en-IN" />

      {/* Mobile */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=5"
      />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: light)"
        content="#ffffff"
      />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: dark)"
        content="#0A1730"
      />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="default"
      />
      <meta name="format-detection" content="telephone=no" />

      {/* Author */}
      <meta name="author" content="KDial" />
      <meta
        name="publisher"
        content="KDial - Kerala Business Directory"
      />
      <meta name="copyright" content="KDial" />

      {/* Misc */}
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="7 days" />
    </Helmet>
  );
};

export default SEO;
