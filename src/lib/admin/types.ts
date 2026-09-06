export type ApplicationStatus = "pending" | "approved" | "rejected" | "waitlisted";

export interface CommunityApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  emirate: string;
  area_city: string | null;
  interests: string[];
  heard_about_us: string | null;
  looking_for: string | null;
  consent: boolean;
  status: ApplicationStatus;
  admin_notes: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  whatsapp_invited_at: string | null;
  created_at: string;
  updated_at: string;
}

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "pending",
  "approved",
  "rejected",
  "waitlisted",
];
