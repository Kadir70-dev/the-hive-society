import type { NavLink } from "./types";

export const marketingNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "Community", href: "/community" },
  { label: "Join the Community", href: "/membership" },
  { label: "Host", href: "/host" },
  { label: "Partners", href: "/partners" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const mobileNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "Community", href: "/community" },
  { label: "Join the Community", href: "/membership" },
  { label: "Host an Activity", href: "/host" },
  { label: "Partners", href: "/partners" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerDiscoverLinks: NavLink[] = [
  { label: "Explore", href: "/explore" },
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
