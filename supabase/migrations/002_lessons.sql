create table public.lessons (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  subject text not null check (subject in ('alphabets', 'numbers', 'colours', 'shapes')),
  type text default 'free' check (type in ('free', 'premium')),
  price integer default 0,
  thumbnail_url text,
  storage_path text,
  is_published boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.lessons enable row level security;

create policy "published_lessons_public" on public.lessons
  for select using (is_published = true);

create policy "admin_full_access_lessons" on public.lessons
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
