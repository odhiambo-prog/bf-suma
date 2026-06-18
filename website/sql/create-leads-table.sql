create table if not exists leads (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text not null,
  location text not null,
  message text,
  status text default 'new' check (status in ('new', 'contacted')),
  created_at timestamptz default now()
);

alter table leads enable row level security;

create policy "leads_insert_anon" on leads for insert with check (true);
create policy "leads_select_auth" on leads for select using (auth.role() = 'authenticated');
create policy "leads_update_auth" on leads for update using (auth.role() = 'authenticated');
