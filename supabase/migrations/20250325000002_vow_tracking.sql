-- Add conversation tracking fields to monk_memory for vow ceremony trigger
alter table monk_memory
  add column if not exists conversation_count integer not null default 0;

alter table monk_memory
  add column if not exists vow_prompt_ready boolean not null default false;
