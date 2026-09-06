# Supabase setup

This project has two separate Supabase domains — don't mix their data models:

- **Community applications** (`0001_community_applications.sql`) — the Join
  the Community form backend.
- **Website CMS** (`0002_site_cms.sql`) — editable text/images for the
  marketing site, covered in its own section below.

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
