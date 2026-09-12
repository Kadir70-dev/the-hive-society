import type { Metadata } from "next";
import { DynamicLineBackground, type LineBackgroundVariant } from "@/components/backgrounds/DynamicLineBackground";
import { SoftPullVariant } from "@/components/backgrounds/interactive/SoftPullVariant";
import { FlowTrailVariant } from "@/components/backgrounds/interactive/FlowTrailVariant";
import { RippleRingVariant } from "@/components/backgrounds/interactive/RippleRingVariant";
import { OrbitNudgeVariant } from "@/components/backgrounds/interactive/OrbitNudgeVariant";
import { SilkWaveVariant } from "@/components/backgrounds/interactive/SilkWaveVariant";

export const metadata: Metadata = {
  title: "Background Lab",
  robots: { index: false, follow: false },
};

const AMBIENT_VARIANTS: { variant: LineBackgroundVariant; title: string; note: string }[] = [
  { variant: "flow", title: "1 — Flow", note: "A thin line traveling slowly along its own path, like a soft snake." },
  { variant: "orbit", title: "2 — Orbit", note: "Two calm rings; one thin arc slowly revolving through/around them." },
  { variant: "rings", title: "3 — Rings", note: "Large partial arcs bleeding in from the corners, breathing gently." },
  { variant: "wave", title: "4 — Wave", note: "Three ribbon-like curves drifting out of phase with one another." },
  { variant: "constellation", title: "5 — Constellation", note: "A sparse handful of nodes joined by soft curved connectors." },
];

function AmbientSection({ variant, title, note }: (typeof AMBIENT_VARIANTS)[number]) {
  return (
    <section className="section--intimate" style={{ position: "relative", minHeight: 420, overflow: "hidden" }}>
      <DynamicLineBackground variant={variant} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <h2 className="h3">{title}</h2>
        <p className="text-2" style={{ maxWidth: "48ch" }}>
          {note}
        </p>
      </div>
    </section>
  );
}

const INTERACTIVE_VARIANTS: { title: string; note: string; Component: () => React.ReactNode }[] = [
  {
    title: "A — Soft Pull",
    note: "Move your pointer (or finger) nearby — the line leans gently toward it, then relaxes back.",
    Component: SoftPullVariant,
  },
  {
    title: "B — Flow Trail",
    note: "A short curved trail follows your movement, then fades once you stop.",
    Component: FlowTrailVariant,
  },
  {
    title: "C — Ripple Ring",
    note: "Small rings bloom and fade as you move — throttled, not one per pixel.",
    Component: RippleRingVariant,
  },
  {
    title: "D — Orbit Nudge",
    note: "The arc speeds up smoothly the closer your pointer gets to the rings' centre.",
    Component: OrbitNudgeVariant,
  },
  {
    title: "E — Silk Wave",
    note: "A long ribbon drifts on its own, and bends further where your pointer passes over it.",
    Component: SilkWaveVariant,
  },
];

function InteractiveSection({ title, note, Component }: (typeof INTERACTIVE_VARIANTS)[number]) {
  return (
    <section className="section--intimate" style={{ position: "relative", minHeight: 420, overflow: "hidden" }}>
      <Component />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <h2 className="h3">{title}</h2>
        <p className="text-2" style={{ maxWidth: "48ch" }}>
          {note}
        </p>
      </div>
    </section>
  );
}

/**
 * Internal, unlinked preview of the DynamicLineBackground system — both the
 * 5 ambient ("ready to sit behind a section") variants and the 5
 * pointer-reactive interaction variants layered on top of a couple of them.
 * Nothing here touches any real route.
 */
export default function BackgroundLabPage() {
  return (
    <div className="page-open">
      <div className="container stack gap-16">
        <span className="eyebrow">Internal — Background Lab</span>
        <h1 className="display-xl">Dynamic line background system</h1>
        <p className="lede">
          Five ambient ready-to-place variants, then five pointer-reactive variants layered on top. Move your mouse
          (or finger, on a touch device) over each interactive section below its heading.
        </p>
      </div>

      <div className="divider" style={{ margin: "48px 0" }} />
      <div className="container">
        <span className="label-sm">Ambient variants</span>
      </div>
      {AMBIENT_VARIANTS.map((v) => (
        <AmbientSection key={v.variant} {...v} />
      ))}

      <div className="divider" style={{ margin: "48px 0" }} />
      <div className="container">
        <span className="label-sm">Pointer-reactive variants</span>
      </div>
      {INTERACTIVE_VARIANTS.map((v) => (
        <InteractiveSection key={v.title} {...v} />
      ))}
    </div>
  );
}
