'use client';

import { useEffect, useState } from 'react';
// import { createBrowserClient } from '@supabase/ssr';
import { Trash2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface Subscriber {
  id: number;
  email: string;
  subscribed_at: string;
  active: boolean;
}

export default function Subscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
        const supabase = createClient()

      const { data } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      setSubscribers(data || []);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscriber = async (id: number) => {
    if (!confirm('Are you sure you want to remove this subscriber?')) return;

    try {
        const supabase = createClient()
      // const supabase = createBrowserClient(
      //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
      //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      // );
      //
      const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id);
      if (error) throw error;

      setSubscribers(subscribers.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      alert('Failed to delete subscriber');
    }
  };

  const toggleActive = async (id: number, active: boolean) => {
    try {
        const supabase = createClient()
      // const supabase = createBrowserClient(
      //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
      //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      // );
      //
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ active: !active })
        .eq('id', id);

      if (error) throw error;

      setSubscribers(
        subscribers.map((s) => (s.id === id ? { ...s, active: !active } : s))
      );
    } catch (error) {
      console.error('Error toggling subscriber:', error);
      alert('Failed to update subscriber');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
          Newsletter Subscribers
        </h1>
        <p className="text-muted-foreground">
          Total: {subscribers.length} subscribers
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded" />
          ))}
        </div>
      ) : subscribers.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground">No subscribers yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-foreground">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">
                  Subscribed Date
                </th>
                <th className="text-right px-4 py-3 font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr
                  key={subscriber.id}
                  className="border-b border-border hover:bg-muted transition-colors"
                >
                  <td className="px-4 py-3 text-foreground">{subscriber.email}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(subscriber.id, subscriber.active)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        subscriber.active
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}
                    >
                      {subscriber.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">
                    {new Date(subscriber.subscribed_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteSubscriber(subscriber.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
