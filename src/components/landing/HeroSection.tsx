import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { getVariant, HEADLINES, logConversion, logImpression, type Variant } from "@/lib/ab";

const NAVY = "#0A1730";
const BLUE = "#1E6FFF";
const ORANGE = "#FF6B1A";
const CREAM = "#F5F1E8";

const whatsappMessage = encodeURIComponent(
  "Hi KDial Team! I want to lock my ₹501 Pre-Booking Offer for a Premium Listing. Please send me the payment details."
);
const whatsappLink = `https://wa.me/917356137106?text=${whatsappMessage}`;

const display = { fontFamily: "'Space Grotesk', system-ui, sans-serif" };
const serif = { fontFamily: "'Instrument Serif', Georgia, serif" };
const body = { fontFamily: "'DM Sans', system-ui, sans-serif" };

const WhatsAppGlyph = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.41-8.411" />
  </svg>
);

const HeroSection = () => {
  const [variant, setVariant] = useState<Variant>("A");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const v = getVariant();
    setVariant(v);
    setMounted(true);
    logImpression(v);
  }, []);

  const headline = HEADLINES[variant];

  return (
    <section
      aria-label="KDial hero"
      className="relative w-full py-6 md:py-14 lg:py-20 px-3 md:px-8"
      style={{ backgroundColor: CREAM }}
    >
      {/* editorial rule line */}
      <div className="max-w-2xl mx-auto pb-3 md:pb-6 flex items-baseline justify-between border-b border-[#0A1730]/15">
        <span style={serif} className="text-[13px] md:text-sm italic text-[#0A1730]/70">
          Vol. 01 · Kerala's paid-only directory
        </span>
        <span style={body} className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.22em] text-[#0A1730]/60">
          Kochi · Est. 2026
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl mx-auto mt-4 md:mt-8 bg-[#0A1730] text-[#F5F1E8] rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_30px_80px_-30px_rgba(10,23,48,0.55)]"
        style={body}
      >
        {/* card header */}
        <div className="px-5 md:px-8 py-3 md:py-4 flex items-center justify-between border-b border-[#F5F1E8]/10">
          <span style={display} className="text-lg md:text-xl font-bold tracking-tight">
            <span className="text-[#1E6FFF]">k</span>
            <span className="text-[#FF6B1A]">.</span>
            dial
          </span>
          <span
            className="inline-flex items-center gap-1.5 bg-[#FF6B1A] text-white text-[9px] md:text-[10px] font-bold px-2 py-1 rounded uppercase tracking-[0.18em]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            Founder Offer
          </span>
        </div>

        {/* body */}
        <div className="p-6 md:p-12 space-y-7 md:space-y-9">
          <div className="space-y-3 md:space-y-4">
            <p style={serif} className="text-[13px] md:text-sm italic text-[#F5F1E8]/60">
              — An open letter to every Kerala business owner
            </p>
            <h1
              style={display}
              className="text-[clamp(2rem,8.5vw,3.75rem)] leading-[1.02] tracking-tight font-bold text-white"
            >
              {headline.top}{" "}
              <span style={serif} className="italic font-normal text-[#FF6B1A]">
                {headline.accent}
              </span>{" "}
              {headline.tail}
            </h1>
            <p className="text-base md:text-lg leading-relaxed text-[#F5F1E8]/75 max-w-lg">
              Kerala's only paid directory where customers call your WhatsApp{" "}
              <span className="text-white font-semibold">directly</span>. No middleman.
              No reselling. No spam.
            </p>
          </div>

          {/* Price lockup */}
          <div className="relative bg-[#1E6FFF] p-5 md:p-6 rounded-2xl overflow-hidden">
            <div className="relative z-10">
              <p style={body} className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">
                Pre-launch · founder slot
              </p>
              <div className="mt-2 flex items-baseline gap-3 flex-wrap">
                <span style={display} className="text-5xl md:text-6xl font-bold text-white tracking-tighter leading-none">
                  ₹501
                </span>
                <span className="text-lg text-white/60 line-through">₹2,999</span>
                <span className="text-sm font-medium text-white/90">/ year</span>
              </div>
              <p style={serif} className="mt-2 text-sm italic text-white/85">
                Save ₹2,498 · locked forever at renewal
              </p>
            </div>
            <div className="absolute -right-4 -bottom-6 opacity-[0.09] pointer-events-none select-none">
              <span style={display} className="text-[9rem] md:text-[11rem] font-black text-white leading-none">
                100
              </span>
            </div>
          </div>

          {/* Value bullets */}
          <ul className="grid gap-3">
            {[
              "Direct customer WhatsApp calls",
              "Zero lead reselling to competitors",
              "Verified, paid-only listings across 14 districts",
            ].map((line) => (
              <li key={line} className="flex items-start gap-3">
                <span className="mt-0.5 h-5 w-5 rounded-full bg-[#FF6B1A] flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </span>
                <span className="text-[15px] md:text-base font-medium text-[#F5F1E8]/90">{line}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="space-y-3 pt-2">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => mounted && logConversion(variant)}
              className="group w-full inline-flex items-center justify-center gap-3 bg-white text-[#0A1730] hover:bg-[#FF6B1A] hover:text-white transition-colors duration-300 font-bold py-4 md:py-5 rounded-xl text-base md:text-lg shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)]"
              style={display}
            >
              <WhatsAppGlyph className="w-5 h-5 md:w-6 md:h-6" />
              Register via WhatsApp
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <p
              style={body}
              className="text-center text-[10px] md:text-[11px] font-semibold text-[#F5F1E8]/55 uppercase tracking-[0.24em]"
            >
              Hurry · limited to the first 100 businesses
            </p>
          </div>
        </div>

        {/* Signature bar */}
        <div className="h-1.5 w-full flex">
          <div className="flex-1" style={{ backgroundColor: BLUE }} />
          <div className="flex-1" style={{ backgroundColor: ORANGE }} />
          <div className="flex-1" style={{ backgroundColor: CREAM }} />
        </div>
      </motion.div>

      {/* Editorial footnote */}
      <div className="max-w-2xl mx-auto mt-4 md:mt-6 flex flex-wrap items-baseline justify-between gap-2 pb-16 md:pb-0">
        <span style={serif} className="text-[13px] md:text-sm italic text-[#0A1730]/70">
          Signed, the KDial founders — made in Kerala.
        </span>
        <span style={body} className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#0A1730]/60">
          Variant · {variant}
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
