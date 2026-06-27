import { motion } from "framer-motion";
import kdialLogo from "@/assets/kdial-logo.png";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CountdownTimer } from "@/components/CountdownTimer";

const Header = () => {
  const launchDate = new Date("2025-03-15T23:59:59+05:30");

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
            alt="KDial - Kerala Business Directory Logo - Premium Business Listings in Kochi, Ernakulam, Trivandrum, Calicut"
            title="KDial - Kerala's Best Business Directory"
            className="h-20 md:h-24 lg:h-28 w-auto"
          />
        </motion.a>

        <div className="flex items-center gap-3 md:gap-4">
          <CountdownTimer
            targetDate={launchDate}
            compact={true}
            showIcon={true}
          />

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
