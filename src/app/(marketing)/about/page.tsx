import type { Metadata } from "next";
import Image from "next/image";
import { PhotoTile } from "@/components/ui/PhotoTile";

export const metadata: Metadata = {
  title: "About",
  description: "Built in Abu Dhabi. Designed around how women actually gather here.",
};

const NEIGHBOURHOODS = ["Saadiyat", "Al Reem", "Yas", "Al Bateen", "Khalifa City", "Al Raha", "Corniche", "Al Maryah", "Hudayriyat"];

const PRINCIPLES = [
  { letter: "01", title: "Trust", desc: "Verified hosts, respectful spaces." },
  { letter: "02", title: "Connect", desc: "Women who share your interests." },
  { letter: "03", title: "Belong", desc: "A Hive that grows with you." },
];

export default function AboutPage() {
  return (
    <>
      <div className="bleed bleed--hero">
        <Image
          src="/images/a10-creative.jpg"
          alt="Women at a Hive creative workshop in Abu Dhabi"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="bleed__overlay" />
        <div className="bleed__content">
          <span className="eyebrow" style={{ color: "#fff" }}>About</span>
          <h1 className="h1" style={{ fontSize: "clamp(2rem,4vw + .4rem,3.2rem)", marginTop: 14 }}>
            Built in Abu Dhabi. Designed around how women actually gather here.
          </h1>
        </div>
      </div>

      <div className="section section--intimate">
        <div className="container">
          <div className="split split--60-40">
            <PhotoTile
              src="/images/gathering.jpg"
              alt="Women sharing an evening gathering, Abu Dhabi"
              tag="Abu Dhabi, UAE"
              className="photo img-hover"
              sizes="(min-width: 900px) 55vw, 100vw"
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

      <div className="section section--intimate">
        <div className="container">
          <span className="label-sm">Our Team</span>
          <div className="row wrap gap-32" style={{ marginTop: 20 }}>
            <div className="row gap-16">
              <div className="founder-photo" style={{ width: 64, height: 64, marginBottom: 0 }} />
              <div>
                <h3 className="h3" style={{ fontSize: "1.02rem" }}>Founder &amp; CEO</h3>
                <p className="small text-3">Placeholder — biography to be confirmed</p>
              </div>
            </div>
            <div className="row gap-16">
              <div className="founder-photo" style={{ width: 64, height: 64, marginBottom: 0 }} />
              <div>
                <h3 className="h3" style={{ fontSize: "1.02rem" }}>Co-Founder &amp; CTO</h3>
                <p className="small text-3">Placeholder — biography to be confirmed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section section--alt section--intimate">
        <div className="container">
          <span className="eyebrow">Where We Gather</span>
          <h2 className="h2" style={{ margin: "14px 0 24px" }}>Across Abu Dhabi&rsquo;s neighbourhoods.</h2>
          <div className="pill-row">
            {NEIGHBOURHOODS.map((n) => (
              <span className="area-chip" key={n}>{n}</span>
            ))}
          </div>
          <p className="small text-3" style={{ marginTop: 16 }}>
            Venue names are not implied partners unless stated on the specific gathering.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <h2 className="h2" style={{ marginBottom: 32, maxWidth: "16ch" }}>What every gathering strengthens.</h2>
          <div className="rule-list rule-list--row rule-list--row-3">
            {PRINCIPLES.map((p) => (
              <div className="rule-list__item" key={p.title}>
                <span className="rule-list__num">{p.letter}</span>
                <h3 className="h3">{p.title}</h3>
                <p className="small text-2">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
