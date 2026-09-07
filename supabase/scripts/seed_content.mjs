import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0,i).trim(), l.slice(i+1).trim()]; })
);
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const GLOBAL_PREFIXES = new Set(["nav", "footer", "modal"]);

function row(content_key, content_type, value) {
  const prefix = content_key.split(".")[0];
  const page_key = GLOBAL_PREFIXES.has(prefix) ? "global" : prefix;
  return { content_key, page_key, content_type, value };
}

const HOME = [
  row("home.hero.kicker", "label", "Launching Soon in Abu Dhabi"),
  row("home.hero.title", "heading", "No one has to show up alone."),
  row("home.hero.lede", "text", "A trusted women’s community across the UAE — built on real gatherings, not another app to browse."),
  row("home.why.heading", "heading", "Belonging, not another app to browse."),
  row("home.why.1.title", "heading", "Curated, not endless."),
  row("home.why.1.body", "text", "Real gatherings picked with care — not another feed to scroll."),
  row("home.why.2.title", "heading", "Real women, real rooms."),
  row("home.why.2.body", "text", "See who’s showing up before you decide to join them."),
  row("home.why.3.title", "heading", "Belonging that continues."),
  row("home.why.3.body", "text", "The relationships outlast the event — that’s the whole point."),
  row("home.bleed.tennis.caption", "caption", "Khalifa City, Abu Dhabi"),
  row("home.experiences.eyebrow", "label", "The Experience"),
  row("home.experiences.heading", "heading", "Gather beautifully, your way."),
  row("home.experiences.link_label", "link", "Explore Experiences"),
  row("home.experiences.coffee.label", "label", "Coffee"),
  row("home.experiences.dinners.label", "label", "Dinners"),
  row("home.experiences.networking.label", "label", "Networking"),
  row("home.experiences.wellness.label", "label", "Wellness"),
  row("home.experiences.gatherings.label", "label", "Gatherings"),
  row("home.experiences.workshops.label", "label", "Workshops"),
  row("home.how.eyebrow", "label", "How It Works"),
  row("home.how.heading", "heading", "From first visit to real belonging."),
  row("home.how.1.title", "heading", "Join"),
  row("home.how.1.body", "text", "Tell us a little about you."),
  row("home.how.2.title", "heading", "Review"),
  row("home.how.2.body", "text", "A brief, human check — not automatic."),
  row("home.how.3.title", "heading", "Connect"),
  row("home.how.3.body", "text", "A relevant invitation, when there’s a fit."),
  row("home.how.4.title", "heading", "Experience"),
  row("home.how.4.body", "text", "Show up, and keep showing up."),
  row("home.app.eyebrow", "label", "The Hive App"),
  row("home.app.quote", "text", "The website and community form are live today. The app comes next."),
  row("home.app.link_label", "link", "Preview the app →"),
  row("home.cta.heading", "heading", "Your next gathering starts here."),
  row("home.cta.subtext", "text", "No one has to show up alone."),
  row("home.cta.secondary_label", "button", "Explore Experiences"),
];

const COMMUNITY = [
  row("community.masthead.eyebrow", "label", "Community"),
  row("community.masthead.quote", "heading", "You come for a gathering. You return for your Hive."),
  row("community.masthead.lede", "text", "The Hive isn’t just where you book an activity — it’s where relationships and trusted circles grow."),
  row("community.circles.heading", "heading", "Community forms around what you love."),
  row("community.circles.preview_label", "label", "Preview — sign in to see your circles"),
  row("community.steps.1.title", "heading", "Attend"),
  row("community.steps.1.body", "text", "Show up to a gathering that fits your mood."),
  row("community.steps.2.title", "heading", "Reconnect"),
  row("community.steps.2.body", "text", "See familiar faces at the next one — and the one after that."),
  row("community.steps.3.title", "heading", "Belong"),
  row("community.steps.3.body", "text", "Your Hive grows every time you show up."),
  row("community.recurring.eyebrow", "label", "Recurring Gatherings"),
  row("community.recurring.heading", "heading", "Trusted circles that meet again and again."),
  row("community.recurring.paragraph", "paragraph", "Beyond one-off events, Hive circles gather on a rhythm — so belonging isn’t a single night, it’s a habit."),
  row("community.badges.1", "label", "Verified organisers"),
  row("community.badges.2", "label", "Community guidelines"),
  row("community.badges.3", "label", "Safe reporting"),
  row("community.guidelines.paragraph", "paragraph", "Every host is reviewed before their gathering goes live, and concerns are reviewed quickly and privately."),
  row("community.guidelines.link_label", "link", "Read our guidelines →"),
  row("community.closing.heading", "heading", "Ready to find your circle?"),
  row("community.closing.primary_label", "button", "Explore Gatherings"),
];

const MEMBERSHIP = [
  row("membership.masthead.eyebrow", "label", "Join the Community"),
  row("membership.masthead.title", "heading", "Be part of it from day one."),
  row("membership.masthead.lede", "text", "Stay connected for gatherings, meetups, events and launch updates."),
  row("membership.masthead.tag", "label", "Pre-launch — paid membership is proposed for later and not yet available"),
  row("membership.form.title", "heading", "Join the Community"),
  row("membership.form.subtitle", "text", "Tell us a little about you — we’ll follow up with relevant updates and invitations."),
  row("membership.community_tier.eyebrow", "label", "Community Access"),
  row("membership.community_tier.title", "heading", "Hive Community"),
  row("membership.community_tier.description", "text", "Everything you need to start exploring and meeting people, free."),
  row("membership.community_tier.feature_1", "label", "Discover experiences"),
  row("membership.community_tier.feature_2", "label", "Join community circles"),
  row("membership.community_tier.feature_3", "label", "Save activities"),
  row("membership.community_tier.feature_4", "label", "Standard booking access"),
  row("membership.community_tier.button_label", "button", "Start Exploring"),
  row("membership.premium_tier.eyebrow", "label", "Premium Tier · Proposed"),
  row("membership.premium_tier.title", "heading", "Hive Membership"),
  row("membership.premium_tier.description", "text", "Priority and curation for women who want to make the most of every season. Price to be announced."),
  row("membership.premium_tier.feature_1", "label", "Everything in Hive Community"),
  row("membership.premium_tier.feature_2", "label", "Early access to selected gatherings"),
  row("membership.premium_tier.feature_3", "label", "Priority booking"),
  row("membership.premium_tier.feature_4", "label", "Member-only experiences & circles"),
  row("membership.premium_tier.feature_5", "label", "Partner benefits & seasonal offers"),
  row("membership.premium_tier.button_label", "button", "Join the Community"),
  row("membership.faq.heading", "heading", "Membership questions."),
  row("membership.faq.1.question", "text", "When does Hive Membership launch?"),
  row("membership.faq.1.answer", "paragraph", "We're finalising membership details with our founding community. Waitlist members will be the first to know."),
  row("membership.faq.2.question", "text", "How much will it cost?"),
  row("membership.faq.2.answer", "paragraph", "Pricing hasn't been confirmed yet. It will be shared with waitlist members before public launch."),
  row("membership.faq.3.question", "text", "Do I need to be a member to book gatherings?"),
  row("membership.faq.3.answer", "paragraph", "Yes — if you are hosting a gathering, you need to be a Hive Member. For simply joining or attending a gathering, membership is not required."),
  row("membership.faq.4.question", "text", "What are founding member benefits?"),
  row("membership.faq.4.answer", "paragraph", "Early waitlist members will receive early access and preferred pricing once membership tiers are finalised."),
];

const ABOUT = [
  row("about.hero.eyebrow", "label", "About"),
  row("about.hero.title", "heading", "Built in Abu Dhabi. Designed around how women actually gather here."),
  row("about.intro.lede", "text", "The real barrier was never finding something to do — it was not wanting to arrive alone."),
  row("about.intro.paragraph", "paragraph", "The Hive Society exists to close that gap: real gatherings, trusted faces, a community worth returning to."),
  row("about.team.eyebrow", "label", "Our Team"),
  row("about.team.founder.title", "heading", "Founder & CEO"),
  row("about.team.founder.bio", "text", "Placeholder — biography to be confirmed"),
  row("about.team.cofounder.title", "heading", "Co-Founder & CTO"),
  row("about.team.cofounder.bio", "text", "Placeholder — biography to be confirmed"),
  row("about.neighbourhoods.eyebrow", "label", "Where We Gather"),
  row("about.neighbourhoods.heading", "heading", "Across Abu Dhabi’s neighbourhoods."),
  row("about.neighbourhoods.disclaimer", "text", "Venue names are not implied partners unless stated on the specific gathering."),
  row("about.principles.heading", "heading", "What every gathering strengthens."),
  row("about.principles.1.title", "heading", "Trust"),
  row("about.principles.1.desc", "text", "Verified hosts, respectful spaces."),
  row("about.principles.2.title", "heading", "Connect"),
  row("about.principles.2.desc", "text", "Women who share your interests."),
  row("about.principles.3.title", "heading", "Belong"),
  row("about.principles.3.desc", "text", "A Hive that grows with you."),
];

const EXPLORE = [
  row("explore.hero.eyebrow", "label", "Explore"),
  row("explore.hero.title", "heading", "Explore Gatherings"),
  row("explore.hero.lede", "text", "Discover what’s happening across Abu Dhabi this season."),
  row("explore.cta.quote", "heading", "Hosting something the Hive would love?"),
  row("explore.cta.button_label", "button", "Host an Activity"),
];

const GLOBAL = [
  row("nav.home", "label", "Home"),
  row("nav.community", "label", "Community"),
  row("nav.experiences", "label", "Experiences"),
  row("nav.about", "label", "About"),
  row("nav.join", "label", "Join the Community"),
  row("nav.open_app", "button", "Open App"),
  row("footer.tagline", "text", "No one has to show up alone."),
  row("footer.description", "text", "A social discovery and booking platform for women in the UAE."),
  row("footer.discover_heading", "label", "Discover"),
  row("footer.company_heading", "label", "Company"),
  row("footer.copyright", "text", "© 2026 The Hive Society, Abu Dhabi, UAE"),
  row("footer.social_coming_soon", "text", "Instagram · TikTok · LinkedIn · YouTube — coming soon"),
  row("modal.join.title", "heading", "Join the Community"),
  row("modal.join.subtitle", "text", "Tell us a little about you — we’ll follow up with relevant updates and invitations."),
  row("modal.signin.title", "heading", "Step inside the Hive."),
  row("modal.signin.body", "text", "Full accounts are coming soon — until then, explore a live preview of the member experience."),
  row("modal.signin.button_label", "button", "Open App Preview"),
];

const rows = [...HOME, ...COMMUNITY, ...MEMBERSHIP, ...ABOUT, ...EXPLORE, ...GLOBAL];

// ignoreDuplicates: never overwrite a row that already exists — this script
// is re-run as more pages are migrated, and must not clobber live edits.
const { error } = await admin.from("site_content").upsert(rows, { onConflict: "content_key", ignoreDuplicates: true });
if (error) {
  console.error("SEED_ERROR", error);
  process.exit(1);
}
console.log(`Seeded ${rows.length} rows.`);
