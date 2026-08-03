import { motion } from "framer-motion";
import {
  BadgeCheck,
  Search,
  MessageCircle,
  Sparkles,
  Images,
  MapPin,
  ClipboardList,
  Star,
  Share2,
  Link2,
  BarChart3,
  Crown,
  ShieldCheck,
  Smartphone,
  IndianRupee,
  Tag,
} from "lucide-react";
import WhatsAppCTA from "@/components/landing/WhatsAppCTA";

const features = [
  { icon: BadgeCheck, title: "Premium Business Profile", body: "Create a professional business page with all your important details." },
  { icon: Search, title: "SEO Optimized Business Page", body: "Improve your chances of appearing in Google search results." },
  { icon: MessageCircle, title: "WhatsApp Click-to-Chat", body: "Customers can contact you instantly with one tap." },
  { icon: Sparkles, title: "AI Generated Business Description", body: "Receive a professionally written business description powered by AI." },
  { icon: Images, title: "Photo Gallery", body: "Showcase your products, services, shop, or portfolio." },
  { icon: MapPin, title: "Google Maps Integration", body: "Help customers find your business easily." },
  { icon: ClipboardList, title: "Lead Enquiry Form", body: "Receive customer enquiries directly from your KDial page." },
  { icon: Star, title: "Customer Reviews & Ratings", body: "Build trust through authentic customer feedback.", soon: true },
  { icon: Link2, title: "Social Media Links", body: "Connect customers to your Facebook, Instagram, YouTube, and more." },
  { icon: Share2, title: "One-Click Share", body: "Share your business page instantly on WhatsApp and social media." },
  { icon: BarChart3, title: "Monthly Visibility Report", body: "Track views, clicks, and enquiries with simple monthly insights.", soon: true },
];

const trust = [
  { icon: IndianRupee, label: "No Hidden Charges" },
  { icon: Crown, label: "Founder Pricing" },
  { icon: ShieldCheck, label: "Secure Registration" },
  { icon: MapPin, label: "Kerala Focused" },
  { icon: Smartphone, label: "Mobile Friendly" },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="relative overflow-hidden py-16 md:py-24 bg-muted/30">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-25">
        <div className="absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-accent">
            <Tag className="h-3.5 w-3.5" aria-hidden="true" />
            Founder Offer
          </span>
          <h2 className="mt-5 text-2xl md:text-4xl font-extrabold leading-tight text-foreground">
            Everything Your Business Needs to Get Found Online
            <span className="mt-2 block text-gradient-brand">Founder Offer – Just ₹501/Year</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground">
            Launch your business online with a complete digital presence. Get discovered on Google,
            receive enquiries on WhatsApp, build customer trust, and grow your business—all for just
            ₹501/year.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="mt-12 md:mt-16 grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: Math.min(i, 6) * 0.05 }}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-5 md:p-6 shadow-card backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <div className="relative z-10">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/15 text-primary shadow-sm">
                    <f.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  {f.soon && (
                    <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      Coming Soon
                    </span>
                  )}
                </div>
                <h3 className="text-base md:text-lg font-bold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Highlight banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="relative mt-12 md:mt-16 overflow-hidden rounded-3xl gradient-brand p-8 md:p-12 text-center shadow-elevated"
        >
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(600px_circle_at_50%_0%,rgba(255,255,255,0.18),transparent_60%)]" />
          <div className="relative z-10">
            <p className="text-2xl md:text-4xl font-extrabold text-primary-foreground">
              More than a Business Listing
            </p>
            <p className="mt-3 text-base md:text-xl font-medium text-primary-foreground/85">
              Your Complete Digital Presence for Just ₹501/Year
            </p>
          </div>
        </motion.div>

        {/* Founder badge + pricing + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
          className="relative mx-auto mt-10 md:mt-14 max-w-3xl overflow-hidden rounded-3xl border border-border/60 bg-card/90 p-6 md:p-10 text-center shadow-card backdrop-blur-md"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E0B24C]/50 bg-gradient-to-r from-[#E0B24C]/20 to-[#F7DFA5]/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#B4842A]">
            <Crown className="h-4 w-4" aria-hidden="true" />
            Founder Business
          </span>

          <h3 className="mt-5 text-lg md:text-2xl font-extrabold text-foreground">
            Limited Founder Offer
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm md:text-base text-muted-foreground">
            Become one of the first businesses on KDial and secure your Founder status before the
            public launch.
          </p>

          <div className="mt-6 flex flex-wrap items-end justify-center gap-3">
            <span className="text-4xl md:text-5xl font-black text-gradient-brand">₹501</span>
            <span className="pb-1 text-base text-foreground">/ Year</span>
            <span className="pb-1 text-sm text-muted-foreground line-through">₹2,999</span>
          </div>

          <p className="mt-6 text-xl md:text-2xl font-extrabold text-foreground">
            Ready to Grow Your Business?
          </p>

          <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <WhatsAppCTA
              ariaLabel="Become a Founder Business for ₹501"
              className="inline-flex items-center justify-center gap-2 rounded-xl gradient-brand px-6 py-3.5 font-bold text-primary-foreground shadow-elevated transition-transform hover:scale-[1.02] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <Crown className="h-5 w-5" aria-hidden="true" />
              Become a Founder Business – ₹501
            </WhatsAppCTA>
            <WhatsAppCTA
              ariaLabel="Contact KDial on WhatsApp"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3.5 font-bold text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Contact on WhatsApp
            </WhatsAppCTA>
          </div>

          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
            {trust.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-muted-foreground">
                <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
