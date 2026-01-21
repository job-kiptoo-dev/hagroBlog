'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ArticleForm from '@/components/article-form';
import { createClient } from '@/utils/supabase/client';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  category_id: number;
  author: string;
  status: string;
}

interface Params {
  id: string;
}

export default function EditArticle({ params }: { params: Params }) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const router = useRouter();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const supabase = createClient();

        
        const { data, error } = await supabase 
          .from('articles')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) { 
          console.error('Error fetching article:', error);
          setError(error.message);
          return;
        }

        if (data) {
          setArticle(data);
        }
      } catch (err) { 
        console.error('Exception fetching article:', err);
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.id]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">Loading article...</div>
      </div>
    );
  }

  if (error) { 
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <button 
          onClick={() => router.push('/admin')}
          className="text-primary hover:underline"
        >
          Back to Admin
        </button>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">Article not found</p>
        <button 
          onClick={() => router.push('/admin')}
          className="text-primary hover:underline"
        >
          Back to Admin
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-foreground mb-6">
        Edit Article
      </h1>
      <ArticleForm
        initialData={article}
        onSuccess={() => router.push('/admin')}
      />
    </div>
  );
}
