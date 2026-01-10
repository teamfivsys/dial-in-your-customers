import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Building, Users, ArrowRight, CheckCircle } from 'lucide-react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import SEO from '@/components/seo/SEO';
import StructuredData from '@/components/seo/StructuredData';
import { Button } from '@/components/ui/button';
import { getCityBySlug, keralaCities } from '@/data/cities';
import { businessCategories } from '@/data/categories';

const CityPage = () => {
  const { city } = useParams<{ city: string }>();
  const cityData = city ? getCityBySlug(city) : undefined;

  // If city not found, redirect to 404
  if (!cityData) {
    return <Navigate to="/404" replace />;
  }

  const whatsappMessage = encodeURIComponent(
    `Hi, I want to pre-book my business listing on KDIAL for ${cityData.name}. Please share the details.`
  );
  const whatsappLink = `https://wa.me/919876543210?text=${whatsappMessage}`;

  // Local Business Schema for this city
  const citySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Business Directory in ${cityData.name} - KDIAL`,
    "description": `Find verified local businesses in ${cityData.name}, Kerala. Doctors, restaurants, lawyers, home services and more. Kerala's premium business directory.`,
    "url": `https://kdial.in/${cityData.slug}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "KDIAL",
      "url": "https://kdial.in"
    },
    "about": {
      "@type": "City",
      "name": cityData.name,
      "alternateName": cityData.malayalam,
      "containedInPlace": {
        "@type": "State",
        "name": "Kerala"
      }
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".city-hero", ".city-description"]
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://kdial.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": cityData.name,
        "item": `https://kdial.in/${cityData.slug}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`Business Directory in ${cityData.name} - Find Local Businesses | KDIAL`}
        description={`Find verified businesses in ${cityData.name}, Kerala. Search for doctors, restaurants, lawyers, home services and more. ${cityData.name}'s premium business directory with direct contact.`}
        keywords={`${cityData.name} business directory, ${cityData.name} local businesses, businesses in ${cityData.name}, ${cityData.name} service providers, ${cityData.district} business listing, Kerala business directory ${cityData.name}`}
        canonicalUrl={`https://kdial.in/${cityData.slug}`}
      />
      <StructuredData data={[citySchema, breadcrumbSchema]} />
      
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="city-hero relative py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              {/* Breadcrumb */}
              <nav className="mb-6">
                <ol className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <li><Link to="/" className="hover:text-primary">Home</Link></li>
                  <li>/</li>
                  <li className="text-foreground font-medium">{cityData.name}</li>
                </ol>
              </nav>

              <div className="flex items-center justify-center gap-2 mb-4">
                <MapPin className="h-6 w-6 text-primary" />
                <span className="text-lg text-muted-foreground">{cityData.district} District</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Business Directory in <span className="text-primary">{cityData.name}</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-2">
                {cityData.malayalam}
              </p>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Find verified local businesses in {cityData.name}. From doctors to restaurants, 
                lawyers to home services – discover trusted {cityData.name} businesses on KDIAL.
              </p>

              {/* City Highlights */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {cityData.highlights.map((highlight, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {highlight}
                  </span>
                ))}
              </div>

              <Button
                size="lg"
                className="bg-[#25D366] hover:bg-[#22c55e] text-white font-semibold px-8 py-6 text-lg"
                onClick={() => window.open(whatsappLink, '_blank')}
              >
                <Phone className="mr-2 h-5 w-5" />
                List Your {cityData.name} Business
              </Button>
            </motion.div>
          </div>
        </section>

        {/* City Description */}
        <section className="city-description py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  About {cityData.name} Business Community
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {cityData.description}
                </p>

                {cityData.population && (
                  <div className="flex items-center gap-4 mb-8 p-4 bg-muted/50 rounded-lg">
                    <Users className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Population</p>
                      <p className="text-xl font-semibold">{cityData.population}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Categories in this City */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Find Businesses in {cityData.name}
              </h2>
              <p className="text-lg text-muted-foreground">
                Browse verified businesses by category in {cityData.name}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {businessCategories.slice(0, 8).map((category, index) => (
                <motion.div
                  key={category.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link
                    to={`/${cityData.slug}/${category.slug}`}
                    className="block p-4 bg-card rounded-lg border hover:border-primary hover:shadow-md transition-all text-center group"
                  >
                    <Building className="h-8 w-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <h3 className="font-medium text-sm">{category.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      in {cityData.name}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/" className="text-primary hover:underline inline-flex items-center gap-1">
                View all categories <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Why List on KDIAL */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Why {cityData.name} Businesses Choose KDIAL
                </h2>
                <p className="text-lg text-muted-foreground">
                  Join Kerala's premium business directory and reach more customers
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Verified Business Badge",
                    description: `Stand out as a verified ${cityData.name} business that customers can trust`
                  },
                  {
                    title: "Direct Customer Contact",
                    description: "Customers call or WhatsApp you directly – no middlemen, no lead fees"
                  },
                  {
                    title: "No Competitor Ads",
                    description: "Your listing page is yours alone – no competitors stealing your customers"
                  },
                  {
                    title: `${cityData.name} Local Search`,
                    description: `Appear in searches for \"${cityData.name} businesses\" and related queries`
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex gap-4 p-4 bg-card rounded-lg border"
                  >
                    <CheckCircle className="h-6 w-6 text-[#25D366] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-secondary">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Grow Your {cityData.name} Business?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Pre-book your KDIAL listing today at just ₹999/year. 
                Limited Founder Slots available!
              </p>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-lg"
                onClick={() => window.open(whatsappLink, '_blank')}
              >
                <Phone className="mr-2 h-5 w-5" />
                Pre-Book Now on WhatsApp
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Other Cities */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                Explore Other Kerala Cities
              </h2>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {keralaCities
                .filter(c => c.slug !== cityData.slug)
                .map((otherCity) => (
                  <Link
                    key={otherCity.slug}
                    to={`/${otherCity.slug}`}
                    className="px-4 py-2 bg-card border rounded-full text-sm hover:border-primary hover:text-primary transition-colors"
                  >
                    {otherCity.name}
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CityPage;
