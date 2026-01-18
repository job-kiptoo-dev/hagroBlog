-- Create tables for the blog platform

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url VARCHAR(500),
  category_id UUID NOT NULL REFERENCES categories(id),
  author VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft', -- 'draft' or 'published'
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  unsubscribed_at TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_featured ON articles(featured);
CREATE INDEX idx_articles_published_at ON articles(published_at);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
  ('News', 'news', 'Latest news from Africa'),
  ('Technology', 'technology', 'Tech innovations and developments'),
  ('Business', 'business', 'Business and economy stories'),
  ('Agriculture', 'agriculture', 'Agricultural news and insights'),
  ('Sports', 'sports', 'Sports coverage and analysis'),
  ('Entertainment', 'entertainment', 'Entertainment and culture'),
  ('Human Interest', 'human-interest', 'Human interest stories')
ON CONFLICT DO NOTHING;
