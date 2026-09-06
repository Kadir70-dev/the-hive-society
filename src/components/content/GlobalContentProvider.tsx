"use client";

import { createContext, useContext, type ReactNode } from "react";

const GlobalContentContext = createContext<Record<string, string>>({});

/** Nav/footer/modal copy, fetched once server-side (page_key="global") and
 * handed down here so the client components that render it (Header, Footer,
 * MobileNav, modals) don't each need their own Supabase round trip. */
export function useGlobalContent() {
  return useContext(GlobalContentContext);
}

export function GlobalContentProvider({ content, children }: { content: Record<string, string>; children: ReactNode }) {
  return <GlobalContentContext.Provider value={content}>{children}</GlobalContentContext.Provider>;
}
