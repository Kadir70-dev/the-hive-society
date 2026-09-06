"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { marketingNav, navContentKeys } from "@/data/navigation";
import { LogoMark } from "@/components/ui/LogoMark";
import { MobileNav } from "./MobileNav";
import { SignInModal } from "./SignInModal";
import { JoinCommunityButton } from "@/components/forms/JoinCommunityButton";
import { EditableLabel } from "@/components/content/EditableText";
import { useGlobalContent } from "@/components/content/GlobalContentProvider";
import { resolve } from "@/lib/content/resolve";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const globalContent = useGlobalContent();

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="logo">
            <LogoMark />
            The Hive Society
          </Link>
          <nav className="nav-desktop" aria-label="Primary">
            {marketingNav.map((item) => {
              const key = navContentKeys[item.href];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {key ? <EditableLabel contentKey={key} value={resolve(globalContent, key, item.label)} /> : item.label}
                </Link>
              );
            })}
          </nav>
          <div className="header-cta">
            <button className="signin" onClick={() => setSignInOpen(true)}>
              <EditableLabel contentKey="nav.open_app" value={resolve(globalContent, "nav.open_app", "Open App")} />
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
