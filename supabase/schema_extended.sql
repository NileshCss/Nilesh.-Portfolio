-- ============================================================
-- Portfolio Admin Dashboard — Extended Schema (Addendum)
-- Run this AFTER the main schema.sql
-- ============================================================

-- 8. Certifications
CREATE TABLE IF NOT EXISTS certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  expiry_date TEXT,
  credential_url TEXT,
  credential_id TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read certifications" ON certifications FOR SELECT USING (true);
CREATE POLICY "Auth manage certifications" ON certifications FOR ALL USING (auth.role() = 'authenticated');

CREATE TRIGGER set_updated_at_certifications
  BEFORE UPDATE ON certifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 9. Social Links (separate table, alternative to personal_info columns)
-- Note: social_links stored in personal_info.github, .linkedin, .twitter, .email columns

-- 10. Media Library
CREATE TABLE IF NOT EXISTS media_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  size_bytes BIGINT,
  mime_type TEXT,
  bucket TEXT DEFAULT 'media',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read media_library" ON media_library FOR SELECT USING (true);
CREATE POLICY "Auth manage media_library" ON media_library FOR ALL USING (auth.role() = 'authenticated');

-- 11. Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  description TEXT,
  resource_type TEXT,
  resource_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth manage activity_logs" ON activity_logs FOR ALL USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);

-- 12. SEO Settings
CREATE TABLE IF NOT EXISTS seo_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT UNIQUE NOT NULL,
  title TEXT,
  description TEXT,
  og_image TEXT,
  keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read seo_settings" ON seo_settings FOR SELECT USING (true);
CREATE POLICY "Auth manage seo_settings" ON seo_settings FOR ALL USING (auth.role() = 'authenticated');

CREATE TRIGGER set_updated_at_seo_settings
  BEFORE UPDATE ON seo_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Insert default SEO for home page
INSERT INTO seo_settings (page, title, description)
VALUES (
  'home',
  'Nilesh Kumar Singh — Full Stack Java Developer',
  'Full Stack Java Developer building scalable SaaS platforms with Spring Boot, Next.js, and cloud technologies.'
) ON CONFLICT (page) DO NOTHING;

-- 13. Resume Versions
CREATE TABLE IF NOT EXISTS resume_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size TEXT NOT NULL,
  version_label TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE resume_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read resume_versions" ON resume_versions FOR SELECT USING (true);
CREATE POLICY "Auth manage resume_versions" ON resume_versions FOR ALL USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_resume_versions_created ON resume_versions(created_at DESC);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_certifications_sort ON certifications(sort_order);
