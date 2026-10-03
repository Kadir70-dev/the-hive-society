import Link from "next/link";
import type { Metadata } from "next";
import { circles } from "@/data/circles";
import { JoinCommunityButton } from "@/components/forms/JoinCommunityButton";
import { EditableText, EditableHeading, EditableLabel } from "@/components/content/EditableText";
import { getPageContent, resolve } from "@/lib/content/getPageContent";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Not just where you book an activity — where trusted circles grow.",
};

const STEPS = [
  { n: "01", titleKey: "community.steps.1.title", title: "Attend", bodyKey: "community.steps.1.body", body: "Show up to a gathering that fits your mood." },
  {
    n: "02",
    titleKey: "community.steps.2.title",
    title: "Reconnect",
    bodyKey: "community.steps.2.body",
    body: "See familiar faces at the next one — and the one after that.",
  },
  { n: "03", titleKey: "community.steps.3.title", title: "Belong", bodyKey: "community.steps.3.body", body: "Your Hive grows every time you show up." },
];

const recurring = [
  { name: "Coffee & Conversations", cadence: "Tuesdays, weekly" },
  { name: "Weekend Padel", cadence: "Saturdays, weekly" },
  { name: "Book Club", cadence: "First Thursday, monthly" },
  { name: "Outdoor Explorers", cadence: "Every other Friday" },
];

export default async function CommunityPage() {
  const content = await getPageContent("community");
  const t = (key: string, fallback: string) => resolve(content, key, fallback);

  return (
    <>
      <section className="j-pagehero j-pagehero--maroon j-on-dark">
        <div className="j-wrap">
          <EditableLabel contentKey="community.masthead.eyebrow" value={t("community.masthead.eyebrow", "Community")} className="j-label" />
          <EditableHeading
            as="h1"
            contentKey="community.masthead.quote"
            value={t("community.masthead.quote", "You come for a gathering. You return for your Hive.")}
            className="j-display j-pagehero__title je-title-long"
          />
          <EditableText
            as="p"
            multiline
            contentKey="community.masthead.lede"
            value={t("community.masthead.lede", "Not just where you book an activity — where trusted circles grow.")}
            className="j-lede j-pagehero__lede"
          />
        </div>
      </section>

      <section className="j-section je-circles">
        <div className="j-wrap jc-split">
          <div>
            <EditableHeading
              as="h2"
              contentKey="community.circles.heading"
              value={t("community.circles.heading", "Community forms around what you love.")}
              className="j-display j-h2"
            />
            <EditableLabel
              contentKey="community.circles.preview_label"
              value={t("community.circles.preview_label", "Preview — sign in to see your circles")}
              className="jc-note"
            />
          </div>
          <ul className="je-circles__rows">
            {circles.map((circle) => (
              <li key={circle.slug}>
                <span className="je-circles__info">
                  <span className="je-circles__name">{circle.name}</span>
                  <span className="je-circles__meta">{circle.cadence}</span>
                </span>
                <span className="je-circles__count">
                  <strong>{circle.members}</strong>
                  <span>women</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="j-section section--dark jc-steps je-steps-dark">
        <div className="j-wrap">
          <EditableLabel
            contentKey="community.steps.eyebrow"
            value={t("community.steps.eyebrow", "How Belonging Grows")}
            className="j-label"
          />
          <EditableHeading
            as="h2"
            contentKey="community.steps.heading"
            value={t("community.steps.heading", "Three visits, and it stops feeling new.")}
            className="j-display j-h2 je-principles__title"
          />
          <ol className="jc-steps__list">
            {STEPS.map((s) => (
              <li key={s.n}>
                <span className="jc-steps__n" aria-hidden="true">{s.n}</span>
                <EditableHeading as="h3" contentKey={s.titleKey} value={t(s.titleKey, s.title)} className="j-display" />
                <EditableText as="p" multiline contentKey={s.bodyKey} value={t(s.bodyKey, s.body)} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="j-section je-recurring">
        <div className="j-wrap jc-split">
          <div>
            <EditableLabel contentKey="community.recurring.eyebrow" value={t("community.recurring.eyebrow", "Recurring Gatherings")} className="j-label" />
            <EditableHeading
              as="h2"
              contentKey="community.recurring.heading"
              value={t("community.recurring.heading", "Trusted circles that meet again and again.")}
              className="j-display j-h2"
            />
            <EditableText
              as="p"
              multiline
              contentKey="community.recurring.paragraph"
              value={t("community.recurring.paragraph", "Hive circles meet on a rhythm — belonging isn’t one night, it’s a habit.")}
              className="j-lede je-recurring__lede"
            />
          </div>
          <ul className="je-circles__rows">
            {recurring.map((r) => (
              <li key={r.name}>
                <span className="je-circles__info">
                  <span className="je-circles__name">{r.name}</span>
                  <span className="je-circles__meta">{r.cadence}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="je-trust">
        <div className="j-wrap">
          <ul className="je-trust__list">
            <li><EditableLabel contentKey="community.badges.1" value={t("community.badges.1", "Verified organisers")} /></li>
            <li><EditableLabel contentKey="community.badges.2" value={t("community.badges.2", "Community guidelines")} /></li>
            <li><EditableLabel contentKey="community.badges.3" value={t("community.badges.3", "Safe reporting")} /></li>
          </ul>
          <p className="je-trust__text">
            <EditableText
              as="span"
              contentKey="community.guidelines.paragraph"
              value={t("community.guidelines.paragraph", "Every host is reviewed before going live. Concerns are handled quickly and privately.")}
            />{" "}
            <Link href="/community-guidelines" className="je-trust__link">
              <EditableLabel contentKey="community.guidelines.link_label" value={t("community.guidelines.link_label", "Read our guidelines →")} />
            </Link>
          </p>
        </div>
      </section>

      <section className="je-cta">
        <div className="j-wrap je-cta__inner">
          <EditableHeading
            hero
            as="h2"
            contentKey="community.closing.heading"
            value={t("community.closing.heading", "Ready to find your circle?")}
            className="j-display je-cta__title"
          />
          <div className="je-cta__actions">
            <Link href="/explore" className="j-btn j-btn--apricot">
              <EditableLabel contentKey="community.closing.primary_label" value={t("community.closing.primary_label", "Explore Gatherings")} />
            </Link>
            <JoinCommunityButton className="j-btn je-btn--outline" />
          </div>
        </div>
      </section>
    </>
  );
}
