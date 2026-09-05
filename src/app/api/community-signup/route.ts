import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const EMIRATES = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Fujairah",
  "Umm Al Quwain",
  "Other / Outside UAE",
];

function clean(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const fullName = clean(data.fullName, 120);
  const email = clean(data.email, 200).toLowerCase();
  const mobile = clean(data.mobile, 30);
  const emirate = clean(data.emirate, 60);
  const area = clean(data.area, 80);
  const interests = Array.isArray(data.interests)
    ? data.interests.filter((i): i is string => typeof i === "string").slice(0, 10)
    : [];
  const heardFrom = clean(data.heardFrom, 120);
  const message = clean(data.message, 1000);
  const consent = data.consent === true;

  if (!fullName || !email || !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Please provide a valid name and email." }, { status: 400 });
  }
  if (!mobile) {
    return NextResponse.json({ ok: false, error: "Please provide a WhatsApp / mobile number." }, { status: 400 });
  }
  if (!emirate || !EMIRATES.includes(emirate)) {
    return NextResponse.json({ ok: false, error: "Please select your Emirate." }, { status: 400 });
  }
  if (!consent) {
    return NextResponse.json({ ok: false, error: "Consent is required to join the community." }, { status: 400 });
  }

  const entry = {
    fullName,
    email,
    mobile,
    emirate,
    area,
    interests,
    heardFrom,
    message,
    consent: true,
    submittedAt: new Date().toISOString(),
  };

  // Server logs are NOT a datastore for personal data — keep this to non-identifying
  // metadata only (no name, email, mobile or free-text message content).
  console.log("[community-signup] new submission", {
    emirate,
    interestCount: interests.length,
    hasArea: Boolean(area),
    submittedAt: entry.submittedAt,
  });

  // Best-effort local append, useful for local/dev only.
  // TODO(production blocker): replace with a real datastore or CRM (e.g. Airtable, a managed
  // DB, or an email/CRM integration) before launch. Netlify's serverless functions run on an
  // ephemeral (often read-only) filesystem, so this file will NOT persist across invocations
  // or deploys in production — do not treat it as durable storage.
  //
  // Future WhatsApp Community flow (not built yet — no invite links exist in this codebase):
  // once a real datastore is in place, submissions should be reviewed and categorised by
  // `emirate` + `interests` so the right WhatsApp group invite can be shared manually or via
  // an approved integration. Never auto-add anyone to a WhatsApp group, and never expose an
  // invite link publicly until it's explicitly configured for that purpose.
  try {
    const dir = path.join(process.cwd(), ".data");
    await fs.mkdir(dir, { recursive: true });
    await fs.appendFile(path.join(dir, "community-signup.jsonl"), JSON.stringify(entry) + "\n", "utf8");
  } catch (err) {
    console.warn("[community-signup] local file append skipped:", err);
  }

  return NextResponse.json({ ok: true });
}
