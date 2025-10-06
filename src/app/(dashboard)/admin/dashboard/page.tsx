'use client'
import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  UserCheck, 
  UserCog, 
  BookOpen,
  MessageSquare,
  FileText,
  CreditCard,
  Settings,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { useAdminQueries } from '@/hooks/useAdminQueries';

export default function AdminDashboard() {
  const { useDashboardStats } = useAdminQueries();
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center text-destructive">Error loading dashboard</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">School management overview and analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{stats?.totalStudents || 0}</p>
                  <p className="text-xs text-green-600">+12 this month</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Teachers</p>
                  <p className="text-2xl font-bold">{stats?.totalTeachers || 0}</p>
                  <p className="text-xs text-green-600">+2 this month</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Parents</p>
                  <p className="text-2xl font-bold">{stats?.totalParents || 0}</p>
                  <p className="text-xs text-green-600">+8 this month</p>
                </div>
                <UserCog className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Classes</p>
                  <p className="text-2xl font-bold">{stats?.activeClasses || 0}</p>
                  <p className="text-xs text-muted-foreground">Current term</p>
                </div>
                <BookOpen className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                  <p className="text-2xl font-bold">{stats?.attendanceRate || 0}%</p>
                  <p className="text-xs text-muted-foreground">This week</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fee Collection</p>
                  <p className="text-2xl font-bold">{stats?.feeCollection || 0}%</p>
                  <p className="text-xs text-muted-foreground">This term</p>
                </div>
                <CreditCard className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Academic Year</p>
                  <p className="text-2xl font-bold">{stats?.academicYear || '2025-2026'}</p>
                  <p className="text-xs text-muted-foreground">1st Term</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <Link href="/admin/students">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow text-center">
              <CardContent className="p-4">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <CardTitle className="text-sm">Students</CardTitle>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/teachers">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow text-center">
              <CardContent className="p-4">
                <UserCheck className="h-6 w-6 mx-auto mb-2" />
                <CardTitle className="text-sm">Teachers</CardTitle>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/parents">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow text-center">
              <CardContent className="p-4">
                <UserCog className="h-6 w-6 mx-auto mb-2" />
                <CardTitle className="text-sm">Parents</CardTitle>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/messages">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow text-center">
              <CardContent className="p-4">
                <MessageSquare className="h-6 w-6 mx-auto mb-2" />
                <CardTitle className="text-sm">Messages</CardTitle>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/reports">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow text-center">
              <CardContent className="p-4">
                <FileText className="h-6 w-6 mx-auto mb-2" />
                <CardTitle className="text-sm">Reports</CardTitle>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/payments">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow text-center">
              <CardContent className="p-4">
                <CreditCard className="h-6 w-6 mx-auto mb-2" />
                <CardTitle className="text-sm">Payments</CardTitle>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/settings">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow text-center">
              <CardContent className="p-4">
                <Settings className="h-6 w-6 mx-auto mb-2" />
                <CardTitle className="text-sm">Settings</CardTitle>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}