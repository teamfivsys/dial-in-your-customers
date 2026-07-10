import { ShieldCheck } from "lucide-react";

const commitments = [
  "We never resell your leads. A customer WhatsApp goes only to you.",
  "We collect only what's needed to publish your listing — nothing more.",
  "You can request edits or removal of your listing at any time.",
  "No third-party ad trackers on business profiles.",
];

const PrivacyCommitment = () => (
  <section id="privacy" className="py-16 md:py-24 bg-[#0A1730] text-[#F5F1E8]">
    <div className="container mx-auto px-4 md:px-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="h-6 w-6 text-[#FF6B1A]" aria-hidden="true" />
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF6B1A]">Privacy commitment</p>
      </div>
      <h2 className="text-2xl md:text-4xl font-extrabold leading-tight mb-8">
        Your data stays yours. Your leads stay yours.
      </h2>
      <ul className="space-y-4">
        {commitments.map((c) => (
          <li key={c} className="flex items-start gap-3 text-base md:text-lg text-[#F5F1E8]/85 leading-relaxed">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#FF6B1A] flex-shrink-0" aria-hidden="true" />
            {c}
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default PrivacyCommitment;