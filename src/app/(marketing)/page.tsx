import Link from "next/link";
import type { Metadata } from "next";
import { JoinCommunityButton } from "@/components/forms/JoinCommunityButton";
import { EditableText, EditableHeading, EditableLabel, EditableCaption } from "@/components/content/EditableText";
import { EditableImage } from "@/components/content/EditableImage";
import { getPageContent, resolve } from "@/lib/content/getPageContent";
import { getPageMedia, resolveMedia } from "@/lib/content/getPageMedia";

export const metadata: Metadata = {
  title: "Home",
  description:
    "A trusted women's community across the UAE — real gatherings, real connection. Launching soon in Abu Dhabi.",
};

const VALUES = [
  {
    mark: "01",
    titleKey: "home.why.1.title",
    title: "Curated, not endless.",
    bodyKey: "home.why.1.body",
    body: "Real gatherings picked with care — not another feed to scroll.",
  },
  {
    mark: "02",
    titleKey: "home.why.2.title",
    title: "Real women, real rooms.",
    bodyKey: "home.why.2.body",
    body: "See who's showing up before you decide to join them.",
  },
  {
    mark: "03",
    titleKey: "home.why.3.title",
    title: "Belonging that continues.",
    bodyKey: "home.why.3.body",
    body: "The relationships outlast the event — that's the whole point.",
  },
];

/* Facility/category tiles — a solid brand color per category (see .cat-swatch
   in globals.css) instead of a photo. `dark` picks the matching cms-editable
   edit-mode ring: true for the cream-text swatches, false for the ink-text
   ones, mirroring how EditableLabel's `hero` prop already pairs with text color
   elsewhere on this page. */
const EXPERIENCES = [
  { key: "coffee", label: "Coffee", dark: true },
  { key: "dinners", label: "Dinners", dark: true },
  { key: "networking", label: "Networking", dark: true },
  { key: "wellness", label: "Wellness", dark: false },
  { key: "gatherings", label: "Gatherings", dark: false },
  { key: "workshops", label: "Workshops", dark: false },
];

const STEPS = [
  { n: "01", titleKey: "home.how.1.title", title: "Join", bodyKey: "home.how.1.body", body: "Tell us a little about you." },
  {
    n: "02",
    titleKey: "home.how.2.title",
    title: "Review",
    bodyKey: "home.how.2.body",
    body: "A brief, human check — not automatic.",
  },
  {
    n: "03",
    titleKey: "home.how.3.title",
    title: "Connect",
    bodyKey: "home.how.3.body",
    body: "A relevant invitation, when there's a fit.",
  },
  {
    n: "04",
    titleKey: "home.how.4.title",
    title: "Experience",
    bodyKey: "home.how.4.body",
    body: "Show up, and keep showing up.",
  },
];

export default async function HomePage() {
  const [content, media] = await Promise.all([getPageContent("home"), getPageMedia("home")]);
  const t = (key: string, fallback: string) => resolve(content, key, fallback);

  const heroImage = resolveMedia(media, "home.hero.image", {
    url: "/images/a11-outdoor.jpg",
    alt: "Women walking together along the Abu Dhabi Corniche at sunset",
    objectPosition: "center 30%",
  });
  const tennisImage = resolveMedia(media, "home.bleed.tennis.image", {
    url: "/images/tennis.jpg",
    alt: "Hive women playing tennis together at dusk",
  });
  const appImage = resolveMedia(media, "home.app_preview.image", {
    url: "/images/a7-padel.jpg",
    alt: "A preview of an experience inside the Hive app",
  });

  return (
    <>
      <section className="hero">
        <EditableImage
          mediaKey="home.hero.image"
          src={heroImage.url}
          alt={heroImage.alt}
          objectPosition={heroImage.objectPosition}
          sizes="100vw"
          priority
        />
        <EditableLabel hero contentKey="home.hero.kicker" value={t("home.hero.kicker", "Launching Soon in Abu Dhabi")} className="hero__kicker" />
        <div className="hero__content">
          <EditableHeading hero as="h1" contentKey="home.hero.title" value={t("home.hero.title", "No one has to show up alone.")} className="hero__title" />
          <EditableText
            hero
            as="p"
            multiline
            contentKey="home.hero.lede"
            value={t(
              "home.hero.lede",
              "A trusted women’s community across the UAE — built on real gatherings, not another app to browse."
            )}
            className="hero__lede"
          />
          <JoinCommunityButton className="btn btn--on-dark" />
        </div>
      </section>

      <section className="section section--intimate hex-texture hex-texture--light">
        <div className="container">
          <div className="split split--60-40">
            <EditableHeading
              as="h2"
              contentKey="home.why.heading"
              value={t("home.why.heading", "Belonging, not another app to browse.")}
              className="display-xl"
              style={{ maxWidth: "11ch" }}
            />
            <div className="value-list">
              {VALUES.map((v) => (
                <div className="value-item" key={v.mark}>
                  <span className="value-item__mark">{v.mark}</span>
                  <div>
                    <EditableHeading as="h3" contentKey={v.titleKey} value={t(v.titleKey, v.title)} className="h3" />
                    <EditableText as="p" multiline contentKey={v.bodyKey} value={t(v.bodyKey, v.body)} className="text-2 small" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="bleed">
        <EditableImage mediaKey="home.bleed.tennis.image" src={tennisImage.url} alt={tennisImage.alt} objectPosition={tennisImage.objectPosition} sizes="100vw" />
        <div className="bleed__overlay" />
        <EditableCaption hero contentKey="home.bleed.tennis.caption" value={t("home.bleed.tennis.caption", "Khalifa City, Abu Dhabi")} className="bleed__cap" />
      </div>

      <section className="section section--alt">
        <div className="container">
          <div className="exp-heading">
            <div className="exp-heading__copy">
              <EditableLabel
                contentKey="home.experiences.eyebrow"
                value={t("home.experiences.eyebrow", "The Experience")}
                className="eyebrow"
              />
              <EditableHeading
                as="h2"
                contentKey="home.experiences.heading"
                value={t("home.experiences.heading", "Gather beautifully, your way.")}
                className="exp-heading__title"
              />
            </div>
            <Link href="/explore" className="exp-cta">
              <EditableLabel
                contentKey="home.experiences.link_label"
                value={t("home.experiences.link_label", "Explore Experiences")}
              />
              <span className="exp-cta__arrow" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </div>
          <div className="cat-grid" style={{ marginTop: 8 }}>
            {EXPERIENCES.map((exp) => {
              const key = `home.experiences.${exp.key}`;
              const label = t(`${key}.label`, exp.label);
              return (
                <Link
                  href="/explore"
                  className={`cat-tile cat-swatch cat-swatch--${exp.key} hex-texture hex-texture--light`}
                  key={exp.key}
                >
                  <span className="cat-tile__label">
                    <EditableLabel
                      hero={exp.dark}
                      contentKey={`${key}.label`}
                      value={label}
                    />
                    <span className="cat-tile__arrow" aria-hidden="true">
                      <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--intimate hex-texture hex-texture--light">
        <div className="container">
          <div style={{ maxWidth: 460, marginBottom: 40 }}>
            <EditableLabel contentKey="home.how.eyebrow" value={t("home.how.eyebrow", "How It Works")} className="eyebrow" />
            <EditableHeading
              as="h2"
              contentKey="home.how.heading"
              value={t("home.how.heading", "From first visit to real belonging.")}
              className="h2"
              style={{ marginTop: 14 }}
            />
          </div>
          <div className="rule-list rule-list--row rule-list--row-4">
            {STEPS.map((s) => (
              <div className="rule-list__item" key={s.n}>
                <span className="rule-list__num">{s.n}</span>
                <EditableHeading as="h3" contentKey={s.titleKey} value={t(s.titleKey, s.title)} className="h3" />
                <EditableText as="p" multiline contentKey={s.bodyKey} value={t(s.bodyKey, s.body)} className="small text-2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--expansive section--alt hex-texture hex-texture--light">
        <div className="container">
          <div className="split split--40-60" style={{ alignItems: "center" }}>
            <div className="stack gap-16">
              <EditableLabel contentKey="home.app.eyebrow" value={t("home.app.eyebrow", "The Hive App")} className="eyebrow" />
              <EditableText
                as="p"
                multiline
                contentKey="home.app.quote"
                value={t("home.app.quote", "The website and community form are live today. The app comes next.")}
                className="pull-quote"
              />
              <Link href="/app/explore" className="text-link">
                <EditableLabel contentKey="home.app.link_label" value={t("home.app.link_label", "Preview the app →")} />
              </Link>
            </div>
            <div className="phone-frame phone-frame--lg" style={{ marginLeft: "auto", marginRight: "auto" }}>
              <div className="phone-frame__screen">
                <EditableImage mediaKey="home.app_preview.image" src={appImage.url} alt={appImage.alt} objectPosition={appImage.objectPosition} sizes="300px" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="cta-banner cta-banner--bleed section--dark hex-texture">
        <div className="container" style={{ textAlign: "center" }}>
          <EditableHeading
            as="h2"
            contentKey="home.cta.heading"
            value={t("home.cta.heading", "Your next gathering starts here.")}
            className="display-xl"
            style={{ maxWidth: "16ch", margin: "0 auto" }}
          />
          <EditableText
            as="p"
            multiline
            contentKey="home.cta.subtext"
            value={t("home.cta.subtext", "No one has to show up alone.")}
            className="text-2"
            style={{ margin: "20px auto 32px", maxWidth: "40ch" }}
          />
          <div className="row wrap gap-16" style={{ justifyContent: "center" }}>
            <JoinCommunityButton className="btn btn--on-dark" />
            <Link href="/explore" className="btn btn--ghost-dark">
              <EditableLabel contentKey="home.cta.secondary_label" value={t("home.cta.secondary_label", "Explore Experiences")} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
