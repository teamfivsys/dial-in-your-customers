import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Building, CheckCircle, ArrowRight } from 'lucide-react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import SEO from '@/components/seo/SEO';
import StructuredData from '@/components/seo/StructuredData';
import { Button } from '@/components/ui/button';
import { getCityBySlug, keralaCities } from '@/data/cities';
import { getCategoryBySlug, businessCategories } from '@/data/categories';

const CategoryPage = () => {
  const { city, category } = useParams<{ city: string; category: string }>();
  
  // Handle both /:city/:category and /kerala/:category
  const isStatewide = city?.toLowerCase() === 'kerala';
  const cityData = !isStatewide && city ? getCityBySlug(city) : null;
  const categoryData = category ? getCategoryBySlug(category) : undefined;

  // If category not found, redirect to 404
  if (!categoryData) {
    return <Navigate to="/404" replace />;
  }

  // If city provided but not found (and not "kerala"), redirect to 404
  if (city && !isStatewide && !cityData) {
    return <Navigate to="/404" replace />;
  }

  const locationName = isStatewide ? 'Kerala' : cityData?.name || 'Kerala';
  const locationSlug = isStatewide ? 'kerala' : cityData?.slug || 'kerala';

  const whatsappMessage = encodeURIComponent(
    `Hi, I want to pre-book my ${categoryData.name} business listing on KDIAL${!isStatewide ? ` for ${locationName}` : ''}. Please share the details.`
  );
  const whatsappLink = `https://wa.me/919876543210?text=${whatsappMessage}`;

  // Category Page Schema
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Best ${categoryData.name} in ${locationName} - KDIAL`,
    "description": `Find verified ${categoryData.name.toLowerCase()} in ${locationName}. ${categoryData.description}`,
    "url": `https://kdial.in/${locationSlug}/${categoryData.slug}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "KDIAL",
      "url": "https://kdial.in"
    },
    "about": {
      "@type": "Service",
      "name": categoryData.name,
      "areaServed": isStatewide ? {
        "@type": "State",
        "name": "Kerala"
      } : {
        "@type": "City",
        "name": locationName
      }
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".category-hero", ".category-description"]
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
      ...(cityData ? [{
        "@type": "ListItem",
        "position": 2,
        "name": cityData.name,
        "item": `https://kdial.in/${cityData.slug}`
      }] : []),
      {
        "@type": "ListItem",
        "position": cityData ? 3 : 2,
        "name": categoryData.name,
        "item": `https://kdial.in/${locationSlug}/${categoryData.slug}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`Best ${categoryData.name} in ${locationName} - Find Verified Businesses | KDIAL`}
        description={`Find the best ${categoryData.name.toLowerCase()} in ${locationName}, Kerala. ${categoryData.description} Verified listings with direct contact.`}
        keywords={`${categoryData.name.toLowerCase()} in ${locationName}, best ${categoryData.name.toLowerCase()} ${locationName}, ${locationName} ${categoryData.slug}, ${categoryData.keywords.join(', ')}`}
        canonicalUrl={`https://kdial.in/${locationSlug}/${categoryData.slug}`}
      />
      <StructuredData data={[categorySchema, breadcrumbSchema]} />
      
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="category-hero relative py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              {/* Breadcrumb */}
              <nav className="mb-6">
                <ol className="flex items-center justify-center gap-2 text-sm text-muted-foreground flex-wrap">
                  <li><Link to="/" className="hover:text-primary">Home</Link></li>
                  <li>/</li>
                  {cityData && (
                    <>
                      <li><Link to={`/${cityData.slug}`} className="hover:text-primary">{cityData.name}</Link></li>
                      <li>/</li>
                    </>
                  )}
                  <li className="text-foreground font-medium">{categoryData.name}</li>
                </ol>
              </nav>

              <div className="flex items-center justify-center gap-2 mb-4">
                <MapPin className="h-6 w-6 text-primary" />
                <span className="text-lg text-muted-foreground">{locationName}, Kerala</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Best <span className="text-primary">{categoryData.name}</span> in {locationName}
              </h1>
              
              <p className="text-lg text-muted-foreground mb-2">
                {categoryData.malayalam}
              </p>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                {categoryData.description}
              </p>

              {/* Subcategories */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {categoryData.subcategories.slice(0, 6).map((sub, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                  >
                    {sub}
                  </span>
                ))}
                {categoryData.subcategories.length > 6 && (
                  <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                    +{categoryData.subcategories.length - 6} more
                  </span>
                )}
              </div>

              <Button
                size="lg"
                className="bg-[#25D366] hover:bg-[#22c55e] text-white font-semibold px-8 py-6 text-lg"
                onClick={() => window.open(whatsappLink, '_blank')}
              >
                <Phone className="mr-2 h-5 w-5" />
                List Your {categoryData.name.split(' ')[0]} Business
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Category Description */}
        <section className="category-description py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  Find Trusted {categoryData.name} in {locationName}
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Looking for reliable {categoryData.name.toLowerCase()} in {locationName}? KDIAL is Kerala's premium 
                  business directory featuring only verified, trusted businesses. Unlike free directories 
                  filled with spam and outdated listings, every business on KDIAL is verified and committed 
                  to quality service.
                </p>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Whether you need {categoryData.subcategories.slice(0, 3).join(', ').toLowerCase()}, or other 
                  {' '}{categoryData.name.toLowerCase()} services in {locationName}, KDIAL helps you find businesses 
                  you can trust with direct contact – no middlemen, no spam calls.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Subcategories Grid */}
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
                Browse {categoryData.name} Categories
              </h2>
              <p className="text-lg text-muted-foreground">
                Find exactly what you need in {locationName}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {categoryData.subcategories.map((sub, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.03 }}
                  className="p-4 bg-card rounded-lg border hover:border-primary hover:shadow-md transition-all text-center"
                >
                  <h3 className="font-medium text-sm">{sub}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    in {locationName}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why List Your Business */}
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
                  Are You a {categoryData.name.split(' ')[0]} Business in {locationName}?
                </h2>
                <p className="text-lg text-muted-foreground">
                  List your business on KDIAL and reach more customers
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Verified Business Badge",
                    description: `Stand out as a verified ${categoryData.name.split(' ')[0].toLowerCase()} that customers can trust`
                  },
                  {
                    title: "Direct Customer Contact",
                    description: "Customers call or WhatsApp you directly – no middlemen, no lead fees"
                  },
                  {
                    title: "No Competitor Ads",
                    description: "Your listing page is yours alone – competitors can't advertise on it"
                  },
                  {
                    title: "Category Search Visibility",
                    description: `Appear when customers search for "${categoryData.name.toLowerCase()} in ${locationName}"`
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

              <div className="text-center mt-8">
                <Button
                  size="lg"
                  className="bg-[#25D366] hover:bg-[#22c55e] text-white font-semibold px-8 py-6 text-lg"
                  onClick={() => window.open(whatsappLink, '_blank')}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Pre-Book Your Listing at ₹999/year
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Other Categories */}
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
                Explore Other Categories in {locationName}
              </h2>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {businessCategories
                .filter(c => c.slug !== categoryData.slug)
                .slice(0, 8)
                .map((otherCat) => (
                  <Link
                    key={otherCat.slug}
                    to={`/${locationSlug}/${otherCat.slug}`}
                    className="px-4 py-2 bg-card border rounded-full text-sm hover:border-primary hover:text-primary transition-colors"
                  >
                    {otherCat.name}
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* Browse by City */}
        {isStatewide && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
              >
                <h2 className="text-xl md:text-2xl font-bold mb-4">
                  Find {categoryData.name} by City
                </h2>
              </motion.div>

              <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                {keralaCities.map((cityItem) => (
                  <Link
                    key={cityItem.slug}
                    to={`/${cityItem.slug}/${categoryData.slug}`}
                    className="px-4 py-2 bg-card border rounded-full text-sm hover:border-primary hover:text-primary transition-colors"
                  >
                    {categoryData.name} in {cityItem.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
