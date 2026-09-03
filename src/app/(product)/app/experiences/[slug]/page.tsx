import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PhotoTile } from "@/components/ui/PhotoTile";
import { AvatarStack } from "@/components/ui/AvatarStack";
import { VerifiedBadge } from "@/components/ui/Badge";
import { ReserveButton } from "@/components/product/ReserveButton";
import { appExperiences, findExperience, marketingExperiences } from "@/data/experiences";

export function generateStaticParams() {
  return [...marketingExperiences, ...appExperiences].map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const experience = findExperience(slug);
  if (!experience) return {};
  return {
    title: experience.title,
    description: experience.description,
  };
}

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experience = findExperience(slug);
  if (!experience) notFound();

  return (
    <div className="app-content" style={{ paddingTop: 44 }}>
      <div className="stack gap-24" style={{ maxWidth: 680, margin: "0 auto" }}>
        <PhotoTile
          src={experience.image}
          alt={experience.title}
          tag={`${experience.area}, Abu Dhabi · ${experience.date}`}
          className="photo"
          sizes="680px"
          priority
        />

        <div className="row wrap gap-12" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <div className="stack gap-6">
            <span className="activity-card__cat">{experience.category}</span>
            <h1 className="h3">{experience.title}</h1>
            <span className="small text-3">
              Hosted by {experience.organiser}
              {experience.verified && <VerifiedBadge />}
            </span>
          </div>
          <span className="activity-card__price" style={{ fontSize: "1.2rem" }}>
            {experience.price}
          </span>
        </div>

        <p className="text-2 small">{experience.description}</p>

        <div className="row wrap gap-24 small text-2">
          <span>📍 {experience.area}</span>
          <span>🗓 {experience.date}</span>
          {experience.time && <span>🕐 {experience.time}</span>}
        </div>

        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <AvatarStack names={experience.attendeeNames} total={experience.going} />
          <span className="small text-3">{experience.going} women going</span>
        </div>

        <div className="card stack gap-10" style={{ padding: 16, background: "var(--bg-alt)" }}>
          <span className="label-sm">Say hi before you arrive</span>
          <div className="icebreaker">&quot;Hi everyone, looking forward to meeting you.&quot;</div>
          <div className="icebreaker">&quot;Is this beginner friendly?&quot;</div>
          <span className="small text-3">
            Preset icebreakers unlock in the group chat once you book — messaging is limited to
            attendees and moderated by the host.
          </span>
        </div>

        <ReserveButton title={experience.title} />
      </div>
    </div>
  );
}
