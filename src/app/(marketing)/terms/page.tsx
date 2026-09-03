import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Draft terms and conditions for The Hive Society, pending UAE legal review.",
};

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  { title: "Acceptance of terms", body: "By using The Hive Society, you agree to these draft terms, which will be finalised before public launch." },
  { title: "Eligibility", body: "The platform is intended for adult women in the UAE." },
  { title: "User accounts", body: "You are responsible for the accuracy of your profile and the security of your login credentials." },
  {
    title: "Community conduct",
    body: (
      <>
        Members agree to treat one another with respect, consistent with our{" "}
        <Link href="/community-guidelines" style={{ color: "var(--accent-deep)", fontWeight: 600 }}>
          Community Guidelines
        </Link>
        .
      </>
    ),
  },
  { title: "Bookings", body: "Booking a gathering reserves your place subject to the organiser's capacity and terms." },
  { title: "Payments", body: "Where applicable, payments are processed securely through third-party providers." },
  { title: "Cancellations & refunds", body: "Cancellation and refund terms will be set per gathering and disclosed before booking." },
  { title: "Waitlists", body: "Joining a waitlist does not guarantee a place; you'll be notified if a spot opens." },
  { title: "Event organiser responsibilities", body: "Hosts are responsible for the safety, accuracy and delivery of the gatherings they list." },
  { title: "Hive's platform role", body: "The Hive Society connects members and organisers; it does not operate venues or gatherings directly." },
  { title: "User-generated content", body: "Content you post (e.g. profile details) should be accurate and respectful of others." },
  { title: "Safety & behaviour", body: "Members must follow venue rules and behave respectfully at all gatherings." },
  { title: "Prohibited activities", body: "Harassment, discrimination, unsolicited promotion and unsafe conduct are prohibited." },
  { title: "Account suspension", body: "Hive may suspend accounts that violate these terms or the Community Guidelines." },
  { title: "Intellectual property", body: "The Hive Society brand, design and content are owned by The Hive Society unless otherwise noted." },
  { title: "Disclaimers", body: "Gatherings are provided by independent organisers; Hive makes no warranty as to specific outcomes." },
  { title: "Liability", body: "To the extent permitted by law, Hive's liability is limited as will be detailed in the final terms." },
  { title: "Changes", body: "These terms may be updated as the platform evolves." },
  { title: "Governing law", body: "Governing law placeholder — to be confirmed with UAE legal counsel." },
  {
    title: "Contact",
    body: (
      <>
        Questions can be sent via our{" "}
        <Link href="/contact" style={{ color: "var(--accent-deep)", fontWeight: 600 }}>
          Contact page
        </Link>
        .
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container stack gap-10">
          <span className="eyebrow">Legal</span>
          <h1 className="h1" style={{ fontSize: "clamp(2rem,3.5vw + .4rem,2.8rem)" }}>
            Terms &amp; Conditions
          </h1>
        </div>
      </div>
      <div className="section section--tight">
        <div className="container">
          <div className="note-banner" style={{ marginBottom: 36 }}>
            Draft for legal review before public launch. Nothing here constitutes a final legal or
            business commitment.
          </div>
          {SECTIONS.map((s) => (
            <div className="legal-section" key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
