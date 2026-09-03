import Link from "next/link";
import { footerCompanyLinks, footerDiscoverLinks, footerLegalLinks } from "@/data/navigation";
import { LogoMark } from "@/components/ui/LogoMark";

const footerSocials = ["Instagram", "TikTok", "LinkedIn", "YouTube"];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="logo" style={{ color: "var(--on-dark)" }}>
              <LogoMark />
              The Hive Society
            </Link>
            <p>
              No one has to show up alone. A social discovery and booking platform for women in
              the UAE.
            </p>
          </div>
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
          <div>
            <h4>Social</h4>
            {footerSocials.map((name) => (
              <span className="fline" key={name}>
                {name} <span className="small text-3">— coming soon</span>
              </span>
            ))}
          </div>
          <div>
            <h4>Legal</h4>
            {footerLegalLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 The Hive Society, Abu Dhabi, UAE</span>
          <span>Concept prototype — for review purposes</span>
        </div>
      </div>
    </footer>
  );
}
