import Link from "next/link";
import type { Metadata } from "next";
import { CommunitySignupForm } from "@/components/forms/CommunitySignupForm";
import { membershipFaqs } from "@/data/faqs";
import { EditableText, EditableHeading, EditableLabel } from "@/components/content/EditableText";
import { getPageContent, resolve } from "@/lib/content/getPageContent";

export const metadata: Metadata = {
  title: "Join the Community",
  description:
    "Join The Hive Society's early UAE community and stay connected for gatherings, meetups, events and launch updates.",
};

export default async function MembershipPage() {
  const content = await getPageContent("membership");
  const t = (key: string, fallback: string) => resolve(content, key, fallback);

  return (
    <>
      <div className="masthead section--dark hex-texture">
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

      <div className="section section--intimate hex-texture hex-texture--light" id="join-form">
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

      <div className="section section--alt hex-texture hex-texture--light">
        <div className="container">
          <div className="grid grid-2">
            <div className="card stack gap-14" style={{ padding: 32 }}>
              <EditableLabel contentKey="membership.community_tier.eyebrow" value={t("membership.community_tier.eyebrow", "Community Access")} className="eyebrow" />
              <EditableHeading as="h3" contentKey="membership.community_tier.title" value={t("membership.community_tier.title", "Hive Community")} className="h3" />
              <EditableText
                as="p"
                multiline
                contentKey="membership.community_tier.description"
                value={t("membership.community_tier.description", "Explore, connect & enjoy - free")}
                className="text-2 small"
              />
              <ul className="stack gap-10" style={{ listStyle: "none", padding: 0, marginTop: 8 }}>
                {["1", "2", "3", "4"].map((n) => (
                  <li className="small" key={n}>
                    ✓{" "}
                    <EditableLabel
                      contentKey={`membership.community_tier.feature_${n}`}
                      value={t(
                        `membership.community_tier.feature_${n}`,
                        { "1": "Discover experiences", "2": "Join circles", "3": "Save favorites", "4": "Book activities" }[n]!
                      )}
                    />
                  </li>
                ))}
              </ul>
              <Link href="/explore" className="btn btn--outline" style={{ alignSelf: "flex-start", marginTop: 8 }}>
                <EditableLabel contentKey="membership.community_tier.button_label" value={t("membership.community_tier.button_label", "Start Exploring")} />
              </Link>
            </div>
            <div className="card card--warm stack gap-14" style={{ padding: 32, borderColor: "var(--accent-deep)" }}>
              <EditableLabel contentKey="membership.premium_tier.eyebrow" value={t("membership.premium_tier.eyebrow", "Premium Tier · Proposed")} className="eyebrow" />
              <EditableHeading as="h3" contentKey="membership.premium_tier.title" value={t("membership.premium_tier.title", "Hive Membership")} className="h3" />
              <EditableText
                as="p"
                multiline
                contentKey="membership.premium_tier.description"
                value={t(
                  "membership.premium_tier.description",
                  "More access. More perks."
                )}
                className="text-2 small"
              />
              <ul className="stack gap-10" style={{ listStyle: "none", padding: 0, marginTop: 8 }}>
                {["1", "2", "3", "4", "5"].map((n) => (
                  <li className="small" key={n}>
                    ✓{" "}
                    <EditableLabel
                      contentKey={`membership.premium_tier.feature_${n}`}
                      value={t(
                        `membership.premium_tier.feature_${n}`,
                        {
                          "1": "All community benefits",
                          "2": "Early access",
                          "3": "Priority booking",
                          "4": "Member-only events",
                          "5": "Special offers",
                        }[n]!
                      )}
                    />
                  </li>
                ))}
              </ul>
              <a href="#join-form" className="btn btn--primary" style={{ alignSelf: "flex-start", marginTop: 8 }}>
                <EditableLabel contentKey="membership.premium_tier.button_label" value={t("membership.premium_tier.button_label", "Join the Hive")} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="section hex-texture hex-texture--light">
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
