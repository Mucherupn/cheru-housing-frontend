-- Cheru housing database reset + canonical schema
-- This script is idempotent and safe to re-run in Supabase.

create extension if not exists "pgcrypto";

-- Drop all foreign keys in public schema to prevent duplicate relationships.
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN (
    SELECT conname, conrelid::regclass AS table_name
    FROM pg_constraint
    WHERE contype = 'f'
      AND connamespace = 'public'::regnamespace
  ) LOOP
    EXECUTE format('ALTER TABLE %s DROP CONSTRAINT IF EXISTS %I', r.table_name, r.conname);
  END LOOP;
END $$;

-- Rename legacy property_amenities to listing_amenities if needed.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename = 'property_amenities'
  ) AND NOT EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename = 'listing_amenities'
  ) THEN
    EXECUTE 'ALTER TABLE public.property_amenities RENAME TO listing_amenities';
  END IF;
END $$;

-- Drop legacy tables.
DROP TABLE IF EXISTS public.properties CASCADE;
DROP TABLE IF EXISTS public.property_images CASCADE;
DROP TABLE IF EXISTS public.property_amenities CASCADE;
DROP TABLE IF EXISTS public.property_requests CASCADE;
DROP TABLE IF EXISTS public.property_status CASCADE;
DROP TABLE IF EXISTS public.property_types CASCADE;
DROP TABLE IF EXISTS public.neighbourhoods CASCADE;
DROP TABLE IF EXISTS public.neighborhoods CASCADE;
DROP TABLE IF EXISTS public.insights_properties CASCADE;
DROP TABLE IF EXISTS public.insights_images CASCADE;
DROP TABLE IF EXISTS public.area_articles CASCADE;
DROP TABLE IF EXISTS public.property_interest CASCADE;

-- Core tables
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  type text,
  parent_id uuid,
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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.amenities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists amenities_name_key on public.amenities (name);

create table if not exists public.listing_amenities (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid,
  amenity_id uuid
);

create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid,
  image_url text,
  sort_order int,
  created_at timestamptz not null default now()
);

create table if not exists public.insights_data (
  id uuid primary key default gen_random_uuid(),
  title text,
  content text,
  year int,
  location_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.estimator_configs (
  id uuid primary key default gen_random_uuid(),
  property_type text,
  base_price_per_sqm numeric,
  land_price_per_acre numeric,
  depreciation_rate numeric not null default 0.02,
  location_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  password_hash text,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create unique index if not exists users_email_key on public.users (email);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid,
  location_id uuid,
  request_type text,
  property_type text,
  interest_type text,
  timeline text,
  budget numeric,
  contact text,
  message text,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid,
  action text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  content text,
  status text not null default 'draft',
  featured_image text,
  location_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists articles_slug_key on public.articles (slug);

-- Ensure required columns exist (idempotent adds if tables pre-exist)
alter table public.locations
  add column if not exists name text,
  add column if not exists slug text,
  add column if not exists type text,
  add column if not exists parent_id uuid;

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
  add column if not exists location_id uuid,
  add column if not exists updated_at timestamptz;

alter table public.amenities
  add column if not exists name text;

alter table public.listing_amenities
  add column if not exists listing_id uuid,
  add column if not exists amenity_id uuid;

alter table public.listing_images
  add column if not exists listing_id uuid,
  add column if not exists image_url text,
  add column if not exists sort_order int;

alter table public.insights_data
  add column if not exists title text,
  add column if not exists content text,
  add column if not exists year int,
  add column if not exists location_id uuid,
  add column if not exists updated_at timestamptz;

alter table public.estimator_configs
  add column if not exists property_type text,
  add column if not exists base_price_per_sqm numeric,
  add column if not exists land_price_per_acre numeric,
  add column if not exists depreciation_rate numeric,
  add column if not exists location_id uuid,
  add column if not exists updated_at timestamptz;

alter table public.users
  add column if not exists email text,
  add column if not exists password_hash text,
  add column if not exists role text;

alter table public.inquiries
  add column if not exists listing_id uuid,
  add column if not exists location_id uuid,
  add column if not exists request_type text,
  add column if not exists property_type text,
  add column if not exists interest_type text,
  add column if not exists timeline text,
  add column if not exists budget numeric,
  add column if not exists contact text,
  add column if not exists message text;

alter table public.admin_logs
  add column if not exists admin_id uuid,
  add column if not exists action text,
  add column if not exists metadata jsonb;

alter table public.articles
  add column if not exists title text,
  add column if not exists slug text,
  add column if not exists content text,
  add column if not exists status text,
  add column if not exists featured_image text,
  add column if not exists location_id uuid,
  add column if not exists updated_at timestamptz;

-- Foreign keys (single, canonical relationships)
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
    WHERE conname = 'listing_amenities_listing_id_fkey'
  ) THEN
    alter table public.listing_amenities
      add constraint listing_amenities_listing_id_fkey
      foreign key (listing_id) references public.listings(id) on delete cascade;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'listing_amenities_amenity_id_fkey'
  ) THEN
    alter table public.listing_amenities
      add constraint listing_amenities_amenity_id_fkey
      foreign key (amenity_id) references public.amenities(id) on delete cascade;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'listing_images_listing_id_fkey'
  ) THEN
    alter table public.listing_images
      add constraint listing_images_listing_id_fkey
      foreign key (listing_id) references public.listings(id) on delete cascade;
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

-- Helpful indexes
create index if not exists listings_location_idx on public.listings(location_id);
create index if not exists listing_amenities_listing_idx on public.listing_amenities(listing_id);
create index if not exists listing_amenities_amenity_idx on public.listing_amenities(amenity_id);
create index if not exists listing_images_listing_idx on public.listing_images(listing_id);
create index if not exists insights_location_idx on public.insights_data(location_id);
create index if not exists estimator_location_idx on public.estimator_configs(location_id);
create index if not exists articles_location_idx on public.articles(location_id);
create index if not exists inquiries_listing_idx on public.inquiries(listing_id);
create index if not exists inquiries_location_idx on public.inquiries(location_id);
create index if not exists admin_logs_admin_idx on public.admin_logs(admin_id);
