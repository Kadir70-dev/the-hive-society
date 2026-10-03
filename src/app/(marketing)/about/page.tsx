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

  const introImage = resolveMedia(media, "about.intro.image", {
    url: "/images/gathering.jpg",
    alt: "Women sharing an evening gathering, Abu Dhabi",
  });

  return (
    <>
      <section className="j-pagehero j-pagehero--maroon j-on-dark">
        <div className="j-wrap">
          <EditableLabel contentKey="about.hero.eyebrow" value={t("about.hero.eyebrow", "About")} className="j-label" />
          <EditableHeading
            as="h1"
            contentKey="about.hero.title"
            value={t("about.hero.title", "Built in Abu Dhabi, for how women gather.")}
            className="j-display j-pagehero__title je-title-long"
          />
        </div>
      </section>

      <section className="j-section je-intro">
        <div className="j-wrap je-intro__grid">
          <figure className="je-figure">
            <div className="je-photo">
              <EditableImage
                mediaKey="about.intro.image"
                src={introImage.url}
                alt={introImage.alt}
                objectPosition={introImage.objectPosition}
                sizes="(min-width: 900px) 55vw, 100vw"
              />
            </div>
            <figcaption>Abu Dhabi, UAE</figcaption>
          </figure>
          <div className="je-intro__copy">
            <EditableText
              as="p"
              multiline
              contentKey="about.intro.lede"
              value={t("about.intro.lede", "The real barrier was never finding something to do — it was not wanting to arrive alone.")}
              className="j-display je-intro__lede"
            />
            <EditableText
              as="p"
              multiline
              contentKey="about.intro.paragraph"
              value={t("about.intro.paragraph", "Real gatherings. Trusted faces. A community worth returning to.")}
              className="j-lede"
            />
          </div>
        </div>
      </section>

      <section className="j-section je-team">
        <div className="j-wrap">
          <EditableLabel contentKey="about.team.eyebrow" value={t("about.team.eyebrow", "Our Team")} className="j-label" />
          <div className="je-team__rows">
            <div className="je-team__row">
              <EditableHeading as="h3" contentKey="about.team.founder.title" value={t("about.team.founder.title", "Founder & CEO")} className="j-display" />
              <EditableText as="p" multiline contentKey="about.team.founder.bio" value={t("about.team.founder.bio", "Full introduction coming soon.")} />
            </div>
            <div className="je-team__row">
              <EditableHeading as="h3" contentKey="about.team.cofounder.title" value={t("about.team.cofounder.title", "Co-Founder & CTO")} className="j-display" />
              <EditableText as="p" multiline contentKey="about.team.cofounder.bio" value={t("about.team.cofounder.bio", "Full introduction coming soon.")} />
            </div>
          </div>
        </div>
      </section>

      <section className="j-section section--dark jc-why je-places">
        <div className="j-wrap">
          <EditableLabel contentKey="about.neighbourhoods.eyebrow" value={t("about.neighbourhoods.eyebrow", "Where We Gather")} className="j-label" />
          <EditableHeading
            as="h2"
            contentKey="about.neighbourhoods.heading"
            value={t("about.neighbourhoods.heading", "Across Abu Dhabi’s neighbourhoods.")}
            className="j-display j-h2"
          />
          <ul className="je-places__list">
            {NEIGHBOURHOODS.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <EditableText
            as="p"
            multiline
            contentKey="about.neighbourhoods.disclaimer"
            value={t("about.neighbourhoods.disclaimer", "Venue names don't imply partnership unless stated on the gathering.")}
            className="je-places__note"
          />
        </div>
      </section>

      <section className="j-section jc-steps">
        <div className="j-wrap">
          <EditableHeading
            as="h2"
            contentKey="about.principles.heading"
            value={t("about.principles.heading", "What every gathering strengthens.")}
            className="j-display j-h2 je-principles__title"
          />
          <ol className="jc-steps__list">
            {PRINCIPLES.map((p) => (
              <li key={p.letter}>
                <span className="jc-steps__n" aria-hidden="true">{p.letter}</span>
                <EditableHeading as="h3" contentKey={`about.principles.${p.key}.title`} value={t(`about.principles.${p.key}.title`, p.title)} className="j-display" />
                <EditableText as="p" multiline contentKey={`about.principles.${p.key}.desc`} value={t(`about.principles.${p.key}.desc`, p.desc)} />
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
