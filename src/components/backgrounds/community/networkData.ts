export interface NetworkNode {
  id: string;
  x: number;
  y: number;
  /** Removed from the mobile SVG, including its incident connections. */
  mobileHidden?: boolean;
}

export interface NetworkEdge {
  from: string;
  to: string;
  bend?: number;
  mobileHidden?: boolean;
}

export interface NetworkTemplate {
  size: "large" | "medium" | "small";
  viewBox: { width: number; height: number };
  nodes: NetworkNode[];
  hub: string;
  /** Each connection starts at someone already present; loops reunite existing nodes. */
  edges: NetworkEdge[];
}

/** An open, asymmetric gathering, with three new arrivals at its edges. */
export const CLUSTER_LARGE: NetworkTemplate = {
  size: "large",
  viewBox: { width: 560, height: 420 },
  hub: "hub",
  nodes: [
    { id: "hub", x: 268, y: 208 },
    { id: "l1", x: 168, y: 184 },
    { id: "tl", x: 220, y: 84 },
    { id: "tr", x: 356, y: 110 },
    { id: "r1", x: 394, y: 224 },
    { id: "bottom1", x: 298, y: 316 },
    { id: "l2", x: 65, y: 235, mobileHidden: true },
    { id: "r2", x: 502, y: 160, mobileHidden: true },
    { id: "bottom2", x: 418, y: 365, mobileHidden: true },
  ],
  edges: [
    { from: "hub", to: "l1", bend: 0.2 },
    { from: "l1", to: "tl", bend: -0.19 },
    { from: "tl", to: "tr", bend: 0.22 },
    { from: "tr", to: "hub", bend: -0.2 },
    { from: "hub", to: "r1", bend: 0.19 },
    { from: "r1", to: "bottom1", bend: 0.22 },
    { from: "bottom1", to: "l1", bend: -0.21 },
    { from: "l1", to: "l2", bend: 0.16 },
    { from: "r1", to: "r2", bend: 0.18 },
    { from: "bottom1", to: "bottom2", bend: 0.2 },
  ],
};

/** A winding conversation with a smaller gathering opening to the right. */
export const CLUSTER_MEDIUM: NetworkTemplate = {
  size: "medium",
  viewBox: { width: 460, height: 300 },
  hub: "hub",
  nodes: [
    { id: "hub", x: 92, y: 196 },
    { id: "l1", x: 167, y: 92 },
    { id: "r1", x: 280, y: 140 },
    { id: "bottom1", x: 236, y: 235 },
    { id: "tr", x: 379, y: 77 },
    { id: "r2", x: 404, y: 213, mobileHidden: true },
  ],
  edges: [
    { from: "hub", to: "l1", bend: -0.23 },
    { from: "l1", to: "r1", bend: 0.21 },
    { from: "r1", to: "bottom1", bend: 0.17 },
    { from: "bottom1", to: "hub", bend: -0.2 },
    { from: "r1", to: "tr", bend: 0.18 },
    { from: "r1", to: "r2", bend: 0.22 },
  ],
};

/** Three people meeting, then an outward connection: room for the next arrival. */
export const CLUSTER_SMALL: NetworkTemplate = {
  size: "small",
  viewBox: { width: 340, height: 220 },
  hub: "hub",
  nodes: [
    { id: "hub", x: 68, y: 147 },
    { id: "l1", x: 151, y: 69 },
    { id: "r1", x: 213, y: 155 },
    { id: "r2", x: 290, y: 108, mobileHidden: true },
  ],
  edges: [
    { from: "hub", to: "l1", bend: -0.2 },
    { from: "l1", to: "r1", bend: 0.2 },
    { from: "r1", to: "hub", bend: -0.18 },
    { from: "r1", to: "r2", bend: 0.19 },
  ],
};

export function curvePath(a: { x: number; y: number }, b: { x: number; y: number }, bend = 0.18) {
  return `M ${a.x},${a.y} Q ${(a.x + b.x) / 2 - (b.y - a.y) * bend},${(a.y + b.y) / 2 + (b.x - a.x) * bend} ${b.x},${b.y}`;
}
