"use client";

import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { EditableText, EditableHeading, EditableLabel } from "@/components/content/EditableText";
import { useGlobalContent } from "@/components/content/GlobalContentProvider";
import { resolve } from "@/lib/content/resolve";

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
}

export function SignInModal({ open, onClose }: SignInModalProps) {
  const content = useGlobalContent();
  const t = (key: string, fallback: string) => resolve(content, key, fallback);

  return (
    <Modal open={open} onClose={onClose} labelledBy="signin-title">
      <div className="modal__body stack gap-14" style={{ textAlign: "center", padding: "44px 30px" }}>
        <div className="hex hex--lg" style={{ margin: "0 auto" }}>
          ◈
        </div>
        <EditableHeading as="h3" contentKey="modal.signin.title" value={t("modal.signin.title", "Step inside the Hive.")} className="h3" id="signin-title" />
        <EditableText
          as="p"
          multiline
          contentKey="modal.signin.body"
          value={t("modal.signin.body", "Full accounts are coming soon — until then, explore a live preview of the member experience.")}
          className="text-2 small"
        />
        <Link href="/app/explore" className="btn btn--primary" onClick={onClose}>
          <EditableLabel contentKey="modal.signin.button_label" value={t("modal.signin.button_label", "Open App Preview")} />
        </Link>
      </div>
    </Modal>
  );
}
