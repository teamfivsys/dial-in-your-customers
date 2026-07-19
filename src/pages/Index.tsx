import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import PricingSection from "@/components/landing/PricingSection";
import ProcessSection from "@/components/landing/ProcessSection";
import AEOContent from "@/components/landing/AEOContent";
import FAQSection from "@/components/landing/FAQSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import TrustStrip from "@/components/landing/TrustStrip";
import WhyKDial from "@/components/landing/WhyKDial";
import ProblemsSolved from "@/components/landing/ProblemsSolved";
import WhyVisibility from "@/components/landing/WhyVisibility";
import WhoCanJoin from "@/components/landing/WhoCanJoin";
import FutureFeatures from "@/components/landing/FutureFeatures";
import LaunchRoadmap from "@/components/landing/LaunchRoadmap";
import MissionVision from "@/components/landing/MissionVision";
import PrivacyCommitment from "@/components/landing/PrivacyCommitment";
import ExitIntentModal from "@/components/landing/ExitIntentModal";
import SEO from "@/components/seo/SEO";
import StructuredData, {
  organizationSchema,
  websiteSchema,
  productSchema,
  howToRegisterSchema,
  breadcrumbSchema,
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
          howToRegisterSchema,
          breadcrumbSchema,
        ]}
      />
      <FAQSchema faqs={aeoFaqs} />
      
      <Header />
      <main>
        <HeroSection />
        <TrustStrip />
        <WhyKDial />
        <ProblemsSolved />
        <WhyVisibility />
        <ComparisonSection />
        <BenefitsSection />
        <WhoCanJoin />
        <PricingSection />
        <ProcessSection />
        <FutureFeatures />
        <LaunchRoadmap />
        <MissionVision />
        <PrivacyCommitment />
        <AEOContent />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
      <StickyMobileCTA />
      <ExitIntentModal />
    </div>
  );
};

export default Index;
