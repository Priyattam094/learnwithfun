create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete set null,
  order_type text check (order_type in ('lesson', 'subscription')),
  razorpay_order_id text unique,
  razorpay_payment_id text,
  status text default 'pending' check (status in ('pending', 'paid', 'failed')),
  amount integer not null,
  created_at timestamptz default now()
);

alter table public.orders enable row level security;

create policy "users_own_orders" on public.orders
  for select using (auth.uid() = user_id);
