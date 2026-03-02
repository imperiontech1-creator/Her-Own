-- Her Own: run in Supabase SQL editor after supabase-schema.sql
-- Adds shipping_address for fulfillment and supplier_notified_at for idempotency/retry

alter table orders add column if not exists shipping_address jsonb;
alter table orders add column if not exists supplier_notified_at timestamptz;

comment on column orders.shipping_address is 'Stripe shipping_details address + name for retailer fulfillment';
comment on column orders.supplier_notified_at is 'When supplier was last notified (for retry logic)';
