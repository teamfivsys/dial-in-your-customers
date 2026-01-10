import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import SEO from '@/components/seo/SEO';
import StructuredData from '@/components/seo/StructuredData';
import { Button } from '@/components/ui/button';
import { getBlogPostBySlug, getRecentPosts } from '@/data/blogPosts';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const relatedPosts = getRecentPosts(3).filter(p => p.slug !== post.slug);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Organization",
      "name": post.author,
      "url": "https://kdial.in"
    },
    "publisher": {
      "@type": "Organization",
      "name": "KDIAL",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kdial.in/kdial-logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://kdial.in/blog/${post.slug}`
    },
    "keywords": post.keywords.join(', '),
    "articleSection": post.category,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".article-content h1", ".article-content h2", ".article-content p:first-of-type"]
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
        "name": "Blog",
        "item": "https://kdial.in/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://kdial.in/blog/${post.slug}`
      }
    ]
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={post.title}
        description={post.excerpt}
        keywords={post.keywords.join(', ')}
        canonicalUrl={`https://kdial.in/blog/${post.slug}`}
        ogType="article"
      />
      <StructuredData data={[articleSchema, breadcrumbSchema]} />
      
      <Header />
      
      <main>
        {/* Article Header */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              {/* Breadcrumb */}
              <nav className="mb-6">
                <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                  <li><Link to="/" className="hover:text-primary">Home</Link></li>
                  <li>/</li>
                  <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
                  <li>/</li>
                  <li className="text-foreground font-medium truncate max-w-[200px]">{post.title}</li>
                </ol>
              </nav>

              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>

              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                  {post.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                {post.title}
              </h1>

              <p className="text-xl text-muted-foreground mb-6">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-3xl mx-auto"
            >
              <article className="article-content prose prose-lg max-w-none">
                {/* Convert markdown-like content to HTML */}
                {post.content.split('\n').map((line, index) => {
                  const trimmedLine = line.trim();
                  
                  if (trimmedLine.startsWith('# ')) {
                    return (
                      <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-foreground">
                        {trimmedLine.replace('# ', '')}
                      </h1>
                    );
                  }
                  if (trimmedLine.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-foreground">
                        {trimmedLine.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (trimmedLine.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-foreground">
                        {trimmedLine.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (trimmedLine.startsWith('- ')) {
                    return (
                      <li key={index} className="ml-4 text-muted-foreground">
                        {trimmedLine.replace('- ', '')}
                      </li>
                    );
                  }
                  if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
                    return (
                      <p key={index} className="font-semibold my-4 text-foreground">
                        {trimmedLine.replace(/\*\*/g, '')}
                      </p>
                    );
                  }
                  if (trimmedLine.startsWith('|')) {
                    // Skip table rows for now (would need proper table rendering)
                    return null;
                  }
                  if (trimmedLine === '') {
                    return null;
                  }
                  
                  // Handle inline bold text
                  const processedLine = trimmedLine.replace(
                    /\*\*(.*?)\*\*/g,
                    '<strong>$1</strong>'
                  );
                  
                  return (
                    <p
                      key={index}
                      className="my-4 text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: processedLine }}
                    />
                  );
                })}
              </article>

              {/* Tags */}
              <div className="mt-12 pt-6 border-t">
                <h3 className="text-sm font-medium mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
                <div className="grid gap-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.slug}
                      to={`/blog/${relatedPost.slug}`}
                      className="flex gap-4 p-4 bg-card border rounded-lg hover:border-primary hover:shadow-md transition-all group"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-12 bg-gradient-to-r from-primary to-secondary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to List Your Business on KDIAL?
            </h2>
            <p className="text-white/90 mb-6">
              Pre-book your listing at just ₹999/year
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-white text-primary hover:bg-white/90 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
