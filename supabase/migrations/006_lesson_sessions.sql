create table public.lesson_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  device_hash text,
  last_active timestamptz default now(),
  unique(user_id, lesson_id)
);

alter table public.lesson_sessions enable row level security;

-- Users can only read and upsert their own session rows
create policy "users_own_lesson_sessions" on public.lesson_sessions
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
