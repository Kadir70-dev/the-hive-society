import Image from "next/image";
import { AvatarStack } from "@/components/ui/AvatarStack";
import { CategoryIcon, PinIcon, CalendarIcon, ClockIcon, ChatIcon } from "@/components/ui/Icons";
import type { Experience } from "@/data/types";

interface ActivityCardProps {
  experience: Experience;
  onSelect: (id: string) => void;
}

export function ActivityCard({ experience, onSelect }: ActivityCardProps) {
  return (
    <button className="event-card" onClick={() => onSelect(experience.id)}>
      <div className="event-card__photo">
        <Image
          src={experience.image}
          alt={experience.title}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          style={{ objectFit: "cover" }}
        />
        <span className="event-card__pill event-card__pill--cat">
          <CategoryIcon category={experience.category} />
          {experience.category}
        </span>
        <span className="event-card__pill event-card__pill--price">{experience.price}</span>
      </div>
      <div className="event-card__body">
        <h3 className="event-card__title">{experience.title}</h3>
        <div className="event-card__meta">
          <span>
            <PinIcon />
            {experience.area}
          </span>
          <span>
            <CalendarIcon />
            {experience.date}
          </span>
          {experience.time && (
            <span>
              <ClockIcon />
              {experience.time}
            </span>
          )}
        </div>
        <div className="event-card__divider" />
        <div className="event-card__foot">
          <div className="event-card__going">
            <AvatarStack names={experience.attendeeNames} total={experience.going} />
            <span>{experience.going} going</span>
          </div>
          {!!experience.sayHi && (
            <span className="event-card__sayhi">
              <ChatIcon />
              Say Hi · {experience.sayHi}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
