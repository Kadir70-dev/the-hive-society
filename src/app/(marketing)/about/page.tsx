import type { Metadata } from "next";
import { EditableText, EditableHeading, EditableLabel } from "@/components/content/EditableText";
import { EditableImage } from "@/components/content/EditableImage";
import { getPageContent, resolve } from "@/lib/content/getPageContent";
import { getPageMedia, resolveMedia } from "@/lib/content/getPageMedia";

export const metadata: Metadata = {
  title: "About",
  description: "Built in Abu Dhabi, for how women gather.",
};

const NEIGHBOURHOODS = ["Saadiyat", "Al Reem", "Yas", "Al Bateen", "Khalifa City", "Al Raha", "Corniche", "Al Maryah", "Hudayriyat"];

const PRINCIPLES = [
  { letter: "01", key: "1", title: "Trust", desc: "Verified hosts, respectful spaces." },
  { letter: "02", key: "2", title: "Connect", desc: "Women who share your interests." },
  { letter: "03", key: "3", title: "Belong", desc: "A Hive that grows with you." },
];

export default async function AboutPage() {
  const [content, media] = await Promise.all([getPageContent("about"), getPageMedia("about")]);
  const t = (key: string, fallback: string) => resolve(content, key, fallback);

  const heroImage = resolveMedia(media, "about.hero.image", {
    url: "/images/a10-creative.jpg",
    alt: "Women at a Hive creative workshop in Abu Dhabi",
    objectPosition: "30% center",
  });
  const introImage = resolveMedia(media, "about.intro.image", {
    url: "/images/gathering.jpg",
    alt: "Women sharing an evening gathering, Abu Dhabi",
  });

  return (
    <>
      <div className="bleed bleed--hero">
        <EditableImage mediaKey="about.hero.image" src={heroImage.url} alt={heroImage.alt} objectPosition={heroImage.objectPosition} sizes="100vw" priority />
        <div className="bleed__overlay" />
        <div className="bleed__content">
          <EditableLabel hero contentKey="about.hero.eyebrow" value={t("about.hero.eyebrow", "About")} className="eyebrow" style={{ color: "#fff" }} />
          <EditableHeading
            hero
            as="h1"
            contentKey="about.hero.title"
            value={t("about.hero.title", "Built in Abu Dhabi, for how women gather.")}
            className="h1"
            style={{ fontSize: "clamp(2rem,4vw + .4rem,3.2rem)", marginTop: 14 }}
          />
        </div>
      </div>

      <div className="section section--intimate">
        <div className="container">
          <div className="split split--60-40">
            <div className="photo img-hover" style={{ position: "relative" }}>
              <EditableImage
                mediaKey="about.intro.image"
                src={introImage.url}
                alt={introImage.alt}
                objectPosition={introImage.objectPosition}
                sizes="(min-width: 900px) 55vw, 100vw"
              />
              <span className="photo__tag">Abu Dhabi, UAE</span>
            </div>
            <div className="stack gap-16">
              <EditableText
                as="p"
                multiline
                contentKey="about.intro.lede"
                value={t("about.intro.lede", "The real barrier was never finding something to do — it was not wanting to arrive alone.")}
                className="lede"
              />
              <EditableText
                as="p"
                multiline
                contentKey="about.intro.paragraph"
                value={t(
                  "about.intro.paragraph",
                  "Real gatherings. Trusted faces. A community worth returning to."
                )}
                className="text-2"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="section section--intimate">
        <div className="container">
          <EditableLabel contentKey="about.team.eyebrow" value={t("about.team.eyebrow", "Our Team")} className="label-sm" />
          <div className="row wrap gap-32" style={{ marginTop: 20 }}>
            <div className="row gap-16">
              <div className="founder-photo" style={{ width: 64, height: 64, marginBottom: 0 }} />
              <div>
                <EditableHeading as="h3" contentKey="about.team.founder.title" value={t("about.team.founder.title", "Founder & CEO")} className="h3" style={{ fontSize: "1.02rem" }} />
                <EditableText as="p" multiline contentKey="about.team.founder.bio" value={t("about.team.founder.bio", "Full introduction coming soon.")} className="small text-3" />
              </div>
            </div>
            <div className="row gap-16">
              <div className="founder-photo" style={{ width: 64, height: 64, marginBottom: 0 }} />
              <div>
                <EditableHeading as="h3" contentKey="about.team.cofounder.title" value={t("about.team.cofounder.title", "Co-Founder & CTO")} className="h3" style={{ fontSize: "1.02rem" }} />
                <EditableText as="p" multiline contentKey="about.team.cofounder.bio" value={t("about.team.cofounder.bio", "Full introduction coming soon.")} className="small text-3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section section--alt section--intimate">
        <div className="container">
          <EditableLabel contentKey="about.neighbourhoods.eyebrow" value={t("about.neighbourhoods.eyebrow", "Where We Gather")} className="eyebrow" />
          <EditableHeading
            as="h2"
            contentKey="about.neighbourhoods.heading"
            value={t("about.neighbourhoods.heading", "Across Abu Dhabi’s neighbourhoods.")}
            className="h2"
            style={{ margin: "14px 0 24px" }}
          />
          <div className="pill-row">
            {NEIGHBOURHOODS.map((n) => (
              <span className="area-chip" key={n}>{n}</span>
            ))}
          </div>
          <EditableText
            as="p"
            multiline
            contentKey="about.neighbourhoods.disclaimer"
            value={t("about.neighbourhoods.disclaimer", "Venue names don't imply partnership unless stated on the gathering.")}
            className="small text-3"
            style={{ marginTop: 16 }}
          />
        </div>
      </div>

      <div className="section">
        <div className="container">
          <EditableHeading
            as="h2"
            contentKey="about.principles.heading"
            value={t("about.principles.heading", "What every gathering strengthens.")}
            className="h2"
            style={{ marginBottom: 32, maxWidth: "16ch" }}
          />
          <div className="rule-list rule-list--row rule-list--row-3">
            {PRINCIPLES.map((p) => (
              <div className="rule-list__item" key={p.letter}>
                <span className="rule-list__num">{p.letter}</span>
                <EditableHeading as="h3" contentKey={`about.principles.${p.key}.title`} value={t(`about.principles.${p.key}.title`, p.title)} className="h3" />
                <EditableText as="p" multiline contentKey={`about.principles.${p.key}.desc`} value={t(`about.principles.${p.key}.desc`, p.desc)} className="small text-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
