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
  title = "KDIAL - Kerala's Premium Business Directory | Find Verified Local Businesses",
  description = "KDIAL is Kerala's first premium business directory. Find verified doctors, restaurants, lawyers, home services and more in Kochi, Calicut, Trivandrum, Thrissur & all Kerala cities. No spam, only trusted businesses.",
  keywords = "Kerala business directory, Kerala business listing, Kochi business search, Calicut service providers, Trivandrum local business, Thrissur business directory, best businesses in Kerala, Kerala local search, Kerala Justdial alternative",
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
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional Meta */}
      <meta name="geo.region" content="IN-KL" />
      <meta name="geo.placename" content="Kerala, India" />
      <meta name="language" content="English" />
      <meta name="author" content="KDIAL" />
    </Helmet>
  );
};

export default SEO;
