import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { PhotoTile } from "@/components/ui/PhotoTile";
import { FeaturedExperiences } from "@/components/marketing/FeaturedExperiences";
import { marketingExperiences } from "@/data/experiences";
import { socialChannels } from "@/data/socials";
import type { ExperienceCategory } from "@/data/types";

export const metadata: Metadata = {
  title: "Home",
  description:
    "No one has to show up alone. Discover experiences, meet women who share your interests, and find your next gathering across Abu Dhabi.",
};

const CATEGORY_DESCRIPTIONS: Record<ExperienceCategory, string> = {
  Move: "Pilates, padel, tennis and everything active.",
  Gather: "Coffee mornings, majlis evenings and easy company.",
  Learn: "Workshops and circles that teach something new.",
  Celebrate: "Brunches, ladies days and reasons to dress up.",
  Unwind: "Wellness evenings built for slowing down.",
  Explore: "Outdoor gatherings across Abu Dhabi's coastline.",
};

const CATEGORIES: ExperienceCategory[] = ["Move", "Gather", "Learn", "Celebrate", "Unwind", "Explore"];

const MOOD_CHIPS = ["Social", "Active", "Relaxed", "Curious", "Quiet", "Wellness", "Explore"];

export default function HomePage() {
  const featured = marketingExperiences.slice(0, 6);

  return (
    <>
      <section className="hero">
        <Image
          src="/images/womem2.jpg"
          alt="Women gathering together on the Corniche, Abu Dhabi"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          priority
        />
        <span className="hero__kicker">Launching Soon in Abu Dhabi</span>
        <h1 className="hero__title">No one has to show up alone.</h1>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: "start" }}>
            <div className="stack gap-16">
              <span className="eyebrow">The Real Barrier</span>
              <h2 className="h2">Finding something to do was never the hard part.</h2>
            </div>
            <div className="stack gap-20">
              <p className="lede">
                Between Instagram, WhatsApp groups and a dozen booking apps, discovering things to
                do in Abu Dhabi isn&rsquo;t hard anymore. What&rsquo;s hard is the moment right
                before you go — wondering if you&rsquo;ll know anyone, if it&rsquo;s the right
                crowd, if you should just stay home instead.
              </p>
              <p className="pull-quote">
                I&rsquo;d love to go — I just don&rsquo;t want to arrive alone.
              </p>
            </div>
          </div>

          <div className="grid grid-4" style={{ marginTop: 56 }}>
            <div className="icon-tile stack gap-12">
              <div className="hex">1</div>
              <h3 className="h3" style={{ fontSize: "1.05rem" }}>What to do</h3>
              <p className="small text-2">Curated gatherings across Abu Dhabi, not another endless feed.</p>
            </div>
            <div className="icon-tile stack gap-12">
              <div className="hex">2</div>
              <h3 className="h3" style={{ fontSize: "1.05rem" }}>Where to go</h3>
              <p className="small text-2">From Saadiyat to Al Reem — real places, real neighbourhoods.</p>
            </div>
            <div className="icon-tile stack gap-12">
              <div className="hex">3</div>
              <h3 className="h3" style={{ fontSize: "1.05rem" }}>Who&rsquo;s going</h3>
              <p className="small text-2">See the women attending before you commit to a single thing.</p>
            </div>
            <div className="icon-tile stack gap-12">
              <div className="hex">4</div>
              <h3 className="h3" style={{ fontSize: "1.05rem" }}>Book &amp; join</h3>
              <p className="small text-2">Reserve your place and arrive already part of something.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="stack gap-16" style={{ maxWidth: 640, marginBottom: 48 }}>
            <span className="eyebrow">How Hive Works</span>
            <h2 className="h2">Three steps to your next gathering.</h2>
          </div>
          <div className="stack gap-32">
            <div className="step">
              <div className="hex hex--lg">01</div>
              <div className="stack gap-12">
                <h3 className="h3">Tell us what you feel like</h3>
                <p className="text-2" style={{ maxWidth: "56ch" }}>
                  No forms, no algorithms to outsmart — just a mood.
                </p>
                <div className="pill-row">
                  {MOOD_CHIPS.map((mood) => (
                    <span className="mood-chip" key={mood}>
                      {mood}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <hr className="divider" />
            <div className="step">
              <div className="hex hex--lg">02</div>
              <div className="stack gap-12">
                <h3 className="h3">Find your match</h3>
                <p className="text-2" style={{ maxWidth: "56ch" }}>
                  Hive surfaces the activity, location, time and community around it — plus the
                  women already joining.
                </p>
              </div>
            </div>
            <hr className="divider" />
            <div className="step">
              <div className="hex hex--lg">03</div>
              <div className="stack gap-12">
                <h3 className="h3">Book and show up</h3>
                <p className="text-2" style={{ maxWidth: "56ch" }}>
                  Reserve your place and arrive already knowing you&rsquo;re part of something.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div
            className="row wrap gap-16"
            style={{ justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}
          >
            <div className="stack gap-16">
              <span className="eyebrow">Featured This Season</span>
              <h2 className="h2">Gatherings happening near you.</h2>
            </div>
            <Link href="/explore" className="btn btn--outline">
              View all gatherings
            </Link>
          </div>
          <FeaturedExperiences experiences={featured} />
        </div>
      </section>

      <section className="section section--dark hex-texture">
        <div className="container">
          <div className="stack gap-8" style={{ textAlign: "center", marginBottom: 40 }}>
            <span className="eyebrow">The Hive, Growing</span>
            <h2 className="h2">A community that shows up for each other.</h2>
          </div>
          <div className="grid grid-4">
            <div className="stack" style={{ textAlign: "center", gap: 6 }}>
              <span className="h2" style={{ color: "var(--accent)" }}>2,300+</span>
              <span className="small text-2">Women in the Hive</span>
            </div>
            <div className="stack" style={{ textAlign: "center", gap: 6 }}>
              <span className="h2" style={{ color: "var(--accent)" }}>180+</span>
              <span className="small text-2">Gatherings hosted</span>
            </div>
            <div className="stack" style={{ textAlign: "center", gap: 6 }}>
              <span className="h2" style={{ color: "var(--accent)" }}>40+</span>
              <span className="small text-2">Verified organisers</span>
            </div>
            <div className="stack" style={{ textAlign: "center", gap: 6 }}>
              <span className="h2" style={{ color: "var(--accent)" }}>9</span>
              <span className="small text-2">Abu Dhabi neighbourhoods</span>
            </div>
          </div>
          <p className="small text-2" style={{ textAlign: "center", marginTop: 24 }}>
            Illustrative figures for this concept preview.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="stack gap-16" style={{ maxWidth: 640, marginBottom: 40 }}>
            <span className="eyebrow">Categories</span>
            <h2 className="h2">Whatever you&rsquo;re in the mood for.</h2>
          </div>
          <div className="grid grid-3">
            {CATEGORIES.map((category, i) => (
              <Link
                key={category}
                href="/explore"
                className="icon-tile stack gap-10"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div className="hex">{i + 1}</div>
                <h3 className="h3" style={{ fontSize: "1.05rem" }}>{category}</h3>
                <p className="small text-2">{CATEGORY_DESCRIPTIONS[category]}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: "center" }}>
            <PhotoTile
              src="/images/community-teaser.jpg"
              alt="Women in a wellness circle on Yas Island"
              tag="Yas Island, Abu Dhabi"
              className="photo"
              sizes="(min-width: 700px) 50vw, 100vw"
            />
            <div className="stack gap-16">
              <span className="eyebrow">Community</span>
              <h2 className="h2">
                You come for a gathering.
                <br />
                You return for your Hive.
              </h2>
              <p className="text-2">
                The relationships don&rsquo;t end when the event does. Women who click at a
                gathering keep gathering — in circles that meet again and again.
              </p>
              <Link href="/community" className="btn btn--outline" style={{ alignSelf: "flex-start" }}>
                Discover Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2">
            <div className="card card--warm stack gap-16" style={{ padding: 36 }}>
              <span className="eyebrow">Membership</span>
              <h3 className="h3">More than access. A place to belong.</h3>
              <p className="text-2 small">
                Early access to gatherings, member-only circles, and priority booking — pricing to
                be announced.
              </p>
              <Link href="/membership" className="btn btn--outline" style={{ alignSelf: "flex-start" }}>
                Explore Membership
              </Link>
            </div>
            <div className="card card--warm stack gap-16" style={{ padding: 36 }}>
              <span className="eyebrow">Host</span>
              <h3 className="h3">Bring people together.</h3>
              <p className="text-2 small">
                Host what you love and reach women across Abu Dhabi who are ready to show up.
              </p>
              <Link href="/host" className="btn btn--outline" style={{ alignSelf: "flex-start" }}>
                Become a Hive Host
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div
            className="stack gap-16"
            style={{ maxWidth: 640, marginBottom: 36, textAlign: "center", marginLeft: "auto", marginRight: "auto" }}
          >
            <span className="eyebrow" style={{ justifyContent: "center" }}>Follow the Hive</span>
            <h2 className="h2">The community continues beyond the gathering.</h2>
          </div>
          <div className="grid grid-4">
            {socialChannels.map((social) => (
              <div className="social-card stack gap-10" key={social.name}>
                <div className="hex">{social.name[0]}</div>
                <h3 className="h3" style={{ fontSize: "1.05rem" }}>{social.name}</h3>
                <p className="small text-2">{social.description}</p>
                <span className="small text-3">Link coming soon</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner hex-texture">
            <h2 className="h2">Your next gathering starts here.</h2>
            <p className="text-2" style={{ margin: "14px auto 28px", maxWidth: "44ch" }}>
              No one has to show up alone — not to a workout, a workshop, or a brunch table.
            </p>
            <div className="row wrap gap-16" style={{ justifyContent: "center" }}>
              <Link href="/explore" className="btn btn--on-dark">
                Explore Gatherings
              </Link>
              <Link href="/membership" className="btn btn--ghost-dark">
                Join the Hive
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
