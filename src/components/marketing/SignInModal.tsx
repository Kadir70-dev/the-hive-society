"use client";

import Link from "next/link";
import { Modal } from "@/components/ui/Modal";

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
}

export function SignInModal({ open, onClose }: SignInModalProps) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="signin-title">
      <div className="modal__body stack gap-14" style={{ textAlign: "center", padding: "44px 30px" }}>
        <div className="hex hex--lg" style={{ margin: "0 auto" }}>
          ◈
        </div>
        <h3 className="h3" id="signin-title">
          Step inside the Hive.
        </h3>
        <p className="text-2 small">
          Full accounts are coming soon — until then, explore a live preview of the member
          experience.
        </p>
        <Link href="/app/explore" className="btn btn--primary" onClick={onClose}>
          Open App Preview
        </Link>
      </div>
    </Modal>
  );
}
