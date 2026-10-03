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
    <section className="j-section jc-contact">
      <div className="j-wrap jc-contact__grid">
        <div className="jc-contact__intro">
          <span className="j-label">Contact</span>
          <h1 className="j-display jc-contact__title">We&rsquo;d love to hear from you.</h1>
          <div className="jc-contact__channels">
            <span className="j-label">Reach the Right Team</span>
            <h2 className="j-display jc-contact__sub">Get in touch.</h2>
            <ul className="jc-channels">
              {CONTACT_CHANNELS.map((c) => (
                <li key={c.label}>
                  <span className="jc-channels__name">{c.label}</span>
                  <span className="jc-channels__email">{c.email}</span>
                </li>
              ))}
            </ul>
            <p className="jc-note">*Placeholder addresses — to be confirmed before launch.</p>
          </div>
        </div>
        <div className="jc-contact__form">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
