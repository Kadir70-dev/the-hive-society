import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

// Ziina's docs don't spell out the exact header name in what we could fetch
// at build time — confirm this against a real delivery in Ziina's test mode
// (log req.headers once, then lock it in) and adjust if needed. Everything
// else about this handler stays the same either way.
const SIGNATURE_HEADER = "ziina-signature";

function verifySignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  const secret = process.env.ZIINA_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhooks/ziina] ZIINA_WEBHOOK_SECRET not configured — rejecting");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get(SIGNATURE_HEADER);

  if (!verifySignature(rawBody, signature, secret)) {
    console.error("[webhooks/ziina] signature verification failed");
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as { event?: string; data?: { id?: string; status?: string } };

  if (payload.event !== "payment_intent.status.updated" || !payload.data?.id) {
    return NextResponse.json({ ok: true }); // not an event we act on
  }

  const { id: paymentIntentId, status } = payload.data;
  const admin = getSupabaseAdmin();

  const { data: payment, error: findError } = await admin
    .from("membership_payments")
    .select("id, member_id, plan")
    .eq("ziina_payment_intent_id", paymentIntentId)
    .maybeSingle();

  if (findError || !payment) {
    console.error("[webhooks/ziina] no matching payment row for intent", paymentIntentId);
    return NextResponse.json({ ok: true }); // ack anyway — nothing to retry
  }

  if (status === "completed") {
    await admin.from("membership_payments").update({ status: "completed" }).eq("id", payment.id);

    const currentPeriodEnd =
      payment.plan === "monthly" ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null;

    await admin
      .from("members")
      .update({ status: "active", current_period_end: currentPeriodEnd })
      .eq("id", payment.member_id);
  } else if (status === "failed") {
    await admin.from("membership_payments").update({ status: "failed" }).eq("id", payment.id);
  }

  return NextResponse.json({ ok: true });
}
