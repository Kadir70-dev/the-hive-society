import { initials } from "@/lib/initials";

interface AvatarStackProps {
  names: string[];
  total: number;
}

export function AvatarStack({ names, total }: AvatarStackProps) {
  const shown = names.slice(0, 3);
  const extra = total - shown.length;

  return (
    <div className="avatars">
      {shown.map((name) => (
        <span className="avatar" title={name} key={name}>
          {initials(name)}
        </span>
      ))}
      {extra > 0 && <span className="avatar avatar--more">+{extra}</span>}
    </div>
  );
}
