import { create } from 'zustand'
import { StudentStats } from '@/types/student'

interface StudentState {
    selectedCategory: string
    setSelectedCategory: (category: string) => void
    studentStats: StudentStats | null
    setStudentStats: (stats: StudentStats) => void
}

export const useStudentStore = create<StudentState>((set) => ({
    selectedCategory: 'all',
    setSelectedCategory: (category) => set({ selectedCategory: category }),
    studentStats: null,
    setStudentStats: (stats) => set({ studentStats: stats }),
}))