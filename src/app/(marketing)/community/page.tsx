import Link from "next/link";
import type { Metadata } from "next";
import { circles } from "@/data/circles";
import { JoinCommunityButton } from "@/components/forms/JoinCommunityButton";
import { EditableText, EditableHeading, EditableLabel } from "@/components/content/EditableText";
import { EditableImage } from "@/components/content/EditableImage";
import { getPageContent, resolve } from "@/lib/content/getPageContent";
import { getPageMedia, resolveMedia } from "@/lib/content/getPageMedia";

export const metadata: Metadata = {
  title: "Community",
  description:
    "The Hive isn't just where you book an activity — it's where relationships and trusted circles grow.",
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
  const [content, media] = await Promise.all([getPageContent("community"), getPageMedia("community")]);
  const t = (key: string, fallback: string) => resolve(content, key, fallback);

  const closingImage = resolveMedia(media, "community.closing.image", {
    url: "/images/a8-wellness.jpg",
    alt: "A Hive wellness evening gathering",
  });

  return (
    <>
      <div className="masthead section--dark hex-texture">
        <div className="container stack gap-14">
          <EditableLabel contentKey="community.masthead.eyebrow" value={t("community.masthead.eyebrow", "Community")} className="eyebrow" />
          <EditableHeading
            as="p"
            contentKey="community.masthead.quote"
            value={t("community.masthead.quote", "You come for a gathering. You return for your Hive.")}
            className="pull-quote"
            style={{ maxWidth: "18ch" }}
          />
          <EditableText
            as="p"
            multiline
            contentKey="community.masthead.lede"
            value={t(
              "community.masthead.lede",
              "The Hive isn’t just where you book an activity — it’s where relationships and trusted circles grow."
            )}
            className="lede"
          />
        </div>
      </div>

      <div className="section section--intimate hex-texture hex-texture--light">
        <div className="container">
          <div
            className="row wrap gap-16"
            style={{ justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}
          >
            <EditableHeading
              as="h2"
              contentKey="community.circles.heading"
              value={t("community.circles.heading", "Community forms around what you love.")}
              className="h2"
              style={{ maxWidth: "16ch" }}
            />
            <EditableLabel
              contentKey="community.circles.preview_label"
              value={t("community.circles.preview_label", "Preview — sign in to see your circles")}
              className="small text-3"
            />
          </div>
          <div className="index-list" style={{ marginTop: 24 }}>
            {circles.map((circle) => (
              <div className="index-list__row" key={circle.slug}>
                <span className="index-list__name">{circle.name}</span>
                <span className="index-list__meta">{circle.members} women · {circle.cadence}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section section--alt section--intimate">
        <div className="container">
          <div style={{ maxWidth: 460, marginBottom: 36 }}>
            <EditableLabel
              contentKey="community.steps.eyebrow"
              value={t("community.steps.eyebrow", "How Belonging Grows")}
              className="eyebrow"
            />
            <EditableHeading
              as="h2"
              contentKey="community.steps.heading"
              value={t("community.steps.heading", "Three visits, and it stops feeling new.")}
              className="h2"
              style={{ marginTop: 14 }}
            />
          </div>
          <div className="rule-list rule-list--row rule-list--row-3">
            {STEPS.map((s) => (
              <div className="rule-list__item" key={s.n}>
                <span className="rule-list__num">{s.n}</span>
                <EditableHeading as="h3" contentKey={s.titleKey} value={t(s.titleKey, s.title)} className="h3" style={{ fontSize: "1.1rem" }} />
                <EditableText as="p" multiline contentKey={s.bodyKey} value={t(s.bodyKey, s.body)} className="small text-2" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section hex-texture hex-texture--light">
        <div className="container">
          <div className="split split--40-60">
            <div className="stack gap-16">
              <EditableLabel contentKey="community.recurring.eyebrow" value={t("community.recurring.eyebrow", "Recurring Gatherings")} className="eyebrow" />
              <EditableHeading
                as="h2"
                contentKey="community.recurring.heading"
                value={t("community.recurring.heading", "Trusted circles that meet again and again.")}
                className="h2"
              />
              <EditableText
                as="p"
                multiline
                contentKey="community.recurring.paragraph"
                value={t(
                  "community.recurring.paragraph",
                  "Beyond one-off events, Hive circles gather on a rhythm — so belonging isn’t a single night, it’s a habit."
                )}
                className="text-2"
              />
            </div>
            <div className="index-list">
              {recurring.map((r) => (
                <div className="index-list__row" key={r.name}>
                  <span className="index-list__name" style={{ fontSize: ".98rem" }}>{r.name}</span>
                  <span className="index-list__meta">{r.cadence}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="section section--alt section--intimate">
        <div className="container">
          <div className="row wrap gap-12">
            <EditableLabel contentKey="community.badges.1" value={t("community.badges.1", "Verified organisers")} className="badge" />
            <EditableLabel contentKey="community.badges.2" value={t("community.badges.2", "Community guidelines")} className="badge" />
            <EditableLabel contentKey="community.badges.3" value={t("community.badges.3", "Safe reporting")} className="badge" />
          </div>
          <p className="small text-2" style={{ marginTop: 16, maxWidth: "60ch" }}>
            <EditableText
              as="span"
              contentKey="community.guidelines.paragraph"
              value={t(
                "community.guidelines.paragraph",
                "Every host is reviewed before their gathering goes live, and concerns are reviewed quickly and privately."
              )}
            />{" "}
            <Link href="/community-guidelines" style={{ color: "var(--accent-deep)", fontWeight: 600 }}>
              <EditableLabel contentKey="community.guidelines.link_label" value={t("community.guidelines.link_label", "Read our guidelines →")} />
            </Link>
          </p>
        </div>
      </div>

      <div className="bleed">
        <EditableImage
          mediaKey="community.closing.image"
          src={closingImage.url}
          alt={closingImage.alt}
          objectPosition={closingImage.objectPosition}
          sizes="100vw"
        />
        <div className="bleed__overlay" />
        <div className="bleed__content bleed__content--center">
          <EditableHeading
            hero
            as="h2"
            contentKey="community.closing.heading"
            value={t("community.closing.heading", "Ready to find your circle?")}
            className="h2"
            style={{ color: "#fff" }}
          />
          <div className="row wrap gap-16" style={{ justifyContent: "center", marginTop: 22 }}>
            <Link href="/explore" className="btn btn--on-dark">
              <EditableLabel contentKey="community.closing.primary_label" value={t("community.closing.primary_label", "Explore Gatherings")} />
            </Link>
            <JoinCommunityButton className="btn btn--ghost-dark" />
          </div>
        </div>
      </div>
    </>
  );
}
