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
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-40 right-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
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
            How to Register Your Kerala Business on KDial in 4 Simple Steps
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Easy online business registration process for Kerala businesses. Register your business in Ernakulam, Kochi, Trivandrum, Calicut, or anywhere in Kerala through WhatsApp payment in just 4 simple steps and secure your premium listing today.
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          <svg className="hidden md:block absolute top-12 left-0 right-0 w-full h-1" style={{ zIndex: 0 }}>
            <motion.line
              x1="12%"
              y1="50%"
              x2="88%"
              y2="50%"
              stroke="url(#gradient)"
              strokeWidth="2"
              strokeDasharray="1000"
              initial={{ strokeDashoffset: 1000 }}
              whileInView={{ strokeDashoffset: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(0, 84%, 50%)" />
                <stop offset="50%" stopColor="hsl(210, 85%, 45%)" />
                <stop offset="100%" stopColor="hsl(25, 95%, 55%)" />
              </linearGradient>
            </defs>
          </svg>

          <motion.div
            className="hidden md:block absolute top-12 left-[12%] w-3 h-3 rounded-full bg-primary animate-pulse"
            style={{ zIndex: 1 }}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 relative" style={{ zIndex: 2 }}>
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="relative text-center group"
                >
                  <div className="relative inline-flex">
                    <motion.div
                      whileHover={{ scale: 1.1, rotateY: 180 }}
                      transition={{ duration: 0.6 }}
                      className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-2xl glass bg-card/80 backdrop-blur-sm shadow-card border border-border/50 group-hover:shadow-2xl group-hover:border-primary/50 transition-all duration-500"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <Icon className="h-8 w-8 md:h-10 md:w-10 text-secondary group-hover:text-primary transition-colors duration-300" style={{ transform: "rotateY(180deg)" }} />
                    </motion.div>

                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 200 }}
                      className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full gradient-brand text-sm font-bold text-primary-foreground shadow-lg"
                    >
                      {step.number}
                    </motion.div>
                  </div>

                  <p className="mt-4 text-sm md:text-base font-medium text-foreground leading-snug group-hover:text-primary transition-colors duration-300">
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
