create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  plan text default 'monthly' check (plan in ('monthly', 'yearly')),
  amount_paid integer not null,
  starts_at timestamptz default now(),
  expires_at timestamptz not null,
  is_active boolean default true
);

alter table public.subscriptions enable row level security;

create policy "users_own_subscription" on public.subscriptions
  for select using (auth.uid() = user_id);
