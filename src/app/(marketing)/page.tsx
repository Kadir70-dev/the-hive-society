import Link from "next/link";
import type { Metadata } from "next";
import { JoinCommunityButton } from "@/components/forms/JoinCommunityButton";
import { EditableText, EditableHeading, EditableLabel } from "@/components/content/EditableText";
import { EditableImage } from "@/components/content/EditableImage";
import { getPageContent, resolve } from "@/lib/content/getPageContent";
import { getPageMedia, resolveMedia } from "@/lib/content/getPageMedia";
import { PeopleIcon, SparkleIcon, LeafIcon, CompassIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Home",
  description: "A private society for ambitious women who seek more.",
};

const PILLARS = [
  { key: "connections", title: "Real Connections", Icon: PeopleIcon },
  { key: "experiences", title: "Unique Experiences", Icon: SparkleIcon },
  { key: "growth", title: "Personal Growth", Icon: LeafIcon },
  { key: "access", title: "Exclusive Access", Icon: CompassIcon },
];

const EXPERIENCE_CARDS = [
  { key: "wellness", label: "Wellness", image: "a8-wellness.jpg", alt: "A Hive wellness gathering" },
  { key: "travel", label: "Travel", image: "tennis.jpg", alt: "Hive women on an outdoor gathering" },
  { key: "dining", label: "Dining", image: "a4-brunch.jpg", alt: "A Hive brunch gathering" },
];

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function HomePage() {
  const [content, media] = await Promise.all([getPageContent("home"), getPageMedia("home")]);
  const t = (key: string, fallback: string) => resolve(content, key, fallback);

  const heroImage = resolveMedia(media, "home.hero.image", {
    url: "/images/a11-outdoor.jpg",
    alt: "Women walking together along the Abu Dhabi Corniche at sunset",
    objectPosition: "center 30%",
  });
  const membershipImage = resolveMedia(media, "home.membership2.image", {
    url: "/images/majlisnight.jpg",
    alt: "An evening Hive gathering",
  });

  return (
    <>
      {/* HERO — full-bleed photo, edge-to-edge. The floating header pill
          (position:absolute, no flow height) sits directly on top of it —
          the hero starts at the literal top of the page. Centered lockup:
          label, headline, lede, cta, sitting in the upper-middle third. */}
      <section className="hero">
        <EditableImage
          mediaKey="home.hero.image"
          src={heroImage.url}
          alt={heroImage.alt}
          objectPosition={heroImage.objectPosition}
          sizes="100vw"
          priority
        />
        <div className="hero__content">
          <EditableLabel
            hero
            contentKey="home.hero2.eyebrow"
            value={t("home.hero2.eyebrow", "Soon in Abu Dhabi")}
            className="hero__kicker"
          />
          <EditableHeading
            hero
            as="h1"
            contentKey="home.hero2.title"
            value={t("home.hero2.title", "Find your Hive in Abu Dhabi")}
            className="hero__title"
          />
          <EditableText
            hero
            as="p"
            multiline
            contentKey="home.hero2.lede"
            value={t("home.hero2.lede", "Host or join gatherings, classes, and slow mornings")}
            className="hero__lede"
          />
          <JoinCommunityButton className="btn btn--on-dark">
            {t("home.hero2.cta_label", "Join The Hive")}
            <span aria-hidden="true">→</span>
          </JoinCommunityButton>
        </div>
      </section>

      {/* MORE THAN A CLUB — centered heading + short lede, then a row of
          three portrait photo cards (bottom-left label, bottom-right arrow). */}
      <section className="section section--intimate">
        <div className="container" style={{ textAlign: "center" }}>
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <EditableLabel
              contentKey="home.about.eyebrow"
              value={t("home.about.eyebrow", "The Hive Society")}
              className="eyebrow"
              style={{ justifyContent: "center" }}
            />
            <EditableHeading
              as="h2"
              contentKey="home.about.heading"
              value={t("home.about.heading", "Belonging feels different here")}
              className="h2"
              style={{ marginTop: 14 }}
            />
            <EditableText
              as="p"
              multiline
              contentKey="home.about.lede"
              value={t("home.about.lede", "A private community for women who grow, connect and create more.")}
              className="lede"
              style={{ margin: "16px auto 0" }}
            />
          </div>
        </div>
        <div className="container container--wide" style={{ marginTop: 48 }}>
          <div className="grid grid-3" style={{ textAlign: "left" }}>
            {EXPERIENCE_CARDS.map((card) => {
              const cardImage = resolveMedia(media, `home.experiences2.${card.key}.image`, {
                url: `/images/${card.image}`,
                alt: card.alt,
              });
              return (
                <div className="photo img-hover" style={{ aspectRatio: "4/4.6" }} key={card.key}>
                  <EditableImage
                    mediaKey={`home.experiences2.${card.key}.image`}
                    src={cardImage.url}
                    alt={cardImage.alt}
                    objectPosition={cardImage.objectPosition}
                    sizes="(min-width: 900px) 30vw, 90vw"
                  />
                  <span className="photo__tag">
                    <EditableLabel
                      contentKey={`home.experiences2.${card.key}.label`}
                      value={t(`home.experiences2.${card.key}.label`, card.label)}
                    />
                  </span>
                  <Link href="/explore" className="photo__arrow" aria-label="Explore experiences">
                    <ArrowIcon />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
        <div className="container" style={{ textAlign: "center" }}>
          <Link href="/explore" className="text-link" style={{ marginTop: 40 }}>
            <EditableLabel
              contentKey="home.experiences2.button_label"
              value={t("home.experiences2.button_label", "Explore Experiences")}
            />
            <ArrowIcon />
          </Link>
        </div>
      </section>

      {/* FEATURE BAND — large rounded-top, light-beige panel; contrast comes
          from the surface shift + generous padding, never from a dark fill. */}
      <div className="feature-band">
        <div className="container" style={{ textAlign: "center" }}>
          <EditableLabel
            contentKey="home.pillars.eyebrow"
            value={t("home.pillars.eyebrow", "Why Join")}
            className="eyebrow"
            style={{ justifyContent: "center" }}
          />
          <EditableHeading
            as="h2"
            contentKey="home.pillars.heading"
            value={t("home.pillars.heading", "What Sets Us Apart")}
            className="h2"
            style={{ marginTop: 14 }}
          />
          <div className="feature-grid">
            {PILLARS.map((p) => (
              <div className="feature-item" key={p.key}>
                <p.Icon className="feature-item__icon" />
                <EditableHeading
                  as="h3"
                  contentKey={`home.about.pillar_${p.key}`}
                  value={t(`home.about.pillar_${p.key}`, p.title)}
                  className="h3"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MEMBERSHIP — a very light, unboxed container: large photo on the
          left, short copy and a primary CTA on the right. No dark background. */}
      <section className="section section--alt">
        <div className="container">
          <div className="split split--60-40" style={{ alignItems: "center" }}>
            <div className="photo img-hover" style={{ aspectRatio: "4/3" }}>
              <EditableImage
                mediaKey="home.membership2.image"
                src={membershipImage.url}
                alt={membershipImage.alt}
                objectPosition={membershipImage.objectPosition}
                sizes="(min-width: 900px) 55vw, 100vw"
              />
            </div>
            <div className="stack gap-16">
              <EditableLabel
                contentKey="home.membership2.eyebrow"
                value={t("home.membership2.eyebrow", "Membership")}
                className="eyebrow"
              />
              <EditableHeading
                as="h2"
                contentKey="home.membership2.heading"
                value={t("home.membership2.heading", "Join The Hive")}
                className="h2"
              />
              <EditableText
                as="p"
                multiline
                contentKey="home.membership2.body"
                value={t("home.membership2.body", "A community built on trust, warmth and belonging.")}
                className="text-2"
              />
              <JoinCommunityButton className="btn btn--primary" style={{ alignSelf: "flex-start", marginTop: 8 }}>
                {t("home.membership2.button_label", "Join The Hive")}
              </JoinCommunityButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
