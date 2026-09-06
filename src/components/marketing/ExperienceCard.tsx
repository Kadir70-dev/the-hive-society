import Image from "next/image";
import { AvatarStack } from "@/components/ui/AvatarStack";
import type { Experience } from "@/data/types";

interface ExperienceCardProps {
  experience: Experience;
  onSelect: (id: string) => void;
  featured?: boolean;
}

export function ExperienceCard({ experience, onSelect, featured }: ExperienceCardProps) {
  return (
    <button
      className="activity-card"
      style={{
        textAlign: "left",
        cursor: "pointer",
        padding: 0,
        font: "inherit",
        color: "inherit",
      }}
      onClick={() => onSelect(experience.id)}
    >
      <div className="photo activity-card__photo">
        <Image
          src={experience.image}
          alt={experience.title}
          fill
          sizes="(min-width: 1000px) 33vw, (min-width: 700px) 50vw, 100vw"
          style={{ objectFit: "cover" }}
        />
        <span className="photo__tag">
          {experience.area}, Abu Dhabi
        </span>
      </div>
      <div className="activity-card__body">
        <span className="activity-card__cat">
          {experience.category}
          {experience.verified ? " · Verified" : ""}
        </span>
        <h3 className="activity-card__title">{experience.title}</h3>
        {featured && <p className="small text-2">{experience.description}</p>}
        <div className="activity-card__meta">
          <span>{experience.area}</span>
          <span>
            {experience.date}
            {experience.time ? ` · ${experience.time}` : ""}
          </span>
        </div>
        <div className="activity-card__foot">
          <span className="activity-card__price">{experience.price}</span>
          <AvatarStack names={experience.attendeeNames} total={experience.going} />
        </div>
        <span className="going-line">{experience.going} women going</span>
      </div>
    </button>
  );
}
