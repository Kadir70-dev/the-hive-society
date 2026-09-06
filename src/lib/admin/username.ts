/**
 * Admin login uses a friendly username, but Supabase Auth identifies users
 * by email — this maps one to the other. Not secret (just aliasing), unlike
 * the password itself, which lives only in Supabase Auth (set via the
 * Admin API), never in source.
 */
const USERNAME_EMAIL_MAP: Record<string, string> = {
  meera: "kadirab1999@gmail.com",
};

export function usernameToEmail(username: string): string | null {
  const key = username.trim().toLowerCase();
  return USERNAME_EMAIL_MAP[key] ?? null;
}
