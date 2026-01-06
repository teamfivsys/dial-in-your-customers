import { motion } from "framer-motion";
import { Lock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const FinalCTASection = () => {
  const whatsappMessage = encodeURIComponent(
    "Hi KDial Team! I want to lock my ₹999 Pre-Booking Offer for a Premium Listing. Please send me the payment details."
  );
  const whatsappLink = `https://wa.me/919876543210?text=${whatsappMessage}`;

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-6">
            Don't let your competitors take the{" "}
            <span className="text-gradient-brand">top spots</span>.
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 md:mb-10">
            Join the 100 founding businesses and lock your price today
          </p>
          
          <Button
            variant="hero"
            size="xl"
            className="w-full max-w-md"
            asChild
          >
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Lock className="h-5 w-5" />
              Secure My ₹999 Listing Now
              <MessageCircle className="h-5 w-5" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
