-- SQL Migration V2: View Tracking and Content Scheduling
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Add views_count column for tracking reads (Priority 3)
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0 NOT NULL;

-- 2. Add scheduling metadata columns (Priority 4)
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published' NOT NULL;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL;

-- 3. Create indices for scheduling lookups and view counters
CREATE INDEX IF NOT EXISTS idx_posts_status_published_at ON public.posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_views_count ON public.posts(views_count DESC);

-- 4. Create a secure RPC function to increment post views safely by slug (Priority 3)
-- Marked with SECURITY DEFINER to bypass RLS restrictions for public readers incrementing count
CREATE OR REPLACE FUNCTION public.increment_post_views_by_slug(post_slug TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.posts
    SET views_count = views_count + 1
    WHERE slug = post_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
