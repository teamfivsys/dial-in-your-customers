import { ShieldCheck, MapPin, BadgeCheck, Lock } from "lucide-react";

const items = [
  { icon: MapPin, label: "Kerala-only" },
  { icon: BadgeCheck, label: "Paid-only listings" },
  { icon: ShieldCheck, label: "Verified businesses" },
  { icon: Lock, label: "Privacy-first" },
];

const TrustStrip = () => (
  <section aria-label="Trust indicators" className="bg-[#F5F1E8] border-y border-[#0A1730]/10 py-4">
    <div className="container mx-auto px-4">
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:gap-x-10">
        {items.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2 text-[#0A1730]">
            <Icon className="h-4 w-4 text-[#1E6FFF]" aria-hidden="true" />
            <span className="text-xs md:text-sm font-semibold tracking-wide">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default TrustStrip;