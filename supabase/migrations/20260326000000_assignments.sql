ALTER TABLE monk_memory ADD COLUMN IF NOT EXISTS current_assignment TEXT;
ALTER TABLE monk_memory ADD COLUMN IF NOT EXISTS assignment_given_at TIMESTAMPTZ;
ALTER TABLE monk_memory ADD COLUMN IF NOT EXISTS assignment_due_at TIMESTAMPTZ;
ALTER TABLE monk_memory ADD COLUMN IF NOT EXISTS assignment_completed BOOLEAN;
ALTER TABLE monk_memory ADD COLUMN IF NOT EXISTS assignment_checked_at TIMESTAMPTZ;
