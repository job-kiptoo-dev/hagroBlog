import Header from '@/components/header';
import Footer from '@/components/footer';
import FeaturedArticles from '@/components/featured-articles';
import NewsletterSignup from '@/components/newsletter-signup';

export const metadata = {
  title: 'Africa On Go Blog - News, Business & Culture from Africa',
  description: 'Quality journalism covering African news, business, technology, sports, entertainment, agriculture, and human interest stories.',
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/50 to-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
                Quality Journalism from Africa
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                Understanding our complicated world, so that we can all help shape it. Your source for African news, business, technology, and culture.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Articles Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
              Latest Stories
            </h2>
            <p className="text-muted-foreground">
              Discover the most recent articles from our journalists across Africa
            </p>
          </div>
          <FeaturedArticles />
        </section>

        {/* Newsletter CTA Section */}
        <section className="bg-secondary/20 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="md:flex-1">
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Stay Updated with Africa On Go
                </h3>
                <p className="text-muted-foreground">
                  Get the latest African stories, news, and insights delivered straight to your inbox. No spam, just quality journalism.
                </p>
              </div>
              <div className="w-full md:w-auto md:flex-shrink-0 md:min-w-80">
                <NewsletterSignup />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
