export function VerifiedBadge() {
  return <span className="badge">Verified</span>;
}

export function ProposedTag({ children }: { children: React.ReactNode }) {
  return <span className="tag-proposed">{children}</span>;
}
