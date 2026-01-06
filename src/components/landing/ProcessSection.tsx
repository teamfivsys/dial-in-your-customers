import { motion } from "framer-motion";
import { MousePointer, MessageSquare, CreditCard, Rocket } from "lucide-react";

const steps = [
  {
    icon: MousePointer,
    title: "Click the button below",
    number: 1,
  },
  {
    icon: MessageSquare,
    title: "Send the pre-filled WhatsApp message",
    number: 2,
  },
  {
    icon: CreditCard,
    title: "Complete payment via UPI",
    number: 3,
  },
  {
    icon: Rocket,
    title: "Go live on Launch Day",
    number: 4,
  },
];

const ProcessSection = () => {
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
          <h2 className="text-2xl md:text-4xl font-bold text-foreground">
            How To Claim Your Spot
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple 4-step process to secure your listing
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line - Desktop */}
          <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary via-secondary to-accent"></div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="relative text-center"
                >
                  <div className="relative inline-flex">
                    <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-2xl bg-card shadow-card border border-border">
                      <Icon className="h-8 w-8 md:h-10 md:w-10 text-secondary" />
                    </div>
                    <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full gradient-brand text-sm font-bold text-primary-foreground">
                      {step.number}
                    </div>
                  </div>
                  
                  <p className="mt-4 text-sm md:text-base font-medium text-foreground leading-snug">
                    {step.title}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
