import { motion } from "framer-motion";

const AEOContent = () => {
  return (
    <section className="py-12 md:py-16 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              What is KDial Business Directory?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              KDial is Kerala's first premium-only business directory where customers contact businesses directly without any middlemen or commission fees. Unlike traditional directories like JustDial, KDial only lists verified, paid businesses ensuring quality and eliminating spam. Businesses get a professional digital profile, analytics dashboard, and direct customer connections through phone and WhatsApp.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Which Cities in Kerala Does KDial Serve?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4">
              KDial serves all 14 districts of Kerala including major cities and towns:
            </p>
            <ul className="grid md:grid-cols-2 gap-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>Ernakulam & Kochi</strong> - Commercial capital</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>Thiruvananthapuram (Trivandrum)</strong> - State capital</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>Kozhikode (Calicut)</strong> - Northern hub</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>Thrissur</strong> - Cultural capital</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>Kollam</strong> - Business center</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>Kannur</strong> - Malabar region</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>Palakkad</strong> - Gateway of Kerala</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>Malappuram, Alappuzha, Kottayam</strong> & more</span>
              </li>
            </ul>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              How Much Does KDial Business Listing Cost?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              The standard price for KDial business listing is ₹2,999 per year. However, during the pre-launch period, Kerala businesses can register for just <strong className="text-primary">₹501 per year</strong> - a limited-time offer for the first 100 businesses only. This one-time annual fee includes premium digital profile, analytics dashboard, verified badge, and direct customer connections with zero commission fees.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Who Should Register on KDial?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Any legitimate business in Kerala can benefit from KDial. This includes restaurants, salons, clinics, doctors, lawyers, coaching centers, repair services, consultants, shops, home services, real estate agents, and all types of service providers. If you want genuine customers who contact you directly without paying commission on every lead, KDial is perfect for your Kerala business.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Best Business Directory in Kerala for Local Businesses
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              KDial stands out as the best business directory in Kerala because it prioritizes direct business-customer relationships. Unlike platforms that sell leads to multiple competitors or charge commission on transactions, KDial ensures your listing is premium, verified, and gives you complete control over customer interactions. With detailed analytics and no spam, Kerala businesses finally have a trustworthy alternative to traditional directories.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AEOContent;
