import { Search, Star, MapPinned, LayoutDashboard, Smartphone, Filter } from "lucide-react";

const features = [
  { icon: Search, title: "Smart search", body: "Find any Kerala business by name, service, or location." },
  { icon: Filter, title: "Category filters", body: "Narrow by city, service type, ratings and open-now status." },
  { icon: Star, title: "Verified reviews", body: "Real customer feedback tied to real WhatsApp conversations." },
  { icon: MapPinned, title: "Maps & directions", body: "Tap-to-navigate from the listing straight into Google Maps." },
  { icon: LayoutDashboard, title: "Business dashboard", body: "Edit your profile, track views, respond to enquiries." },
  { icon: Smartphone, title: "Mobile app", body: "Native Android app for customers and business owners." },
];

const FutureFeatures = () => (
  <section className="py-16 md:py-24 bg-background">
    <div className="container mx-auto px-4 md:px-6">
      <div className="max-w-2xl mb-10 md:mb-14">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF6B1A] mb-3">Coming after launch</p>
        <h2 className="text-2xl md:text-4xl font-extrabold text-foreground leading-tight">
          What you get access to as we roll out KDial.
        </h2>
        <p className="mt-3 text-muted-foreground">
          Founder members get every module as it ships, at no extra cost during the first year.
        </p>
      </div>
      <div className="grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <article
            key={f.title}
            className="rounded-2xl border border-border bg-card p-6 hover:border-[#1E6FFF]/40 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-lg bg-[#FF6B1A]/10 flex items-center justify-center">
                <f.icon className="h-4 w-4 text-[#FF6B1A]" aria-hidden="true" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Coming soon
              </span>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default FutureFeatures;