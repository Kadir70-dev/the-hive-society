import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "We'd love to hear from you — general enquiries, membership, organisers, partnerships, media and support.",
};

const CONTACT_CHANNELS = [
  { label: "General enquiries", email: "hello@thehivesociety.ae*" },
  { label: "Membership", email: "membership@thehivesociety.ae*" },
  { label: "Partnerships", email: "partners@thehivesociety.ae*" },
  { label: "Media & Press", email: "press@thehivesociety.ae*" },
];

export default function ContactPage() {
  return (
    <>
      <div className="page-hero hex-texture">
        <div className="container stack gap-14">
          <span className="eyebrow">Contact</span>
          <h1 className="h1" style={{ fontSize: "clamp(2rem,4vw + .4rem,3.2rem)" }}>
            We&rsquo;d love to hear from you.
          </h1>
        </div>
      </div>
      <div className="section">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: "flex-start" }}>
            <div className="stack gap-24">
              <div className="stack gap-14">
                <span className="eyebrow">Reach the Right Team</span>
                <h2 className="h2">Get in touch.</h2>
              </div>
              <div className="card stack" style={{ padding: 6 }}>
                {CONTACT_CHANNELS.map((c, i) => (
                  <div
                    className="row"
                    key={c.label}
                    style={{
                      justifyContent: "space-between",
                      padding: "14px 18px",
                      borderBottom: i < CONTACT_CHANNELS.length - 1 ? "1px solid var(--line)" : "none",
                    }}
                  >
                    <span className="small" style={{ fontWeight: 600 }}>{c.label}</span>
                    <span className="small text-3">{c.email}</span>
                  </div>
                ))}
              </div>
              <p className="small text-3">*Placeholder addresses — to be confirmed before launch.</p>
            </div>
            <div className="card" style={{ padding: 30 }}>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
