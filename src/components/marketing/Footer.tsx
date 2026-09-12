"use client";

import Link from "next/link";
import { footerCompanyLinks, footerDiscoverLinks, footerLegalLinks } from "@/data/navigation";
import { EditableText, EditableLabel } from "@/components/content/EditableText";
import { useGlobalContent } from "@/components/content/GlobalContentProvider";
import { resolve } from "@/lib/content/resolve";
import { FooterBackground } from "@/components/backgrounds/production/FooterBackground";

export function Footer() {
  const content = useGlobalContent();
  const t = (key: string, fallback: string) => resolve(content, key, fallback);

  return (
    <footer className="site-footer" style={{ position: "relative" }}>
      <FooterBackground />
      <div className="footer-inner" style={{ position: "relative", zIndex: 1 }}>
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="logo" style={{ color: "var(--on-dark)" }}>
              The Hive Society
            </Link>
            <EditableText as="p" contentKey="footer.tagline" value={t("footer.tagline", "Never show up alone")} className="footer-statement" />
            <EditableText as="p" contentKey="footer.description" value={t("footer.description", "Discover and connect with women across the UAE.")} />
          </div>
          <div className="footer-links">
            <div>
              <EditableLabel as="h4" contentKey="footer.discover_heading" value={t("footer.discover_heading", "Discover")} />
              {footerDiscoverLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
            <div>
              <EditableLabel as="h4" contentKey="footer.company_heading" value={t("footer.company_heading", "Company")} />
              {footerCompanyLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <EditableLabel as="span" contentKey="footer.copyright" value={t("footer.copyright", "© 2026 The Hive Society, Abu Dhabi, UAE")} />
          <EditableLabel as="span" contentKey="footer.social_coming_soon" value={t("footer.social_coming_soon", "Instagram · LinkedIn — coming soon")} />
          <span>
            {footerLegalLinks.map((link, i) => (
              <span key={link.href}>
                <Link href={link.href}>{link.label}</Link>
                {i < footerLegalLinks.length - 1 ? " · " : ""}
              </span>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
