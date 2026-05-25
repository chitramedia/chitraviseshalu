-- SQL Migration for Movie News & OTT Updates Table
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create custom enum types for clean data filtering if they don't exist
DO $$ BEGIN
    CREATE TYPE content_category AS ENUM ('Movie News', 'OTT Release', 'Review', 'Box Office', 'Rumor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ott_platform AS ENUM ('Netflix', 'Prime Video', 'Hotstar', 'Aha', 'Zee5', 'SonyLIV', 'Theaters');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create the posts table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Content fields
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE, -- URL-friendly version of the title (e.g., "pushpa-2-ott-release-date")
    summary TEXT,              -- Short summary of the article
    content TEXT NOT NULL,      -- Supports markdown or plain text for the article body
    image_url TEXT,            -- Link to the movie poster or banner image
    
    -- Metadata & Filtering
    category content_category NOT NULL DEFAULT 'Movie News',
    platform ott_platform NOT NULL DEFAULT 'Theaters',
    release_date DATE,         -- Explicit streaming/theater release date if applicable
    streaming_url TEXT,        -- Direct link to watch (e.g., Netflix link)
    
    -- Authorship (links to your authenticated users/profiles)
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 3. Create indexes for fast searching and filtering
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_platform ON public.posts(platform);

-- 4. Enable Row-Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 5. Add RLS Policies
-- Allow completely anonymous read access (Everyone can view movie updates)
DROP POLICY IF EXISTS "Allow public read access" ON public.posts;
CREATE POLICY "Allow public read access" 
ON public.posts 
FOR SELECT 
USING (true);

-- Allow write access only if the logged-in user matches your admin email
-- NOTE: Make sure to replace 'mvmanish.mv3@gmail.com' with the email address you use for admin logins!
DROP POLICY IF EXISTS "Allow admin full access" ON public.posts;
CREATE POLICY "Allow admin full access" 
ON public.posts 
FOR ALL 
TO authenticated
USING (auth.jwt() ->> 'email' = 'mvmanish.mv3@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'mvmanish.mv3@gmail.com');

-- 6. Setup Auto-Updating Timestamps Trigger
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_posts_updated_at ON public.posts;
CREATE TRIGGER set_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
