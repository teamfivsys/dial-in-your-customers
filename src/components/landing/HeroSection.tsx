import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Lock, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingShapes } from "@/components/3d/FloatingShapes";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Suspense, useEffect } from "react";

const HeroSection = () => {
  const launchDate = new Date("2026-03-15T23:59:59+05:30");

  const whatsappMessage = encodeURIComponent(
    "Hi KDial Team! I want to lock my ₹999 Pre-Booking Offer for a Premium Listing. Please send me the payment details."
  );
  const whatsappLink = `https://wa.me/917356137106?text=${whatsappMessage}`;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set(clientX / innerWidth - 0.5);
      mouseY.set(clientY / innerHeight - 0.5);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
      <Suspense fallback={null}>
        <FloatingShapes />
      </Suspense>

      <div className="absolute inset-0 gradient-mesh -z-20" />

      <div className="absolute inset-0 opacity-[0.02] -z-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L35 15 L30 25 L25 15 Z' fill='%23E63946' fill-opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
          >
            Kerala's Best Business Directory – Stop Buying{" "}
            <span className="text-gradient-brand inline-flex items-center gap-2">
              'Leads'
            </span>
            , Start Getting Real{" "}
            <span className="text-secondary">Customers</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 md:mt-8 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            style={{ textShadow: '0 1px 5px rgba(0,0,0,0.1)' }}
          >
            <strong className="text-foreground font-semibold">KDial is the first business directory in Kerala</strong> where customers contact{" "}
            <strong className="text-foreground font-black">YOU</strong> directly. Trusted by businesses across Kochi, Trivandrum, Calicut, Thrissur, and all 14 districts of Kerala.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto"
          >
            <span className="text-primary font-medium">No Commission</span>.{" "}
            <span className="text-secondary font-medium">No Middlemen</span>.{" "}
            <span className="text-accent font-medium">No Spam Calls</span>. Just direct customer connections for your Kerala-based business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{ rotateX, rotateY, transformPerspective: 1000 }}
            className="mt-10 md:mt-12 inline-block w-full max-w-md"
          >
            <div className="relative rounded-2xl glass bg-card/80 backdrop-blur-xl p-6 md:p-8 shadow-elevated border-2 border-accent/30 overflow-visible group hover:shadow-2xl transition-shadow duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-50">
                <motion.span
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(234, 88, 12, 0.3)",
                      "0 0 40px rgba(234, 88, 12, 0.6)",
                      "0 0 20px rgba(234, 88, 12, 0.3)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center gap-1.5 rounded-full gradient-brand px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  Pre-Launch Offer
                </motion.span>
              </div>

              <div className="mt-3 relative z-10">
                <p className="text-lg md:text-xl font-medium text-foreground">
                  Get 1 Year Premium Listing for just
                </p>
                <div className="mt-2 flex items-baseline justify-center gap-2">
                  <motion.span
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl md:text-5xl font-black text-primary"
                  >
                    ₹999
                  </motion.span>
                  <span className="text-lg text-muted-foreground line-through">₹2,999</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-accent">
                  Valid for first <strong className="animate-pulse">100 businesses</strong> only
                </p>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary opacity-50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 md:mt-10"
          >
            <CountdownTimer targetDate={launchDate} className="max-w-2xl mx-auto" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 md:mt-10"
          >
            <Button
              variant="hero"
              size="xl"
              className="w-full max-w-md relative group overflow-hidden"
              asChild
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ["-200%", "200%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />
                <Lock className="h-5 w-5 relative z-10" />
                <span className="relative z-10">Lock My Price @ ₹999 via WhatsApp</span>
                <MessageCircle className="h-5 w-5 relative z-10" />
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
