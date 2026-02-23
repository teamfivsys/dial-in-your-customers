import { motion } from "framer-motion";
import kdialLogo from "@/assets/WhatsApp_Image_2026-02-23_at_12.29.15_PM-removebg-preview.png";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full glass bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
    >
      <div className="container mx-auto flex h-20 md:h-24 items-center justify-between px-4 md:px-6">
        <motion.a
          href="/"
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <img
            src={kdialLogo}
            alt="KDial Logo"
            className="h-20 md:h-24 lg:h-28 w-auto"
          />
        </motion.a>

        <div className="flex items-center gap-3 md:gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex items-center gap-2 rounded-full glass bg-secondary/10 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 border border-secondary/30 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-xs md:text-sm font-medium text-secondary">
              Pre-Booking Open
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <ThemeToggle />
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
