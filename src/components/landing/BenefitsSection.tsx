import { motion } from "framer-motion";
import { Globe, BarChart3, BadgeCheck } from "lucide-react";

const benefits = [
  {
    icon: Globe,
    title: "Your Professional Digital Profile",
    description:
      "Think of it as a mini-website. Showcase your photos, services, and location on a clean, premium page.",
    color: "secondary",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics Dashboard",
    description:
      "Login and see exactly how many people viewed your profile, clicked 'Call', or clicked 'WhatsApp'.",
    color: "accent",
  },
  {
    icon: BadgeCheck,
    title: "The 'Trust' Badge",
    description:
      "KDial has no free listings. Being listed here proves to customers that you are a legitimate, premium business owner in Kerala.",
    color: "secondary",
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-extrabold text-foreground">
            What You Get
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to stand out and get more customers
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const colorClass = benefit.color === "accent" ? "bg-accent/10 text-accent" : "bg-secondary/10 text-secondary";
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="group relative rounded-2xl bg-card p-6 md:p-8 shadow-card border border-border hover:shadow-elevated hover:border-secondary/30 transition-all duration-300"
              >
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${colorClass} mb-5`}>
                  <Icon className="h-7 w-7" />
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {index + 1}. {benefit.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
