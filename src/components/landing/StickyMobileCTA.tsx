import { useEffect, useState } from "react";
import { getVariant, logConversion, type Variant } from "@/lib/ab";

const whatsappMessage = encodeURIComponent(
  "Hi KDial Team! I want to lock my ₹501 Pre-Booking Offer for a Premium Listing. Please send me the payment details."
);
const whatsappLink = `https://wa.me/917356137106?text=${whatsappMessage}`;

const StickyMobileCTA = () => {
  const [variant, setVariant] = useState<Variant>("A");

  useEffect(() => {
    setVariant(getVariant());
  }, []);

  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-40 px-3 pb-3 pt-2 bg-gradient-to-t from-[#0A1730] via-[#0A1730]/95 to-transparent"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => logConversion(variant)}
        className="flex items-center justify-between w-full rounded-2xl bg-[#FF6B1A] text-white px-4 py-3.5 shadow-[0_18px_40px_-12px_rgba(255,107,26,0.7)] active:scale-[0.98] transition-transform"
        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
      >
        <span className="flex flex-col leading-tight text-left">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
            Lock ₹501 · save ₹2,498
          </span>
          <span className="text-base font-bold">Register on WhatsApp</span>
        </span>
        <span
          aria-hidden
          className="h-9 w-9 rounded-xl bg-white/15 flex items-center justify-center text-lg"
        >
          →
        </span>
      </a>
    </div>
  );
};

export default StickyMobileCTA;