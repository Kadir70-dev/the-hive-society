-- The Hive Society — community application intake + admin authorization
-- Run this once against the production Supabase project (SQL editor or `supabase db push`).

create extension if not exists pgcrypto;

-- ============================================================================
-- community_applications
-- One row per "Join the Community" form submission. Field names mirror the
-- existing form in src/components/forms/CommunitySignupForm.tsx:
--   fullName -> full_name, email -> email, mobile -> phone, emirate -> emirate,
--   area -> area_city, interests -> interests, heardFrom -> heard_about_us,
--   message -> looking_for, consent -> consent
-- ============================================================================
create table if not exists public.community_applications (
  id uuid primary key default gen_random_uuid(),

  full_name text not null,
  email text not null,
  phone text not null,
  emirate text not null,
  area_city text,
  interests text[] not null default '{}',
  heard_about_us text,
  looking_for text,
  consent boolean not null default false,

  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'waitlisted')),

  admin_notes text,

  reviewed_at timestamptz,
  reviewed_by uuid references auth.users (id) on delete set null,

  whatsapp_invited_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists community_applications_created_at_idx
  on public.community_applications (created_at desc);
create index if not exists community_applications_status_idx
  on public.community_applications (status);
create index if not exists community_applications_email_idx
  on public.community_applications (lower(email));
create index if not exists community_applications_phone_idx
  on public.community_applications (phone);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_community_applications_updated_at on public.community_applications;
create trigger trg_community_applications_updated_at
  before update on public.community_applications
  for each row
  execute function public.set_updated_at();

-- RLS: enabled with NO policies for anon/authenticated. This table is reachable
-- only through the Supabase service-role key, which is used exclusively in
-- server-only code (API routes / admin server components) and always bypasses
-- RLS. Anonymous visitors and logged-in-but-non-admin users therefore cannot
-- select, insert, update or delete a single row via the public API surface —
-- not even the form's own submit request, which goes through our server route.
alter table public.community_applications enable row level security;

-- ============================================================================
-- admin_users
-- Explicit allow-list of who may use /admin. A Supabase Auth account alone is
-- NOT sufficient for admin access — the user's auth.users id must also have an
-- active row here. Insert rows manually after inviting Meera/Abdul via the
-- Supabase Auth dashboard, e.g.:
--   insert into public.admin_users (user_id, email) values ('<auth-uid>', 'meera@thehivesociety.ae');
-- ============================================================================
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'admin' check (role in ('admin', 'superadmin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Same reasoning as above: no anon/authenticated policies. Only the
-- service-role client (server-only) may read this table, which is exactly
-- what the admin-authorization check in src/lib/admin/session.ts uses.
alter table public.admin_users enable row level security;
