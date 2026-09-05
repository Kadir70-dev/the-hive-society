"use client";

import type { ReactNode } from "react";
import { useCommunitySignupModal } from "./CommunitySignupModal";

interface JoinCommunityButtonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

export function JoinCommunityButton({
  className = "btn btn--primary",
  style,
  children = "Join the Community",
}: JoinCommunityButtonProps) {
  const { open } = useCommunitySignupModal();

  return (
    <button type="button" className={className} style={style} onClick={open}>
      {children}
    </button>
  );
}
