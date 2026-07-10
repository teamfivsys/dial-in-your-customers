import { motion } from "framer-motion";

const problems = [
  {
    problem: "Your lead is sold to 5 competitors",
    solution: "On KDial, the customer WhatsApps you directly. No shared leads, ever.",
  },
  {
    problem: "Free directories bury you under ads",
    solution: "Paid-only listings mean less noise and fair visibility for every member.",
  },
  {
    problem: "Fake reviews and fake businesses",
    solution: "Every listing is manually verified before it goes live.",
  },
  {
    problem: "No control over your profile",
    solution: "You'll get a dashboard to edit hours, photos, services and contact anytime.",
  },
];

const ProblemsSolved = () => (
  <section className="py-16 md:py-24 bg-[#F5F1E8]">
    <div className="container mx-auto px-4 md:px-6">
      <div className="max-w-2xl mb-10 md:mb-14">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF6B1A] mb-3">Problems we fix</p>
        <h2 className="text-2xl md:text-4xl font-extrabold text-[#0A1730] leading-tight">
          What's broken with directories in Kerala today — and what KDial does about it.
        </h2>
      </div>
      <div className="grid gap-4 md:gap-5 md:grid-cols-2">
        {problems.map((p, i) => (
          <motion.div
            key={p.problem}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="rounded-2xl bg-white border border-[#0A1730]/10 p-6 shadow-sm"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-[#0A1730]/50 mb-2">Problem</p>
            <p className="text-base md:text-lg font-semibold text-[#0A1730] mb-4">{p.problem}</p>
            <div className="h-px bg-[#0A1730]/10 mb-4" />
            <p className="text-xs font-bold uppercase tracking-wider text-[#1E6FFF] mb-2">KDial</p>
            <p className="text-sm md:text-base text-[#0A1730]/80 leading-relaxed">{p.solution}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemsSolved;