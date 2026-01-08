import { motion } from "framer-motion";
import kdialLogo from "@/assets/kdial-logo.png";

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border/50"
    >
      <div className="container mx-auto flex h-20 md:h-24 items-center justify-between px-4 md:px-6">
        <a href="/" className="flex items-center gap-2">
          <img 
            src={kdialLogo} 
            alt="KDial Logo" 
            className="h-20 md:h-24 lg:h-28 w-auto"
          />
        </a>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1.5 md:px-4 md:py-2 border border-secondary/30"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          <span className="text-xs md:text-sm font-medium text-secondary">
            Pre-Booking Open
          </span>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
