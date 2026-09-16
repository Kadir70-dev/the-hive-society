-- The Hive Society — extend Explore Gatherings CRUD to the product app
-- Adds a `surface` column so the same `gatherings` table (0003) backs both
-- the public marketing page (/explore, surface='marketing') and the
-- in-app catalogue (/app/explore, surface='app'), each shown and edited
-- independently. See src/lib/content/getGatherings.ts and
-- src/components/product/AppExploreGrid.tsx.

alter table public.gatherings
  add column if not exists surface text not null default 'marketing'
    check (surface in ('marketing', 'app'));

create index if not exists gatherings_surface_idx on public.gatherings (surface);
