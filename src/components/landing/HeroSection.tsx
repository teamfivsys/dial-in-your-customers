import { motion } from "framer-motion";
import { Lock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const whatsappMessage = encodeURIComponent(
    "Hi KDial Team! I want to lock my ₹999 Pre-Booking Offer for a Premium Listing. Please send me the payment details."
  );
  const whatsappLink = `https://wa.me/919876543210?text=${whatsappMessage}`;

  return (
    <section className="relative overflow-hidden gradient-hero py-16 md:py-24 lg:py-32">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L35 15 L30 25 L25 15 Z' fill='%23E63946' fill-opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>
      
      <div className="container relative mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight"
          >
            Stop Buying{" "}
            <span className="text-gradient-brand">'Leads'</span>.
            <br />
            Start Getting{" "}
            <span className="text-secondary">Customers</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 md:mt-8 text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            The first business directory in Kerala where customers contact{" "}
            <strong className="text-foreground font-black">YOU</strong> directly.
            <br className="hidden md:block" />
            <span className="text-primary font-medium">No Commission</span>.{" "}
            <span className="text-secondary font-medium">No Middlemen</span>.{" "}
            <span className="text-accent font-medium">No Spam Calls</span>.
          </motion.p>

          {/* Offer Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-10 md:mt-12 inline-block w-full max-w-md"
          >
            <div className="relative rounded-2xl bg-card p-6 md:p-8 shadow-elevated border-2 border-accent/30">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 rounded-full gradient-brand px-4 py-1.5 text-sm font-semibold text-primary-foreground">
                  🚀 Pre-Launch Offer
                </span>
              </div>
              
              <div className="mt-3">
                <p className="text-lg md:text-xl font-medium text-foreground">
                  Get 1 Year Premium Listing for just
                </p>
                <div className="mt-2 flex items-baseline justify-center gap-2">
                  <span className="text-4xl md:text-5xl font-black text-primary">₹999</span>
                  <span className="text-lg text-muted-foreground line-through">₹2,999</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-accent">
                  Valid for first <strong className="animate-pulse">100 businesses</strong> only
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 md:mt-10"
          >
            <Button
              variant="hero"
              size="xl"
              className="w-full max-w-md"
              asChild
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Lock className="h-5 w-5" />
                Lock My Price @ ₹999 via WhatsApp
                <MessageCircle className="h-5 w-5" />
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
