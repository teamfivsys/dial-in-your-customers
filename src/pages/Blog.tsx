import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import SEO from '@/components/seo/SEO';
import StructuredData from '@/components/seo/StructuredData';
import { blogPosts, getFeaturedPosts, getRecentPosts } from '@/data/blogPosts';

const Blog = () => {
  const featuredPosts = getFeaturedPosts();
  const recentPosts = getRecentPosts(10);

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "KDIAL Blog - Kerala Business Tips & Marketing Strategies",
    "description": "Expert tips for Kerala businesses. Learn marketing strategies, SEO, customer acquisition, and how to grow your local business.",
    "url": "https://kdial.in/blog",
    "publisher": {
      "@type": "Organization",
      "name": "KDIAL",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kdial.in/kdial-logo.png"
      }
    },
    "blogPost": blogPosts.slice(0, 5).map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.date,
      "author": {
        "@type": "Organization",
        "name": post.author
      },
      "url": `https://kdial.in/blog/${post.slug}`
    }))
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
        "name": "Blog",
        "item": "https://kdial.in/blog"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Kerala Business Tips & Marketing Strategies - KDIAL Blog"
        description="Expert tips for Kerala businesses. Learn marketing strategies, local SEO, customer acquisition, and how to grow your business in Kerala."
        keywords="Kerala business tips, Kerala marketing strategies, local business growth, Kerala SEO, business listing tips, Kerala entrepreneur guide"
        canonicalUrl="https://kdial.in/blog"
      />
      <StructuredData data={[blogSchema, breadcrumbSchema]} />
      
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              {/* Breadcrumb */}
              <nav className="mb-6">
                <ol className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <li><Link to="/" className="hover:text-primary">Home</Link></li>
                  <li>/</li>
                  <li className="text-foreground font-medium">Blog</li>
                </ol>
              </nav>

              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                KDIAL <span className="text-primary">Blog</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Expert tips and strategies to grow your Kerala business. 
                Marketing insights, SEO guides, and success stories.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <h2 className="text-2xl md:text-3xl font-bold">Featured Articles</h2>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                {featuredPosts.map((post, index) => (
                  <motion.article
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      to={`/blog/${post.slug}`}
                      className="block p-6 bg-card border rounded-xl hover:border-primary hover:shadow-lg transition-all group"
                    >
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-4">
                        Featured
                      </span>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.date).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readTime}
                          </span>
                        </div>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold">All Articles</h2>
            </motion.div>

            <div className="grid gap-6 max-w-4xl">
              {recentPosts.map((post, index) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="flex flex-col md:flex-row gap-4 p-4 bg-card border rounded-lg hover:border-primary hover:shadow-md transition-all group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded">
                          {post.category}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                </motion.article>
              ))}
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
                Ready to Grow Your Kerala Business?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Pre-book your KDIAL listing today and reach more customers.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Learn About KDIAL
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
