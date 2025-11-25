// app/admin/teachers/[id]/page.tsx
'use client'
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Mail, Phone, Calendar, User, BookOpen } from 'lucide-react';
import { useAdminQueries } from '@/hooks/useAdminQueries';

export default function TeacherDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teacherId = parseInt(params.id as string);

  const { useTeacher, useTeacherSubjects } = useAdminQueries();

  const { data: teacherResponse, isLoading: teacherLoading } = useTeacher(teacherId);
  const { data: subjectsResponse, isLoading: subjectsLoading } = useTeacherSubjects();

  const teacher = teacherResponse?.data;
  const allSubjects = subjectsResponse?.data || [];

  // Filter subjects for this specific teacher
  const teacherSubjects = allSubjects.filter((subject: any) => 
    subject.teacher.id === teacherId
  );

  if (teacherLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">Loading teacher details...</div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive">Teacher not found</div>
          <Button onClick={() => router.push('/admin/teachers')} className="mt-4">
            Back to Teachers
          </Button>
        </div>
      </div>
    );
  }

  // FIX: Accept string | null | undefined
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.push('/admin/teachers')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Teachers
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Teacher Details</h1>
              <p className="text-gray-600">Detailed information about {teacher.first_name} {teacher.last_name}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Teacher Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Personal and contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-lg font-semibold">{teacher.first_name} {teacher.last_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Employee Number</label>
                    <p className="text-lg">{teacher.teacher?.employee_no || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Username</label>
                    <p className="text-lg">{teacher.username || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Hire Date</label>
                    <p className="text-lg">{formatDate(teacher.teacher?.hire_date)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-lg">{teacher.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-lg">{teacher.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1">
                      <Badge variant={teacher.is_active ? 'default' : 'secondary'}>
                        {teacher.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email Verified</label>
                    <div className="mt-1">
                      <Badge variant={teacher.email_verified ? 'default' : 'outline'}>
                        {teacher.email_verified ? 'Verified' : 'Not Verified'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Subjects */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle>Assigned Subjects</CardTitle>
                <CardDescription>
                  {teacherSubjects.length} subjects assigned to this teacher
                </CardDescription>
              </CardHeader>
              <CardContent>
                {teacherSubjects.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Class Group</TableHead>
                        <TableHead>Semester</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Duration</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teacherSubjects.map((assignment: any) => (
                        <TableRow key={assignment.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{assignment.subject.name}</div>
                              <div className="text-sm text-gray-500">{assignment.subject.shortname}</div>
                            </div>
                          </TableCell>
                          <TableCell>{assignment.class_group.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {assignment.meta.semester || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>{assignment.meta.room || 'N/A'}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{formatDate(assignment.start_date)}</div>
                              <div>to {formatDate(assignment.end_date)}</div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No subjects assigned to this teacher</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => router.push(`/admin/teachers?assign=${teacherId}`)}
                    >
                      Assign Subjects
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Subjects</span>
                  <Badge variant="default">{teacherSubjects.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge variant={teacher.is_active ? 'default' : 'secondary'}>
                    {teacher.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Email Verified</span>
                  <Badge variant={teacher.email_verified ? 'default' : 'outline'}>
                    {teacher.email_verified ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Login</span>
                  <span className="text-sm">{formatDate(teacher.last_login_at)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Teacher Subjects Summary */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle>Subjects Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {teacher.teacher?.subjects && teacher.teacher.subjects.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Qualified to teach:</p>
                    <div className="flex flex-wrap gap-1">
                      {teacher.teacher.subjects.map((subject: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No subjects specified</p>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push(`/admin/teachers?edit=${teacherId}`)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Edit Teacher
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push(`/admin/teachers?assign=${teacherId}`)}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Assign Subjects
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}