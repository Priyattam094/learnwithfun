create table public.purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  amount_paid integer not null,
  paid_at timestamptz default now(),
  unique(user_id, lesson_id)
);

alter table public.purchases enable row level security;

create policy "users_own_purchases" on public.purchases
  for select using (auth.uid() = user_id);
