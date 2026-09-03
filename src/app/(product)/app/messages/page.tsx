import type { Metadata } from "next";
import { ChatIcon, UserIcon, PeopleIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Messages — The Hive App",
};

const MESSAGE_GROUPS = [
  {
    icon: ChatIcon,
    title: "Event Chats",
    desc: "Chats unlock once you reserve a spot at a gathering.",
  },
  {
    icon: UserIcon,
    title: "Host Messages",
    desc: "Messages from hosts you've gathered with will appear here.",
  },
  {
    icon: PeopleIcon,
    title: "Community Updates",
    desc: "News from your circles will appear here once you join one.",
  },
];

export default function MessagesPage() {
  return (
    <div className="app-content" style={{ paddingTop: 44 }}>
      <div className="app-view-header stack gap-10">
        <span className="eyebrow">Messages</span>
        <h1 className="h2">Controlled, event-first conversation.</h1>
        <p className="text-2 small">
          Hive messaging is organised around gatherings, not open DMs — chats unlock once you
          reserve a spot.
        </p>
      </div>
      <div className="stack gap-16">
        {MESSAGE_GROUPS.map((group) => (
          <div className="msg-row" key={group.title}>
            <span className="msg-row__icon">
              <group.icon />
            </span>
            <div className="stack gap-4">
              <h3 className="h3" style={{ fontSize: "1rem" }}>{group.title}</h3>
              <p className="small text-2">{group.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
