'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url: string;
  author: string;
  published_at: string;
}

export default function CategoryPage({ 
  params 
}: { 
  params: Promise<{ slug: string }>
}) {
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string>(''); 

  useEffect(() => {
    params.then((resolvedParams) => {
      setSlug(resolvedParams.slug);
    });
  }, [params]);

  useEffect(() => {
    if (!slug) return; // Wait for slug to be set

    const fetchCategoryAndArticles = async () => {
      try {
        const supabase = createClient();
        
        // Fetch category
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug) 
          .single();

        if (categoryError) {
          console.error('Error fetching category:', categoryError);
          setError(categoryError.message);
          setLoading(false);
          return;
        }

        if (categoryData) {
          setCategory(categoryData);

          // Fetch articles in this category
          const { data: articlesData, error: articlesError } = await supabase
            .from('articles')
            .select('*')
            .eq('category_id', categoryData.id)
            .eq('status', 'published')
            .order('published_at', { ascending: false });

          if (articlesError) {
            console.error('Error fetching articles:', articlesError);
          }

          setArticles(articlesData || []);
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        setError('Failed to load category');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndArticles();
  }, [slug]);  

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-4">
            <div className="h-10 bg-muted animate-pulse rounded w-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
              Category Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              {error || "The category you're looking for doesn't exist."}
            </p>
            <Link href="/" className="text-primary hover:underline inline-flex items-center gap-2">
              <ArrowLeft size={18} />
              Back to Homepage
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Category header */}
        <section className="bg-muted/50 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
              <ArrowLeft size={18} />
              Back to Homepage
            </Link>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-lg text-muted-foreground max-w-2xl">
                {category.description}
              </p>
            )}
          </div>
        </section>

        {/* Articles grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {articles.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-6">
                Showing {articles.length} article{articles.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="group overflow-hidden rounded-lg border border-border hover:border-primary transition-colors"
                  >
                    <div className="relative h-48 bg-muted overflow-hidden">
                      {article.featured_image_url ? (
                        <Image
                          src={article.featured_image_url || "/placeholder.svg"}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10" />
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-medium text-primary uppercase mb-2">
                        {article.author}
                      </p>
                      <h3 className="font-serif text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {article.excerpt}
                      </p>
                      <p className="text-xs text-muted-foreground mt-3">
                        {new Date(article.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No articles found in this category yet.
              </p>
              <Link href="/" className="text-primary hover:underline">
                Back to homepage
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
