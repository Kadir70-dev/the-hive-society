import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description: "A few simple principles keep the Hive feeling safe for every woman who shows up.",
};

const PRINCIPLES = [
  { title: "Respect", desc: "Treat every woman the way you'd want to be treated." },
  { title: "Privacy", desc: "What's shared in the group stays in the group." },
  { title: "No harassment", desc: "Zero tolerance, always." },
  { title: "No unsolicited promotion", desc: "Gatherings aren't a place to sell." },
  { title: "No discrimination", desc: "Every background and faith is welcome." },
  { title: "Consent", desc: "Photos, contact and conversation are always opt-in." },
  { title: "Respect venue rules", desc: "Every space has its own etiquette — follow it." },
  { title: "Show up responsibly", desc: "Cancel early if plans change, out of respect for others." },
  { title: "Report concerns", desc: "Something feel off? Tell us — quietly and quickly." },
];

export default function CommunityGuidelinesPage() {
  return (
    <>
      <div className="page-hero hex-texture">
        <div className="container stack gap-14">
          <span className="eyebrow">Community Guidelines</span>
          <h1 className="h1" style={{ fontSize: "clamp(2rem,4vw + .4rem,3.2rem)" }}>
            Warm, respectful, and worth returning to.
          </h1>
          <p className="lede" style={{ color: "var(--on-dark-2)" }}>
            A few simple principles keep the Hive feeling safe for every woman who shows up.
          </p>
        </div>
      </div>
      <div className="section">
        <div className="container">
          <div className="grid grid-3">
            {PRINCIPLES.map((p, i) => (
              <div className="icon-tile stack gap-8" key={p.title}>
                <div className="hex">{i + 1}</div>
                <h3 className="h3" style={{ fontSize: "1rem" }}>{p.title}</h3>
                <p className="small text-2">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="cta-banner hex-texture" style={{ marginTop: 56 }}>
            <h2 className="h2" style={{ fontSize: "1.6rem" }}>Something doesn&rsquo;t feel right?</h2>
            <p className="text-2" style={{ marginTop: 10 }}>
              Reach our Support team directly — every report is reviewed personally.
            </p>
            <Link href="/contact" className="btn btn--on-dark" style={{ marginTop: 20 }}>
              Report a Concern
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
