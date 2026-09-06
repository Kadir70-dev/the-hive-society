import Link from "next/link";
import type { Metadata } from "next";
import { ExploreGrid } from "@/components/marketing/ExploreGrid";
import { marketingExperiences } from "@/data/experiences";
import { EditableText, EditableHeading, EditableLabel } from "@/components/content/EditableText";
import { getPageContent, resolve } from "@/lib/content/getPageContent";

export const metadata: Metadata = {
  title: "Explore",
  description: "Discover what's happening across Abu Dhabi this season.",
};

export default async function ExplorePage() {
  const content = await getPageContent("explore");
  const t = (key: string, fallback: string) => resolve(content, key, fallback);

  return (
    <>
      <div className="page-open hex-texture hex-texture--light">
        <div className="container stack gap-14" style={{ maxWidth: 560 }}>
          <EditableLabel contentKey="explore.hero.eyebrow" value={t("explore.hero.eyebrow", "Explore")} className="eyebrow" />
          <EditableHeading
            as="h1"
            contentKey="explore.hero.title"
            value={t("explore.hero.title", "Explore Gatherings")}
            className="h1"
            style={{ fontSize: "clamp(2rem,4vw + .4rem,3.2rem)" }}
          />
          <EditableText
            as="p"
            multiline
            contentKey="explore.hero.lede"
            value={t("explore.hero.lede", "Discover what’s happening across Abu Dhabi this season.")}
            className="lede"
          />
        </div>
      </div>
      <div className="section section--tight hex-texture hex-texture--light">
        <div className="container">
          <ExploreGrid experiences={marketingExperiences} />
        </div>
      </div>
      <div className="section">
        <div className="container">
          <div className="cta-banner section--dark hex-texture" style={{ textAlign: "center" }}>
            <EditableHeading
              as="p"
              contentKey="explore.cta.quote"
              value={t("explore.cta.quote", "Hosting something the Hive would love?")}
              className="pull-quote"
              style={{ margin: "0 auto", maxWidth: "22ch" }}
            />
            <Link href="/host" className="btn btn--on-dark" style={{ marginTop: 24 }}>
              <EditableLabel contentKey="explore.cta.button_label" value={t("explore.cta.button_label", "Host an Activity")} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
