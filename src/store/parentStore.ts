import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ParentChild {
  id: string;
  name: string;
  grade: string;
  studentId: string;
  relationship: string;
}

interface ParentStore {
  selectedStudentId: string | null;
  children: ParentChild[];
  setSelectedStudentId: (id: string | null) => void;
  setChildren: (children: ParentChild[]) => void;
}

export const useParentStore = create<ParentStore>()(
  persist(
    (set) => ({
      selectedStudentId: null,
      children: [],
      setSelectedStudentId: (id) => set({ selectedStudentId: id }),
      setChildren: (children) => set({ children }),
    }),
    {
      name: 'parent-storage',
    }
  )
);