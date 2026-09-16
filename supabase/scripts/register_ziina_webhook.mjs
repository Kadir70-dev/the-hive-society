import { readFileSync } from "fs";
import { randomBytes } from "crypto";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0,i).trim(), l.slice(i+1).trim()]; })
);

if (!env.ZIINA_API_KEY) {
  console.error("Missing ZIINA_API_KEY in .env.local — generate one at docs.ziina.com/developers/custom-integration first.");
  process.exit(1);
}

const siteUrl = env.NEXT_PUBLIC_SITE_URL || "https://thehivesociety.ae";
const webhookUrl = `${siteUrl}/api/webhooks/ziina`;
const secret = randomBytes(32).toString("hex");

const res = await fetch("https://api-v2.ziina.com/api/webhook", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${env.ZIINA_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ url: webhookUrl, secret }),
});

const body = await res.json().catch(() => null);

if (!res.ok || !body?.success) {
  console.error("Webhook registration failed:", body?.error || res.status);
  process.exit(1);
}

console.log(`Webhook registered for ${webhookUrl}`);
console.log("");
console.log("Add this to .env.local AND your Netlify site's environment variables:");
console.log(`ZIINA_WEBHOOK_SECRET=${secret}`);
console.log("");
console.log("Next: trigger a test-mode payment and check the incoming request headers in");
console.log("src/app/api/webhooks/ziina/route.ts to confirm the signature header name matches SIGNATURE_HEADER.");
