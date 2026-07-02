"use client";

import { useState, useEffect, useCallback } from "react";
import type {
   GradeFilters,
   Grade,
   GradeDashboardData,
   GradesPaginationState,
   GradesGroupBy,
   GroupedGradeData,
   StudentTranscript,
   GradeScale,
} from "../types/grades.types";
import { gradesService } from "../lib/services/grades.service";

// ─── Default Filter State ─────────────────────────────────────────────────────

export const DEFAULT_GRADE_FILTERS: GradeFilters = {
   search: "",
   status: "all",
   academicYearId: "all",
   semesterId: "all",
   programId: "all",
   gradeLetter: "all",
};

// ─── Dashboard Hook ───────────────────────────────────────────────────────────

export function useGradesDashboard() {
   const [data, setData] = useState<GradeDashboardData | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      async function load() {
         setLoading(true);
         try {
            const d = await gradesService.getDashboardData();
            setData(d);
         } catch {
            setError("Failed to load dashboard data");
         } finally {
            setLoading(false);
         }
      }
      void load();
   }, []);

   return { data, loading, error };
}

// ─── Grades Hook (paginated + filtered) ──────────────────────────────────────

export function useGrades(initialPageSize = 15) {
   const [grades, setGrades] = useState<Grade[]>([]);
   const [loading, setLoading] = useState(false);
   const [filters, setFilters] = useState<GradeFilters>(DEFAULT_GRADE_FILTERS);
   const [pagination, setPagination] = useState<GradesPaginationState>({
      page: 1,
      pageSize: initialPageSize,
      total: 0,
      totalPages: 0,
   });

   const fetchGrades = useCallback(
      async (newFilters?: GradeFilters, page = 1) => {
         setLoading(true);
         try {
            const result = await gradesService.getGrades(
               newFilters ?? filters,
               page,
               pagination.pageSize
            );
            setGrades(result.data);
            setPagination(result.pagination);
         } catch {
            // handled silently
         } finally {
            setLoading(false);
         }
      },
      [filters, pagination.pageSize]
   );

   useEffect(() => {
      fetchGrades();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const updateFilters = useCallback(
      (partial: Partial<GradeFilters>) => {
         const merged = { ...filters, ...partial };
         setFilters(merged);
         fetchGrades(merged, 1);
      },
      [filters, fetchGrades]
   );

   const resetFilters = useCallback(() => {
      setFilters(DEFAULT_GRADE_FILTERS);
      fetchGrades(DEFAULT_GRADE_FILTERS, 1);
   }, [fetchGrades]);

   const goToPage = useCallback(
      (page: number) => fetchGrades(undefined, page),
      [fetchGrades]
   );

   const refreshGrades = useCallback(() => fetchGrades(), [fetchGrades]);

   const activeFilterCount = (Object.keys(filters) as (keyof GradeFilters)[]).filter(
      (k) => filters[k] !== DEFAULT_GRADE_FILTERS[k]
   ).length;

   return {
      grades,
      loading,
      filters,
      pagination,
      updateFilters,
      resetFilters,
      goToPage,
      refreshGrades,
      activeFilterCount,
   };
}

// ─── Grouped Grades Hook ──────────────────────────────────────────────────────

export function useGroupedGrades(groupBy: GradesGroupBy, filters: GradeFilters) {
   const [data, setData] = useState<GroupedGradeData[]>([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      async function load() {
         setLoading(true);
         try {
            const d = await gradesService.getGroupedGrades(groupBy, filters);
            setData(d);
         } catch {
            setData([]);
         } finally {
            setLoading(false);
         }
      }
      void load();
   }, [groupBy, filters]);

   return { data, loading };
}

// ─── Student Transcript Hook ──────────────────────────────────────────────────

export function useStudentTranscript(studentId: number | null) {
   const [data, setData] = useState<StudentTranscript | null>(null);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      async function load() {
         if (studentId === null) { setData(null); return; }
         setLoading(true);
         try {
            const d = await gradesService.getStudentTranscript(studentId);
            setData(d);
         } catch {
            setData(null);
         } finally {
            setLoading(false);
         }
      }
      void load();
   }, [studentId]);

   return { data, transcript: data, loading };
}

// ─── Grade Scales Hook ────────────────────────────────────────────────────────

export function useGradeScales() {
   const [data, setData] = useState<GradeScale[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      gradesService
         .getGradeScales()
         .then(setData)
         .catch(() => setData([]))
         .finally(() => setLoading(false));
   }, []);

   return { data, scales: data, loading };
}
