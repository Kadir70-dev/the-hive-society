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
 * Edit Mode defaults ON for an authenticated admin (so signing in lands
 * directly on an editable page) — the toggle still lets them switch to a
 * plain public-visitor preview whenever they want.
 */
export function EditModeProvider({ isAdmin, children }: { isAdmin: boolean; children: ReactNode }) {
  const [editMode, setEditMode] = useState(isAdmin);

  return (
    <EditModeContext.Provider value={{ isAdmin, editMode: isAdmin && editMode, setEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
}
