"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { EditableText, EditableHeading, EditableLabel } from "@/components/content/EditableText";
import { useGlobalContent } from "@/components/content/GlobalContentProvider";
import { resolve } from "@/lib/content/resolve";
import { isValidMemberCredentials } from "@/lib/member/credentials";

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
}

export function SignInModal({ open, onClose }: SignInModalProps) {
  const router = useRouter();
  const content = useGlobalContent();
  const t = (key: string, fallback: string) => resolve(content, key, fallback);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleClose() {
    setUsername("");
    setPassword("");
    setError("");
    onClose();
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isValidMemberCredentials(username, password)) {
      setError("Invalid username or password.");
      return;
    }

    handleClose();
    router.push("/app/explore");
  }

  return (
    <Modal open={open} onClose={handleClose} labelledBy="signin-title">
      <div className="modal__body stack gap-14" style={{ textAlign: "center", padding: "44px 30px" }}>
        <div className="hex hex--lg" style={{ margin: "0 auto" }}>
          ◈
        </div>
        <EditableHeading as="h3" contentKey="modal.signin.title" value={t("modal.signin.title", "Step inside the Hive.")} className="h3" id="signin-title" />
        <EditableText
          as="p"
          multiline
          contentKey="modal.signin.body"
          value={t("modal.signin.body", "Sign in with your member username and password.")}
          className="text-2 small"
        />
        <form className="form-grid" onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          <div className="field">
            <label htmlFor="signinUsername">Username</label>
            <input
              id="signinUsername"
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
            />
          </div>
          <div className="field">
            <label htmlFor="signinPassword">Password</label>
            <input
              id="signinPassword"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error && (
            <p className="small" role="alert" style={{ color: "#b3261e" }}>
              {error}
            </p>
          )}
          <button className="btn btn--primary btn--block" type="submit">
            <EditableLabel contentKey="modal.signin.button_label" value={t("modal.signin.button_label", "Log In")} />
          </button>
        </form>
      </div>
    </Modal>
  );
}
