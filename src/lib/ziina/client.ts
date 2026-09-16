import "server-only";

const ZIINA_API_BASE = "https://api-v2.ziina.com/api";

function getZiinaApiKey(): string {
  const key = process.env.ZIINA_API_KEY;
  if (!key) throw new Error("Missing ZIINA_API_KEY environment variable.");
  return key;
}

function isZiinaTestMode(): boolean {
  return process.env.ZIINA_TEST_MODE === "true";
}

export function aedToFils(amountAed: number): number {
  return Math.round(amountAed * 100);
}

export interface ZiinaPaymentIntent {
  id: string;
  redirect_url: string;
  status: "requires_payment_instrument" | "pending" | "requires_user_action" | "completed" | "failed";
}

export async function createZiinaPaymentIntent(params: {
  amountAed: number;
  successUrl: string;
  cancelUrl: string;
  message?: string;
}): Promise<ZiinaPaymentIntent> {
  const res = await fetch(`${ZIINA_API_BASE}/payment_intent`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getZiinaApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: aedToFils(params.amountAed),
      currency_code: "AED",
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      message: params.message,
      test: isZiinaTestMode(),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Ziina createPaymentIntent failed (${res.status}): ${body}`);
  }

  return res.json();
}

export async function getZiinaPaymentIntent(id: string): Promise<ZiinaPaymentIntent> {
  const res = await fetch(`${ZIINA_API_BASE}/payment_intent/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${getZiinaApiKey()}` },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Ziina getPaymentIntent failed (${res.status}): ${body}`);
  }

  return res.json();
}

export async function registerZiinaWebhook(url: string, secret: string): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${ZIINA_API_BASE}/webhook`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getZiinaApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, secret }),
  });

  return res.json();
}
