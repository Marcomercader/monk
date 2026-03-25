-- Create goals table with category support (if not already present)
create table if not exists goals (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null,
  name        text        not null,
  category    text        not null default 'physical'
                          check (category in ('main','physical','mental','financial','spiritual','social','academics','bad_habit')),
  created_at  timestamptz not null default now()
);

create index if not exists goals_user_id_idx on goals (user_id);

-- If the table already existed without the category column, add it
alter table goals
  add column if not exists category text not null default 'physical'
    check (category in ('main','physical','mental','financial','spiritual','social','academics','bad_habit'));
