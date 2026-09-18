import "server-only";
import nodemailer from "nodemailer";

function getTransport() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;
  return nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
}

/**
 * Notifies the team's own inbox (GMAIL_USER) whenever someone joins —
 * community signup or a JOIN/CREATE membership request. Best-effort: never
 * throws, since a notification failure shouldn't block the signup itself.
 */
export async function sendJoinNotification(subject: string, lines: Record<string, string>): Promise<void> {
  const transport = getTransport();
  if (!transport) {
    console.error("[email] GMAIL_USER/GMAIL_APP_PASSWORD not configured — skipping notification");
    return;
  }

  const text = Object.entries(lines)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  try {
    await transport.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject,
      text,
    });
  } catch (err) {
    console.error("[email] failed to send join notification", err);
  }
}
