import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  data: object | object[];
}

const StructuredData = ({ data }: StructuredDataProps) => {
  const schemas = Array.isArray(data) ? data : [data];
  
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": schemas
  };

  return (
    <Helmet>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Helmet>
  );
};

export default StructuredData;

// --- SCHEMA OBJECTS ---

export const organizationSchema = {
  "@type": "Organization",
  "@id": "https://kdial.in/#organization",
  "name": "KDIAL",
  "alternateName": ["KDial", "Kerala Dial", "K-Dial"],
  "url": "https://kdial.in",
  "logo": "https://kdial.in/kdial-logo.png",
  "description": "Kerala's first premium-only business directory. Verified businesses, no spam, direct customer connections.",
  "foundingDate": "2024",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-7356137106",
    "email": "teamfivsys@gmail.com",
    "contactType": "customer service",
    "availableLanguage": ["English", "Malayalam"]
  },
  "sameAs": [
    "https://www.facebook.com/kdial.in",
    "https://www.instagram.com/kdial.in/"
  ]
};

export const websiteSchema = {
  "@type": "WebSite",
  "name": "KDIAL",
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

export const productSchema = {
  "@type": "Product",
  "name": "KDIAL Business Listing",
  "description": "Premium business listing on Kerala's trusted business directory.",
  "brand": { "@type": "Organization", "name": "KDIAL" },
  "offers": {
    "@type": "Offer",
    "price": "501",
    "priceCurrency": "INR",
    "priceValidUntil": "2026-08-31",
    "availability": "https://schema.org/LimitedAvailability"
  }
};

export const howToRegisterSchema = {
  "@type": "HowTo",
  "name": "How to Register Your Business on KDial",
  "description": "Simple 4-step process to register your Kerala business on KDial.",
  "totalTime": "PT5M",
  "step": [
    { "@type": "HowToStep", "position": 1, "name": "Click Registration", "text": "Click the registration button on the KDIAL homepage." },
    { "@type": "HowToStep", "position": 2, "name": "WhatsApp Message", "text": "Send the pre-filled message to our team." },
    { "@type": "HowToStep", "position": 3, "name": "Complete Payment", "text": "Pay ₹501 via UPI." },
    { "@type": "HowToStep", "position": 4, "name": "Go Live", "text": "Your listing goes live upon launch." }
  ]
};

export const breadcrumbSchema = {
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://kdial.in" },
    { "@type": "ListItem", "position": 2, "name": "Register Business", "item": "https://kdial.in/#register" }
  ]
};
