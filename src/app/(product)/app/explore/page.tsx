import type { Metadata } from "next";
import { AppHero } from "@/components/product/AppHero";
import { ActivityGrid } from "@/components/product/ActivityGrid";
import { getPageContent } from "@/lib/content/getPageContent";
import { getPageMedia } from "@/lib/content/getPageMedia";
import { getGatherings } from "@/lib/content/getGatherings";

export const metadata: Metadata = {
  title: "Explore — The Hive App",
};

export default async function AppExplorePage() {
  const [content, media, experiences] = await Promise.all([
    getPageContent("app-explore"),
    getPageMedia("app-explore"),
    getGatherings("app"),
  ]);

  return (
    <>
      <AppHero content={content} media={media} />
      <ActivityGrid experiences={experiences} />
    </>
  );
}
