import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0,i).trim(), l.slice(i+1).trim()]; })
);
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Mirrors appExperiences in src/data/experiences.ts exactly — seeds the DB
// with what's already live so nothing visually changes the moment this
// table becomes the source of truth for /app/explore.
const GATHERINGS = [
  { slug: "coffee-morning-circle-app", title: "Coffee Morning Circle", category: "Gather", organiser: "The Morning Table", area: "Yas Island", date_label: "Thu, Sep 10", time_label: "10:00", price_label: "Free", going: 4, attendee_names: ["Maryam", "Sara", "Noor", "Fatima"], verified: true, image_url: "/images/coffee.jpg", description: "A relaxed weekly gathering over coffee and conversation — new faces welcome every week." },
  { slug: "sunrise-pilates-by-the-corniche", title: "Sunrise Pilates by the Corniche", category: "Move", organiser: "Studio Bloom", area: "Al Reem Island", date_label: "Tue, Sep 8", time_label: "06:30", price_label: "Free", going: 4, attendee_names: ["Hana", "Zainab", "Layla", "Amal"], verified: true, image_url: "/images/gym.jpg", description: "Mat pilates as the sun comes up. All levels welcome, mats provided." },
  { slug: "majlis-and-moonlight-unwind-circle", title: "Majlis & Moonlight: Unwind Circle", category: "Unwind", organiser: "Saadiyat Gatherings", area: "Al Bateen", date_label: "Sat, Sep 26", time_label: "19:00", price_label: "Free", going: 3, attendee_names: ["Dana", "Salma", "Noura"], verified: true, image_url: "/images/majlisnight.jpg", description: "An evening majlis — Arabic coffee, dates and easy conversation under warm light." },
  { slug: "ladies-day-brunch-app", title: "Ladies Day Brunch", category: "Celebrate", organiser: "Saadiyat Social Club", area: "Saadiyat", date_label: "Sun, Sep 20", time_label: "12:30", price_label: "AED 180", going: 5, attendee_names: ["Reem", "Alia", "Huda", "Mona", "Rania"], verified: true, image_url: "/images/a4-brunch.jpg", description: "A long, easy brunch by the water with a table set aside just for the Hive." },
  { slug: "pottery-and-clay-workshop-app", title: "Pottery & Clay Workshop", category: "Learn", organiser: "Clay & Co.", area: "Al Mamsha", date_label: "Thu, Sep 17", time_label: "16:00", price_label: "AED 120", going: 6, attendee_names: ["Wadha", "Asma", "Maitha"], verified: true, image_url: "/images/claypot.jpg", description: "Hand-build your first piece with a small group and take it home fired and glazed." },
  { slug: "ladies-tennis-social-app", title: "Ladies Tennis Social", category: "Move", organiser: "Khalifa Courts", area: "Khalifa City", date_label: "Sun, Sep 13", time_label: "08:00", price_label: "AED 60", going: 5, attendee_names: ["Shaikha", "Latifa", "Ghalia"], verified: false, image_url: "/images/tennis.jpg", description: "Doubles rotation for all levels — rackets available to borrow." },
].map((g, i) => ({ ...g, surface: "app", display_order: i }));

const { data, error } = await admin
  .from("gatherings")
  .upsert(GATHERINGS, { onConflict: "slug", ignoreDuplicates: true })
  .select("slug");

if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}

console.log(`Seeded/kept ${data?.length ?? 0} app gatherings.`);
