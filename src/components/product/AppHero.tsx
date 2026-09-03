import Image from "next/image";

export function AppHero() {
  return (
    <div className="app-hero">
      <Image
        src="/images/app-hero.jpg"
        alt="Women sharing Arabic coffee at a Hive gathering"
        fill
        sizes="100vw"
        style={{ objectFit: "cover" }}
        priority
      />
      <div className="app-hero__inner">
        <span className="app-hero__tag">Abu Dhabi Chapter</span>
        <h1 className="app-hero__headline">No one has to show up alone</h1>
      </div>
    </div>
  );
}
