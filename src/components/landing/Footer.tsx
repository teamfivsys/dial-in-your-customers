import { motion } from "framer-motion";
import {
  MessageCircle,
  Mail,
  Facebook,
  Instagram,
} from "lucide-react";
import { WHATSAPP_URL } from "./WhatsAppCTA";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const linkCls =
    "text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:underline";

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-12 md:py-16 bg-background border-t border-border"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Logo */}
          <div>
            <img
              src="/kdial-logo.png"
              alt="KDial — Kerala Business Directory"
              width={216}
              height={72}
              className="h-16 w-auto"
              loading="lazy"
              decoding="async"
            />

            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              Kerala's paid-only, verified business directory. Customers on
              WhatsApp, direct.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-foreground mb-3">
              Explore
            </h3>

            <ul className="space-y-2">
              <li>
                <a href="/" className={linkCls}>
                  Home
                </a>
              </li>
              <li>
                <a href="/blog" className={linkCls}>
                  Blog
                </a>
              </li>
              <li>
                <a href="/#why-kdial" className={linkCls}>
                  Why KDial
                </a>
              </li>
              <li>
                <a href="/#privacy" className={linkCls}>
                  Privacy
                </a>
              </li>
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-foreground mb-3">
              Cities
            </h3>

            <ul className="space-y-2">
              <li>
                <a href="/kochi" className={linkCls}>
                  Kochi
                </a>
              </li>
              <li>
                <a href="/trivandrum" className={linkCls}>
                  Trivandrum
                </a>
              </li>
              <li>
                <a href="/calicut" className={linkCls}>
                  Calicut
                </a>
              </li>
              <li>
                <a href="/thrissur" className={linkCls}>
                  Thrissur
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-foreground mb-3">
              Get in Touch
            </h3>

            <ul className="space-y-3">
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkCls} inline-flex items-center gap-2`}
                  aria-label="Chat with KDial on WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </li>

              <li>
                <a
                  href="mailto:hello@kdial.in"
                  className={`${linkCls} inline-flex items-center gap-2`}
                  aria-label="Email KDial"
                >
                  <Mail className="h-4 w-4" />
                  hello@kdial.in
                </a>
              </li>

              <li>
                <a
                  href="https://www.facebook.com/kdial.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkCls} inline-flex items-center gap-2`}
                  aria-label="Follow KDial on Facebook"
                >
                  <Facebook className="h-4 w-4" />
                  Facebook
                </a>
              </li>

              <li>
                <a
                  href="https://www.instagram.com/kdial.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkCls} inline-flex items-center gap-2`}
                  aria-label="Follow KDial on Instagram"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {currentYear} KDial. All rights reserved.
          </p>

          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made in Kerala with{" "}
            <span className="text-[#FF6B1A]" aria-hidden="true">
              ❤️
            </span>
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
