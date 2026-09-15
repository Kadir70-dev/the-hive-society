import Image from "next/image";
import type { Metadata } from "next";
import { JoinCommunityButton } from "@/components/forms/JoinCommunityButton";
import { EditableText, EditableHeading, EditableLabel } from "@/components/content/EditableText";
import { EditableImage } from "@/components/content/EditableImage";
import { getPageContent, resolve } from "@/lib/content/getPageContent";
import { getPageMedia, resolveMedia } from "@/lib/content/getPageMedia";
import { PeopleIcon, SparkleIcon, LeafIcon, CompassIcon } from "@/components/ui/Icons";
import { RevealHeading } from "@/components/effects/RevealHeading";
import { RevealPhotoCard } from "@/components/effects/RevealPhotoCard";
import { ParallaxSection } from "@/components/effects/ParallaxSection";
import { MagneticButton } from "@/components/effects/MagneticButton";
import { MoreThanAClubBackground } from "@/components/backgrounds/production/MoreThanAClubBackground";
import { WhatSetsUsApartBackground } from "@/components/backgrounds/production/WhatSetsUsApartBackground";
import { ConstellationSoftPullVariant } from "@/components/backgrounds/interactive/ConstellationSoftPullVariant";

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

const BELONGING_GALLERY = [
  { file: "belonging-01.png", alt: "A Hive member stretching through an outdoor yoga session in dappled sunlight" },
  { file: "belonging-02.png", alt: "A Hive member holding a racket and ball courtside in tennis whites" },
  { file: "belonging-04.png", alt: "Hive members mid-session in a sun-warmed Pilates studio" },
];

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
          <RevealHeading>
            <EditableHeading
              hero
              as="h1"
              contentKey="home.hero2.title"
              value={t("home.hero2.title", "Find your Hive in Abu Dhabi")}
              className="hero__title"
            />
          </RevealHeading>
          <EditableText
            hero
            as="p"
            multiline
            contentKey="home.hero2.lede"
            value={t("home.hero2.lede", "Host or join gatherings, classes, and slow mornings")}
            className="hero__lede"
          />
          <MagneticButton strength={0.18}>
            <JoinCommunityButton className="btn btn--on-dark">
              {t("home.hero2.cta_label", "Join The Hive")}
              <span aria-hidden="true">→</span>
            </JoinCommunityButton>
          </MagneticButton>
        </div>
      </section>

      {/* MORE THAN A CLUB — centered heading + short lede, then the
          belonging photo gallery (staggered editorial grid).
          Background: Flow + Soft Pull, behind everything (z-index:0), all
          real content explicitly z-index:1 above it. */}
      <section className="section section--intimate" style={{ position: "relative" }}>
        <MoreThanAClubBackground />
        <div style={{ position: "relative", zIndex: 1 }}>
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
          <div className="container container--wide" style={{ marginTop: 56 }}>
            <div className="belonging-gallery">
              {BELONGING_GALLERY.map((item) => (
                <RevealPhotoCard className="belonging-gallery__frame img-hover" key={item.file}>
                  <Image
                    src={`/images/${item.file}`}
                    alt={item.alt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1000px) 23vw, (min-width: 700px) 32vw, 46vw"
                  />
                </RevealPhotoCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE BAND — large rounded-top, light-beige panel; contrast comes
          from the surface shift + generous padding, never from a dark fill.
          Background: Orbit + Orbit Nudge. */}
      <div className="feature-band" style={{ position: "relative" }}>
        <WhatSetsUsApartBackground />
        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
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
          <ParallaxSection speed={0.1} className="feature-grid">
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
          </ParallaxSection>
        </div>
      </div>

      {/* MEMBERSHIP — a very light, unboxed container: large photo on the
          left, short copy and a primary CTA on the right. No dark background.
          Background: Constellation, with a very subtle Soft Pull on its
          connectors only (nodes never move). */}
      <section className="section section--alt" style={{ position: "relative" }}>
        <ConstellationSoftPullVariant />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
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
