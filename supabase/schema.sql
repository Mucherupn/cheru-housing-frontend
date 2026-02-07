-- Cheru housing database reset + canonical schema
-- This script is idempotent and safe to re-run in Supabase.

-- 1) Extensions
create extension if not exists "pgcrypto";

-- 2) Drop existing public tables (app tables only)
--    This avoids duplicate FKs/relationships that can break embeds.
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN (
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  ) LOOP
    EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE', r.tablename);
  END LOOP;
END $$;

-- 3) Core tables
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists locations_name_key on public.locations (name);
create unique index if not exists locations_slug_key on public.locations (slug);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  type text,
  title text,
  description text,
  price numeric,
  bedrooms int,
  bathrooms int,
  house_size numeric,
  land_size numeric,
  year_built int,
  floor int,
  apartment_name text,
  location_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.amenities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists amenities_name_key on public.amenities (name);

create table if not exists public.property_amenities (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid,
  amenity_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.insights_data (
  id uuid primary key default gen_random_uuid(),
  title text,
  content text,
  year int,
  location_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.estimator_configs (
  id uuid primary key default gen_random_uuid(),
  property_type text,
  location_id uuid,
  base_price_per_sqm numeric,
  land_price_per_acre numeric,
  depreciation_rate numeric not null default 0.02,
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  password_hash text,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create unique index if not exists users_email_key on public.users (email);

-- 4) Ensure required columns exist (idempotent adds if tables pre-exist)
alter table public.locations
  add column if not exists name text,
  add column if not exists slug text;

alter table public.listings
  add column if not exists type text,
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists price numeric,
  add column if not exists bedrooms int,
  add column if not exists bathrooms int,
  add column if not exists house_size numeric,
  add column if not exists land_size numeric,
  add column if not exists year_built int,
  add column if not exists floor int,
  add column if not exists apartment_name text,
  add column if not exists location_id uuid;

alter table public.amenities
  add column if not exists name text;

alter table public.property_amenities
  add column if not exists listing_id uuid,
  add column if not exists amenity_id uuid;

alter table public.insights_data
  add column if not exists title text,
  add column if not exists content text,
  add column if not exists year int,
  add column if not exists location_id uuid;

alter table public.estimator_configs
  add column if not exists property_type text,
  add column if not exists location_id uuid,
  add column if not exists base_price_per_sqm numeric,
  add column if not exists land_price_per_acre numeric,
  add column if not exists depreciation_rate numeric;

alter table public.users
  add column if not exists email text,
  add column if not exists password_hash text,
  add column if not exists role text;

-- 5) Foreign keys (single, canonical relationships)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'listings_location_id_fkey'
  ) THEN
    alter table public.listings
      add constraint listings_location_id_fkey
      foreign key (location_id) references public.locations(id) on delete restrict;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'property_amenities_listing_id_fkey'
  ) THEN
    alter table public.property_amenities
      add constraint property_amenities_listing_id_fkey
      foreign key (listing_id) references public.listings(id) on delete cascade;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'property_amenities_amenity_id_fkey'
  ) THEN
    alter table public.property_amenities
      add constraint property_amenities_amenity_id_fkey
      foreign key (amenity_id) references public.amenities(id) on delete cascade;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'insights_data_location_id_fkey'
  ) THEN
    alter table public.insights_data
      add constraint insights_data_location_id_fkey
      foreign key (location_id) references public.locations(id) on delete cascade;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'estimator_configs_location_id_fkey'
  ) THEN
    alter table public.estimator_configs
      add constraint estimator_configs_location_id_fkey
      foreign key (location_id) references public.locations(id) on delete cascade;
  END IF;
END $$;

-- 6) Helpful indexes
create index if not exists listings_location_idx on public.listings(location_id);
create index if not exists property_amenities_listing_idx on public.property_amenities(listing_id);
create index if not exists property_amenities_amenity_idx on public.property_amenities(amenity_id);
create index if not exists insights_location_idx on public.insights_data(location_id);
create index if not exists estimator_location_idx on public.estimator_configs(location_id);
