-- Add metadata and answered_at columns to notification_log for easy_question support
ALTER TABLE notification_log ADD COLUMN IF NOT EXISTS metadata jsonb;
ALTER TABLE notification_log ADD COLUMN IF NOT EXISTS answered_at timestamptz;
