-- The Hive Society — paid membership (Ziina)
-- Separate domain from community_applications (0001), site CMS (0002), and
-- gatherings (0003). Self-contained: safe to run on its own.

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
-- members — one row per person who has ever started a membership checkout.
-- A row can sit at status 'pending' indefinitely if the customer abandons
-- checkout; it only becomes 'active' once the Ziina webhook confirms payment
-- (see src/app/api/webhooks/ziina/route.ts) — never from the success-page
-- redirect alone, which anyone can hit without paying.
-- ============================================================================
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text not null,
  plan text not null check (plan in ('one_time', 'monthly')),
  status text not null default 'pending' check (status in ('pending', 'active', 'expired', 'canceled')),
  amount_aed numeric not null,
  -- null for one_time (never expires); set on payment confirmation for monthly.
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists members_status_idx on public.members (status);
create index if not exists members_email_idx on public.members (lower(email));

drop trigger if exists trg_members_updated_at on public.members;
create trigger trg_members_updated_at
  before update on public.members
  for each row
  execute function public.set_updated_at();

alter table public.members enable row level security;

-- ============================================================================
-- membership_payments — one row per Ziina Payment Intent. A monthly member
-- accumulates one row per billing cycle; a one_time member has exactly one.
-- ============================================================================
create table if not exists public.membership_payments (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members (id) on delete cascade,
  ziina_payment_intent_id text unique not null,
  plan text not null check (plan in ('one_time', 'monthly')),
  amount_aed numeric not null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists membership_payments_member_id_idx on public.membership_payments (member_id);
create index if not exists membership_payments_status_idx on public.membership_payments (status);

drop trigger if exists trg_membership_payments_updated_at on public.membership_payments;
create trigger trg_membership_payments_updated_at
  before update on public.membership_payments
  for each row
  execute function public.set_updated_at();

-- RLS: enabled with NO policies for anon/authenticated — same reasoning as
-- every other table in this project. Reads/writes go only through
-- service-role code in admin-checked routes and the Ziina webhook handler
-- (which authenticates the *request* via signature verification instead of
-- a user session, since Ziina's servers have no Supabase session).
alter table public.membership_payments enable row level security;
