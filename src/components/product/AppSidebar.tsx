"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { productNav } from "@/data/navigation";
import { CompassIcon, PeopleIcon, ChatIcon, UserIcon, SparkleIcon, MenuIcon } from "@/components/ui/Icons";

const NAV_ICONS = {
  explore: CompassIcon,
  hive: PeopleIcon,
  messages: ChatIcon,
  profile: UserIcon,
};

export function AppSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <aside className={`app-sidebar${open ? " is-open" : ""}`}>
      <div className="app-sidebar__top">
        <Link href="/" className="app-sidebar__brand">
          The Hive<span>.</span>
        </Link>
        <button className="app-sidebar__mobile-toggle" aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}>
          <MenuIcon />
        </button>
      </div>

      <div className="app-sidebar__panel">
        <div>
          <p className="app-sidebar__tagline">No one has to show up alone</p>
          <nav className="app-nav" aria-label="Product">
            {productNav.map((item) => {
              const Icon = NAV_ICONS[item.key];
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`app-nav__item${isActive ? " is-active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  <Icon />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="app-sidebar__bottom">
          <Link href="/host" className="app-host-cta">
            <SparkleIcon />
            Host an Activity
          </Link>
          <span className="app-sidebar__chapter">Abu Dhabi Chapter</span>
        </div>
      </div>
    </aside>
  );
}
