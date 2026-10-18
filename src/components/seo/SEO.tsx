import { Helmet } from "react-helmet-async";
import { prelaunch } from "@/data/prelaunch";

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
  title = prelaunch.title,
  description = prelaunch.description,
  canonicalUrl = prelaunch.url,
  ogType = "website",
  ogImage = prelaunch.image,
  noIndex = false,
}: SEOProps) => {
  const fullTitle = /kdial/i.test(title) ? title : `${title} | KDial`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={noIndex ? "noindex,follow" : "index,follow,max-image-preview:large"} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="KDial — Kerala business directory coming soon. Launch planned 1 November 2026." />
      <meta property="og:site_name" content="KDial" />
      <meta property="og:locale" content="en_IN" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content="KDial — Kerala business directory coming soon" />
    </Helmet>
  );
};
export default SEO;
