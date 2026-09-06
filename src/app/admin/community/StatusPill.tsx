import type { ApplicationStatus } from "@/lib/admin/types";

const COLORS: Record<ApplicationStatus, { bg: string; fg: string }> = {
  pending: { bg: "rgba(154,107,47,.14)", fg: "var(--accent-deep)" },
  approved: { bg: "rgba(46,70,64,.12)", fg: "var(--trust-c)" },
  rejected: { bg: "rgba(179,38,30,.12)", fg: "#b3261e" },
  waitlisted: { bg: "rgba(124,114,100,.14)", fg: "var(--text-2)" },
};

export function StatusPill({ status }: { status: ApplicationStatus }) {
  const { bg, fg } = COLORS[status];
  return (
    <span
      style={{
        display: "inline-flex",
        fontSize: ".7rem",
        fontWeight: 700,
        letterSpacing: ".03em",
        textTransform: "capitalize",
        padding: "4px 10px",
        borderRadius: 999,
        background: bg,
        color: fg,
      }}
    >
      {status}
    </span>
  );
}
