import { motion } from "framer-motion";
import { AlertTriangle, Tag } from "lucide-react";

const PricingSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-extrabold text-foreground">
            The Founder's Offer
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We are launching soon in Ernakulam. Secure your spot before the price goes up.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
          {/* Standard Price */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl bg-card p-6 md:p-8 shadow-card border border-border opacity-60"
          >
            <h3 className="text-lg font-medium text-muted-foreground mb-4">
              Standard Price
            </h3>
            
            <div className="mb-4">
              <span className="text-3xl md:text-4xl font-bold text-muted-foreground line-through">
                ₹2,999
              </span>
              <span className="text-lg text-muted-foreground"> / Year</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Launch Price
            </p>
          </motion.div>

          {/* Pre-Booking Offer */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl bg-card p-6 md:p-8 shadow-elevated border-2 border-accent"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 rounded-full gradient-brand px-4 py-1.5 text-sm font-semibold text-primary-foreground">
                <Tag className="h-3.5 w-3.5" />
                Best Value
              </span>
            </div>
            
            <h3 className="text-lg font-medium text-foreground mb-4 mt-2">
              Pre-Booking Offer
            </h3>
            
            <div className="mb-4">
              <span className="text-4xl md:text-5xl font-black text-gradient-brand">
                ₹999
              </span>
              <span className="text-lg text-foreground"> / Year</span>
            </div>
            
            <p className="text-sm text-secondary font-medium">
              Save ₹2,000 Today
            </p>
          </motion.div>
        </div>

        {/* Urgency Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 md:mt-10 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2.5 text-primary font-bold text-base md:text-lg">
            <AlertTriangle className="h-5 w-5" />
            <span>Offer closes strictly after the first <strong className="animate-pulse">100</strong> bookings</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
