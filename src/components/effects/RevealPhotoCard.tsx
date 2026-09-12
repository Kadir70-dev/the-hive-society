"use client";

import type { CSSProperties, ReactNode } from "react";
import { useRevealImage } from "@/lib/animation/useRevealImage";

interface RevealPhotoCardProps {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * Drop-in replacement for a plain `<div>` that IS the layout-critical
 * element (e.g. a CSS grid item) — renders as that same div with the reveal
 * ref attached directly, so it participates in the parent grid/flex exactly
 * as it did before. No extra wrapper, so no risk to `grid-template-columns`,
 * aspect-ratio, or any other layout that depends on this being the direct
 * child.
 */
export function RevealPhotoCard({ className, style, children }: RevealPhotoCardProps) {
  const ref = useRevealImage<HTMLDivElement>({ fromScale: 1.04 });

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
