-- ============================================================
-- Experience Table — Add Logo & Visibility Fields
-- Run this AFTER schema.sql
-- Safe to run multiple times (uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS)
-- ============================================================

-- Add company_logo_url column (public URL from Supabase Storage)
ALTER TABLE experiences
  ADD COLUMN IF NOT EXISTS company_logo_url TEXT;

-- Add company_logo_storage_path column (internal storage path for cleanup)
ALTER TABLE experiences
  ADD COLUMN IF NOT EXISTS company_logo_storage_path TEXT;

-- Add technology_tags column (array of domain/tool badge strings)
ALTER TABLE experiences
  ADD COLUMN IF NOT EXISTS technology_tags TEXT[] DEFAULT '{}';

-- Add is_visible column (controls whether entry shows publicly)
ALTER TABLE experiences
  ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT TRUE;

-- ── Storage bucket for experience logos ────────────────────────────────────
-- Run in the Supabase Dashboard > Storage > New Bucket, OR via SQL:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('experience-logos', 'experience-logos', true)
-- ON CONFLICT (id) DO NOTHING;

-- ── Storage RLS Policies for experience-logos bucket ──────────────────────
-- Allow public to read logos
-- CREATE POLICY "Public read experience-logos"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'experience-logos');

-- Allow authenticated users to upload/replace logos
-- CREATE POLICY "Auth upload experience-logos"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'experience-logos' AND auth.role() = 'authenticated');

-- Allow authenticated users to update logos
-- CREATE POLICY "Auth update experience-logos"
--   ON storage.objects FOR UPDATE
--   USING (bucket_id = 'experience-logos' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete logos
-- CREATE POLICY "Auth delete experience-logos"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'experience-logos' AND auth.role() = 'authenticated');

-- ── Index for is_visible queries ──────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_experiences_visible ON experiences(is_visible);
CREATE INDEX IF NOT EXISTS idx_experiences_sort_visible ON experiences(sort_order, is_visible);
