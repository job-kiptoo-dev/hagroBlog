'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createBrowserClient } from '@supabase/ssr';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SearchBar from '@/components/search-bar';
import Loading from './loading';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url: string;
  author: string;
  published_at: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data } = await supabase
          .from('articles')
          .select('*')
          .eq('status', 'published')
          .or(
            `title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`
          )
          .order('published_at', { ascending: false });

        setResults(data || []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      performSearch();
    }
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Search Results
            </h1>
            <div className="max-w-md">
              <SearchBar />
            </div>
          </div>

          {loading ? (
            <Loading />
          ) : results.length > 0 ? (
            <div className="space-y-6">
              <p className="text-muted-foreground">
                Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
              </p>
              {results.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="block border border-border rounded-lg overflow-hidden hover:border-primary transition-colors group"
                >
                  <div className="flex gap-4 p-4">
                    {article.featured_image_url && (
                      <div className="relative w-32 h-32 flex-shrink-0">
                        <Image
                          src={article.featured_image_url || "/placeholder.svg"}
                          alt={article.title}
                          fill
                          className="object-cover rounded group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-xs font-medium text-primary uppercase mb-2">
                        {article.author}
                      </p>
                      <h3 className="font-serif text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {article.excerpt}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(article.published_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No articles found for "{query}"
              </p>
              <Link href="/" className="text-primary hover:underline">
                Back to homepage
              </Link>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Enter a search query to get started</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
