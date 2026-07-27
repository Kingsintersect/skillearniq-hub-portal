import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ChildLinkStatus = "pending" | "accepted" | "declined";

export interface SelectableChild {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: ChildLinkStatus;
}

interface ChildSelectorState {
  /** All linked children, any status. */
  children: SelectableChild[];
  /** Always references an accepted child (or null). */
  selectedChildId: string | null;
  setChildren: (children: SelectableChild[]) => void;
  /** No-ops unless the id belongs to an accepted child. */
  selectChild: (id: string | null) => void;
  clear: () => void;
}

const firstAcceptedId = (children: SelectableChild[]): string | null =>
  children.find((c) => c.status === "accepted")?.id ?? null;

export const useChildSelectorStore = create<ChildSelectorState>()(
  persist(
    (set, get) => ({
      children: [],
      selectedChildId: null,
      setChildren: (children) => {
        const accepted = children.filter((c) => c.status === "accepted");
        const current = get().selectedChildId;
        const stillValid =
          current != null && accepted.some((c) => c.id === current);
        set({
          children,
          selectedChildId: stillValid ? current : firstAcceptedId(children),
        });
      },
      selectChild: (id) => {
        if (id === null) {
          set({ selectedChildId: null });
          return;
        }
        const child = get().children.find((c) => c.id === id);
        if (child && child.status === "accepted") {
          set({ selectedChildId: id });
        }
      },
      clear: () => set({ children: [], selectedChildId: null }),
    }),
    {
      name: "child-selector",
      // Only the selection is persisted — the list is always refetched.
      partialize: (state) => ({ selectedChildId: state.selectedChildId }),
    }
  )
);

/** Children whose link the student has accepted — the only ones the dashboard views. */
export const selectAcceptedChildren = (s: ChildSelectorState): SelectableChild[] =>
  s.children.filter((c) => c.status === "accepted");

/** Children awaiting the student's acceptance. */
export const selectPendingChildren = (s: ChildSelectorState): SelectableChild[] =>
  s.children.filter((c) => c.status === "pending");

/** The currently-selected accepted child, or null. */
export const selectSelectedChild = (s: ChildSelectorState): SelectableChild | null =>
  s.children.find(
    (c) => c.id === s.selectedChildId && c.status === "accepted"
  ) ?? null;
