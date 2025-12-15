'use client'
import React, { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  BookOpen,
  Calendar,
  FileText,
  ArrowRight,
  MessageCircle,
  Download,
  CreditCard,
  Loader2
} from 'lucide-react';
import { useParentStore } from '@/store/parentStore';
import { useParentQueries } from '@/hooks/useParentQueries';
import { Badge } from '@/components/ui/badge';

export default function ParentsDashboard() {
  const {
    selectedStudentId,
    children,
    setChildren,
    setSelectedStudentId,
    selectedChild,
    setSelectedChild
  } = useParentStore();

  const { useDashboardStats, useChildren } = useParentQueries();
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: childrenData, isLoading: childrenLoading, error: childrenError } = useChildren();

  // Sync children data with store
  useEffect(() => {
    if (childrenData) {
      setChildren(childrenData);
      
      // If no child is selected, select the first one
      if (!selectedChild && childrenData.length > 0) {
        setSelectedChild(childrenData[0]);
        setSelectedStudentId(childrenData[0].id.toString());
      }
    }
  }, [childrenData, setChildren, selectedChild, setSelectedChild, setSelectedStudentId]);

  // Find stats for selected child
  const selectedChildStats = stats?.childrenStats?.find(child => 
    child.first_name === selectedChild?.first_name
  ) || stats?.childrenStats?.[0];

  // Calculate overall stats
  const totalChildren = children.length;
  const averageAttendance = stats?.childrenStats?.reduce((sum, child) => sum + (child.attendance || 0), 0) || 0;
  const avgAttendance = totalChildren > 0 ? Math.round(averageAttendance / totalChildren) : 0;
  
  const totalPendingAssignments = stats?.childrenStats?.reduce((sum, child) => sum + (child.pendingAssignments || 0), 0) || 0;

  const isLoading = statsLoading || childrenLoading;
  const hasError = statsError || childrenError;

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-8xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-8xl mx-auto">
          <Card className="mb-6">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Unable to Load Dashboard</h3>
              <p className="text-muted-foreground mb-4">
                {statsError?.message || childrenError?.message || 'Failed to load dashboard data'}
              </p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-8xl mx-auto">
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Children Registered</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any children registered in the system yet.
              </p>
              <p className="text-sm text-muted-foreground">
                Please contact the school administration to register your children.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Parents Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            {selectedChild ? `Viewing ${selectedChild.first_name}'s progress` : 'Select a student to view progress'}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Children</p>
                  <p className="text-2xl font-bold">{stats?.childrenCount || totalChildren}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Average Attendance</p>
                  <p className="text-2xl font-bold">{avgAttendance}%</p>
                </div>
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Pending Work</p>
                  <p className="text-2xl font-bold">{totalPendingAssignments}</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student Overview */}
          <div className="lg:col-span-2 space-y-6">
            {selectedChild && selectedChildStats && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{selectedChild.first_name}'s Overview</CardTitle>
                  <CardDescription>
                    Student ID: {selectedChild.id}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Academic Performance</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2">
                          <span className="text-muted-foreground">Enrollment Status</span>
                          <Badge variant={
                            selectedChildStats.enrollment_status === 'enrolled' ? 'default' : 'secondary'
                          }>
                            {selectedChildStats.enrollment_status === 'enrolled' ? 'Enrolled' : 'Not Enrolled'}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-muted-foreground">Average Grade</span>
                          <span className="font-semibold">{selectedChildStats.avgGrade || 0}%</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-muted-foreground">Attendance Rate</span>
                          <span className="font-semibold">{selectedChildStats.attendance || 0}%</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-muted-foreground">Enrolled Courses</span>
                          <span className="font-semibold">{selectedChildStats.enrolled_courses?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Quick Actions</h3>
                      <div className="space-y-3 flex flex-col gap-2">
                        <Link href="/parents/classes">
                          <Button variant="outline" className="w-full cursor-pointer dark:border-white dark:text-white justify-start h-11">
                            <BookOpen className="h-4 w-4 mr-3" />
                            View Academic Progress
                          </Button>
                        </Link>
                        <Link href="/parents/reports">
                          <Button variant="outline" className="w-full cursor-pointer dark:border-white dark:text-white justify-start h-11">
                            <Download className="h-4 w-4 mr-3" />
                            View Reports
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Children Section */}
            {children.length > 0 && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">All Your Children</CardTitle>
                  <CardDescription>Quick overview of all your children's progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {children.map((child) => {
                      const childStats = stats?.childrenStats?.find(s => s.id.toString() === child.id.toString());
                      const isSelected = child.id.toString() === selectedStudentId;

                      return (
                        <Card
                          key={child.id}
                          className={`cursor-pointer transition-all border-2 ${isSelected
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                            : 'border-transparent hover:border-gray-300'
                            }`}
                          onClick={() => {
                            setSelectedChild(child);
                            setSelectedStudentId(child.id.toString());
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-4">
                              <div className="space-y-1">
                                <h3 className="font-semibold text-lg">{child.first_name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {childStats?.enrollment_status === 'enrolled' ? 'Enrolled' : 'Not Enrolled'}
                                </p>
                              </div>
                              {isSelected && (
                                <div className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-medium">
                                  Current
                                </div>
                              )}
                            </div>

                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Avg Grade</span>
                                <span className="font-semibold">{childStats?.avgGrade || 0}%</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Attendance</span>
                                <span className="font-semibold">{childStats?.attendance || 0}%</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Courses</span>
                                <span className="font-semibold">{childStats?.enrolled_courses?.length || 0}</span>
                              </div>
                            </div>

                            <Button
                              variant={isSelected ? "default" : "outline"}
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedChild(child);
                                setSelectedStudentId(child.id.toString());
                              }}
                            >
                              View Details
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Quick Access</CardTitle>
                <CardDescription>Common actions and features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 flex flex-col gap-2">
                <Link href="/parents/classes">
                  <Button variant="outline" className="w-full justify-start h-12">
                    <BookOpen className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Academic Progress</div>
                      <div className="text-xs text-muted-foreground">View detailed academic progress</div>
                    </div>
                  </Button>
                </Link>

                <Link href="/parents/messages">
                  <Button variant="outline" className="w-full justify-start h-12">
                    <MessageCircle className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Messages</div>
                      <div className="text-xs text-muted-foreground">Teacher communications</div>
                    </div>
                  </Button>
                </Link>

                <Link href="/parents/reports">
                  <Button variant="outline" className="w-full justify-start h-12">
                    <Download className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Reports</div>
                      <div className="text-xs text-muted-foreground">View academic reports</div>
                    </div>
                  </Button>
                </Link>

                <Link href="/parents/payments">
                  <Button variant="outline" className="w-full justify-start h-12">
                    <CreditCard className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Payments</div>
                      <div className="text-xs text-muted-foreground">Fee history & invoices</div>
                    </div>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}