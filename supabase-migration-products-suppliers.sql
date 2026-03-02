-- Her Own: multi-supplier + products (for CSV import, low stock, scaling)
-- Run after supabase-schema.sql and supabase-migration-shipping.sql

create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text unique,
  wholesale_cents integer not null default 0,
  retail_cents integer not null default 0,
  supplier_id uuid references suppliers(id),
  stock_quantity integer not null default 0,
  hidden boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists products_sku on products(sku);
create index if not exists products_hidden on products(hidden);
create index if not exists products_stock on products(stock_quantity);

comment on table suppliers is 'Multi-supplier support for scaling';
comment on table products is 'CSV-imported products; low stock (<5) can hide from storefront';
comment on column products.stock_quantity is 'Placeholder for inventory sync; <5 triggers low stock alert';
