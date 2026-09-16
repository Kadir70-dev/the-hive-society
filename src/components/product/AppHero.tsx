import { EditableImage } from "@/components/content/EditableImage";
import { EditableLabel, EditableHeading } from "@/components/content/EditableText";
import { resolveMedia } from "@/lib/content/getPageMedia";
import type { ResolvedMedia } from "@/lib/content/types";

interface AppHeroProps {
  content: Record<string, string>;
  media: Record<string, ResolvedMedia>;
}

export function AppHero({ content, media }: AppHeroProps) {
  const t = (key: string, fallback: string) => content[key] ?? fallback;
  const background = resolveMedia(media, "app-explore.hero.background", {
    url: "/images/introhive.jpg",
    alt: "Women sharing Arabic coffee at a Hive gathering",
  });

  return (
    <div className="app-hero">
      <EditableImage
        mediaKey="app-explore.hero.background"
        src={background.url}
        alt={background.alt}
        objectPosition={background.objectPosition}
        sizes="100vw"
        priority
      />
      <div className="app-hero__inner">
        <EditableLabel
          contentKey="app-explore.hero.tag"
          value={t("app-explore.hero.tag", "Abu Dhabi Chapter")}
          className="app-hero__tag"
          hero
        />
        <EditableHeading
          as="h1"
          contentKey="app-explore.hero.headline"
          value={t("app-explore.hero.headline", "No one has to show up alone")}
          className="app-hero__headline"
          hero
        />
      </div>
    </div>
  );
}
