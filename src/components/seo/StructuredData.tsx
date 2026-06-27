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
    "price": "501",
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
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "10.8505",
    "longitude": "76.2711"
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Kochi",
      "alternateName": "Cochin"
    },
    {
      "@type": "City",
      "name": "Thiruvananthapuram",
      "alternateName": "Trivandrum"
    },
    {
      "@type": "City",
      "name": "Kozhikode",
      "alternateName": "Calicut"
    },
    {
      "@type": "City",
      "name": "Thrissur"
    },
    {
      "@type": "City",
      "name": "Ernakulam"
    }
  ],
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

// HowTo Schema for Registration Process
export const howToRegisterSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Register Your Business on KDial",
  "description": "Simple 4-step process to register your Kerala business on KDial and get a premium listing",
  "totalTime": "PT5M",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Click the Registration Button",
      "text": "Click the 'Lock My Price @ ₹501 via WhatsApp' button on the KDial homepage",
      "url": "https://kdial.in/#register"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Send WhatsApp Message",
      "text": "Send the pre-filled WhatsApp message to KDial's business team",
      "url": "https://wa.me/917356137106"
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Complete Payment",
      "text": "Pay ₹501 via UPI using GPay, PhonePe, Paytm, or any bank UPI app",
      "itemListElement": [{
        "@type": "HowToDirection",
        "text": "Payment methods accepted: Google Pay, PhonePe, Paytm, Bank UPI"
      }]
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Go Live on Launch Day",
      "text": "Your verified premium business listing will go live when KDial launches in Kerala",
      "url": "https://kdial.in"
    }
  ]
};

// Offer Schema for Pre-Launch Discount
export const prelaunchOfferSchema = {
  "@context": "https://schema.org",
  "@type": "Offer",
  "name": "KDial Pre-Launch Business Listing Offer",
  "description": "Get 1 year premium business listing in Kerala for just ₹501 - limited to first 100 businesses",
  "price": "501",
  "priceCurrency": "INR",
  "priceValidUntil": "2026-12-31",
  "availability": "https://schema.org/LimitedAvailability",
  "availableAtOrFrom": {
    "@type": "Place",
    "name": "Kerala, India"
  },
  "eligibleRegion": {
    "@type": "State",
    "name": "Kerala",
    "containedInPlace": {
      "@type": "Country",
      "name": "India"
    }
  },
  "itemOffered": {
    "@type": "Service",
    "name": "Premium Business Listing",
    "description": "1 year verified premium business listing on KDial Kerala Business Directory"
  },
  "seller": {
    "@type": "Organization",
    "name": "KDial"
  }
};

// Service Schema for Business Listing
export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Business Directory Listing",
  "name": "KDial Premium Business Listing",
  "description": "Premium business listing service for Kerala businesses with direct customer connections, analytics dashboard, and verified status",
  "provider": {
    "@type": "Organization",
    "name": "KDial"
  },
  "areaServed": {
    "@type": "State",
    "name": "Kerala"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Business Listing Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Premium Digital Business Profile"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Analytics Dashboard"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Verified Business Badge"
        }
      }
    ]
  }
};

// BreadcrumbList Schema
export const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://kdial.in"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Kerala Business Directory",
      "item": "https://kdial.in/#directory"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Register Business",
      "item": "https://kdial.in/#register"
    }
  ]
};

export default StructuredData;
