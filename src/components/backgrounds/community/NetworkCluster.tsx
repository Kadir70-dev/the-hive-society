"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { curvePath, type NetworkTemplate } from "./networkData";
import styles from "./communityNetwork.module.css";

const MOBILE_QUERY = "(max-width: 699px)";
function subscribeMobile(callback: () => void) {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const isMobile = () => window.matchMedia(MOBILE_QUERY).matches;
const serverMobile = () => false;

export function NetworkCluster({ template }: { template: NetworkTemplate }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const mobile = useSyncExternalStore(subscribeMobile, isMobile, serverMobile);
  const nodes = template.nodes.filter((node) => !mobile || !node.mobileHidden);
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const edges = template.edges.filter((edge) => (!mobile || !edge.mobileHidden) && nodeById.has(edge.from) && nodeById.has(edge.to));

  useEffect(() => {
    const element = svgRef.current;
    if (!element) return;
    const svg = element;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let visible = false;
    let generation = 0;
    let controller: ReturnType<typeof import("./animateNetwork").animateNetwork> | undefined;

    async function syncMotion() {
      const current = ++generation;
      if (preference.matches) {
        controller?.destroy();
        controller = undefined;
        return;
      }
      if (!visible || document.hidden) {
        controller?.pause();
        return;
      }
      if (!controller) {
        // Complete SVG fallback; motion loads only for a visible cluster.
        try {
          const { animateNetwork } = await import("./animateNetwork");
          if (disposed || current !== generation) return;
          controller = animateNetwork(svg, template, mobile);
        } catch {
          return;
        }
      }
      controller.play();
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      void syncMotion();
    });
    observer.observe(svg);
    preference.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncMotion);
    return () => {
      disposed = true;
      generation++;
      observer.disconnect();
      preference.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncMotion);
      controller?.destroy();
    };
  }, [template, mobile]);

  return (
    <div className={`${styles.artwork} ${styles[template.size]}`} aria-hidden="true">
      <svg ref={svgRef} data-community-network={template.size} viewBox={`0 0 ${template.viewBox.width} ${template.viewBox.height}`} width="100%" height="100%" focusable="false" aria-hidden="true">
        {edges.map((edge, index) => {
          const a = nodeById.get(edge.from)!;
          const b = nodeById.get(edge.to)!;
          const hidden = edge.mobileHidden || a.mobileHidden || b.mobileHidden;
          const d = curvePath(a, b, edge.bend);
          return (
            <g key={`${edge.from}--${edge.to}`} data-mobile-hidden={hidden || undefined}>
              <path data-edge={index} d={d} fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.27" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              <path data-flow={index} d={d} fill="none" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.32" opacity="0" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </g>
          );
        })}
        {nodes.map((node) => (
          <g key={node.id} data-node={node.id} data-mobile-hidden={node.mobileHidden || undefined} transform={`translate(${node.x} ${node.y})`}>
            <g data-reveal="">
              <circle data-ring="" r="3" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0" vectorEffect="non-scaling-stroke" />
              <circle r={node.id === template.hub ? 4 : 3} fill="currentColor" opacity={node.id === template.hub ? 0.72 : 0.58} />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
