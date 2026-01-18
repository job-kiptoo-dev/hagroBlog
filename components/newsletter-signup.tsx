'use client';

import React from "react"

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Check if email already exists
      const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('email', email)
        .single();

      if (existing) {
        setMessage('This email is already subscribed.');
        setMessageType('error');
        setLoading(false);
        return;
      }

      // Insert new subscriber
      const { error } = await supabase.from('newsletter_subscribers').insert([
        {
          email,
          active: true,
        },
      ]);

      if (error) throw error;

      setMessage('Thank you for subscribing! Check your inbox for updates.');
      setMessageType('success');
      setEmail('');
    } catch (error) {
      console.error('Subscription error:', error);
      setMessage('Failed to subscribe. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="newsletter" className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-input border border-border rounded text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-primary text-primary-foreground rounded font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 rounded text-sm ${
            messageType === 'success'
              ? 'bg-green-100/80 text-green-800 dark:bg-green-900/30 dark:text-green-200'
              : 'bg-red-100/80 text-red-800 dark:bg-red-900/30 dark:text-red-200'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
