-- Create articles table for admin management
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT, -- e.g., 'treatments', 'nutrition', 'activities', 'news'
    image_url TEXT,
    author TEXT,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Everyone can view published articles
CREATE POLICY "Anyone can view published articles" ON articles
    FOR SELECT USING (published = true OR is_admin());

-- Only admins can insert articles
CREATE POLICY "Admins can insert articles" ON articles
    FOR INSERT WITH CHECK (is_admin());

-- Only admins can update articles
CREATE POLICY "Admins can update articles" ON articles
    FOR UPDATE USING (is_admin());

-- Only admins can delete articles
CREATE POLICY "Admins can delete articles" ON articles
    FOR DELETE USING (is_admin());

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_articles_updated_at ON articles;
CREATE TRIGGER trigger_update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_articles_updated_at();
