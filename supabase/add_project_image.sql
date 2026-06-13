-- ============================================================
-- Migration: Add preview_image_url to projects table
-- Run this in your Supabase SQL editor
-- ============================================================

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS preview_image_url TEXT;

-- ============================================================
-- Storage: Create the project-images bucket
-- Run this in Supabase SQL editor OR via Dashboard > Storage
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload/delete
CREATE POLICY "Auth upload project images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Auth delete project images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-images');

-- Allow public to read project images
CREATE POLICY "Public read project images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');
