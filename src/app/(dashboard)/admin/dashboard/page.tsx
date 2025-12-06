'use client'
import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
      <div className="min-h-screen p-6 flex items-center justify-center bg-background">
        <div className="text-center text-foreground">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-background">
        <div className="text-center text-destructive">
          <div>Error loading dashboard</div>
          <div className="text-sm text-muted-foreground mt-2">Please try again later</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">School management overview and analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold text-foreground">{stats?.totalStudents || 0}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">+12 this month</p>
                </div>
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Teachers</p>
                  <p className="text-2xl font-bold text-foreground">{stats?.totalTeachers || 0}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">+2 this month</p>
                </div>
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Parents</p>
                  <p className="text-2xl font-bold text-foreground">{stats?.totalParents || 0}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">+8 this month</p>
                </div>
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <UserCog className="h-5 w-5 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Classes</p>
                  <p className="text-2xl font-bold text-foreground">{stats?.activeClasses || 0}</p>
                  <p className="text-xs text-muted-foreground">Current term</p>
                </div>
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                  <p className="text-2xl font-bold text-foreground">{stats?.attendanceRate || 0}%</p>
                  <p className="text-xs text-muted-foreground">This week</p>
                </div>
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fee Collection</p>
                  <p className="text-2xl font-bold text-foreground">{stats?.feeCollection || 0}%</p>
                  <p className="text-xs text-muted-foreground">This term</p>
                </div>
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <Link href="/admin/students">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow text-center bg-card border-border group hover:border-primary/50">
              <CardContent className="p-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-500/20 transition-colors">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle className="text-sm font-medium text-foreground">Students</CardTitle>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/teachers">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow text-center bg-card border-border group hover:border-primary/50">
              <CardContent className="p-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-green-500/20 transition-colors">
                  <UserCheck className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle className="text-sm font-medium text-foreground">Teachers</CardTitle>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/parents">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow text-center bg-card border-border group hover:border-primary/50">
              <CardContent className="p-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-500/20 transition-colors">
                  <UserCog className="h-6 w-6 text-purple-500" />
                </div>
                <CardTitle className="text-sm font-medium text-foreground">Parents</CardTitle>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/messages">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow text-center bg-card border-border group hover:border-primary/50">
              <CardContent className="p-4">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-500/20 transition-colors">
                  <MessageSquare className="h-6 w-6 text-orange-500" />
                </div>
                <CardTitle className="text-sm font-medium text-foreground">Messages</CardTitle>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/reports">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow text-center bg-card border-border group hover:border-primary/50">
              <CardContent className="p-4">
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-red-500/20 transition-colors">
                  <FileText className="h-6 w-6 text-red-500" />
                </div>
                <CardTitle className="text-sm font-medium text-foreground">Reports</CardTitle>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/payments">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow text-center bg-card border-border group hover:border-primary/50">
              <CardContent className="p-4">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-500/20 transition-colors">
                  <CreditCard className="h-6 w-6 text-indigo-500" />
                </div>
                <CardTitle className="text-sm font-medium text-foreground">Payments</CardTitle>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/settings">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow text-center bg-card border-border group hover:border-primary/50">
              <CardContent className="p-4">
                <div className="w-12 h-12 bg-gray-500/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-500/20 transition-colors">
                  <Settings className="h-6 w-6 text-gray-500" />
                </div>
                <CardTitle className="text-sm font-medium text-foreground">Settings</CardTitle>
              </CardContent>
            </Card>
          </Link>

          {/* Additional quick action card for completeness */}
          <Link href="/admin/classes">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow text-center bg-card border-border group hover:border-primary/50">
              <CardContent className="p-4">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-cyan-500/20 transition-colors">
                  <BookOpen className="h-6 w-6 text-cyan-500" />
                </div>
                <CardTitle className="text-sm font-medium text-foreground">Classes</CardTitle>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-12">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
              <CardDescription>Latest system activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                    <UserCheck className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">New teacher registered</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">5 new students enrolled</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Fee payment received</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}