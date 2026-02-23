import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const ComparisonSection = () => {
  const oldWayPoints = [
    "You pay for leads.",
    "The same lead is sold to 5 of your competitors.",
    "You have to fight a price war.",
  ];

  const kdialWayPoints = [
    { icon: "📞", text: "Direct Connection: Customers call your number directly." },
    { icon: "💬", text: "Direct WhatsApp: Customers click 'Chat' and land in your WhatsApp inbox." },
    { icon: "✓", text: "Exclusive: We only list verified, paid businesses. No scammers allowed." },
  ];

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
            Why Kerala Businesses Choose KDial Over JustDial
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Unlike traditional business directories in Kerala, KDial connects customers directly to your business without middlemen, commission fees, or lead selling. Get genuine customers from Kochi, Ernakulam, Calicut, Trivandrum, and all Kerala cities.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Old Way */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl bg-card p-6 md:p-8 shadow-card border border-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <X className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Traditional Business Directories <span className="text-muted-foreground">(JustDial & Others)</span>
              </h3>
            </div>
            
            <ul className="space-y-4">
              {oldWayPoints.map((point, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                    <X className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* KDial Way */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl bg-card p-6 md:p-8 shadow-card border-2 border-secondary/30"
          >
            <div className="absolute -top-3 right-4">
              <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                Recommended
              </span>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                <Check className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                The KDial Advantage for Kerala Businesses
              </h3>
            </div>
            
            <ul className="space-y-4">
              {kdialWayPoints.map((point, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/10 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-secondary" />
                  </div>
                  <span className="text-foreground">{point.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
