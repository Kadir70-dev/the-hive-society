"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Modal } from "@/components/ui/Modal";
import { CommunitySignupForm } from "./CommunitySignupForm";
import { EditableText, EditableHeading } from "@/components/content/EditableText";
import { useGlobalContent } from "@/components/content/GlobalContentProvider";
import { resolve } from "@/lib/content/resolve";

interface CommunitySignupModalContextValue {
  open: () => void;
}

const CommunitySignupModalContext = createContext<CommunitySignupModalContextValue | null>(null);

export function useCommunitySignupModal() {
  const ctx = useContext(CommunitySignupModalContext);
  if (!ctx) {
    throw new Error("useCommunitySignupModal must be used within a CommunitySignupModalProvider");
  }
  return ctx;
}

export function CommunitySignupModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const content = useGlobalContent();
  const t = (key: string, fallback: string) => resolve(content, key, fallback);

  function open() {
    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    triggerRef.current?.focus();
    triggerRef.current = null;
  }

  useEffect(() => {
    if (isOpen) panelRef.current?.focus();
  }, [isOpen]);

  return (
    <CommunitySignupModalContext.Provider value={{ open }}>
      {children}
      <Modal open={isOpen} onClose={close} labelledBy="community-signup-title">
        <div className="modal__body" ref={panelRef} tabIndex={-1} style={{ outline: "none" }}>
          <div className="stack gap-6" style={{ marginBottom: 22 }}>
            <EditableHeading as="h3" contentKey="modal.join.title" value={t("modal.join.title", "Join the Hive Society")} className="h3" id="community-signup-title" />
            <EditableText
              as="p"
              multiline
              contentKey="modal.join.subtitle"
              value={t("modal.join.subtitle", "Tell us a little about you — we’ll follow up with relevant updates and invitations.")}
              className="text-2 small"
            />
          </div>
          <CommunitySignupForm onClose={close} />
        </div>
      </Modal>
    </CommunitySignupModalContext.Provider>
  );
}
