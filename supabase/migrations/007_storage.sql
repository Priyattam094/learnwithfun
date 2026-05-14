insert into storage.buckets (id, name, public)
values ('lesson-content', 'lesson-content', false)
on conflict (id) do nothing;

create policy "no_public_access" on storage.objects
  for select using (false);
