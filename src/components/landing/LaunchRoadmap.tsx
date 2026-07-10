import { CheckCircle2, Loader2, Circle } from "lucide-react";

type Status = "done" | "active" | "next";

const steps: { status: Status; label: string; date: string; body: string }[] = [
  {
    status: "done",
    label: "Concept & brand",
    date: "Q4 2025",
    body: "KDial identity, brand system, and category structure locked in.",
  },
  {
    status: "done",
    label: "Website & pre-launch offer",
    date: "Q1 2026",
    body: "This site — founder pricing open for the first 100 businesses.",
  },
  {
    status: "active",
    label: "Founder onboarding",
    date: "Now",
    body: "Verifying businesses, collecting listings, publishing city + category pages.",
  },
  {
    status: "next",
    label: "Public launch — Ernakulam",
    date: "2026",
    body: "Directory goes live starting Ernakulam, then rolling across all 14 districts.",
  },
  {
    status: "next",
    label: "Reviews, dashboard & mobile app",
    date: "Post-launch",
    body: "Verified reviews, business dashboard and Android app roll out to founders first.",
  },
];

const iconFor = (s: Status) =>
  s === "done" ? CheckCircle2 : s === "active" ? Loader2 : Circle;
const colorFor = (s: Status) =>
  s === "done" ? "text-[#1E6FFF]" : s === "active" ? "text-[#FF6B1A]" : "text-[#0A1730]/40";
const labelFor = (s: Status) => (s === "done" ? "Done" : s === "active" ? "In progress" : "Upcoming");

const LaunchRoadmap = () => (
  <section className="py-16 md:py-24 bg-[#F5F1E8]">
    <div className="container mx-auto px-4 md:px-6 max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF6B1A] mb-3">Roadmap</p>
      <h2 className="text-2xl md:text-4xl font-extrabold text-[#0A1730] leading-tight mb-10">
        Where we are, and what's next.
      </h2>
      <ol aria-label="Launch roadmap" className="relative border-l-2 border-[#0A1730]/10 pl-6 md:pl-8 space-y-8">
        {steps.map((s) => {
          const Icon = iconFor(s.status);
          return (
            <li key={s.label} className="relative">
              <span
                className={`absolute -left-[34px] md:-left-[42px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 ${
                  s.status === "done"
                    ? "border-[#1E6FFF]"
                    : s.status === "active"
                      ? "border-[#FF6B1A]"
                      : "border-[#0A1730]/20"
                }`}
                aria-hidden="true"
              >
                <Icon className={`h-3.5 w-3.5 ${colorFor(s.status)} ${s.status === "active" ? "animate-spin" : ""}`} />
              </span>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className={`text-[10px] font-bold uppercase tracking-[0.18em] ${colorFor(s.status)}`}>
                  {labelFor(s.status)}
                </span>
                <span className="text-xs text-[#0A1730]/60">{s.date}</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-[#0A1730] mt-1">{s.label}</h3>
              <p className="text-sm md:text-base text-[#0A1730]/70 mt-1 leading-relaxed">{s.body}</p>
            </li>
          );
        })}
      </ol>
    </div>
  </section>
);

export default LaunchRoadmap;