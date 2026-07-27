"use client";

import React, { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { TeachersTable } from './TeachersTable';
import { TeachersFilters } from './TeachersFilters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, UserCheck, UserX, Mail, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useTeachersPageContext } from './TeachersPageProvider';
import { CreateTeacherDialog } from './CreateTeacherDialog';
import { EditTeacherDialog } from './EditTeacherDialog';
import { AssignTeacherDialog } from './AssignTeacherDialog';
import { Progress } from '@/components/ui/progress';

// Dashboard Card Component
interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

function DashboardCard({ title, subtitle, icon, action, children, className = '' }: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className={`rounded-3xl border border-border/70 bg-card/95 p-5 shadow-sm backdrop-blur-sm ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-card-foreground">{title}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      {children}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/60 px-3 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

const MemoizedTeachersFilters = memo(TeachersFilters);
const MemoizedTeachersTable = memo(TeachersTable);

export const TeachersPageView: React.FC = () => {
  const {
    isLoading,
    isError,
    error,
    refetch,
    store,
  } = useTeachersPageContext();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);

  // Get teacher stats from store
  const teachers = store?.teachers || [];
  const totalTeachers = teachers.length;
  const activeTeachers = teachers.filter((t: any) => t.is_active === 1).length;
  const inactiveTeachers = teachers.filter((t: any) => t.is_active === 0).length;
  const verifiedTeachers = teachers.filter((t: any) => t.email_verified === 1).length;

  const handleEditTeacher = useCallback((teacher: any) => {
    setSelectedTeacher(teacher);
    setIsEditDialogOpen(true);
  }, []);

  const handleAssignTeacher = useCallback((teacher: any) => {
    setSelectedTeacher(teacher);
    setIsAssignDialogOpen(true);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <div className="text-lg text-muted-foreground">Loading teachers...</div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <div className="text-lg text-foreground">Error loading teachers</div>
            <p className="text-sm text-muted-foreground mt-2">{error?.message || 'Please try again later'}</p>
            <Button onClick={() => refetch()} variant="outline" className="mt-4 gap-2">
              <RefreshCw size={16} />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl bg-primary p-6 text-white sm:p-8"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-white/5" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">User Management</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Teachers</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/75">
              Manage all teachers and their assignments. View, add, edit, and track teacher information.
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} variant="secondary" className="gap-2">
            <Plus size={16} />
            Add Teacher
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="relative mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-black/5 bg-card p-4 shadow-sm dark:border-white/10 dark:bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Teachers</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{totalTeachers}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Users size={18} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-card p-4 shadow-sm dark:border-white/10 dark:bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="mt-1 text-2xl font-bold text-emerald-600">{activeTeachers}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                <UserCheck size={18} />
              </div>
            </div>
            <Progress value={totalTeachers > 0 ? (activeTeachers / totalTeachers) * 100 : 0} className="h-1 mt-2" />
          </div>

          <div className="rounded-2xl border border-black/5 bg-card p-4 shadow-sm dark:border-white/10 dark:bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Inactive</p>
                <p className="mt-1 text-2xl font-bold text-red-600">{inactiveTeachers}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                <UserX size={18} />
              </div>
            </div>
            <Progress value={totalTeachers > 0 ? (inactiveTeachers / totalTeachers) * 100 : 0} className="h-1 mt-2" />
          </div>

          <div className="rounded-2xl border border-black/5 bg-card p-4 shadow-sm dark:border-white/10 dark:bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Verified</p>
                <p className="mt-1 text-2xl font-bold text-secondary">{verifiedTeachers}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
                <Mail size={18} />
              </div>
            </div>
            <Progress value={totalTeachers > 0 ? (verifiedTeachers / totalTeachers) * 100 : 0} className="h-1 mt-2" />
          </div>
        </div>
      </motion.section>

      {/* Filters */}
      <MemoizedTeachersFilters />

      {/* Teachers Table */}
      <div className="rounded-3xl border border-border/70 bg-card/95 overflow-hidden shadow-sm backdrop-blur-sm">
        <div className="p-5 border-b border-border/50">
          <div>
            <p className="text-sm font-semibold text-card-foreground">All Teachers</p>
            <p className="text-xs text-muted-foreground mt-1">
              Manage and view all teachers in the system
            </p>
          </div>
        </div>
        <div className="p-5">
          <MemoizedTeachersTable
            onEditTeacher={handleEditTeacher}
            onAssignTeacher={handleAssignTeacher}
          />
        </div>
      </div>

      {/* Dialogs */}
      <CreateTeacherDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      {selectedTeacher && (
        <>
          <EditTeacherDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            teacher={selectedTeacher}
          />

          <AssignTeacherDialog
            open={isAssignDialogOpen}
            onOpenChange={setIsAssignDialogOpen}
            teacher={selectedTeacher}
          />
        </>
      )}
    </div>
  );
};