"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface EditModeContextValue {
  isAdmin: boolean;
  editMode: boolean;
  setEditMode: (on: boolean) => void;
}

const EditModeContext = createContext<EditModeContextValue>({
  isAdmin: false,
  editMode: false,
  setEditMode: () => {},
});

export function useEditMode() {
  return useContext(EditModeContext);
}

/**
 * `isAdmin` is decided once, server-side (see (marketing)/layout.tsx), from
 * the same admin-session check used to guard /admin — never trust a
 * client-side flag for this. Anonymous visitors always get isAdmin=false and
 * never render any edit affordance, regardless of editMode state.
 *
 * Edit Mode defaults OFF, even for an authenticated admin, so ordinary
 * browsing (including a hard refresh or a fresh URL, which remounts this
 * provider) shows the plain public view — the CMS boundary boxes only ever
 * appear once the admin deliberately flips the toggle on.
 */
export function EditModeProvider({ isAdmin, children }: { isAdmin: boolean; children: ReactNode }) {
  const [editMode, setEditMode] = useState(false);

  return (
    <EditModeContext.Provider value={{ isAdmin, editMode: isAdmin && editMode, setEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
}
