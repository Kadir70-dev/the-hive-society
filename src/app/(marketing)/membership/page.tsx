import type { Metadata } from "next";
import { CommunitySignupForm } from "@/components/forms/CommunitySignupForm";
import { MembershipCheckoutForm } from "@/components/forms/MembershipCheckoutForm";
import { membershipFaqs } from "@/data/faqs";
import { getMembershipPlans } from "@/lib/content/getMembershipPlans";
import { EditableText, EditableHeading, EditableLabel } from "@/components/content/EditableText";
import { EditablePlanValue, EditablePlanFeatures } from "@/components/content/EditablePlanField";
import { getPageContent, resolve } from "@/lib/content/getPageContent";

export const metadata: Metadata = {
  title: "Join the Community",
  description:
    "Join The Hive Society's early UAE community and stay connected for gatherings, meetups, events and launch updates.",
};

export default async function MembershipPage() {
  const [content, plans] = await Promise.all([getPageContent("membership"), getMembershipPlans()]);
  const t = (key: string, fallback: string) => resolve(content, key, fallback);

  return (
    <>
      <div className="masthead section--dark">
        <div className="container">
          <div className="split split--60-40" style={{ alignItems: "start" }}>
            <div className="stack gap-14">
              <EditableLabel contentKey="membership.masthead.eyebrow" value={t("membership.masthead.eyebrow", "Join the Hive")} className="eyebrow" />
              <EditableHeading
                as="h1"
                contentKey="membership.masthead.title"
                value={t("membership.masthead.title", "Be part of it")}
                className="h1"
                style={{ fontSize: "clamp(2rem,4vw + .4rem,3.2rem)" }}
              />
              <EditableText
                as="p"
                multiline
                contentKey="membership.masthead.lede"
                value={t("membership.masthead.lede", "Get updates on Abu Dhabi events, meetups & launch news")}
                className="lede"
              />
            </div>
            <EditableLabel
              contentKey="membership.masthead.tag"
              value={t("membership.masthead.tag", "Membership coming soon")}
              className="tag-proposed"
              style={{ justifySelf: "start", marginTop: 10 }}
            />
          </div>
        </div>
      </div>

      <div className="section section--intimate" id="join-form">
        <div className="container">
          <div className="card popup-card">
            <div className="stack gap-6" style={{ textAlign: "center", marginBottom: 22 }}>
              <EditableHeading as="h2" contentKey="membership.form.title" value={t("membership.form.title", "Join the Hive")} className="h3" />
              <EditableText
                as="p"
                multiline
                contentKey="membership.form.subtitle"
                value={t("membership.form.subtitle", "Get updates & invites")}
                className="text-2 small"
              />
            </div>
            <CommunitySignupForm />
          </div>
        </div>
      </div>

      <div className="section section--alt">
        <div className="container">
          <div className="grid grid-2">
            {plans.map((plan) => (
              <div
                key={plan.key}
                className={plan.key === "create" ? "card card--warm stack gap-14" : "card stack gap-14"}
                style={
                  plan.key === "create"
                    ? { padding: 32, borderColor: "var(--accent-deep)" }
                    : { padding: 32 }
                }
              >
                <EditablePlanValue planId={plan.id} field="name" value={plan.name} as="span" className="eyebrow" />
                <h3 className="h3">
                  AED <EditablePlanValue planId={plan.id} field="amount_aed" value={plan.amountAed} as="span" />
                  <span className="small text-2">/mo</span>
                </h3>
                <EditablePlanValue planId={plan.id} field="tagline" value={plan.tagline} as="p" className="text-2 small" />
                <EditablePlanFeatures planId={plan.id} features={plan.features} />
                <div style={{ marginTop: 8, width: "100%" }}>
                  <MembershipCheckoutForm planKey={plan.key} amountAed={plan.amountAed} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <EditableHeading
            as="h2"
            contentKey="membership.faq.heading"
            value={t("membership.faq.heading", "Membership questions.")}
            className="h2"
            style={{ marginBottom: 8 }}
          />
          <div className="faq">
            {membershipFaqs.map((faq, i) => {
              const n = i + 1;
              return (
                <details className="faq-item" key={faq.question}>
                  <summary>
                    <EditableLabel contentKey={`membership.faq.${n}.question`} value={t(`membership.faq.${n}.question`, faq.question)} />
                  </summary>
                  <p>
                    <EditableText
                      as="span"
                      contentKey={`membership.faq.${n}.answer`}
                      value={t(`membership.faq.${n}.answer`, faq.answer)}
                    />
                  </p>
                </details>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
