'use client';

import { useRouter } from 'next/navigation';
import ArticleForm from '@/components/article-form';

export default function NewArticle() {
  const router = useRouter();

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-foreground mb-6">Create New Article</h1>
      <ArticleForm onSuccess={() => router.push('/admin')} />
    </div>
  );
}
