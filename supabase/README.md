# Supabase Backend Setup

## 1) Environment variables

Create a `.env.local` file with the following values:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
ADMIN_EMAIL=Mucherupn@gmail.com
ADMIN_PASSWORD=mnmn,,223@kia-Ngocivlghu
```

## 2) Database schema and RLS

Apply the SQL in [`supabase/schema.sql`](./schema.sql) using the Supabase SQL editor or a migration.

## 3) Storage bucket

Create a storage bucket called `listing-images`.

Suggested bucket structure:

```
listing-images/
  <listing-id>/
    featured.jpg
    gallery-1.jpg
    gallery-2.jpg
```

Configure storage policies for public read access and admin writes in Supabase as needed.

## 4) Admin authentication

Use Supabase Auth to create the admin user. You can run the seed script:

```
node --loader ts-node/esm scripts/seed.ts
```

This script creates the admin user defined in `.env.local` and seeds default locations.

## 5) Admin API routes

The admin panel uses the following API endpoints (all require an authenticated admin session):

- `/api/admin/listings`
- `/api/admin/listings/[id]`
- `/api/admin/bulk-upload`
- `/api/admin/locations`
- `/api/admin/locations/[id]`
- `/api/admin/amenities`
- `/api/admin/amenities/[id]`
- `/api/admin/articles`
- `/api/admin/articles/[id]`
- `/api/admin/estimator`
- `/api/admin/estimator/[id]`
- `/api/admin/insights`
- `/api/admin/insights/[id]`

## 6) Bulk upload

The bulk upload UI accepts CSV or Excel files. Use the template at:

`/public/templates/listings-template.csv`

The backend validates rows, creates listings, and uploads remote image URLs to storage.
