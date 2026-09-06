import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

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

// Double-click / network-retry protection: if the same email+phone submitted
// again within this window while the earlier row is still pending, treat it
// as the same application instead of creating a duplicate. Deliberately
// short — this is NOT meant to block someone from genuinely re-applying
// later (e.g. after being rejected or waitlisted, or reapplying days/weeks
// on), only to absorb accidental double-submits of the same form session.
const DUPLICATE_WINDOW_MS = 5 * 60 * 1000;

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
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const fullName = clean(data.fullName, 120);
  const email = clean(data.email, 200).toLowerCase();
  const mobile = clean(data.mobile, 30);
  const emirate = clean(data.emirate, 60);
  const area = clean(data.area, 80);
  const interests = Array.isArray(data.interests)
    ? data.interests.filter((i): i is string => typeof i === "string").slice(0, 10).map((i) => i.slice(0, 60))
    : [];
  const heardFrom = clean(data.heardFrom, 120);
  const message = clean(data.message, 1000);
  const consent = data.consent === true;

  if (!fullName || !email || !isValidEmail(email)) {
    return NextResponse.json({ success: false, error: "Please provide a valid name and email." }, { status: 400 });
  }
  if (!mobile) {
    return NextResponse.json({ success: false, error: "Please provide a WhatsApp / mobile number." }, { status: 400 });
  }
  if (!emirate || !EMIRATES.includes(emirate)) {
    return NextResponse.json({ success: false, error: "Please select your Emirate." }, { status: 400 });
  }
  if (!consent) {
    return NextResponse.json({ success: false, error: "Consent is required to join the community." }, { status: 400 });
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    console.error("[community-signup] Supabase is not configured");
    return NextResponse.json(
      { success: false, error: "We couldn't submit your application right now. Please try again shortly." },
      { status: 503 }
    );
  }

  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();
  const { data: existing } = await supabase
    .from("community_applications")
    .select("id")
    .eq("email", email)
    .eq("phone", mobile)
    .eq("status", "pending")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    console.log("[community-signup] duplicate submission absorbed", { emirate, submittedAt: new Date().toISOString() });
    return NextResponse.json({ success: true, applicationId: existing.id });
  }

  const { data: inserted, error } = await supabase
    .from("community_applications")
    .insert({
      full_name: fullName,
      email,
      phone: mobile,
      emirate,
      area_city: area || null,
      interests,
      heard_about_us: heardFrom || null,
      looking_for: message || null,
      consent: true,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !inserted) {
    // Never log name/email/phone/message content — only non-identifying metadata.
    console.error("[community-signup] insert failed", { emirate, interestCount: interests.length });
    return NextResponse.json(
      { success: false, error: "We couldn't submit your application right now. Please try again shortly." },
      { status: 500 }
    );
  }

  console.log("[community-signup] new submission", {
    emirate,
    interestCount: interests.length,
    hasArea: Boolean(area),
    submittedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true, applicationId: inserted.id });
}
