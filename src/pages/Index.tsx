import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import PricingSection from "@/components/landing/PricingSection";
import ProcessSection from "@/components/landing/ProcessSection";
import FAQSection from "@/components/landing/FAQSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import Footer from "@/components/landing/Footer";
import SEO from "@/components/seo/SEO";
import StructuredData, {
  organizationSchema,
  websiteSchema,
  productSchema,
  localBusinessSchema,
  businessDirectorySchema,
} from "@/components/seo/StructuredData";
import FAQSchema, { aeoFaqs } from "@/components/seo/FAQSchema";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO />
      <StructuredData
        data={[
          organizationSchema,
          websiteSchema,
          productSchema,
          localBusinessSchema,
          businessDirectorySchema,
        ]}
      />
      <FAQSchema faqs={aeoFaqs} />
      
      <Header />
      <main>
        <HeroSection />
        <ComparisonSection />
        <BenefitsSection />
        <PricingSection />
        <ProcessSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
