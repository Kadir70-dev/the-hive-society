"use client";

import Link from "next/link";
import { mobileNav } from "@/data/navigation";
import { CloseIcon } from "@/components/ui/Icons";
import { LogoMark } from "@/components/ui/LogoMark";
import { useCommunitySignupModal } from "@/components/forms/CommunitySignupModal";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  onOpenSignIn: () => void;
}

export function MobileNav({ open, onClose, onOpenSignIn }: MobileNavProps) {
  const { open: openSignupModal } = useCommunitySignupModal();

  if (!open) return null;

  return (
    <div className="mobile-nav">
      <div className="mobile-nav__top">
        <Link href="/" className="logo" onClick={onClose}>
          <LogoMark />
          The Hive Society
        </Link>
        <button className="mobile-nav__close" onClick={onClose} aria-label="Close menu">
          <CloseIcon width={18} height={18} />
        </button>
      </div>
      <nav className="mobile-nav__links" aria-label="Mobile">
        {mobileNav.map((item) => (
          <Link key={item.href} href={item.href} onClick={onClose}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mobile-nav__cta">
        <button
          type="button"
          className="btn btn--primary btn--block"
          onClick={() => {
            openSignupModal();
            onClose();
          }}
        >
          Join the Community
        </button>
        <button className="btn btn--outline btn--block" onClick={onOpenSignIn}>
          Open App
        </button>
      </div>
    </div>
  );
}
