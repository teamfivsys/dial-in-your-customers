import { motion, useMotionValue, useTransform } from "framer-motion";
import { AlertTriangle, Tag } from "lucide-react";
import { useState } from "react";
import { CountdownTimer } from "@/components/CountdownTimer";

const PricingSection = () => {
  const launchDate = new Date("2025-03-15T23:59:59+05:30");
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-extrabold text-foreground">
            Affordable Business Listing Pricing for Kerala – Pre-Launch Offer
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Limited-time pre-booking offer for Kerala businesses at just ₹501 per year. KDial is launching soon in Ernakulam, Kochi with plans to expand across Kerala. Secure your premium business listing before prices increase.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl glass bg-card/60 backdrop-blur-sm p-6 md:p-8 shadow-card border border-border/50 opacity-60"
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

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              rotateX: isHovered ? rotateX : 0,
              rotateY: isHovered ? rotateY : 0,
              transformPerspective: 1000,
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="relative rounded-2xl glass bg-card/90 backdrop-blur-xl p-6 md:p-8 shadow-elevated border-2 border-accent overflow-hidden group hover:shadow-2xl transition-shadow duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(600px circle at ${mouseX.get() * 100 + 50}% ${mouseY.get() * 100 + 50}%, rgba(234, 88, 12, 0.15), transparent 40%)`,
              }}
            />

            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
              <motion.span
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(234, 88, 12, 0.3)",
                    "0 0 40px rgba(234, 88, 12, 0.6)",
                    "0 0 20px rgba(234, 88, 12, 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center gap-1.5 rounded-full gradient-brand px-4 py-1.5 text-sm font-semibold text-primary-foreground"
              >
                <Tag className="h-3.5 w-3.5" />
                Best Value
              </motion.span>
            </div>

            <div className="relative z-10">
              <h3 className="text-lg font-medium text-foreground mb-4 mt-2">
                Pre-Booking Offer
              </h3>

              <div className="mb-4">
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl md:text-5xl font-black text-gradient-brand"
                >
                  ₹501
                </motion.span>
                <span className="text-lg text-foreground"> / Year</span>
              </div>

              <p className="text-sm text-secondary font-medium mb-4">
                Save ₹2,498 Today
              </p>

              <div className="mt-4 pt-4 border-t border-border/30">
                <p className="text-xs text-muted-foreground mb-2">
                  Price increases to ₹2,999 on March 16th
                </p>
                <CountdownTimer
                  targetDate={launchDate}
                  compact={true}
                  showIcon={false}
                  className="justify-center"
                />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 md:mt-10 text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 rounded-full glass bg-primary/20 backdrop-blur-sm px-5 py-2.5 text-primary font-bold text-base md:text-lg border border-primary/30 shadow-lg"
          >
            <AlertTriangle className="h-5 w-5 animate-pulse" />
            <span>Offer closes strictly after the first <strong className="animate-pulse">100</strong> bookings</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
