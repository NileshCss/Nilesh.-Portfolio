-- ============================================================
-- Fix: Contact Messages RLS + Status Default + Notifications
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─── Fix 1: Normalize status default to capitalized 'Unread' ───────────────
-- The schema had status DEFAULT 'unread' (lowercase) but the admin UI
-- filters on 'Unread' (capitalized). This caused all messages to be
-- invisible to the status filter even though data existed.

ALTER TABLE contact_messages ALTER COLUMN status SET DEFAULT 'Unread';

-- Migrate any existing lowercase status values to match UI expectations
UPDATE contact_messages
SET status = CASE
  WHEN status = 'unread' THEN 'Unread'
  WHEN status = 'read'   THEN 'Read'
  WHEN status = 'confirmed' THEN 'Confirmed'
  ELSE status
END
WHERE status IN ('unread', 'read', 'confirmed');

-- ─── Fix 2: Ensure public INSERT policy exists for contact_messages ─────────
-- The schema.sql has this policy, but it may not have been applied to the
-- live database. DROP + CREATE ensures it is present.

DROP POLICY IF EXISTS "Public insert contact_messages" ON contact_messages;
CREATE POLICY "Public insert contact_messages"
  ON contact_messages
  FOR INSERT
  WITH CHECK (true);

-- ─── Fix 3: Create notifications table ─────────────────────────────────────
-- Persists admin notifications so the bell dropdown shows real entries
-- linked to contact_messages via reference_id.

CREATE TABLE IF NOT EXISTS notifications (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  type         TEXT        NOT NULL DEFAULT 'contact_message',
  title        TEXT        NOT NULL,
  body         TEXT        NOT NULL,
  reference_id UUID,          -- references contact_messages(id)
  is_read      BOOLEAN     DEFAULT false NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Only authenticated admin users can read/update/delete notifications
DROP POLICY IF EXISTS "Auth manage notifications" ON notifications;
CREATE POLICY "Auth manage notifications"
  ON notifications
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Server-side inserts use the service-role key which bypasses RLS,
-- so no public insert policy is needed here.

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_notifications_is_read  ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created  ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_ref_id   ON notifications(reference_id);

-- ─── Verify ────────────────────────────────────────────────────────────────
-- After running, check:
--   SELECT * FROM contact_messages LIMIT 5;         → should show 'Unread' status
--   SELECT * FROM notifications LIMIT 5;            → table should exist
--   SELECT policyname FROM pg_policies
--     WHERE tablename = 'contact_messages';         → should include both policies
