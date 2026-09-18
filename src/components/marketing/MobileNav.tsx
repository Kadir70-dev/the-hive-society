"use client";

import Link from "next/link";
import { mobileNav, navContentKeys } from "@/data/navigation";
import { CloseIcon } from "@/components/ui/Icons";
import { useCommunitySignupModal } from "@/components/forms/CommunitySignupModal";
import { EditableLabel } from "@/components/content/EditableText";
import { useGlobalContent } from "@/components/content/GlobalContentProvider";
import { resolve } from "@/lib/content/resolve";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  onOpenSignIn: () => void;
}

export function MobileNav({ open, onClose, onOpenSignIn }: MobileNavProps) {
  const { open: openSignupModal } = useCommunitySignupModal();
  const content = useGlobalContent();

  if (!open) return null;

  return (
    <div className="mobile-nav">
      <div className="mobile-nav__top">
        <Link href="/" className="logo" onClick={onClose}>
          The Hive Society
        </Link>
        <button className="mobile-nav__close" onClick={onClose} aria-label="Close menu">
          <CloseIcon width={18} height={18} />
        </button>
      </div>
      <nav className="mobile-nav__links" aria-label="Mobile">
        {mobileNav.map((item) => {
          const key = navContentKeys[item.href];
          return (
            <Link key={item.href} href={item.href} onClick={onClose}>
              {key ? <EditableLabel contentKey={key} value={resolve(content, key, item.label)} /> : item.label}
            </Link>
          );
        })}
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
          <EditableLabel contentKey="nav.open_app" value={resolve(content, "nav.open_app", "Open App")} />
        </button>
      </div>
    </div>
  );
}
