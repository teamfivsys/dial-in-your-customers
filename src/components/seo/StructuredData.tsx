import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  data: object | object[];
}

const StructuredData = ({ data }: StructuredDataProps) => {
  const schemas = Array.isArray(data) ? data : [data];
  
  return (
    <Helmet>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Helmet>
  );
};

// Organization Schema for KDIAL
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "KDIAL",
  "alternateName": ["KDial", "Kerala Dial", "K-Dial"],
  "url": "https://kdial.in",
  "logo": "https://kdial.in/kdial-logo.png",
  "description": "Kerala's first premium-only business directory. Verified businesses, no spam, direct customer connections.",
  "foundingDate": "2024",
  "areaServed": {
    "@type": "State",
    "name": "Kerala",
    "containedInPlace": {
      "@type": "Country",
      "name": "India"
    }
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["English", "Malayalam"]
  }
};

// WebSite Schema with SearchAction
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "KDIAL",
  "alternateName": "Kerala Business Directory",
  "url": "https://kdial.in",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://kdial.in/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

// Product Schema for KDIAL Listing
export const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "KDIAL Business Listing",
  "description": "Premium business listing on Kerala's trusted business directory. Get verified status, direct customer calls, WhatsApp inquiries, and top visibility in local searches.",
  "brand": {
    "@type": "Brand",
    "name": "KDIAL"
  },
  "offers": {
    "@type": "Offer",
    "price": "999",
    "priceCurrency": "INR",
    "priceValidUntil": "2025-12-31",
    "availability": "https://schema.org/LimitedAvailability",
    "itemCondition": "https://schema.org/NewCondition",
    "seller": {
      "@type": "Organization",
      "name": "KDIAL"
    }
  }
};

// LocalBusiness Schema
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "KDIAL",
  "@id": "https://kdial.in",
  "url": "https://kdial.in",
  "image": "https://kdial.in/kdial-logo.png",
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "Kerala",
    "addressCountry": "IN"
  },
  "priceRange": "₹₹"
};

// Business Directory Schema
export const businessDirectorySchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "KDIAL - Kerala Business Directory",
  "description": "Find verified local businesses in Kerala. Doctors, restaurants, lawyers, home services and more.",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".hero-section", ".faq-section", ".benefits-section"]
  },
  "about": {
    "@type": "Thing",
    "name": "Kerala Business Directory",
    "description": "A premium business listing platform for Kerala businesses"
  },
  "mentions": [
    {
      "@type": "City",
      "name": "Kochi"
    },
    {
      "@type": "City",
      "name": "Calicut"
    },
    {
      "@type": "City",
      "name": "Trivandrum"
    },
    {
      "@type": "City",
      "name": "Thrissur"
    }
  ]
};

export default StructuredData;
