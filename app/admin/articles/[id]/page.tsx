'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import ArticleForm from '@/components/article-form';

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
  const router = useRouter();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data } = await supabase
          .from('articles')
          .select('*')
          .eq('id', params.id)
          .single();

        if (data) {
          setArticle(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.id]);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!article) {
    return <div className="text-center py-12 text-destructive">Article not found</div>;
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-foreground mb-6">Edit Article</h1>
      <ArticleForm
        initialData={article}
        onSuccess={() => router.push('/admin')}
      />
    </div>
  );
}
