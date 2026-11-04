import { useEffect, useState } from "react";
import { getVariant, logConversion, type Variant } from "@/lib/ab";

const WA_MSG = encodeURIComponent(
  "Hi KDial team, I am enquiring about the Founder Package: ₹501 for the first year and ₹701 at renewal after the first year. The one-year term starts when the listing is published. Renewal is manual and requires a new affirmative payment; there is no automatic renewal or auto-charge. Please confirm the package inclusions and payment terms. I understand KDial is pre-launch and this enquiry does not book a listing or make a payment."
);
export const WHATSAPP_URL = `https://wa.me/917356137106?text=${WA_MSG}`;

interface Props {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

/** Shared WhatsApp CTA — fires A/B conversion event on every click. */
export const WhatsAppCTA = ({ children, className, ariaLabel }: Props) => {
  const [variant, setVariant] = useState<Variant>("A");
  useEffect(() => setVariant(getVariant()), []);
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel ?? "Enquire about the Founder Package on WhatsApp"}
      onClick={() => logConversion(variant)}
      className={
        className ??
        "inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A1730] text-[#F5F1E8] hover:bg-[#FF6B1A] transition-colors px-6 py-3 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2"
      }
    >
      {children}
    </a>
  );
};

export default WhatsAppCTA;