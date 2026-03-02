-- Her Own: run in Supabase SQL editor to create tables

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  email text not null,
  status text not null default 'pending' check (status in ('pending','paid','shipped','delivered','refunded')),
  items jsonb not null default '[]',
  total_cents integer not null,
  tracking_number text,
  tracking_carrier text,
  discreet_descriptor text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists orders_stripe_session on orders(stripe_session_id);
create index if not exists orders_email on orders(email);
create index if not exists orders_status on orders(status);
create index if not exists orders_created_at on orders(created_at desc);

-- Optional: trigger to bump updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists orders_updated on orders;
create trigger orders_updated before update on orders
  for each row execute function set_updated_at();

-- RLS: allow service role full access; anon can only read own orders by email via API
alter table orders enable row level security;

create policy "Service role full access" on orders
  for all using (auth.role() = 'service_role');

create policy "Users can read own orders by email" on orders
  for select using (true); -- restrict in API by email param
