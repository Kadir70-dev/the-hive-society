import type { Metadata } from "next";
import { PhotoTile } from "@/components/ui/PhotoTile";

export const metadata: Metadata = {
  title: "About",
  description: "Built in Abu Dhabi. Designed around how women actually gather here.",
};

const NEIGHBOURHOODS = ["Saadiyat", "Al Reem", "Yas", "Al Bateen", "Khalifa City", "Al Raha", "Corniche", "Al Maryah", "Hudayriyat"];

const PRINCIPLES = [
  { letter: "T", title: "Trust", desc: "Verified hosts, respectful spaces." },
  { letter: "C", title: "Connect", desc: "Women who share your interests." },
  { letter: "B", title: "Belong", desc: "A Hive that grows with you." },
];

export default function AboutPage() {
  return (
    <>
      <div className="page-hero hex-texture">
        <div className="container stack gap-14">
          <div className="row wrap gap-12">
            <span className="eyebrow">About</span>
            <span className="tag-proposed tag-shine">Launching Soon in Abu Dhabi</span>
          </div>
          <h1 className="h1" style={{ fontSize: "clamp(2rem,4vw + .4rem,3.2rem)" }}>
            Built in Abu Dhabi. Designed around how women actually gather here.
          </h1>
          <p className="lede" style={{ color: "var(--on-dark-2)" }}>
            The story behind a platform built for connection, trust and belonging across Abu
            Dhabi.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="grid grid-2">
            <PhotoTile
              src="/images/about-story.jpg"
              alt="Women sharing Arabic coffee, Saadiyat Island"
              tag="Saadiyat Island, Abu Dhabi"
              className="photo"
              sizes="(min-width: 700px) 50vw, 100vw"
            />
            <div className="stack gap-16">
              <p className="lede">
                The real barrier was never finding something to do — it was not wanting to arrive alone.
              </p>
              <p className="text-2">
                The Hive Society exists to close that gap: real gatherings, trusted faces, a
                community worth returning to.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="section section--alt">
        <div className="container">
          <h2 className="h2" style={{ marginBottom: 28 }}>Our team.</h2>
          <div className="grid grid-2" style={{ maxWidth: 640 }}>
            <div className="founder-card">
              <div className="founder-photo" />
              <h3 className="h3" style={{ fontSize: "1.05rem" }}>Founder &amp; CEO</h3>
              <p className="small text-3">Placeholder — biography to be confirmed</p>
            </div>
            <div className="founder-card">
              <div className="founder-photo" />
              <h3 className="h3" style={{ fontSize: "1.05rem" }}>Co-Founder &amp; CTO</h3>
              <p className="small text-3">Placeholder — biography to be confirmed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <span className="eyebrow">Where We Gather</span>
          <h2 className="h2" style={{ margin: "14px 0 24px" }}>Across Abu Dhabi&rsquo;s neighbourhoods.</h2>
          <div className="pill-row">
            {NEIGHBOURHOODS.map((n) => (
              <span className="area-chip" key={n}>{n}</span>
            ))}
          </div>
          <p className="small text-3" style={{ marginTop: 16 }}>
            Hive gatherings take place across these neighbourhoods. Venue names are not implied
            partners unless stated on the specific gathering.
          </p>
        </div>
      </div>

      <div className="section section--alt">
        <div className="container">
          <h2 className="h2" style={{ marginBottom: 28 }}>What every gathering strengthens.</h2>
          <div className="grid grid-3">
            {PRINCIPLES.map((p) => (
              <div className="stack gap-8" key={p.title}>
                <div className="hex">{p.letter}</div>
                <h3 className="h3" style={{ fontSize: "1rem" }}>{p.title}</h3>
                <p className="small text-2">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
