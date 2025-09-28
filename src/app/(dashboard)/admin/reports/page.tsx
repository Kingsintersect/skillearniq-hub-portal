
'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download } from 'lucide-react';

export default function ReportsPage() {
  const [filters, setFilters] = useState({
    academicYear: '2025-2026',
    term: '1st'
  });

  const reports = [
    {
      student: 'Alex Johnson',
      class: 'JSS 2A',
      subjects: [
        { name: 'Mathematics', test: 28, quiz: 9, exam: 55, total: 92, average: 92, position: 5 },
        { name: 'English', test: 26, quiz: 8, exam: 54, total: 88, average: 88, position: 8 },
        { name: 'Science', test: 25, quiz: 8, exam: 52, total: 85, average: 85, position: 6 }
      ]
    }
  ];

  const handleDownload = (student: string, format: 'pdf' | 'csv') => {
    alert(`Downloading ${format} report for ${student}`);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Download termly results and performance reports</p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Academic Year</label>
                <Select value={filters.academicYear} onValueChange={(value) => setFilters(prev => ({...prev, academicYear: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2025-2026">2025-2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Term</label>
                <Select value={filters.term} onValueChange={(value) => setFilters(prev => ({...prev, term: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st">1st Term</SelectItem>
                    <SelectItem value="2nd">2nd Term</SelectItem>
                    <SelectItem value="3rd">3rd Term</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {reports.map((report, index) => (
          <Card key={index} className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{report.student}</CardTitle>
                  <CardDescription>{report.class} • {filters.academicYear} {filters.term} Term</CardDescription>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleDownload(report.student, 'pdf')}>
                    PDF Report
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDownload(report.student, 'csv')}>
                    CSV Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Test Score (30%)</TableHead>
                    <TableHead>Quiz Score (10%)</TableHead>
                    <TableHead>Exam Score (60%)</TableHead>
                    <TableHead>Total (100%)</TableHead>
                    <TableHead>Average</TableHead>
                    <TableHead>Position</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.subjects.map((subject, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{subject.name}</TableCell>
                      <TableCell>{subject.test}/30</TableCell>
                      <TableCell>{subject.quiz}/10</TableCell>
                      <TableCell>{subject.exam}/60</TableCell>
                      <TableCell>{subject.total}/100</TableCell>
                      <TableCell>{subject.average}%</TableCell>
                      <TableCell>{subject.position}/120</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}