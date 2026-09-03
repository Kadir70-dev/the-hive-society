import type { Metadata } from "next";
import { AppHero } from "@/components/product/AppHero";
import { ActivityGrid } from "@/components/product/ActivityGrid";
import { appExperiences } from "@/data/experiences";

export const metadata: Metadata = {
  title: "Explore — The Hive App",
};

export default function AppExplorePage() {
  return (
    <>
      <AppHero />
      <ActivityGrid experiences={appExperiences} />
    </>
  );
}
