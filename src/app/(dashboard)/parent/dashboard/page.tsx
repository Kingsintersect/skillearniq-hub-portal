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
  CreditCard
} from 'lucide-react';
import { useParentStore } from '@/store/parentStore';
import { useParentQueries } from '@/hooks/useParentQueries';

export default function ParentsDashboard() {
  const { 
    selectedStudentId, 
    children, 
    setChildren,
    setSelectedStudentId
  } = useParentStore();

  const { useDashboardStats, useChildren } = useParentQueries();
  
  const { data: statsResponse, isLoading: statsLoading } = useDashboardStats();
  const { data: childrenResponse, isLoading: childrenLoading } = useChildren();

  
  useEffect(() => {
    if (childrenResponse?.data) {
      setChildren(childrenResponse.data);
      
      if (!selectedStudentId && childrenResponse.data.length > 0) {
        setSelectedStudentId(childrenResponse.data[0].id);
      }
    }
  }, [childrenResponse?.data, setChildren, selectedStudentId, setSelectedStudentId]);

  const stats = statsResponse?.data;
  const dashboardStats = stats?.childrenStats || [];
  
  const selectedStudent = children.find(child => child.id === selectedStudentId);
  const currentStats = dashboardStats.find(stats => stats.name === selectedStudent?.name) || dashboardStats[0];

  const isLoading = statsLoading || childrenLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Parents Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            {selectedStudent ? `Viewing ${selectedStudent.name}'s progress` : 'Select a student to view progress'}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Children</p>
                  <p className="text-2xl font-bold">{stats?.childrenCount || 0}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Attendance</p>
                  <p className="text-2xl font-bold">{currentStats?.attendance || 0}%</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Pending Work</p>
                  <p className="text-2xl font-bold">{currentStats?.pendingAssignments || 0}</p>
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
            {selectedStudent && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{selectedStudent.name}'s Overview</CardTitle>
                  <CardDescription>
                    {selectedStudent.grade} • Student ID: {selectedStudent.studentId}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Academic Performance</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2">
                          <span className="text-muted-foreground">Average Grade</span>
                          <span className="font-semibold">{currentStats?.avgGrade || 0}%</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-muted-foreground">Class Position</span>
                          <span className="font-semibold">5th / 35</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-muted-foreground">Attendance Rate</span>
                          <span className="font-semibold">{currentStats?.attendance || 0}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Quick Actions</h3>
                      <div className="space-y-3 flex flex-col gap-2">
                        <Link href="/parents/classes">
                          <Button variant="outline" className="w-full cursor-pointer dark:border-white dark:text-white justify-start h-11">
                            <BookOpen className="h-4 w-4 mr-3" />
                            View Detailed Progress
                          </Button>
                        </Link>
                        <Link href="/parents/reports">
                          <Button variant="outline" className="w-full cursor-pointer dark:border-white dark:text-white justify-start h-11">
                            <Download className="h-4 w-4 mr-3" />
                            Download Reports
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Children Section */}
            {children.length > 1 && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">All Your Children</CardTitle>
                  <CardDescription>Quick overview of all your children's progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {children.map((child, index) => {
                      const stats = dashboardStats.find(s => s.name === child.name) || dashboardStats[index];
                      const isSelected = child.id === selectedStudentId;
                      
                      return (
                        <Card 
                          key={child.id} 
                          className={`cursor-pointer transition-all border-2 ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                              : 'border-transparent hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedStudentId(child.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-4">
                              <div className="space-y-1">
                                <h3 className="font-semibold text-lg">{child.name}</h3>
                                <p className="text-sm text-muted-foreground">{child.grade}</p>
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
                                <span className="font-semibold">{stats?.avgGrade || 0}%</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Attendance</span>
                                <span className="font-semibold">{stats?.attendance || 0}%</span>
                              </div>
                            </div>

                            <Button 
                              variant={isSelected ? "default" : "outline"} 
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStudentId(child.id);
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
                      <div className="font-medium">Classes & Progress</div>
                      <div className="text-xs text-muted-foreground">Detailed academic progress</div>
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
                      <div className="text-xs text-muted-foreground">Download term reports</div>
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