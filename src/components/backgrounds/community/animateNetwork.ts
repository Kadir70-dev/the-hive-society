import { gsap } from "gsap";
import { curvePath, type NetworkTemplate } from "./networkData";

/** One owner for node positions and incident curves; no competing SVG transforms. */
export function animateNetwork(svg: SVGSVGElement, template: NetworkTemplate, mobile: boolean) {
  const nodes = template.nodes.filter((node) => !mobile || !node.mobileHidden);
  const byId = new Map(nodes.map((node, i) => [node.id, {
    ...node, i, driftX: 0, driftY: 0, pullX: 0, pullY: 0,
    group: svg.querySelector<SVGGElement>(`[data-node="${node.id}"]`)!,
  }]));
  const edges = template.edges.filter((edge) => (!mobile || !edge.mobileHidden) && byId.has(edge.from) && byId.has(edge.to)).map((edge, i) => ({
    ...edge,
    path: svg.querySelector<SVGPathElement>(`[data-edge="${i}"]`)!,
    flow: svg.querySelector<SVGPathElement>(`[data-flow="${i}"]`)!,
  }));
  const section = svg.parentElement!.parentElement!;
  const positions = new Map(nodes.map((node) => [node.id, { x: node.x, y: node.y }]));
  const pointer = { x: 0, y: 0, active: false, touch: false, startX: 0, startY: 0, scrolling: false };
  let matrix: DOMMatrix | null = null;
  let boundsDirty = true;
  let playing = false;
  let destroyed = false;
  let lastFrame = 0;
  let builtAt = 0;
  let timeline: gsap.core.Timeline;

  const context = gsap.context(() => {
    timeline = gsap.timeline({ paused: true });
    const reveals = nodes.map((node) => byId.get(node.id)!.group.querySelector<SVGGElement>("[data-reveal]")!);
    gsap.set(reveals, { opacity: 0, scale: 0.65, svgOrigin: "0 0" });

    function pulse(id: string, at: number, strength = 0.36) {
      const ring = byId.get(id)!.group.querySelector("[data-ring]");
      timeline.fromTo(ring, { attr: { r: 3 }, opacity: strength }, {
        attr: { r: 14 }, opacity: 0, duration: 1.05, ease: "sine.out", immediateRender: false,
      }, at);
    }
    function reveal(id: string, at: number) {
      timeline.to(byId.get(id)!.group.querySelector("[data-reveal]"), {
        scale: 1, opacity: 1, duration: 0.48, ease: "sine.out",
      }, at);
    }

    const seen = new Set([template.hub]);
    reveal(template.hub, 0.15);
    pulse(template.hub, 0.4);
    let cursor = 1.35;
    edges.forEach((edge, i) => {
      const length = edge.path.getTotalLength();
      const duration = 1.12 + (i % 3) * 0.16 + Math.min(length / 900, 0.25);
      gsap.set(edge.path, { opacity: 0, strokeDasharray: length, strokeDashoffset: length, autoRound: false });
      timeline.set(edge.path, { opacity: 1 }, cursor);
      timeline.to(edge.path, { strokeDashoffset: 0, duration, ease: "sine.inOut", autoRound: false }, cursor);
      const arrival = cursor + duration;
      // The dot begins appearing only as the line tip reaches its radius.
      if (!seen.has(edge.to)) {
        reveal(edge.to, arrival - 0.08);
        seen.add(edge.to);
      }
      pulse(edge.to, arrival);
      cursor = arrival + 0.66 + (i % 2) * 0.13;
    });
    builtAt = cursor;

    // All repeating work belongs to the same timeline, including flow and emphasis.
    // Pausing/reverting it stops everything, including after navigation or preference changes.
    byId.forEach((node) => {
      timeline.to(node, { driftX: (node.i % 2 ? -1 : 1) * (mobile ? 1.4 : 2.3), duration: 5.6 + node.i * 0.39, ease: "sine.inOut", yoyo: true, repeat: -1 }, builtAt);
      timeline.to(node, { driftY: (node.i % 3 ? 1 : -1) * (mobile ? 1.8 : 3), duration: 6.8 + node.i * 0.31, ease: "sine.inOut", yoyo: true, repeat: -1 }, builtAt);
    });
    const ambient = gsap.timeline({ repeat: -1, repeatDelay: 2.5 });
    edges.forEach((edge, i) => {
      const length = edge.path.getTotalLength();
      const at = i * 4.7;
      const ring = byId.get(edge.to)!.group.querySelector("[data-ring]");
      ambient.fromTo(edge.flow, { strokeDasharray: `18 ${length + 32}`, strokeDashoffset: 18, opacity: 0 }, {
        strokeDashoffset: -length, duration: 2.6 + (i % 3) * 0.2, ease: "sine.inOut", immediateRender: false,
      }, at);
      ambient.to(edge.flow, { opacity: 0.8, duration: 0.6, ease: "sine.inOut" }, at);
      ambient.to(edge.flow, { opacity: 0, duration: 0.75, ease: "sine.out" }, at + 2);
      if (i % 2 === 0) {
        ambient.fromTo(ring, { attr: { r: 3 }, opacity: 0.22 }, {
          attr: { r: 12 }, opacity: 0, duration: 1.6, ease: "sine.out", immediateRender: false,
        }, at + 2.5);
      }
    });
    timeline.add(ambient, builtAt + 1.8);
  }, svg);

  function resetPointer() { pointer.active = false; }
  function measure() {
    matrix = svg.getScreenCTM()?.inverse() ?? null;
    boundsDirty = false;
  }
  function tick(time: number) {
    const delta = lastFrame ? time - lastFrame : 1 / 60;
    if (mobile && lastFrame && delta < 1 / 32) return;
    lastFrame = time;
    // Geometry is read only on resize/scroll, before any SVG writes.
    if (boundsDirty) measure();
    if (timeline.time() < builtAt) return;
    const point = matrix && pointer.active ? new DOMPoint(pointer.x, pointer.y).matrixTransform(matrix) : null;
    const radius = mobile ? 90 : 115;
    const ease = 1 - Math.exp(-Math.min(delta, 0.05) * 5);
    byId.forEach((node) => {
      let targetX = 0;
      let targetY = 0;
      if (point) {
        const dx = point.x - node.x;
        const dy = point.y - node.y;
        const distance = Math.hypot(dx, dy);
        if (distance < radius) {
          const strength = (1 - distance / radius) * (mobile ? 0.075 : 0.1);
          targetX = dx * strength;
          targetY = dy * strength;
        }
      }
      node.pullX += (targetX - node.pullX) * ease;
      node.pullY += (targetY - node.pullY) * ease;
      const pos = positions.get(node.id)!;
      pos.x = node.x + node.driftX + node.pullX;
      pos.y = node.y + node.driftY + node.pullY;
      node.group.setAttribute("transform", `translate(${pos.x.toFixed(3)} ${pos.y.toFixed(3)})`);
    });
    edges.forEach((edge) => {
      const d = curvePath(positions.get(edge.from)!, positions.get(edge.to)!, edge.bend);
      edge.path.setAttribute("d", d);
      edge.flow.setAttribute("d", d);
    });
  }

  function pointerDown(event: PointerEvent) {
    if (!event.isPrimary) return;
    pointer.scrolling = false;
    pointer.startX = event.clientX;
    pointer.startY = event.clientY;
    pointer.touch = event.pointerType !== "mouse";
    pointerMove(event);
  }
  function pointerMove(event: PointerEvent) {
    if (!event.isPrimary) return;
    pointer.touch = event.pointerType !== "mouse";
    if (pointer.touch && Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY) > 10) pointer.scrolling = true;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = !pointer.scrolling;
  }
  function pointerUp() {
    if (pointer.touch) resetPointer();
    pointer.scrolling = false;
  }
  function onScroll() { boundsDirty = true; resetPointer(); }
  const resize = new ResizeObserver(() => { boundsDirty = true; });
  resize.observe(svg);

  function listen(add: boolean) {
    const method = add ? "addEventListener" : "removeEventListener";
    section[method]("pointerdown", pointerDown as EventListener, { passive: true });
    section[method]("pointermove", pointerMove as EventListener, { passive: true });
    section[method]("pointerleave", resetPointer, { passive: true });
    window[method]("pointerup", pointerUp, { passive: true });
    window[method]("pointercancel", resetPointer, { passive: true });
    window[method]("blur", resetPointer);
    window[method]("scroll", onScroll, { passive: true });
    window[method]("resize", onScroll, { passive: true });
  }
  function pause() {
    if (!playing) return;
    playing = false;
    timeline.pause();
    gsap.ticker.remove(tick);
    listen(false);
    resetPointer();
    lastFrame = 0;
  }
  return {
    play() {
      if (playing || destroyed) return;
      playing = true;
      boundsDirty = true;
      listen(true);
      timeline.play();
      gsap.ticker.add(tick);
    },
    pause,
    destroy() {
      pause();
      destroyed = true;
      resize.disconnect();
      context.revert();
      byId.forEach((node) => node.group.setAttribute("transform", `translate(${node.x} ${node.y})`));
      edges.forEach((edge) => {
        const d = curvePath(byId.get(edge.from)!, byId.get(edge.to)!, edge.bend);
        edge.path.setAttribute("d", d);
        edge.flow.setAttribute("d", d);
      });
    },
  };
}
