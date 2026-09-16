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

export default async function MembershipSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ pi?: string }>;
}) {
  const { pi } = await searchParams;
  const status = pi ? await getPaymentStatus(pi) : "unknown";

  const copy = {
    completed: {
      title: "You're in.",
      body: "Your membership is active — a confirmation has been sent to your email.",
    },
    pending: {
      title: "Almost there.",
      body: "We're still confirming your payment with Ziina — this usually takes a few seconds. Refresh this page shortly, or check your email for confirmation.",
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
