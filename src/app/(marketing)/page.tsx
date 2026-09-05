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
  { label: "Dinners", image: "/images/majlisnight.jpg" },
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
          src="/images/introhive.jpg"
          alt="Women sharing Arabic coffee at a Hive gathering"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
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

      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: "start", gap: 56 }}>
            <div className="stack gap-16">
              <span className="eyebrow">Why The Hive</span>
              <h2 className="h2">Belonging, not another app to browse.</h2>
            </div>
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

      <section className="section section--alt">
        <div className="container">
          <div
            className="row wrap gap-16"
            style={{ justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}
          >
            <div className="stack gap-14">
              <span className="eyebrow">Community Experiences</span>
              <h2 className="h2">Something for every kind of gathering.</h2>
            </div>
            <Link href="/explore" className="btn btn--outline">
              Explore experiences
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

      <section className="section">
        <div className="container">
          <div className="stack gap-16" style={{ maxWidth: 560, marginBottom: 48 }}>
            <span className="eyebrow">How It Works</span>
            <h2 className="h2">From first visit to real belonging.</h2>
          </div>
          <div className="grid grid-4">
            {STEPS.map((s) => (
              <div className="stack gap-12" key={s.n} style={{ textAlign: "center" }}>
                <div className="hex hex--lg" style={{ margin: "0 auto" }}>{s.n}</div>
                <h3 className="h3" style={{ fontSize: "1.05rem" }}>{s.title}</h3>
                <p className="small text-2">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: "center", gap: 56 }}>
            <div className="stack gap-16">
              <span className="eyebrow">The Hive App</span>
              <h2 className="h2">A live pre-launch preview.</h2>
              <p className="text-2" style={{ maxWidth: "40ch" }}>
                The website and community form are live today. The app comes next.
              </p>
              <Link href="/app/explore" className="btn btn--outline" style={{ alignSelf: "flex-start" }}>
                Preview the app
              </Link>
            </div>
            <div className="phone-frame">
              <div className="phone-frame__screen">
                <Image src="/images/a7-padel.jpg" alt="A preview of an experience inside the Hive app" fill sizes="240px" style={{ objectFit: "cover" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner hex-texture">
            <h2 className="h2">Your next gathering starts here.</h2>
            <p className="text-2" style={{ margin: "14px auto 28px", maxWidth: "40ch" }}>
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
      </section>
    </>
  );
}
