import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import "./home.css";
import { JoinCommunityButton } from "@/components/forms/JoinCommunityButton";
import { EditableText, EditableHeading, EditableLabel } from "@/components/content/EditableText";
import { EditableImage } from "@/components/content/EditableImage";
import { getPageContent, resolve } from "@/lib/content/getPageContent";
import { Reveal } from "@/components/effects/Reveal";
import { Marquee } from "@/components/home/Marquee";
import { getGatherings } from "@/lib/content/getGatherings";
import { getMembershipPlans } from "@/lib/content/getMembershipPlans";
import { getPageMedia, resolveMedia } from "@/lib/content/getPageMedia";
import { circles } from "@/data/circles";

export const metadata: Metadata = {
  title: "Home",
  description: "A private society for ambitious women who seek more.",
};

const PILLARS = [
  { key: "connections", title: "Real Connections" },
  { key: "experiences", title: "Unique Experiences" },
  { key: "growth", title: "Personal Growth" },
  { key: "access", title: "Exclusive Access" },
];

// Same files, same order as the previous rolling strip.
const NIGHT_REEL = [
  { file: "a4-brunch.jpg", alt: "Friends laughing together at a brunch table by the water" },
  { file: "a7-padel.jpg", alt: "Two members playing padel at sunset" },
  { file: "a8-wellness.jpg", alt: "Two members in a quiet wellness session" },
  { file: "a9-bookclub.jpg", alt: "Members at a book club in a sunlit library" },
  { file: "a10-creative.jpg", alt: "Two members painting at easels in a bright studio" },
  { file: "coffee.jpg", alt: "Friends laughing over coffee and pastries" },
];

// First three of the previous belonging gallery (4th, meera.jpeg, now sits in the story section).
const CIRCLE_COLLAGE = [
  { file: "belonging-01.png", alt: "A Hive member stretching through an outdoor yoga session in dappled sunlight" },
  { file: "belonging-02.png", alt: "A Hive member holding a racket and ball courtside in tennis whites" },
  { file: "belonging-04.png", alt: "Hive members mid-session in a sun-warmed Pilates studio" },
];

const pad = (n: number) => String(n).padStart(2, "0");

export default async function HomePage() {
  const [content, aboutContent, media, gatherings, plans] = await Promise.all([
    getPageContent("home"),
    getPageContent("about"),
    getPageMedia("home"),
    getGatherings("marketing"),
    getMembershipPlans(),
  ]);
  const upcoming = gatherings.slice(0, 5);
  const next = gatherings[0];
  const t = (key: string, fallback: string) => resolve(content, key, fallback);
  const ta = (key: string, fallback: string) => resolve(aboutContent, key, fallback);

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
      <span className="hj-marker" hidden />

      {/* 1 · HERO — full-bleed photo, everything centred over it. */}
      <section className="hj-hero">
        <div className="hj-hero__media">
          <EditableImage
            mediaKey="home.hero.image"
            src={heroImage.url}
            alt={heroImage.alt}
            objectPosition={heroImage.objectPosition}
            sizes="100vw"
            priority
          />
        </div>
        <div className="hj-hero__copy">
          <EditableLabel
            contentKey="home.hero2.eyebrow"
            value={t("home.hero2.eyebrow", "Soon in Abu Dhabi")}
            className="j-label"
          />
          <h1 className="hj-hero__title">
            <EditableText
              as="span"
              contentKey="home.hero3.title_lead"
              value={t("home.hero3.title_lead", "Find your")}
              className="hj-hero__lead"
            />{" "}
            <EditableText
              as="em"
              contentKey="home.hero3.title_accent"
              value={t("home.hero3.title_accent", "Hive.")}
            />
          </h1>
          <EditableText
            as="p"
            multiline
            contentKey="home.hero2.lede"
            value={t("home.hero2.lede", "Host or join gatherings, classes, and slow mornings")}
            className="hj-hero__lede"
          />
          <div className="hj-hero__actions">
            <JoinCommunityButton className="j-btn j-btn--apricot">
              {t("home.hero2.cta_label", "Join The Hive")}
            </JoinCommunityButton>
            <Link href="/explore" className="j-link">
              See gatherings <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        {next && (
          <p className="hj-hero__caption">
            Next gathering: {next.title} · {next.date}
            {next.time ? ` · ${next.time}` : ""}
          </p>
        )}
      </section>

      {/* 2 · MARQUEE — circle names from circles.ts */}
      <Marquee words={circles.map((c) => c.name)} label="The Hive circles" />

      {/* 3 · MANIFESTO */}
      <section className="j-section hj-manifesto">
        <div className="j-wrap">
          <Reveal>
            <EditableHeading
              as="h2"
              contentKey="home.about.heading"
              value={t("home.about.heading", "Belonging feels different here")}
              className="j-display hj-manifesto__text"
            />
          </Reveal>
          <Reveal className="hj-manifesto__foot">
            <EditableLabel
              contentKey="home.about.eyebrow"
              value={t("home.about.eyebrow", "The Hive Society")}
              className="j-label"
            />
            <EditableText
              as="p"
              multiline
              contentKey="home.about.lede"
              value={t("home.about.lede", "A private community for women who grow, connect and create more.")}
              className="j-lede"
            />
          </Reveal>
        </div>
      </section>

      {/* 4 · THIS WEEK'S GATHERINGS — live data, hairline rows */}
      {upcoming.length > 0 && (
        <section className="j-section hj-gatherings">
          <div className="j-wrap">
            <div className="j-head">
              <div>
                <EditableLabel
                  contentKey="home.gatherings.eyebrow"
                  value={t("home.gatherings.eyebrow", "Gatherings")}
                  className="j-label"
                />
                <EditableHeading
                  as="h2"
                  contentKey="home.gatherings.heading"
                  value={t("home.gatherings.heading", "Come as you are. Leave with friends.")}
                  className="j-display j-h2"
                />
              </div>
              <Link href="/explore" className="j-link">
                See all gatherings <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="j-rows">
              {upcoming.map((g, i) => (
                <Reveal key={g.id} index={i}>
                  <Link href="/explore" className="j-row">
                    <span className="j-row__when">
                      {g.date}
                      {g.time ? <span> · {g.time}</span> : null}
                    </span>
                    <h3 className="j-display j-row__title">{g.title}</h3>
                    <span className="j-row__details">
                      <span className="j-row__meta">
                        {g.category} · {g.area}
                      </span>
                      <span className="j-row__price">{g.price}</span>
                    </span>
                    <span className="j-row__photo">
                      <Image src={g.image} alt="" fill loading="lazy" sizes="(min-width: 900px) 140px, 88px" />
                    </span>
                    <span className="j-row__arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5 · CIRCLES — asymmetric collage + the real circles list */}
      <section className="j-section hj-circles">
        <div className="j-wrap hj-circles__grid">
          <div className="hj-collage">
            {CIRCLE_COLLAGE.map((item, i) => (
              <Reveal className={`hj-collage__frame hj-collage__frame--${i + 1}`} index={i} key={item.file}>
                <Image
                  src={`/images/${item.file}`}
                  alt={item.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 900px) 28vw, 46vw"
                />
              </Reveal>
            ))}
          </div>
          <Reveal className="hj-circles__list">
            <EditableLabel
              contentKey="home.circles.eyebrow"
              value={t("home.circles.eyebrow", "Circles")}
              className="j-label"
            />
            <EditableHeading
              as="h2"
              contentKey="home.circles.heading"
              value={t("home.circles.heading", "Find your circle.")}
              className="j-display j-h2"
            />
            <ul className="hj-circles__rows">
              {circles.map((c) => (
                <li key={c.slug}>
                  <span className="hj-circles__info">
                    <span className="hj-circles__name">{c.name}</span>
                    <span className="hj-circles__meta">{c.cadence}</span>
                  </span>
                  <span className="hj-circles__count">
                    <strong>{c.members}</strong>
                    <span>members</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/community" className="j-link">
              Explore the community <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 6 · A NIGHT AT THE HIVE — frozen images in a horizontal reel, then the four pillars */}
      <section className="j-section hj-night">
        <div className="j-wrap">
          <Reveal className="j-head">
            <div>
              <EditableLabel
                contentKey="home.pillars.eyebrow"
                value={t("home.pillars.eyebrow", "Why Join")}
                className="j-label"
              />
              <EditableHeading
                as="h2"
                contentKey="home.pillars.heading"
                value={t("home.pillars.heading", "What Sets Us Apart")}
                className="j-display j-h2"
              />
            </div>
          </Reveal>
        </div>
        <div className="hj-reel" role="region" aria-label="Moments from Hive gatherings" tabIndex={0}>
          {NIGHT_REEL.map((item) => (
            <figure className="hj-reel__item" key={item.file}>
              <div className="hj-reel__frame">
                <Image
                  src={`/images/${item.file}`}
                  alt={item.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 900px) 28vw, 70vw"
                />
              </div>
            </figure>
          ))}
        </div>
        <div className="j-wrap">
          <ol className="j-pillars">
            {PILLARS.map((p, i) => (
              <Reveal className="j-pillar" index={i} key={p.key}>
                <span className="j-pillar__n" aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <EditableHeading
                  as="h3"
                  contentKey={`home.about.pillar_${p.key}`}
                  value={t(`home.about.pillar_${p.key}`, p.title)}
                  className="j-display j-pillar__title"
                />
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 7 · VOICES — intentionally omitted until verified member quotes exist */}

      {/* 8 · OUR STORY — existing about copy + frozen images */}
      <section className="j-section j-story">
        <div className="j-wrap j-story__grid">
          <figure className="j-story__figure">
            <Reveal className="j-story__photo">
              <Image
                src="/images/meera.jpeg"
                alt=""
                fill
                loading="lazy"
                sizes="(min-width: 900px) 40vw, 92vw"
              />
            </Reveal>
            <figcaption>Three members laughing together on a padel court</figcaption>
          </figure>
          <Reveal className="j-story__copy">
            <EditableLabel
              contentKey="home.story.eyebrow"
              value={t("home.story.eyebrow", "Our story")}
              className="j-label"
            />
            <EditableText
              as="p"
              multiline
              contentKey="about.intro.lede"
              value={ta(
                "about.intro.lede",
                "The real barrier was never finding something to do — it was not wanting to arrive alone."
              )}
              className="j-display j-story__lede"
            />
            <EditableText
              as="p"
              multiline
              contentKey="about.intro.paragraph"
              value={ta("about.intro.paragraph", "Real gatherings. Trusted faces. A community worth returning to.")}
              className="j-lede"
            />
            <Link href="/about" className="j-link">
              Read our story <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 9 · MEMBERSHIP — live plans, checkout (Ziina) stays on /membership */}
      <section className="hj-membership">
        <Reveal className="hj-membership__copy">
          <EditableLabel
            contentKey="home.membership2.eyebrow"
            value={t("home.membership2.eyebrow", "Membership")}
            className="j-label"
          />
          <EditableHeading
            as="h2"
            contentKey="home.membership2.heading"
            value={t("home.membership2.heading", "Join The Hive")}
            className="j-display j-h2"
          />
          <EditableText
            as="p"
            multiline
            contentKey="home.membership2.body"
            value={t("home.membership2.body", "A community built on trust, warmth and belonging.")}
            className="j-lede"
          />
          <ul className="j-plans">
            {plans.map((p) => (
              <li key={p.key}>
                <span className="j-plans__name">{p.name}</span>
                <span className="j-plans__tag">{p.tagline}</span>
                <span className="j-plans__price">
                  <strong>
                    {p.currency} {p.amountAed}
                  </strong>{" "}
                  / {p.cadence === "annual" ? "year" : "month"}
                </span>
              </li>
            ))}
          </ul>
          <div className="hj-membership__actions">
            <JoinCommunityButton className="j-btn j-btn--apricot">
              {t("home.membership2.button_label", "Join The Hive")}
            </JoinCommunityButton>
            <Link href="/membership" className="j-link">
              Membership details <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>
        <div className="hj-membership__photo">
          <EditableImage
            mediaKey="home.membership2.image"
            src={membershipImage.url}
            alt={membershipImage.alt}
            objectPosition={membershipImage.objectPosition}
            sizes="(min-width: 900px) 50vw, 100vw"
          />
        </div>
      </section>

      {/* 10 · FINAL CTA — full-bleed. Fixed to The Morning Table gathering image. */}
      <section className="j-final">
        <div className="j-final__media">
          <Image
            src="https://bswcliacldjlsadntebd.supabase.co/storage/v1/object/public/site-images/gatherings/fd2b36ec-9368-4906-bea9-a9500f32f8c5/1789641860425.png"
            alt="Friends gathered at The Morning Table"
            fill
            loading="lazy"
            sizes="100vw"
          />
        </div>
        <div className="j-final__copy">
          <EditableHeading
            as="h2"
            contentKey="home.final.heading"
            value={t("home.final.heading", "Pull up a chair.")}
            className="j-display j-final__title"
          />
          <JoinCommunityButton className="j-btn j-btn--apricot">
            {t("home.final.button_label", "Join The Hive")}
          </JoinCommunityButton>
        </div>
      </section>
    </>
  );
}
