"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { marketingNav } from "@/data/navigation";
import { LogoMark } from "@/components/ui/LogoMark";
import { MobileNav } from "./MobileNav";
import { SignInModal } from "./SignInModal";
import { JoinCommunityButton } from "@/components/forms/JoinCommunityButton";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="logo">
            <LogoMark />
            The Hive Society
          </Link>
          <nav className="nav-desktop" aria-label="Primary">
            {marketingNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="header-cta">
            <button className="signin" onClick={() => setSignInOpen(true)}>
              Open App
            </button>
            <JoinCommunityButton className="btn btn--outline btn--sm" />
          </div>
          <button
            className="hamburger"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <span />
          </button>
        </div>
      </header>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onOpenSignIn={() => {
          setMobileOpen(false);
          setSignInOpen(true);
        }}
      />
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </>
  );
}
