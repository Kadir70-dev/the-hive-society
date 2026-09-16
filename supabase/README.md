# Supabase setup

This project has three separate Supabase domains — don't mix their data models:

- **Community applications** (`0001_community_applications.sql`) — the Join
  the Community form backend.
- **Website CMS** (`0002_site_cms.sql`) — editable text/images for the
  marketing site, covered in its own section below.
- **Gatherings** (`0003_gatherings.sql`) — the Explore Gatherings cards,
  covered in its own section below.
- **Memberships** (`0004_memberships.sql`) — paid membership via Ziina,
  covered in its own section below.

## Community applications

### 1. Run the migration

In the Supabase project's SQL editor, run `migrations/0001_community_applications.sql`
(or `supabase db push` if you use the Supabase CLI locally). It creates:

- `community_applications` — one row per Join the Community submission.
- `admin_users` — explicit allow-list of who may use `/admin/community`.

Both tables have Row Level Security enabled with **no** policies for `anon` or
`authenticated`. Every read/write goes through the service-role key, used
only in server-only code (`src/lib/supabase/admin.ts`), after an
application-level admin check. This means neither the public site nor a
logged-in-but-non-admin account can query these tables directly, even with
valid credentials.

### 2. Configure environment variables

Copy the three `SUPABASE_*` / `NEXT_PUBLIC_SUPABASE_*` values from
Project Settings → API into `.env.local` for local dev, and into the
existing Netlify site's environment variables for production. See
`.env.example` for the exact variable names.

### 3. Admin login — username + password

`/admin/login` uses Supabase Auth's email+password sign-in
(`supabase.auth.signInWithPassword`), with a friendly "username" that maps to
a real backing email via a small non-secret lookup table in
`src/lib/admin/username.ts` (`USERNAME_EMAIL_MAP`). The password itself is
never in source — it lives only in Supabase Auth, set via the Admin API:

```js
await admin.auth.admin.updateUserById(userId, { password: "..." });
```

To add a new admin:
1. Create their `auth.users` row (Admin API `createUser` or the dashboard's
   Authentication → Users → **Invite user**, then set a password the same way).
2. Add a `username -> email` entry in `USERNAME_EMAIL_MAP`.
3. Insert their `admin_users` row:

   ```sql
   insert into public.admin_users (user_id, email)
   values ('<uuid-from-step-1>', '<their-email>');
   ```

   Until this row exists, that person's username/password will authenticate
   but they'll be redirected to `/admin/not-authorized`.

### Duplicate-submission handling

The same email + phone submitted again within 5 minutes while the earlier
row is still `pending` is treated as the same application (the existing
`applicationId` is returned, no new row is created). This absorbs
accidental double-clicks / network retries without permanently blocking a
genuine future re-application — e.g. someone who was `rejected` or
`waitlisted` can submit again later and it creates a new row.

## Website CMS

### 1. Run the migration

Run `migrations/0002_site_cms.sql` in the SQL editor. It creates:

- `site_content` — one row per editable text field, keyed by a stable
  `content_key` (e.g. `home.hero.title`), never by its visible string value.
- `site_media` — one row per editable image, keyed by `media_key`. When no
  row exists (or `storage_path` is null), the page falls back to the image
  already shipped in the codebase — nothing goes blank while migrating.
- `content_revisions` — old/new value history, written automatically by a
  trigger whenever `site_content.value` changes.

Same RLS pattern as community_applications: enabled with zero anon/authenticated
policies, reachable only via the service-role key from server-only code
(`getPageContent`/`getPageMedia` in Server Components for reads, admin-checked
API routes under `/api/admin/content` and `/api/admin/media` for writes).

The `site-images` Storage bucket is **not** created by this SQL file — it's
public and was created via the Supabase Admin API
(`supabase.storage.createBucket`) instead, since a `storage.buckets` insert
run through the SQL editor caused the whole migration script to fail/roll
back on this project. If you ever need to recreate it: public bucket named
`site-images`, `image/jpeg`/`image/png`/`image/webp` only, 8MB file size limit.

### 2. Seed the current site copy

```
node supabase/scripts/seed_content.mjs
```

Upserts all ~130 current hardcoded strings into `site_content` using
`ignoreDuplicates: true` — safe to re-run any time (e.g. after adding a new
page's rows to the script); it will never overwrite a row an admin has
already edited through the CMS.

### 3. Editing

Any admin (from the same `admin_users` table as community applications) sees
an "Edit Mode" toggle bottom-right on every marketing page. With it on,
double-click any text to edit inline, or hover an image for a small "Change
image" control. Nothing renders for anon visitors or non-admin accounts —
verified via RLS, via the admin-session check in every API route, and via
raw HTML inspection (no CMS markup at all in the response for a public
request).

## Gatherings

### 1. Run the migration

Run `migrations/0003_gatherings.sql` in the SQL editor. It creates
`gatherings` — one row per card shown on the public `/explore` page (title,
image, category, organiser, area, date/time/price labels, going count,
attendee names, verified flag, description, publish state). Same RLS
pattern as every other table here: enabled, zero anon/authenticated
policies, service-role only. Reads go through
`src/lib/content/getGatherings.ts` (falls back to the hardcoded
`marketingExperiences` array in `src/data/experiences.ts` if the table is
ever empty or unreachable); writes go through admin-checked API routes
under `/api/admin/gatherings`. Images reuse the same `site-images` Storage
bucket as the CMS above, under a `gatherings/` prefix.

### 2. Seed the current cards

```
node supabase/scripts/seed_gatherings.mjs
```

Inserts the 11 cards that are already hardcoded today, so nothing visually
changes on `/explore` the moment this table becomes the source of truth —
safe to re-run any time (`ignoreDuplicates` on `slug`).

### 3. Editing

Admins get a "Gatherings" link in the same bottom-right toolbar as
"Community". `/admin/gatherings` lists every card (including unpublished
ones) with Add / Edit / Delete.

## Memberships (Ziina)

Paid membership on `/membership`, processed by [Ziina](https://ziina.com),
the UAE payment app. Two plans, both defined as plain constants in
`src/data/membershipPlans.ts` — edit the file and redeploy to change price
or copy, no migration needed.

**Important limitation:** Ziina's public API is a single-shot Payment
Intent, not a subscription product — there is no documented way to save a
card and auto-charge it again next cycle. "Monthly" therefore means: the
member pays now, `members.current_period_end` is set 30 days out, and when
it lapses someone (Meera, or a future reminder job) has to send them a fresh
checkout link. It is not silent auto-renewal — don't market it as one.

### 1. Run the migration

Run `migrations/0004_memberships.sql` in the SQL editor. It creates
`members` (one row per person who has started a checkout) and
`membership_payments` (one row per Ziina Payment Intent — a monthly member
accumulates one per cycle). Same RLS pattern as every other table here:
enabled, zero anon/authenticated policies, service-role only.

### 2. Get a Ziina API key

Generate an access token at
[docs.ziina.com/developers/custom-integration](https://docs.ziina.com/developers/custom-integration)
(phone/OTP/email — instant, shown only once). Add it to `.env.local` and to
the Netlify site's environment variables as `ZIINA_API_KEY`. Leave
`ZIINA_TEST_MODE=true` until you're ready to take real payments — Ziina's
test mode accepts any card and makes no real charge.

### 3. Register the webhook

```
node supabase/scripts/register_ziina_webhook.mjs
```

Registers `https://<your-site>/api/webhooks/ziina` with Ziina and prints a
signing secret — add that to `.env.local` / Netlify as
`ZIINA_WEBHOOK_SECRET`. **The webhook, not the success-page redirect, is
what marks a membership active** — anyone can hit the success URL without
paying, so it only ever shows a status message, never grants membership
itself.

The exact webhook signature header wasn't available in Ziina's public docs
at build time — `SIGNATURE_HEADER` in
`src/app/api/webhooks/ziina/route.ts` is a best guess (`ziina-signature`).
Send one test-mode payment, log the incoming request headers, and correct
that constant if it doesn't match — everything else in the handler stays
the same.

### 4. Checking on members

Admins get a "Members" link in the toolbar. `/admin/members` lists everyone
who has started a checkout, their plan, status, renewal date, and full
payment history, plus a manual "Mark active" override for the rare case a
payment is confirmed in the Ziina dashboard but the webhook never arrived.

### Not yet built

A member-facing login so someone can see their own membership status
without asking Meera — designed to reuse the existing Supabase Auth session
helper (`src/lib/supabase/server.ts`) via a passwordless magic-link, same
underlying mechanism as admin login just without the `admin_users`
allow-list. Deliberately left for a follow-up pass once the payment flow
above is live and confirmed working.
