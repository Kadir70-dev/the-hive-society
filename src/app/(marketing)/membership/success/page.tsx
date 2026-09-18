import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Membership",
  robots: { index: false, follow: false },
};

async function getPaymentStatus(paymentIntentId: string): Promise<"completed" | "pending" | "failed" | "unknown"> {
  try {
    const admin = getSupabaseAdmin();
    const { data } = await admin
      .from("membership_payments")
      .select("status")
      .eq("ziina_payment_intent_id", paymentIntentId)
      .maybeSingle();
    if (!data) return "unknown";
    return data.status as "completed" | "pending" | "failed";
  } catch {
    return "unknown";
  }
}

const PLAN_NAMES: Record<string, string> = { join: "JOIN", create: "CREATE" };

export default async function MembershipSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ pi?: string; plan?: string }>;
}) {
  const { pi, plan } = await searchParams;

  if (plan) {
    const planName = PLAN_NAMES[plan] ?? "Hive";
    return (
      <div className="section">
        <div className="container" style={{ maxWidth: 480 }}>
          <div className="card stack gap-16" style={{ padding: 32, textAlign: "center" }}>
            <h1 className="h3">You&apos;re on the list.</h1>
            <p className="text-2 small">
              We&apos;ve got your {planName} membership request — we&apos;ll confirm it and follow up shortly.
            </p>
            <Link href="/membership" className="btn btn--outline" style={{ alignSelf: "center" }}>
              Back to Membership
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const status = pi ? await getPaymentStatus(pi) : "unknown";

  const copy = {
    completed: {
      title: "You're in.",
      body: "Your membership is active — a confirmation has been sent to your email.",
    },
    pending: {
      title: "Almost there.",
      body: "We're still confirming your payment — this usually takes a few seconds. Refresh this page shortly, or check your email for confirmation.",
    },
    failed: {
      title: "That payment didn't go through.",
      body: "No charge was made. You can try again from the membership page.",
    },
    unknown: {
      title: "Thanks for starting your membership.",
      body: "We couldn't find that payment reference. If you completed payment, check your email for confirmation — otherwise please try again.",
    },
  }[status];

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 480 }}>
        <div className="card stack gap-16" style={{ padding: 32, textAlign: "center" }}>
          <h1 className="h3">{copy.title}</h1>
          <p className="text-2 small">{copy.body}</p>
          <Link href="/membership" className="btn btn--outline" style={{ alignSelf: "center" }}>
            Back to Membership
          </Link>
        </div>
      </div>
    </div>
  );
}
