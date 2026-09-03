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
      <div className="page-hero hex-texture">
        <div className="container stack gap-14">
          <span className="eyebrow">Explore</span>
          <h1 className="h1" style={{ fontSize: "clamp(2rem,4vw + .4rem,3.2rem)" }}>
            Explore Gatherings
          </h1>
          <p className="lede" style={{ color: "var(--on-dark-2)" }}>
            Discover what&rsquo;s happening across Abu Dhabi this season.
          </p>
        </div>
      </div>
      <div className="section section--tight">
        <div className="container">
          <ExploreGrid experiences={marketingExperiences} />
        </div>
      </div>
    </>
  );
}
