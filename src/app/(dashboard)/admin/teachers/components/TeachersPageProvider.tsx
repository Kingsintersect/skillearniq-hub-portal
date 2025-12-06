// src/components/teachers/TeachersPageProvider.tsx
"use client";

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTeachersPage } from '../hooks/useTeachersPage';

interface TeachersPageContextType {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filters: any;
    setFilters: (filters: any) => void;
    pagination: any;
    setPagination: (pagination: any) => void;
    categories: any[];
    courses: any[];
    teacherSubjects: any[];
    flattenedCategories: any[];
    topLevelCategories: any[];
    getSubcategories: (parentId: number) => any[];
    getAllCategoryIds: (parentId: number) => number[];
    findCategoryById: (id: number) => any;
    isParentCategory: (categoryId: number) => boolean;
    getParentCategory: (subcategoryId: number) => any;
    store: any;
    getCoursesForCategory: (categoryId: number) => any[];
    getTeacherAssignedSubjects: (teacherId: number) => any[];
    isLoading: boolean;
    isError: boolean;
    error: any;
    refetch: () => void;
}

const TeachersPageContext = createContext<TeachersPageContextType | undefined>(undefined);

// Create query client outside component to prevent recreation
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (React Query v5)
        },
    },
});

export const useTeachersPageContext = () => {
    const context = useContext(TeachersPageContext);
    if (!context) {
        throw new Error('useTeachersPageContext must be used within TeachersPageProvider');
    }
    return context;
};

interface TeachersPageProviderProps {
    children: ReactNode;
}

export const TeachersPageProvider: React.FC<TeachersPageProviderProps> = ({ children }) => {
    const teachersPageData = useTeachersPage();

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => teachersPageData, [teachersPageData]);

    return (
        <QueryClientProvider client={queryClient}>
            <TeachersPageContext.Provider value={contextValue}>
                {children}
            </TeachersPageContext.Provider>
        </QueryClientProvider>
    );
};