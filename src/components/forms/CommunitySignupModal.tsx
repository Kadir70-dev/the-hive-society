"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Modal } from "@/components/ui/Modal";
import { CommunitySignupForm } from "./CommunitySignupForm";

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
            <h3 className="h3" id="community-signup-title">
              Join the Community
            </h3>
            <p className="text-2 small">
              Tell us a little about you — we&rsquo;ll follow up with relevant updates and
              invitations.
            </p>
          </div>
          <CommunitySignupForm onClose={close} />
        </div>
      </Modal>
    </CommunitySignupModalContext.Provider>
  );
}
