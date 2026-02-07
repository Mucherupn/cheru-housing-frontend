create extension if not exists "pgcrypto";

create table if not exists areas (
    id uuid primary key default gen_random_uuid(),
    name text unique not null,
    land_price_per_acre numeric not null,
    apartment_price_per_sqm numeric not null,
    house_price_per_sqm numeric not null,
    created_at timestamptz default now()
);

create table if not exists amenities (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    property_type text not null,
    value_percent numeric not null
);

create table if not exists apartment_projects (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    area text not null,
    average_price_per_sqm numeric not null
);
