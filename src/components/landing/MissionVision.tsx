import WhatsAppCTA from "./WhatsAppCTA";

const MissionVision = () => (
  <section className="py-16 md:py-24 bg-background">
    <div className="container mx-auto px-4 md:px-6 max-w-4xl">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF6B1A] mb-3">Mission & vision</p>
      <h2 className="text-2xl md:text-4xl font-extrabold text-foreground leading-tight mb-8">
        We're building the directory Kerala deserves.
      </h2>

      <p
        className="text-lg md:text-xl italic text-muted-foreground leading-relaxed border-l-2 border-[#FF6B1A] pl-5 md:pl-6 mb-10"
        style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
      >
        &ldquo;Every Kerala business owner I spoke to said the same thing: they're tired of paying
        for leads that end up in a competitor's WhatsApp too. KDial exists to fix that — one
        verified, paid-only listing at a time.&rdquo;
        <span className="not-italic block mt-3 text-sm text-foreground/70" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          — KDial founders
        </span>
      </p>

      <div className="grid gap-6 md:grid-cols-2 mb-10">
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1E6FFF] mb-3">Our mission</p>
          <p className="text-base md:text-lg text-foreground leading-relaxed">
            Give every Kerala business a fair, honest way to be found online — without middlemen,
            lead reselling, or spam.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF6B1A] mb-3">Our vision</p>
          <p className="text-base md:text-lg text-foreground leading-relaxed">
            To become Kerala's most trusted directory — the first place a customer looks, and the
            first platform a business joins.
          </p>
        </div>
      </div>

      <WhatsAppCTA ariaLabel="Register your business on WhatsApp">
        Register your business — ₹501 →
      </WhatsAppCTA>
    </div>
  </section>
);

export default MissionVision;