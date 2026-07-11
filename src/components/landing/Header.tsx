import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CountdownTimer } from "@/components/CountdownTimer";
import { getVariant, type Variant } from "@/lib/ab";
import kdialLogo from "@/assets/kdial-logo.png.asset.json";

const Header = () => {
  const launchDate = new Date("2025-03-15T23:59:59+05:30");
  const [variant, setVariant] = useState<Variant | null>(null);

  useEffect(() => {
    setVariant(getVariant());
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#F5F1E8]/85 border-b border-[#0A1730]/10"
    >
      <div className="container mx-auto flex h-20 md:h-24 items-center justify-between px-4 md:px-6">
        <a href="/" className="flex items-center gap-2" aria-label="KDial — Kerala Business Directory home">
          <img
            src={kdialLogo.url}
            alt="KDial — Kerala Business Directory"
            width={180}
            height={60}
            className="h-12 md:h-14 w-auto"
            fetchPriority="high"
            decoding="async"
          />
          {variant && (
            <span
              className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-[0.18em] uppercase bg-[#0A1730] text-[#F5F1E8]"
              title="A/B test variant"
            >
              <span className="h-1 w-1 rounded-full bg-[#FF6B1A]" />
              exp · {variant}
            </span>
          )}
        </a>

        <div className="flex items-center gap-2 md:gap-3">
          <CountdownTimer targetDate={launchDate} compact showIcon />
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
