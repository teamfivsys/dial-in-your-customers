import { motion } from "framer-motion";
import { ArrowUpRight, MessageCircle } from "lucide-react";

const NAVY = "#0A1730";
const PANEL = "#0F2150";
const BLUE = "#1E6FFF";
const ORANGE = "#FF6B1A";
const CREAM = "#F5F1E8";

const whatsappMessage = encodeURIComponent(
  "Hi KDial Team! I want to lock my ₹501 Pre-Booking Offer for a Premium Listing. Please send me the payment details."
);
const whatsappLink = `https://wa.me/917356137106?text=${whatsappMessage}`;

const tile = "rounded-3xl border border-white/5 transition-transform duration-300";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Tile = ({
  i,
  className = "",
  style,
  children,
}: {
  i: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) => (
  <motion.div
    custom={i}
    initial="hidden"
    animate="show"
    variants={fadeUp}
    whileHover={{ y: -3 }}
    className={`${tile} ${className}`}
    style={style}
  >
    {children}
  </motion.div>
);

const HeroSection = () => {
  return (
    <section
      className="relative overflow-hidden py-10 md:py-16 lg:py-20"
      style={{ backgroundColor: NAVY }}
    >
      {/* atmospheric glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-[28rem] w-[28rem] rounded-full blur-[120px] opacity-30"
        style={{ backgroundColor: BLUE }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 h-[24rem] w-[24rem] rounded-full blur-[120px] opacity-15"
        style={{ backgroundColor: ORANGE }}
      />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-min gap-3 md:gap-4">
          {/* 1. Wordmark + status pills */}
          <Tile
            i={0}
            className="md:col-span-4 p-6 md:p-7 flex flex-col justify-between min-h-[180px]"
            style={{ backgroundColor: CREAM, borderColor: "rgba(10,23,48,0.08)" }}
          >
            <div
              className="text-4xl md:text-5xl font-bold tracking-tight"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", color: NAVY }}
            >
              <span style={{ color: BLUE }}>k</span>
              <span style={{ color: ORANGE }}>.</span>
              dial
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              <span
                className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full border"
                style={{ color: NAVY, borderColor: "rgba(10,23,48,0.15)", backgroundColor: "rgba(10,23,48,0.04)" }}
              >
                14 Districts
              </span>
              <span
                className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full border"
                style={{ color: NAVY, borderColor: "rgba(10,23,48,0.15)", backgroundColor: "rgba(10,23,48,0.04)" }}
              >
                Verified
              </span>
              <span
                className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full border"
                style={{ color: NAVY, borderColor: "rgba(10,23,48,0.15)", backgroundColor: "rgba(10,23,48,0.04)" }}
              >
                Paid-only
              </span>
            </div>
          </Tile>

          {/* 2. Headline hero */}
          <Tile
            i={1}
            className="md:col-span-8 md:row-span-2 p-8 md:p-12 relative overflow-hidden flex flex-col justify-center"
            style={{ backgroundColor: PANEL }}
          >
            <div
              aria-hidden
              className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-[100px] opacity-40"
              style={{ backgroundColor: BLUE }}
            />
            <h1
              className="relative z-10 text-3xl md:text-5xl lg:text-6xl font-bold leading-[0.98] tracking-tight text-white"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
            >
              Kerala's Best
              <br />
              <span style={{ color: BLUE }}>Business Directory.</span>
              <br />
              <span className="text-white/60">Stop buying 'leads'.</span>
            </h1>
            <p className="relative z-10 mt-6 md:mt-8 text-base md:text-lg text-white/65 max-w-2xl leading-relaxed">
              The first directory in Kerala where customers contact{" "}
              <span className="text-white font-semibold">you</span> directly. No commission. No middlemen. No spam calls.
            </p>
          </Tile>

          {/* 3. Orange price anchor */}
          <Tile
            i={2}
            className="md:col-span-4 p-6 md:p-7 flex flex-col justify-between min-h-[220px]"
            style={{ backgroundColor: ORANGE, borderColor: "rgba(255,255,255,0.15)" }}
          >
            <div>
              <p className="text-white/85 uppercase text-[10px] font-black tracking-[0.18em]">
                Pre-Launch · Founder Slot
              </p>
              <div className="mt-3 flex items-baseline gap-3">
                <span
                  className="text-5xl md:text-6xl font-bold text-white leading-none"
                  style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
                >
                  ₹501
                </span>
                <span className="text-white/70 line-through text-lg">₹2,999</span>
              </div>
              <p className="text-white/85 text-xs mt-2 font-medium">per year · save ₹2,498</p>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              <p className="text-white text-xs font-semibold tracking-wide">
                First 100 businesses only
              </p>
            </div>
          </Tile>

          {/* 4. Trust bullets */}
          <Tile
            i={3}
            className="md:col-span-4 p-6 md:p-7"
            style={{ backgroundColor: PANEL }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40 mb-4">
              What you get
            </p>
            <ul className="space-y-3">
              {[
                "Direct customer calls — no lead reselling",
                "WhatsApp inquiries straight to your inbox",
                "Verified, paid-only listings",
                "Indexed across 1,400+ SEO pages",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: BLUE }}
                  />
                  <span className="text-white/80 text-sm leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>
          </Tile>

          {/* 5. Stat: pages */}
          <Tile
            i={4}
            className="md:col-span-2 p-6 flex flex-col justify-center"
            style={{ backgroundColor: PANEL }}
          >
            <span
              className="text-3xl md:text-4xl font-bold text-white leading-none"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
            >
              1,400+
            </span>
            <span className="mt-2 text-[10px] uppercase tracking-[0.15em] font-bold text-white/45 leading-tight">
              City × Category Pages
            </span>
          </Tile>

          {/* 6. Stat: slots (filled blue) */}
          <Tile
            i={5}
            className="md:col-span-2 p-6 flex flex-col justify-center"
            style={{ backgroundColor: BLUE, borderColor: "rgba(255,255,255,0.15)" }}
          >
            <span
              className="text-3xl md:text-4xl font-bold text-white leading-none"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
            >
              100
            </span>
            <span className="mt-2 text-[10px] uppercase tracking-[0.15em] font-bold text-white/80 leading-tight">
              Founder Slots
            </span>
          </Tile>

          {/* 7. WhatsApp CTA tile */}
          <motion.a
            custom={6}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            whileHover={{ y: -3 }}
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`${tile} md:col-span-4 p-6 md:p-7 flex items-center justify-between group cursor-pointer`}
            style={{ backgroundColor: "#ffffff", borderColor: "rgba(10,23,48,0.08)" }}
          >
            <div className="flex flex-col">
              <span
                className="text-lg md:text-xl font-bold leading-tight"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", color: NAVY }}
              >
                Lock My Price <br />
                <span style={{ color: BLUE }}>@ ₹501 via WhatsApp</span>
              </span>
              <span className="text-xs mt-2 font-medium" style={{ color: "rgba(10,23,48,0.55)" }}>
                <MessageCircle className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                Replies in under 10 minutes
              </span>
            </div>
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              style={{ backgroundColor: NAVY }}
            >
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
