-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Locations
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- Neighbourhoods
create table if not exists public.neighbourhoods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location_id uuid not null references public.locations(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Amenities
create table if not exists public.amenities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- Listings
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price numeric,
  property_type text,
  listing_type text not null,
  location_id uuid not null references public.locations(id) on delete restrict,
  neighbourhood_id uuid references public.neighbourhoods(id) on delete set null,
  size numeric,
  bedrooms int,
  bathrooms int,
  year_built int,
  status text,
  featured_image text,
  created_at timestamptz not null default now()
);

-- Listing images
create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  image_path text not null
);

-- Listing amenities
create table if not exists public.listing_amenities (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  amenity_id uuid not null references public.amenities(id) on delete cascade
);

-- Articles
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  content text,
  featured_image text,
  status text,
  created_at timestamptz not null default now()
);

-- Estimator configs
create table if not exists public.estimator_configs (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations(id) on delete cascade,
  price_per_sqm numeric,
  land_price_per_acre numeric,
  created_at timestamptz not null default now()
);

-- Insights data
create table if not exists public.insights_data (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations(id) on delete cascade,
  property_type text not null,
  average_price numeric,
  month int not null,
  year int not null
);

create index if not exists listings_location_idx on public.listings(location_id);
create index if not exists listings_neighbourhood_idx on public.listings(neighbourhood_id);
create index if not exists neighbourhoods_location_idx on public.neighbourhoods(location_id);
create index if not exists listing_images_listing_idx on public.listing_images(listing_id);
create index if not exists listing_amenities_listing_idx on public.listing_amenities(listing_id);
create index if not exists listing_amenities_amenity_idx on public.listing_amenities(amenity_id);
create index if not exists estimator_location_idx on public.estimator_configs(location_id);
create index if not exists insights_location_idx on public.insights_data(location_id);

-- RLS policies
alter table public.locations enable row level security;
alter table public.neighbourhoods enable row level security;
alter table public.amenities enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.listing_amenities enable row level security;
alter table public.articles enable row level security;
alter table public.estimator_configs enable row level security;
alter table public.insights_data enable row level security;

-- Public read policies
create policy "Public read locations" on public.locations for select using (true);
create policy "Public read neighbourhoods" on public.neighbourhoods for select using (true);
create policy "Public read listings" on public.listings for select using (true);
create policy "Public read articles" on public.articles for select using (true);
create policy "Public read listing images" on public.listing_images for select using (true);
create policy "Public read listing amenities" on public.listing_amenities for select using (true);

-- Admin-only write policies
create policy "Admin manage locations" on public.locations
  for all using ((auth.jwt() ->> 'email') = 'Mucherupn@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'Mucherupn@gmail.com');

create policy "Admin manage neighbourhoods" on public.neighbourhoods
  for all using ((auth.jwt() ->> 'email') = 'Mucherupn@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'Mucherupn@gmail.com');

create policy "Admin manage amenities" on public.amenities
  for all using ((auth.jwt() ->> 'email') = 'Mucherupn@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'Mucherupn@gmail.com');

create policy "Admin manage listings" on public.listings
  for all using ((auth.jwt() ->> 'email') = 'Mucherupn@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'Mucherupn@gmail.com');

create policy "Admin manage listing images" on public.listing_images
  for all using ((auth.jwt() ->> 'email') = 'Mucherupn@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'Mucherupn@gmail.com');

create policy "Admin manage listing amenities" on public.listing_amenities
  for all using ((auth.jwt() ->> 'email') = 'Mucherupn@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'Mucherupn@gmail.com');

create policy "Admin manage articles" on public.articles
  for all using ((auth.jwt() ->> 'email') = 'Mucherupn@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'Mucherupn@gmail.com');

create policy "Admin manage estimator" on public.estimator_configs
  for all using ((auth.jwt() ->> 'email') = 'Mucherupn@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'Mucherupn@gmail.com');

create policy "Admin manage insights" on public.insights_data
  for all using ((auth.jwt() ->> 'email') = 'Mucherupn@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'Mucherupn@gmail.com');

-- Storage policies for listing images
create policy "Public read listing-images" on storage.objects
  for select using (bucket_id = 'listing-images');

create policy "Admin manage listing-images" on storage.objects
  for all using (
    bucket_id = 'listing-images'
    and (auth.jwt() ->> 'email') = 'Mucherupn@gmail.com'
  )
  with check (
    bucket_id = 'listing-images'
    and (auth.jwt() ->> 'email') = 'Mucherupn@gmail.com'
  );
