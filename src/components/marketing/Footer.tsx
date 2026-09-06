import Link from "next/link";
import { footerCompanyLinks, footerDiscoverLinks, footerLegalLinks } from "@/data/navigation";
import { LogoMark } from "@/components/ui/LogoMark";

export function Footer() {
  return (
    <footer className="site-footer hex-texture hex-texture--subtle">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="logo" style={{ color: "var(--on-dark)" }}>
              <LogoMark />
              The Hive Society
            </Link>
            <p className="footer-statement">No one has to show up alone.</p>
            <p>A social discovery and booking platform for women in the UAE.</p>
          </div>
          <div className="footer-links">
            <div>
              <h4>Discover</h4>
              {footerDiscoverLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
            <div>
              <h4>Company</h4>
              {footerCompanyLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 The Hive Society, Abu Dhabi, UAE</span>
          <span>Instagram · TikTok · LinkedIn · YouTube — coming soon</span>
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
