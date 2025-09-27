
'use client'
import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  MessageSquare, 
  FileText, 
  CreditCard, 
  Settings,
  BookOpen,
  Calendar,
  Award
} from 'lucide-react';

export default function ParentsDashboard() {
  const children = [
    { name: 'Alex Johnson', grade: 'JSS 2A', avgGrade: 85.6, attendance: 95 },
    { name: 'Sarah Johnson', grade: 'JSS 1B', avgGrade: 78.3, attendance: 92 }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Parents Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your children's overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Children</p>
                  <p className="text-2xl font-bold">{children.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Attendance</p>
                  <p className="text-2xl font-bold">94%</p>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Grade</p>
                  <p className="text-2xl font-bold">82%</p>
                </div>
                <Award className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Work</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <BookOpen className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/parents/messages">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                <CardTitle className="text-lg">Messages</CardTitle>
                <CardDescription>View weekly reports from teachers</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/parents/reports">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <CardTitle className="text-lg">Reports</CardTitle>
                <CardDescription>Download termly results</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/parents/payments">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                <CardTitle className="text-lg">Payments</CardTitle>
                <CardDescription>View payment history</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/parents/settings">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Settings className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                <CardTitle className="text-lg">Settings</CardTitle>
                <CardDescription>Update your bio data</CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Children Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {children.map((child, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{child.name}</h3>
                      <p className="text-sm text-muted-foreground">{child.grade}</p>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div>Avg Grade: <span className="font-medium">{child.avgGrade}%</span></div>
                        <div>Attendance: <span className="font-medium">{child.attendance}%</span></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}