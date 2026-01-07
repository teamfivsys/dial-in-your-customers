import { motion } from "framer-motion";
import kdialLogo from "@/assets/kdial-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-8 md:py-12 bg-background border-t border-border"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <img 
            src={kdialLogo} 
            alt="KDial Logo" 
            className="h-12 md:h-14 w-auto"
          />
          
          <p className="text-sm text-muted-foreground text-center">
            © {currentYear} KDial. All rights reserved.
          </p>
          
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made in Kerala with <span className="text-primary">❤️</span>
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
