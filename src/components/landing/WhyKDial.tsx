import { motion } from "framer-motion";
import { Building2, Users, Rocket } from "lucide-react";

const cards = [
  {
    icon: Building2,
    title: "What KDial is",
    body: "A paid-only Kerala business directory. Every listing is a real, verified business — no free spam, no fake profiles.",
  },
  {
    icon: Users,
    title: "Who it's for",
    body: "Kerala businesses that want direct customer conversations on WhatsApp instead of paying for resold, competitor-shared leads.",
  },
  {
    icon: Rocket,
    title: "Why register now",
    body: "Founder pricing (₹501/year) is capped at the first 100 businesses. Early listings get priority placement at launch.",
  },
];

const WhyKDial = () => (
  <section id="why-kdial" className="py-16 md:py-24 bg-background">
    <div className="container mx-auto px-4 md:px-6">
      <div className="max-w-2xl mb-10 md:mb-14">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF6B1A] mb-3">Why KDial</p>
        <h2 className="text-2xl md:text-4xl font-extrabold text-foreground leading-tight">
          A directory built for Kerala businesses — not for lead resellers.
        </h2>
      </div>
      <div className="grid gap-4 md:gap-6 md:grid-cols-3">
        {cards.map((c, i) => (
          <motion.article
            key={c.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-card p-6 md:p-7 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="h-10 w-10 rounded-lg bg-[#1E6FFF]/10 flex items-center justify-center mb-4">
              <c.icon className="h-5 w-5 text-[#1E6FFF]" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{c.title}</h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{c.body}</p>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default WhyKDial;