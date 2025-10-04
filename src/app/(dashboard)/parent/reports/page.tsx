'use client'
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useParentStore } from '@/store/parentStore';

export default function ReportsPage() {
  const { selectedStudentId, children } = useParentStore();
  const selectedStudent = children.find(child => child.id === selectedStudentId);

  const handleDownloadReport = (type: string) => {
    console.log(`Downloading ${type} report for ${selectedStudent?.name || 'all children'}`);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            {selectedStudent 
              ? `Download academic reports for ${selectedStudent.name}`
              : 'Download academic reports for your children'
            }
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
            <CardDescription>
              Download comprehensive academic reports and progress summaries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Term 1 Progress Report</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive academic performance report for 1st Term 2025-2026
                  </p>
                </div>
                <Button onClick={() => handleDownloadReport('term1')}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>

              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Mid-Term Assessment</h3>
                  <p className="text-sm text-muted-foreground">
                    Detailed mid-term performance analysis and teacher comments
                  </p>
                </div>
                <Button onClick={() => handleDownloadReport('midterm')}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>

              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Attendance Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    Monthly and term-wise attendance records
                  </p>
                </div>
                <Button onClick={() => handleDownloadReport('attendance')}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>

              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Complete Academic Year Report</h3>
                  <p className="text-sm text-muted-foreground">
                    Full academic year performance across all subjects
                  </p>
                </div>
                <Button onClick={() => handleDownloadReport('yearly')}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}