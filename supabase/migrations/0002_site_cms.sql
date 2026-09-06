-- The Hive Society — website CMS (editable text + media)
-- Separate domain from community_applications (0001) — do not mix data models.
-- Self-contained: safe to run on its own in a fresh SQL Editor session.

create extension if not exists pgcrypto;

-- ============================================================================
-- set_updated_at() — shared trigger function (created here too in case 0001
-- wasn't run against this database; CREATE OR REPLACE is a no-op if it
-- already exists and matches).
-- ============================================================================
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
-- site_content — one row per editable text field, addressed by a stable
-- content_key (e.g. "home.hero.title"), never by its visible string value.
-- ============================================================================
create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  content_key text unique not null,
  page_key text not null,
  section_key text,
  content_type text not null default 'text'
    check (content_type in ('heading', 'text', 'paragraph', 'rich_text', 'button', 'label', 'caption', 'link')),
  value text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create index if not exists site_content_page_key_idx on public.site_content (page_key);

drop trigger if exists trg_site_content_updated_at on public.site_content;
create trigger trg_site_content_updated_at
  before update on public.site_content
  for each row
  execute function public.set_updated_at();

alter table public.site_content enable row level security;

-- ============================================================================
-- content_revisions — lightweight history, written by a trigger so API code
-- never has to remember to log it.
-- ============================================================================
create table if not exists public.content_revisions (
  id uuid primary key default gen_random_uuid(),
  content_key text not null,
  old_value text,
  new_value text,
  changed_by uuid references auth.users (id) on delete set null,
  changed_at timestamptz not null default now()
);

create index if not exists content_revisions_content_key_idx
  on public.content_revisions (content_key, changed_at desc);

create or replace function public.log_content_revision()
returns trigger
language plpgsql
as $$
begin
  if (TG_OP = 'UPDATE' and OLD.value is distinct from NEW.value) then
    insert into public.content_revisions (content_key, old_value, new_value, changed_by)
    values (NEW.content_key, OLD.value, NEW.value, NEW.updated_by);
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_log_content_revision on public.site_content;
create trigger trg_log_content_revision
  after update on public.site_content
  for each row
  execute function public.log_content_revision();

alter table public.content_revisions enable row level security;

-- ============================================================================
-- site_media — one row per editable image, addressed by a stable media_key.
-- storage_path points into the "site-images" Storage bucket (created
-- separately via the Supabase Admin API, not SQL). When no row exists for a
-- key, the page falls back to the image already shipped in the codebase.
-- ============================================================================
create table if not exists public.site_media (
  id uuid primary key default gen_random_uuid(),
  media_key text unique not null,
  page_key text not null,
  section_key text,
  storage_path text,
  alt_text text,
  object_position text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create index if not exists site_media_page_key_idx on public.site_media (page_key);

drop trigger if exists trg_site_media_updated_at on public.site_media;
create trigger trg_site_media_updated_at
  before update on public.site_media
  for each row
  execute function public.set_updated_at();

alter table public.site_media enable row level security;

-- ============================================================================
-- Grants. RLS above already denies anon/authenticated entirely (zero
-- policies = default deny) — these grants are what let the service-role
-- client (server-only; used in admin-checked API routes and Server
-- Components) reach the tables at all via PostgREST.
-- ============================================================================
grant usage on schema public to service_role;
grant all on public.site_content to service_role;
grant all on public.content_revisions to service_role;
grant all on public.site_media to service_role;

notify pgrst, 'reload schema';

-- ============================================================================
-- Verification — run this migration, then check these outputs.
-- ============================================================================
select
  to_regclass('public.site_content')      as site_content,
  to_regclass('public.content_revisions') as content_revisions,
  to_regclass('public.site_media')        as site_media;

select schemaname, tablename
from pg_tables
where tablename in ('site_content', 'content_revisions', 'site_media');
