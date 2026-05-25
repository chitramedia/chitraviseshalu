-- SQL Migration for Email Verification System
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Add verification columns to the public.profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS verification_token TEXT UNIQUE;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMP WITH TIME ZONE;

-- 2. Enable row-level security (RLS) policies if not already enabled,
-- or ensure anon/authenticated users can access/update these fields during verification.
-- Note: Below policies are examples. Adjust according to your application's security requirements.

CREATE POLICY "Allow anon select on profiles for verification" 
ON public.profiles 
FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Allow anon update on profiles for verification" 
ON public.profiles 
FOR UPDATE 
TO anon, authenticated
USING (true)
WITH CHECK (true);
