import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { circles, findCircle } from "@/data/circles";

export function generateStaticParams() {
  return circles.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const circle = findCircle(slug);
  if (!circle) return {};
  return { title: circle.name };
}

export default async function CircleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const circle = findCircle(slug);
  if (!circle) notFound();

  return (
    <div className="app-content" style={{ paddingTop: 44 }}>
      <div className="stack gap-24" style={{ maxWidth: 640, margin: "0 auto" }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <div className="stack gap-6">
            <span className="eyebrow">Circle</span>
            <h1 className="h2">{circle.name}</h1>
          </div>
          <span className="tag-proposed">Preview</span>
        </div>
        <p className="text-2">
          {circle.members} women · {circle.cadence}
        </p>
        <div className="empty-state">
          You&rsquo;re not a member of this circle yet. Attend a matching gathering to start
          building it together.
        </div>
        <Link href="/app/explore" className="btn btn--primary" style={{ alignSelf: "flex-start" }}>
          Explore gatherings
        </Link>
      </div>
    </div>
  );
}
