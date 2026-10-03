"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger position; each step adds 60ms. */
  index?: number;
  style?: CSSProperties;
}

/**
 * One reveal for the whole home page: 14px rise + fade, ~450ms. Content is
 * visible on the server and for anything already on screen; only elements
 * below the fold are hidden after mount and revealed once when scrolled to.
 * Under prefers-reduced-motion nothing is hidden or moved.
 */
export function Reveal({ children, className, index = 0, style }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) return;
    setHidden(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setHidden(false);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal${hidden ? " reveal--hidden" : ""}${className ? ` ${className}` : ""}`}
      style={{ ...style, transitionDelay: `${index * 60}ms` }}
    >
      {children}
    </div>
  );
}
