import { motion, useMotionValue, useTransform } from "framer-motion";
import { Globe, BarChart3, BadgeCheck } from "lucide-react";
import { useState } from "react";

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

const BenefitCard = ({ benefit, index }: { benefit: typeof benefits[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

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

  const Icon = benefit.icon;
  const colorClass = benefit.color === "accent"
    ? "bg-gradient-to-br from-accent/20 to-accent/10 text-accent"
    : "bg-gradient-to-br from-secondary/20 to-secondary/10 text-secondary";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      style={{ rotateX: isHovered ? rotateX : 0, rotateY: isHovered ? rotateY : 0, transformPerspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-2xl glass bg-card/80 backdrop-blur-sm p-6 md:p-8 shadow-card border border-border/50 hover:shadow-2xl hover:border-primary/30 transition-all duration-500 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <motion.div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mouseX.get() * 100 + 50}% ${mouseY.get() * 100 + 50}%, rgba(59, 130, 246, 0.15), transparent 40%)`,
        }}
      />

      <div className="relative z-10">
        <motion.div
          whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${colorClass} mb-5 shadow-lg`}
        >
          <Icon className="h-7 w-7" />
        </motion.div>

        <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
          {index + 1}. {benefit.title}
        </h3>

        <p className="text-muted-foreground leading-relaxed">
          {benefit.description}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

const BenefitsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container relative mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-extrabold text-foreground"
          >
            What You Get
          </motion.h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to stand out and get more customers
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} benefit={benefit} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
