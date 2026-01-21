// 'use client';
//
// import { useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// // import { createBrowserClient } from '@supabase/ssr';
// import Header from '@/components/header';
// import Footer from '@/components/footer';
// import { ArrowLeft } from 'lucide-react';
// import { createClient } from '@/utils/supabase/client';
//
// interface Article {
//   id: number;
//   title: string;
//   slug: string;
//   content: string;
//   excerpt: string;
//   featured_image_url: string;
//   category_id: number;
//   author: string;
//   published_at: string;
// }
//
// interface Params {
//   slug: string;
// }
//
// export default function ArticlePage({ params }: { params: Params }) {
//   const [article, setArticle] = useState<Article | null>(null);
//   const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
//   const [loading, setLoading] = useState(true);
//
//   useEffect(() => {
//     const fetchArticle = async () => {
//       try {
//
//         const supabase = createClient()
//
//         // Fetch the article
//         const { data: articleData } = await supabase.from('articles')
//           .select('*')
//           .eq('slug', params.slug)
//           .eq('status', 'published')
//           .single();
// console.log("slug Article",articleData)
//         if (articleData) {
//           setArticle(articleData);
//
//           // Fetch related articles from same category
//           const { data: relatedData } = await supabase
//             .from('articles')
//             .select('*')
//             .eq('category_id', articleData.category_id)
//             .eq('status', 'published')
//             .neq('id', articleData.id)
//             .order('published_at', { ascending: false })
//             .limit(3);
//
//           setRelatedArticles(relatedData || []);
//         }
//       } catch (error) {
//         console.error('Error fetching article:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//
//     fetchArticle();
//   }, [params.slug]);
//
//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <Header />
//         <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="space-y-4">
//             <div className="h-8 bg-muted animate-pulse rounded w-1/2" />
//             <div className="h-96 bg-muted animate-pulse rounded" />
//             <div className="h-4 bg-muted animate-pulse rounded" />
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }
//
//   if (!article) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <Header />
//         <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="text-center">
//             <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
//               Article Not Found
//             </h1>
//             <p className="text-muted-foreground mb-6">
//               The article you're looking for doesn't exist or has been removed.
//             </p>
//             <Link href="/" className="text-primary hover:underline inline-flex items-center gap-2">
//               <ArrowLeft size={18} />
//               Back to Homepage
//             </Link>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }
//
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
//       <main className="flex-1">
//         <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           {/* Back link */}
//           <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
//             <ArrowLeft size={18} />
//             Back to Homepage
//           </Link>
//
//           {/* Article header */}
//           <header className="mb-8">
//             <p className="text-sm font-medium text-primary uppercase mb-3">
//               {article.author}
//             </p>
//             <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
//               {article.title}
//             </h1>
//             <p className="text-lg text-muted-foreground mb-4">
//               {article.excerpt}
//             </p>
//             <time className="text-sm text-muted-foreground">
//               {new Date(article.published_at).toLocaleDateString('en-US', {
//                 month: 'long',
//                 day: 'numeric',
//                 year: 'numeric',
//               })}
//             </time>
//           </header>
//
//           {/* Featured image */}
//           {article.featured_image_url && (
//             <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden mb-12 bg-muted">
//               <Image
//                 src={article.featured_image_url || "/placeholder.svg"}
//                 alt={article.title}
//                 fill
//                 className="object-cover"
//                 priority
//               />
//             </div>
//           )}
//
//           {/* Article content */}
//           <div className="prose prose-invert max-w-none mb-12">
//             <div
//               className="font-serif text-lg leading-relaxed text-foreground space-y-6"
//               dangerouslySetInnerHTML={{
//                 __html: article.content.replace(/\n/g, '<br />'),
//               }}
//             />
//           </div>
//
//           {/* Related articles */}
//           {relatedArticles.length > 0 && (
//             <section className="border-t border-border pt-12">
//               <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
//                 Related Articles
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {relatedArticles.map((relatedArticle) => (
//                   <Link
//                     key={relatedArticle.id}
//                     href={`/articles/${relatedArticle.slug}`}
//                     className="group overflow-hidden rounded-lg border border-border hover:border-primary transition-colors"
//                   >
//                     <div className="relative h-40 bg-muted overflow-hidden">
//                       {relatedArticle.featured_image_url ? (
//                         <Image
//                           src={relatedArticle.featured_image_url || "/placeholder.svg"}
//                           alt={relatedArticle.title}
//                           fill
//                           className="object-cover group-hover:scale-105 transition-transform"
//                         />
//                       ) : (
//                         <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10" />
//                       )}
//                     </div>
//                     <div className="p-4">
//                       <p className="text-xs font-medium text-primary uppercase mb-2">
//                         {relatedArticle.author}
//                       </p>
//                       <h3 className="font-serif font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
//                         {relatedArticle.title}
//                       </h3>
//                       <p className="text-xs text-muted-foreground">
//                         {new Date(relatedArticle.published_at).toLocaleDateString('en-US', {
//                           month: 'short',
//                           day: 'numeric',
//                           year: 'numeric',
//                         })}
//                       </p>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             </section>
//           )}
//         </article>
//       </main>
//       <Footer />
//     </div>
//   );
// }
//
// 'use client';
//
// import { useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import Header from '@/components/header';
// import Footer from '@/components/footer';
// import { ArrowLeft } from 'lucide-react';
// import { createClient } from '@/utils/supabase/client';
//
// interface Article {
//   id: number;
//   title: string;
//   slug: string;
//   content: string;
//   excerpt: string;
//   featured_image_url: string;
//   category_id: number;
//   author: string;
//   published_at: string;
// }
//
// interface Params {
//   slug: string;
// }
//
// export default function ArticlePage({ params }: { params: Params }) {
//   const [article, setArticle] = useState<Article | null>(null);
//   const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//
//   useEffect(() => {
//     const fetchArticle = async () => {
//       try {
//         const supabase = createClient();
//
//         console.log('🔍 Fetching article with slug:', params.slug);
//
//         // Fetch the article
//         const { data: articleData, error: articleError } = await supabase
//           .from('articles')
//           .select('*')
//           .eq('slug', params.slug)
//           .eq('status', 'published')
//           .single();
//
//         console.log('📊 Article data:', articleData);
//         console.log('❌ Article error:', articleError);
//
//         if (articleError) {
//           console.error('Error fetching article:', articleError);
//           setError(articleError.message);
//           setLoading(false);
//           return;
//         }
//
//         if (articleData) {
//           setArticle(articleData);
//
//           // Fetch related articles from same category
//           const { data: relatedData, error: relatedError } = await supabase
//             .from('articles')
//             .select('*')
//             .eq('category_id', articleData.category_id)
//             .eq('status', 'published')
//             .neq('id', articleData.id)
//             .order('published_at', { ascending: false })
//             .limit(3);
//
//           if (relatedError) {
//             console.error('Error fetching related articles:', relatedError);
//           } else {
//             console.log('📚 Related articles:', relatedData);
//             setRelatedArticles(relatedData || []);
//           }
//         }
//       } catch (error) {
//         console.error('💥 Exception fetching article:', error);
//         setError('Failed to load article');
//       } finally {
//         setLoading(false);
//       }
//     };
//
//     fetchArticle();
//   }, [params.slug]);
//
//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <Header />
//         <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="space-y-4">
//             <div className="h-8 bg-muted animate-pulse rounded w-1/2" />
//             <div className="h-96 bg-muted animate-pulse rounded" />
//             <div className="h-4 bg-muted animate-pulse rounded" />
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }
//
//   if (error || !article) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <Header />
//         <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="text-center">
//             <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
//               Article Not Found
//             </h1>
//             <p className="text-muted-foreground mb-6">
//               {error || "The article you're looking for doesn't exist or has been removed."}
//             </p>
//             <Link href="/" className="text-primary hover:underline inline-flex items-center gap-2">
//               <ArrowLeft size={18} />
//               Back to Homepage
//             </Link>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }
//
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
//       <main className="flex-1">
//         <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           {/* Back link */}
//           <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
//             <ArrowLeft size={18} />
//             Back to Homepage
//           </Link>
//
//           {/* Article header */}
//           <header className="mb-8">
//             <p className="text-sm font-medium text-primary uppercase mb-3">
//               {article.author}
//             </p>
//             <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
//               {article.title}
//             </h1>
//             <p className="text-lg text-muted-foreground mb-4">
//               {article.excerpt}
//             </p>
//             <time className="text-sm text-muted-foreground">
//               {new Date(article.published_at).toLocaleDateString('en-US', {
//                 month: 'long',
//                 day: 'numeric',
//                 year: 'numeric',
//               })}
//             </time>
//           </header>
//
//           {/* Featured image */}
//           {article.featured_image_url && (
//             <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden mb-12 bg-muted">
//               <Image
//                 src={article.featured_image_url || "/placeholder.svg"}
//                 alt={article.title}
//                 fill
//                 className="object-cover"
//                 priority
//               />
//             </div>
//           )}
//
//           {/* Article content */}
//           <div className="prose prose-invert max-w-none mb-12">
//             <div
//               className="font-serif text-lg leading-relaxed text-foreground space-y-6"
//               dangerouslySetInnerHTML={{
//                 __html: article.content.replace(/\n/g, '<br />'),
//               }}
//             />
//           </div>
//
//           {/* Related articles */}
//           {relatedArticles.length > 0 && (
//             <section className="border-t border-border pt-12">
//               <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
//                 Related Articles
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {relatedArticles.map((relatedArticle) => (
//                   <Link
//                     key={relatedArticle.id}
//                     href={`/articles/${relatedArticle.slug}`}
//                     className="group overflow-hidden rounded-lg border border-border hover:border-primary transition-colors"
//                   >
//                     <div className="relative h-40 bg-muted overflow-hidden">
//                       {relatedArticle.featured_image_url ? (
//                         <Image
//                           src={relatedArticle.featured_image_url || "/placeholder.svg"}
//                           alt={relatedArticle.title}
//                           fill
//                           className="object-cover group-hover:scale-105 transition-transform"
//                         />
//                       ) : (
//                         <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10" />
//                       )}
//                     </div>
//                     <div className="p-4">
//                       <p className="text-xs font-medium text-primary uppercase mb-2">
//                         {relatedArticle.author}
//                       </p>
//                       <h3 className="font-serif font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
//                         {relatedArticle.title}
//                       </h3>
//                       <p className="text-xs text-muted-foreground">
//                         {new Date(relatedArticle.published_at).toLocaleDateString('en-US', {
//                           month: 'short',
//                           day: 'numeric',
//                           year: 'numeric',
//                         })}
//                       </p>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             </section>
//           )}
//         </article>
//       </main>
//       <Footer />
//     </div>
//   );
// }
//


'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image_url: string;
  category_id: number;
  author: string;
  published_at: string;
}

export default function ArticlePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> // ✅ Params is a Promise
}) {
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string>(''); // ✅ Store unwrapped slug

  // ✅ Unwrap params Promise first
  useEffect(() => {
    params.then((resolvedParams) => {
      setSlug(resolvedParams.slug);
    });
  }, [params]);

  // ✅ Fetch article when slug is available
  useEffect(() => {
    if (!slug) return; // Wait for slug

    const fetchArticle = async () => {
      try {
        const supabase = createClient();

        console.log('🔍 Fetching article with slug:', slug);

        // Fetch the article
        const { data: articleData, error: articleError } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', slug) // ✅ Use unwrapped slug
          .eq('status', 'published')
          .single();

        console.log('📊 Article data:', articleData);

        if (articleError) {
          console.error('Error fetching article:', articleError);
          setError(articleError.message);
          setLoading(false);
          return;
        }

        if (articleData) {
          setArticle(articleData);

          // Fetch related articles from same category
          const { data: relatedData, error: relatedError } = await supabase
            .from('articles')
            .select('*')
            .eq('category_id', articleData.category_id)
            .eq('status', 'published')
            .neq('id', articleData.id)
            .order('published_at', { ascending: false })
            .limit(3);

          if (relatedError) {
            console.error('Error fetching related articles:', relatedError);
          } else {
            setRelatedArticles(relatedData || []);
          }
        }
      } catch (error) {
        console.error('💥 Exception fetching article:', error);
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]); // ✅ Depend on slug, not params.slug

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-4">
            <div className="h-8 bg-muted animate-pulse rounded w-1/2" />
            <div className="h-96 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
              Article Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              {error || "The article you're looking for doesn't exist or has been removed."}
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
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
            <ArrowLeft size={18} />
            Back to Homepage
          </Link>

          <header className="mb-8">
            <p className="text-sm font-medium text-primary uppercase mb-3">
              {article.author}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              {article.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              {article.excerpt}
            </p>
            <time className="text-sm text-muted-foreground">
              {new Date(article.published_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </header>

          {article.featured_image_url && (
            <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden mb-12 bg-muted">
              <Image
                src={article.featured_image_url || "/placeholder.svg"}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="prose prose-invert max-w-none mb-12">
            <div
              className="font-serif text-lg leading-relaxed text-foreground space-y-6"
              dangerouslySetInnerHTML={{
                __html: article.content.replace(/\n/g, '<br />'),
              }}
            />
          </div>

          {relatedArticles.length > 0 && (
            <section className="border-t border-border pt-12">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Link
                    key={relatedArticle.id}
                    href={`/articles/${relatedArticle.slug}`}
                    className="group overflow-hidden rounded-lg border border-border hover:border-primary transition-colors"
                  >
                    <div className="relative h-40 bg-muted overflow-hidden">
                      {relatedArticle.featured_image_url ? (
                        <Image
                          src={relatedArticle.featured_image_url || "/placeholder.svg"}
                          alt={relatedArticle.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10" />
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-medium text-primary uppercase mb-2">
                        {relatedArticle.author}
                      </p>
                      <h3 className="font-serif font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(relatedArticle.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
