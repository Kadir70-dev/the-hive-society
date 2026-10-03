import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
  tone?: "paper" | "maroon";
}

/** Journal page opener: big display title, optional eyebrow/lede/actions. Pass Editable* nodes to keep content editable. */
export function PageHero({ eyebrow, title, lede, actions, tone = "paper" }: PageHeroProps) {
  return (
    <section className={`j-pagehero${tone === "maroon" ? " j-pagehero--maroon j-on-dark" : ""}`}>
      <div className="j-wrap">
        {eyebrow ? <div className="j-label">{eyebrow}</div> : null}
        <h1 className="j-display j-pagehero__title">{title}</h1>
        {lede ? <div className="j-lede j-pagehero__lede">{lede}</div> : null}
        {actions ? <div className="j-pagehero__actions">{actions}</div> : null}
      </div>
    </section>
  );
}
