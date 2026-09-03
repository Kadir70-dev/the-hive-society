import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How The Hive Society collects, uses and protects your information.",
};

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  { title: "Information users provide", body: "We collect information you provide directly, including your name, email, phone number and interests when creating a profile or booking a gathering." },
  { title: "Account & profile information", body: "Your profile may include a first name, photo, interests and areas of Abu Dhabi you gather in, used to help you find relevant gatherings and community." },
  { title: "Booking & activity data", body: "We keep a record of gatherings you book or host, so you can manage upcoming plans and Hive can maintain safe, accurate attendance." },
  { title: "Attendance & community information", body: "Information about circles you join and gatherings you attend helps personalise recommendations and community suggestions." },
  { title: "Contact form submissions", body: "Messages sent through Contact, Membership or Host forms are stored to respond to your enquiry." },
  { title: "Location information", body: "We may use general location (e.g. neighbourhood) to surface nearby gatherings. Precise location is never shared with other members." },
  { title: "Cookies & analytics", body: "We use basic analytics to understand how the platform is used and to improve the experience." },
  { title: "Third-party processors", body: "Selected service providers (e.g. hosting, email delivery) may process data on our behalf under confidentiality obligations." },
  { title: "Payment processors", body: "Where payments apply, transactions are handled by licensed third-party payment processors — Hive does not store full card details." },
  { title: "Data retention", body: "We retain personal data only as long as needed to provide the service or as required by law." },
  { title: "User rights", body: "You may request access, correction or deletion of your personal data at any time via Contact." },
  { title: "Security", body: "We apply reasonable technical and organisational measures to protect your information." },
  { title: "Children & minors", body: "The Hive Society is intended for adults. We do not knowingly collect data from minors." },
  { title: "Changes to this policy", body: "We may update this policy as the platform evolves and will note material changes here." },
  {
    title: "Contact",
    body: (
      <>
        Questions about this policy can be sent via our{" "}
        <Link href="/contact" style={{ color: "var(--accent-deep)", fontWeight: 600 }}>
          Contact page
        </Link>
        .
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container stack gap-10">
          <span className="eyebrow">Legal</span>
          <h1 className="h1" style={{ fontSize: "clamp(2rem,3.5vw + .4rem,2.8rem)" }}>
            Privacy Policy
          </h1>
        </div>
      </div>
      <div className="section section--tight">
        <div className="container">
          <div className="note-banner" style={{ marginBottom: 36 }}>
            This is a draft prototype document for concept review. It does not constitute formal
            UAE legal advice and requires UAE legal review before production launch.
          </div>
          <div style={{ maxWidth: 760 }}>
            {SECTIONS.map((s) => (
              <div className="legal-section" key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
