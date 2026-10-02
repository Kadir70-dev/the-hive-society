"use client";

import { useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "hive.saved-gatherings.v1";
const CHANGE_EVENT = "hive:saved-gatherings-changed";

function readSnapshot(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function serverSnapshot(): null {
  return null;
}

function parseSlugs(value: string | null): string[] {
  try {
    const parsed: unknown = JSON.parse(value ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((slug): slug is string =>
      typeof slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
    ))];
  } catch {
    return [];
  }
}

function subscribe(onChange: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY || event.key === null) onChange();
  }
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function toggleSaved(slug: string): boolean {
  try {
    const current = parseSlugs(window.localStorage.getItem(STORAGE_KEY));
    const next = current.includes(slug)
      ? current.filter((saved) => saved !== slug)
      : [...current, slug];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
}

/** Only public slugs are saved; prices and event details always come from the catalogue. */
export function useSavedGatherings() {
  const snapshot = useSyncExternalStore(subscribe, readSnapshot, serverSnapshot);
  const slugs = useMemo(() => parseSlugs(snapshot), [snapshot]);
  return { slugs, ready: snapshot !== null, toggleSaved };
}
