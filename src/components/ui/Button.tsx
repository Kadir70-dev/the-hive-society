import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "on-dark" | "ghost-dark";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  block?: boolean;
  size?: "default" | "sm";
}

export function Button({
  variant = "primary",
  block,
  size = "default",
  className = "",
  ...props
}: ButtonProps) {
  const classes = [
    "btn",
    `btn--${variant}`,
    block ? "btn--block" : "",
    size === "sm" ? "btn--sm" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <button className={classes} {...props} />;
}
