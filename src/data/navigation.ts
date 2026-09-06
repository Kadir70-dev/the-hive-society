import type { NavLink } from "./types";

export const marketingNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Community", href: "/community" },
  { label: "Experiences", href: "/explore" },
  { label: "About", href: "/about" },
  { label: "Join the Community", href: "/membership" },
];

/** content_key for each nav href's editable label — shared by Header + MobileNav. */
export const navContentKeys: Record<string, string> = {
  "/": "nav.home",
  "/community": "nav.community",
  "/explore": "nav.experiences",
  "/about": "nav.about",
  "/membership": "nav.join",
};

export const mobileNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Community", href: "/community" },
  { label: "Experiences", href: "/explore" },
  { label: "About", href: "/about" },
  { label: "Join the Community", href: "/membership" },
];

export const footerDiscoverLinks: NavLink[] = [
  { label: "Experiences", href: "/explore" },
  { label: "Community", href: "/community" },
  { label: "Join the Community", href: "/membership" },
  { label: "Host an Activity", href: "/host" },
];

export const footerCompanyLinks: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
];

export const footerLegalLinks: NavLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Community Guidelines", href: "/community-guidelines" },
];

export interface AppNavItem {
  label: string;
  href: string;
  key: "explore" | "hive" | "messages" | "profile";
}

export const productNav: AppNavItem[] = [
  { label: "Explore", href: "/app/explore", key: "explore" },
  { label: "My Hive", href: "/app/hive", key: "hive" },
  { label: "Messages", href: "/app/messages", key: "messages" },
  { label: "Profile", href: "/app/profile", key: "profile" },
];
