-- Add category column to goals table
ALTER TABLE goals ADD COLUMN IF NOT EXISTS category text DEFAULT 'uncategorized';

-- Add conversation tracking columns to monk_memory
ALTER TABLE monk_memory ADD COLUMN IF NOT EXISTS conversation_count integer DEFAULT 0;
ALTER TABLE monk_memory ADD COLUMN IF NOT EXISTS vow_prompt_ready boolean DEFAULT false;
