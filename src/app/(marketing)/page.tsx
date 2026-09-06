import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { JoinCommunityButton } from "@/components/forms/JoinCommunityButton";

export const metadata: Metadata = {
  title: "Home",
  description:
    "A trusted women's community across the UAE — real gatherings, real connection. Launching soon in Abu Dhabi.",
};

const VALUES = [
  {
    mark: "01",
    title: "Curated, not endless.",
    body: "Real gatherings picked with care — not another feed to scroll.",
  },
  {
    mark: "02",
    title: "Real women, real rooms.",
    body: "See who's showing up before you decide to join them.",
  },
  {
    mark: "03",
    title: "Belonging that continues.",
    body: "The relationships outlast the event — that's the whole point.",
  },
];

const EXPERIENCES = [
  { label: "Coffee", image: "/images/coffee.jpg" },
  { label: "Dinners", image: "/images/a4-brunch.jpg" },
  { label: "Networking", image: "/images/a9-bookclub.jpg" },
  { label: "Wellness", image: "/images/gym.jpg" },
  { label: "Gatherings", image: "/images/gathering.jpg" },
  { label: "Workshops", image: "/images/claypot.jpg" },
];

const STEPS = [
  { n: "01", title: "Join", body: "Tell us a little about you." },
  { n: "02", title: "Review", body: "A brief, human check — not automatic." },
  { n: "03", title: "Connect", body: "A relevant invitation, when there's a fit." },
  { n: "04", title: "Experience", body: "Show up, and keep showing up." },
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <Image
          src="/images/a11-outdoor.jpg"
          alt="Women walking together along the Abu Dhabi Corniche at sunset"
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 30%" }}
          priority
        />
        <span className="hero__kicker">Launching Soon in Abu Dhabi</span>
        <div className="hero__content">
          <h1 className="hero__title">No one has to show up alone.</h1>
          <p className="hero__lede">
            A trusted women&rsquo;s community across the UAE — built on real gatherings, not another app to browse.
          </p>
          <JoinCommunityButton className="btn btn--on-dark" />
        </div>
      </section>

      <section className="section section--intimate">
        <div className="container">
          <div className="split split--60-40">
            <h2 className="display-xl" style={{ maxWidth: "11ch" }}>
              Belonging, not another app to browse.
            </h2>
            <div className="value-list">
              {VALUES.map((v) => (
                <div className="value-item" key={v.mark}>
                  <span className="value-item__mark">{v.mark}</span>
                  <div>
                    <h3 className="h3">{v.title}</h3>
                    <p className="text-2 small">{v.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="bleed">
        <Image
          src="/images/tennis.jpg"
          alt="Hive women playing tennis together at dusk"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
        <div className="bleed__overlay" />
        <span className="bleed__cap">Khalifa City, Abu Dhabi</span>
      </div>

      <section className="section section--alt">
        <div className="container">
          <div
            className="row wrap gap-16"
            style={{ justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}
          >
            <h2 className="h2" style={{ maxWidth: "14ch" }}>Something for every kind of gathering.</h2>
            <Link href="/explore" className="text-link">
              Explore experiences →
            </Link>
          </div>
          <div className="exp-grid">
            {EXPERIENCES.map((exp) => (
              <Link href="/explore" className="exp-card" key={exp.label}>
                <Image src={exp.image} alt={exp.label} fill sizes="(min-width: 640px) 33vw, 100vw" style={{ objectFit: "cover" }} />
                <span className="exp-card__label">{exp.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--intimate">
        <div className="container">
          <div style={{ maxWidth: 460, marginBottom: 40 }}>
            <span className="eyebrow">How It Works</span>
            <h2 className="h2" style={{ marginTop: 14 }}>From first visit to real belonging.</h2>
          </div>
          <div className="rule-list rule-list--row rule-list--row-4">
            {STEPS.map((s) => (
              <div className="rule-list__item" key={s.n}>
                <span className="rule-list__num">{s.n}</span>
                <h3 className="h3">{s.title}</h3>
                <p className="small text-2">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--expansive section--alt">
        <div className="container">
          <div className="split split--40-60" style={{ alignItems: "center" }}>
            <div className="stack gap-16">
              <span className="eyebrow">The Hive App</span>
              <p className="pull-quote">
                The website and community form are live today. The app comes next.
              </p>
              <Link href="/app/explore" className="text-link">
                Preview the app →
              </Link>
            </div>
            <div className="phone-frame phone-frame--lg" style={{ marginLeft: "auto", marginRight: "auto" }}>
              <div className="phone-frame__screen">
                <Image
                  src="/images/a7-padel.jpg"
                  alt="A preview of an experience inside the Hive app"
                  fill
                  sizes="300px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="cta-banner cta-banner--bleed section--dark hex-texture">
        <div className="container" style={{ textAlign: "center" }}>
          <h2 className="display-xl" style={{ maxWidth: "16ch", margin: "0 auto" }}>
            Your next gathering starts here.
          </h2>
          <p className="text-2" style={{ margin: "20px auto 32px", maxWidth: "40ch" }}>
            No one has to show up alone.
          </p>
          <div className="row wrap gap-16" style={{ justifyContent: "center" }}>
            <JoinCommunityButton className="btn btn--on-dark" />
            <Link href="/explore" className="btn btn--ghost-dark">
              Explore Experiences
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
