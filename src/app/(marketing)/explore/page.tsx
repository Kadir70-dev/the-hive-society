import Link from "next/link";
import type { Metadata } from "next";
import { ExploreGrid } from "@/components/marketing/ExploreGrid";
import { marketingExperiences } from "@/data/experiences";

export const metadata: Metadata = {
  title: "Explore",
  description: "Discover what's happening across Abu Dhabi this season.",
};

export default function ExplorePage() {
  return (
    <>
      <div className="page-open">
        <div className="container stack gap-14" style={{ maxWidth: 560 }}>
          <span className="eyebrow">Explore</span>
          <h1 className="h1" style={{ fontSize: "clamp(2rem,4vw + .4rem,3.2rem)" }}>
            Explore Gatherings
          </h1>
          <p className="lede">
            Discover what&rsquo;s happening across Abu Dhabi this season.
          </p>
        </div>
      </div>
      <div className="section section--tight">
        <div className="container">
          <ExploreGrid experiences={marketingExperiences} />
        </div>
      </div>
      <div className="section">
        <div className="container">
          <div className="cta-banner section--dark hex-texture" style={{ textAlign: "center" }}>
            <p className="pull-quote" style={{ margin: "0 auto", maxWidth: "22ch" }}>
              Hosting something the Hive would love?
            </p>
            <Link href="/host" className="btn btn--on-dark" style={{ marginTop: 24 }}>
              Host an Activity
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
