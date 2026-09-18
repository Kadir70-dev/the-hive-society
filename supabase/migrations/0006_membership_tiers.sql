-- The Hive Society — JOIN / CREATE membership tiers
-- Adds structured, admin-editable plan data (membership_plans) and links
-- members to a plan row. Additive only — does not alter or drop anything
-- from 0004_memberships.sql. No payment gateway wiring here: recurring
-- billing is deliberately out of scope for this pass (Ziina has no
-- subscriptions API); admins activate members manually for now.

create table if not exists public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,               -- stable code reference, e.g. 'join', 'create'
  name text not null,
  tagline text not null default '',
  amount_aed numeric not null,
  currency text not null default 'AED',
  cadence text not null default 'monthly' check (cadence in ('monthly', 'annual')),
  features jsonb not null default '[]'::jsonb,   -- array of benefit strings
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists membership_plans_active_idx on public.membership_plans (is_active, sort_order);

drop trigger if exists trg_membership_plans_updated_at on public.membership_plans;
create trigger trg_membership_plans_updated_at
  before update on public.membership_plans
  for each row execute function public.set_updated_at();

alter table public.membership_plans enable row level security;
-- No policies — service-role only, same as every other table in this project.

insert into public.membership_plans (key, name, tagline, amount_aed, cadence, features, is_active, sort_order)
values
  ('join', 'JOIN', 'Discover, connect, and book.', 140, 'monthly',
   '["Discover experiences","Connect with circles","Join circles","Save favourites","Reserve & book experiences"]'::jsonb,
   true, 1),
  ('create', 'CREATE', 'Everything in JOIN, plus host your own.', 299, 'monthly',
   '["Everything in JOIN","Create & publish experiences","Host experiences","Creator Studio access"]'::jsonb,
   true, 2),
  ('founding', 'Founding Membership', 'Legacy one-time founding plan.', 299, 'monthly',
   '[]'::jsonb, false, 99)
on conflict (key) do nothing;

-- members.plan_id: which membership_plans row a member is on. Nullable and
-- additive — members.plan keeps its existing ('one_time','monthly') CHECK
-- untouched (new JOIN/CREATE members are written with plan='monthly',
-- already legal), so no destructive constraint change is needed here.
alter table public.members add column if not exists plan_id uuid references public.membership_plans (id);
create index if not exists members_plan_id_idx on public.members (plan_id);

-- Backfill: link any pre-existing one_time members to the historical
-- 'founding' plan row so their tier is identifiable going forward. Guarded
-- to only touch rows with no plan_id yet — safe to re-run.
update public.members
set plan_id = (select id from public.membership_plans where key = 'founding')
where plan_id is null and plan = 'one_time';
