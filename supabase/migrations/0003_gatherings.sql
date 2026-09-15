-- The Hive Society — Explore Gatherings admin CRUD
-- Separate domain from community_applications (0001) and the site_content /
-- site_media CMS (0002) — this is a real content list, not a text/image
-- override. Self-contained: safe to run on its own in a fresh SQL Editor
-- session (reuses public.set_updated_at(), created idempotently by 0001/0002
-- too, in case this is the first migration run against a fresh project).

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- gatherings — one row per card shown on the public /explore page. The DB is
-- the source of truth; the hardcoded `marketingExperiences` array in
-- src/data/experiences.ts is kept only as a fallback if this table is ever
-- empty or unreachable (see src/lib/content/getGatherings.ts).
-- ============================================================================
create table if not exists public.gatherings (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null
    check (category in ('Move', 'Gather', 'Learn', 'Celebrate', 'Unwind', 'Explore')),
  organiser text not null,
  area text not null,
  date_label text not null,
  time_label text,
  price_label text not null,
  going int not null default 0 check (going >= 0),
  attendee_names text[] not null default '{}',
  verified boolean not null default false,
  image_url text not null,
  image_alt text,
  description text not null default '',
  display_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create index if not exists gatherings_display_order_idx on public.gatherings (display_order);
create index if not exists gatherings_is_published_idx on public.gatherings (is_published);

drop trigger if exists trg_gatherings_updated_at on public.gatherings;
create trigger trg_gatherings_updated_at
  before update on public.gatherings
  for each row
  execute function public.set_updated_at();

-- RLS: enabled with NO policies for anon/authenticated — same reasoning as
-- every other table in this project. Reads (public /explore page) go
-- through the service-role client in a server-only helper; writes go
-- through admin-session-checked API routes under /api/admin/gatherings.
alter table public.gatherings enable row level security;
