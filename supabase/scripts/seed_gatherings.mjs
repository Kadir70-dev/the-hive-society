import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0,i).trim(), l.slice(i+1).trim()]; })
);
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Mirrors marketingExperiences in src/data/experiences.ts exactly — seeds
// the DB with what's already live so nothing visually changes the moment
// this table becomes the source of truth for /explore.
const GATHERINGS = [
  { slug: "coffee-morning-circle", title: "Coffee Morning Circle", category: "Gather", organiser: "The Morning Table", area: "Al Bateen", date_label: "Sat, 13 Sep", time_label: "9:00 AM", price_label: "AED 60", going: 14, attendee_names: ["Aisha", "Noor", "Layla", "Mona"], verified: true, image_url: "/images/coffee.jpg", description: "A relaxed weekly gathering over coffee and conversation — new faces welcome every week." },
  { slug: "sunrise-pilates", title: "Sunrise Pilates", category: "Move", organiser: "Studio Bloom", area: "Corniche", date_label: "Sun, 14 Sep", time_label: "6:30 AM", price_label: "AED 90", going: 9, attendee_names: ["Sara", "Reem", "Hana"], verified: true, image_url: "/images/gym.jpg", description: "Mat pilates on the Corniche as the sun comes up. All levels welcome, mats provided." },
  { slug: "majlis-and-moonlight", title: "Majlis & Moonlight", category: "Celebrate", organiser: "Saadiyat Gatherings", area: "Saadiyat", date_label: "Fri, 19 Sep", time_label: "7:30 PM", price_label: "AED 150", going: 22, attendee_names: ["Fatima", "Alia", "Maya", "Dana"], verified: true, image_url: "/images/gathering.jpg", description: "An evening majlis under the stars — music, mezze and easy conversation by the shore." },
  { slug: "ladies-day-brunch", title: "Ladies Day Brunch", category: "Celebrate", organiser: "Maryah Social Club", area: "Al Maryah", date_label: "Fri, 26 Sep", time_label: "1:00 PM", price_label: "AED 220", going: 18, attendee_names: ["Noura", "Rania", "Iman"], verified: true, image_url: "/images/a4-brunch.jpg", description: "A long, easy brunch with a table set aside just for the Hive." },
  { slug: "pottery-and-clay-workshop", title: "Pottery & Clay Workshop", category: "Learn", organiser: "Clay & Co.", area: "Al Reem", date_label: "Sat, 20 Sep", time_label: "4:00 PM", price_label: "AED 180", going: 8, attendee_names: ["Salma", "Huda"], verified: true, image_url: "/images/claypot.jpg", description: "Hand-build your first piece with a small group and take it home fired and glazed." },
  { slug: "ladies-tennis-social", title: "Ladies Tennis Social", category: "Move", organiser: "Khalifa Courts", area: "Khalifa City", date_label: "Sun, 21 Sep", time_label: "5:00 PM", price_label: "AED 100", going: 12, attendee_names: ["Amal", "Zainab", "Yara"], verified: false, image_url: "/images/tennis.jpg", description: "Doubles rotation for all levels — rackets available to borrow." },
  { slug: "padel-social", title: "Padel Social", category: "Move", organiser: "Raha Padel House", area: "Al Raha", date_label: "Thu, 18 Sep", time_label: "7:00 PM", price_label: "AED 110", going: 16, attendee_names: ["Latifa", "Shaikha", "Mariam"], verified: true, image_url: "/images/a7-padel.jpg", description: "Casual padel rounds followed by drinks courtside." },
  { slug: "wellness-evening", title: "Wellness Evening", category: "Unwind", organiser: "Yas Wellness Collective", area: "Yas", date_label: "Tue, 16 Sep", time_label: "6:00 PM", price_label: "AED 130", going: 11, attendee_names: ["Nadia", "Hessa"], verified: true, image_url: "/images/a8-wellness.jpg", description: "Breathwork, sound bath and tea — an evening to slow down together." },
  { slug: "book-club", title: "Book Club", category: "Learn", organiser: "Bateen Readers", area: "Al Bateen", date_label: "Thu, 4 Sep", time_label: "7:00 PM", price_label: "Free", going: 15, attendee_names: ["Wadha", "Asma", "Ghalia"], verified: true, image_url: "/images/a9-bookclub.jpg", description: "This month's pick discussed over tea — new members always welcome." },
  { slug: "creative-workshop", title: "Creative Workshop", category: "Learn", organiser: "Reem Makers Studio", area: "Al Reem", date_label: "Sat, 27 Sep", time_label: "3:00 PM", price_label: "AED 140", going: 10, attendee_names: ["Maitha", "Ayesha"], verified: true, image_url: "/images/a10-creative.jpg", description: "A guided afternoon of watercolour and journaling, materials included." },
  { slug: "outdoor-gathering", title: "Outdoor Gathering", category: "Explore", organiser: "Hudayriyat Explorers", area: "Hudayriyat", date_label: "Fri, 12 Sep", time_label: "5:30 PM", price_label: "AED 70", going: 20, attendee_names: ["Khawla", "Sumaya", "Lulwa", "Fajer"], verified: true, image_url: "/images/a11-outdoor.jpg", description: "Sunset walk and beach picnic to close the week, easy pace throughout." },
].map((g, i) => ({ ...g, display_order: i }));

const { data, error } = await admin
  .from("gatherings")
  .upsert(GATHERINGS, { onConflict: "slug", ignoreDuplicates: true })
  .select("slug");

if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}

console.log(`Seeded/kept ${data?.length ?? 0} gatherings.`);
