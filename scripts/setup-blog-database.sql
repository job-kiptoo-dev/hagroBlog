-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE SET NULL,
  author TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  views_count INT DEFAULT 0
);

-- Create newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_articles_category_id ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(active);

-- Insert default categories
INSERT INTO categories (name, slug, description, color) VALUES
  ('News', 'news', 'Breaking news and current events from Africa', '#FF6B6B'),
  ('Business', 'business', 'Business, markets, and economy news', '#4ECDC4'),
  ('Technology', 'technology', 'Tech trends and innovation', '#45B7D1'),
  ('Sports', 'sports', 'Sports news and updates', '#FFA07A'),
  ('Entertainment', 'entertainment', 'Entertainment and cultural news', '#98D8C8'),
  ('Agriculture', 'agriculture', 'Agriculture and food security', '#6BCF7F'),
  ('Human Interest', 'human-interest', 'Stories that inspire and inform', '#FFB6C1')
ON CONFLICT (slug) DO NOTHING;

-- Enable Row Level Security (RLS) for public access
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy for public article viewing
CREATE POLICY "Anyone can view published articles" ON articles
  FOR SELECT
  USING (status = 'published');

-- Create policy for public category viewing
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT
  USING (true);

-- Create policy for newsletter signups
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);
