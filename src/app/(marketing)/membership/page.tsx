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
      <section className="j-pagehero j-pagehero--maroon j-on-dark">
        <div className="j-wrap">
          <EditableLabel contentKey="membership.masthead.eyebrow" value={t("membership.masthead.eyebrow", "Join the Hive")} className="j-label" />
          <EditableHeading
            as="h1"
            contentKey="membership.masthead.title"
            value={t("membership.masthead.title", "Be part of it")}
            className="j-display j-pagehero__title"
          />
          <EditableText
            as="p"
            multiline
            contentKey="membership.masthead.lede"
            value={t("membership.masthead.lede", "Get updates on Abu Dhabi events, meetups & launch news")}
            className="j-lede j-pagehero__lede"
          />
          <EditableLabel
            contentKey="membership.masthead.tag"
            value={t("membership.masthead.tag", "Membership coming soon")}
            className="jc-tag"
          />
        </div>
      </section>

      <section className="j-section jc-join" id="join-form">
        <div className="j-wrap jc-join__grid">
          <div className="jc-join__intro">
            <EditableHeading as="h2" contentKey="membership.form.title" value={t("membership.form.title", "Join the Hive")} className="j-display j-h2" />
            <EditableText
              as="p"
              multiline
              contentKey="membership.form.subtitle"
              value={t("membership.form.subtitle", "Get updates & invites")}
              className="j-lede"
            />
          </div>
          <div className="jc-join__form">
            <CommunitySignupForm />
          </div>
        </div>
      </section>

      <section className="j-section section--dark jc-plans">
        <div className="j-wrap">
          {plans.map((plan) => (
            <div key={plan.key} className="jc-plan">
              <div className="jc-plan__main">
                <EditablePlanValue planId={plan.id} field="name" value={plan.name} as="h2" className="j-display jc-plan__name" />
                <p className="j-display jc-plan__price">
                  AED <EditablePlanValue planId={plan.id} field="amount_aed" value={plan.amountAed} as="span" />
                  <span className="jc-plan__per">/mo</span>
                </p>
                <EditablePlanValue planId={plan.id} field="tagline" value={plan.tagline} as="p" className="jc-plan__tag" />
                <EditablePlanFeatures planId={plan.id} features={plan.features} />
              </div>
              <div className="jc-plan__form">
                <MembershipCheckoutForm planKey={plan.key} amountAed={plan.amountAed} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="j-section jc-faq">
        <div className="j-wrap jc-faq__grid">
          <EditableHeading
            as="h2"
            contentKey="membership.faq.heading"
            value={t("membership.faq.heading", "Membership questions.")}
            className="j-display j-h2"
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
      </section>
    </>
  );
}
