// Hardcoded member credentials until real Supabase member accounts exist.
export const MEMBER_USERNAME = "meera";
export const MEMBER_PASSWORD = "meera786";

export function isValidMemberCredentials(username: string, password: string): boolean {
  return username.trim() === MEMBER_USERNAME && password === MEMBER_PASSWORD;
}
